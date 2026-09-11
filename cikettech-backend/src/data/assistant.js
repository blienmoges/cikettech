const { db } = require("../db");
const { products } = require("./products");

const welcomeMessage =
  "Welcome to CIKETTECH Intelligent Support. How can I assist you with our smart electronic solutions today?";

const fallbackReply =
  "Thanks for reaching out — I don't have an approved answer for that yet, but our team will follow up with details shortly. You can also reach us directly through the Contact page.";

const suggestions = [
  { topic: "parking", label: "Tell me about Smart Parking" },
  { topic: "biometric", label: "Biometric Attendance Features" },
  { topic: "quote", label: "Request a Technical Quote" },
  { topic: "school-bell", label: "School Bell Scheduling" },
];

// A few fixed system-level routing replies that aren't really "product knowledge" —
// these stay in code since they're about how to reach the team, not admin content.
// Used both as the keyword-search fallback's last resort and folded into the LLM's
// grounding context so it gives the same contact details rather than inventing its own.
const routingReplies = [
  {
    keywords: ["quote", "price", "pricing", "cost"],
    reply:
      "Happy to help with a quote — could you tell me which product you're interested in (Smart Parking, Biometric Attendance, School Bell, or Day Counter) and the size of your facility? You can also use the Request a Quote form on any product page.",
  },
  {
    keywords: ["contact", "human", "sales", "support team", "talk to someone"],
    reply:
      "You can reach our team directly at protocols@cikettech.com or +1 (800) 555-0199, or use the Contact page and we'll respond within 4 hours on average.",
  },
];

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "what", "which", "who", "how",
  "does", "do", "did", "can", "could", "would", "should", "will", "for", "and",
  "or", "to", "of", "in", "on", "with", "about", "your", "you", "our", "it",
  "this", "that", "me", "tell", "please", "i", "my",
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function publishedKnowledge() {
  return db
    .prepare(`SELECT data FROM knowledgeBase ORDER BY seq ASC`)
    .all()
    .map((row) => JSON.parse(row.data))
    .filter((entry) => entry.status === "Published");
}

/** Scores a knowledge base entry against the user's message by counting how many
 * of the message's meaningful words appear in the entry's title/question/topic. */
function scoreEntry(entry, queryTokens) {
  const corpus = tokenize(
    [
      entry.title,
      entry.questionEn,
      entry.answerEn,
      entry.questionAm,
      entry.answerAm,
      entry.related,
      entry.relatedPage,
    ]
      .filter(Boolean)
      .join(" ")
  );
  if (!corpus.length) return 0;
  let score = 0;
  for (const token of queryTokens) {
    if (corpus.includes(token)) score += 1;
  }
  return score;
}

function getWelcome() {
  return { message: welcomeMessage, suggestions };
}

/** Keyword-search reply — used as the resilient fallback when the LLM is
 * unconfigured or unavailable, so the widget never goes fully silent. */
function getFallbackReply(text) {
  const queryTokens = tokenize(text);

  const entries = publishedKnowledge();
  let best = null;
  let bestScore = 0;
  for (const entry of entries) {
    const score = scoreEntry(entry, queryTokens);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  if (best) return best.answerEn || best.answerAm || fallbackReply;

  const normalized = (text || "").toLowerCase();
  const routed = routingReplies.find((entry) => entry.keywords.some((k) => normalized.includes(k)));
  if (routed) return routed.reply;

  return fallbackReply;
}

/** Builds the grounding context the LLM is instructed to answer from — the
 * published knowledge base (admin-editable, no code changes) plus a compact
 * product catalog summary. Keeping this as plain text keeps the "admin can
 * update the knowledge base without touching code" requirement true end to end. */
function buildSystemPrompt() {
  const entries = publishedKnowledge();
  const knowledgeBlock = entries.length
    ? entries
        .map((e) => {
          const english = `Q: ${e.questionEn || e.title}\nA: ${e.answerEn || ""}`;
          const amharic = e.questionAm || e.answerAm
            ? `\nQ (AM): ${e.questionAm || e.title}\nA (AM): ${e.answerAm || ""}`
            : "";
          return english + amharic;
        })
        .join("\n\n")
    : "(no knowledge base entries published yet)";

  const productsBlock = products
    .map((p) => {
      const features = (p.features || []).map((f) => `- ${f.title}: ${f.description}`).join("\n");
      return `### ${p.name} (slug: ${p.slug})\n${p.summary}\n${features}`;
    })
    .join("\n\n");

  const routingBlock = routingReplies.map((r) => r.reply).join("\n");

  return `You are the AI Assistant embedded on the CIKETTECH website. CIKETTECH is an Ethiopian company that designs and manufactures smart electronic products: an AI Smart Parking Gate System, a Biometric Attendance System, a Smart School Bell System, and a Smart Day Counter.

Answer using ONLY the information below. Keep replies short (2-4 sentences), professional, and specific to CIKETTECH. If asked something outside this information, say you don't have an approved answer for that and point the visitor to the Contact page or Request a Quote form — never invent specs, pricing, or claims that aren't below.

When relevant, recommend the CIKETTECH product that best fits what the visitor describes, by name.

For pricing/quote or human-contact requests, use this guidance:
${routingBlock}

## Product catalog
${productsBlock}

## Knowledge base (admin-curated FAQs)
${knowledgeBlock}`;
}

let genAI = null;
function getModel() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!genAI) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  // Rebuilt on every call (cheap, local — no network cost) so a fresh knowledge
  // base edit is reflected immediately, matching the admin-editable requirement.
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    systemInstruction: buildSystemPrompt(),
  });
}

/** `history` is the prior turns as [{ from: "user"|"bot", text }], oldest first,
 * NOT including the latest message (passed separately as `text`). */
async function getReply(text, history = []) {
  const model = getModel();
  if (!model) return getFallbackReply(text);

  // Gemini requires history to start with a "user" turn — the welcome message
  // (the widget's first "bot" bubble) isn't a real reply to anything, so drop
  // any leading assistant turns before they'd otherwise start the array.
  const trimmedHistory = [...history];
  while (trimmedHistory.length && trimmedHistory[0].from !== "user") trimmedHistory.shift();

  const contents = [
    ...trimmedHistory
      .filter((m) => m && m.text)
      .map((m) => ({ role: m.from === "user" ? "user" : "model", parts: [{ text: String(m.text) }] })),
    { role: "user", parts: [{ text: String(text) }] },
  ];

  try {
    const result = await model.generateContent({
      contents,
      // gemini-3.6-flash spends a large, variable chunk of this budget on invisible
      // "thinking" tokens before the visible reply — 2048 leaves enough headroom
      // that the actual (short, per the system prompt) answer doesn't get cut off.
      generationConfig: { maxOutputTokens: 2048 },
    });
    const reply = result.response.text().trim();
    return reply || getFallbackReply(text);
  } catch (err) {
    console.error("Assistant LLM call failed, falling back to keyword search:", err.message);
    return getFallbackReply(text);
  }
}

module.exports = { getWelcome, getReply, suggestions };
