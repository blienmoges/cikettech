const { db } = require("../db");

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
    .split(/[^a-z0-9]+/)
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
  const corpus = tokenize(`${entry.title || ""} ${entry.questionEn || ""} ${entry.related || ""}`);
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

function getReply(text) {
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
  if (best && best.answerEn) return best.answerEn;

  const normalized = (text || "").toLowerCase();
  const routed = routingReplies.find((entry) => entry.keywords.some((k) => normalized.includes(k)));
  if (routed) return routed.reply;

  return fallbackReply;
}

module.exports = { getWelcome, getReply, suggestions };
