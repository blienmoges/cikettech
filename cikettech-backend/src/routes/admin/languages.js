const express = require("express");
const { db } = require("../../db");

const router = express.Router();

function rowsOf(collection) {
  return db
    .prepare(`SELECT data FROM "${collection}" ORDER BY seq ASC`)
    .all()
    .map((row) => JSON.parse(row.data));
}

function isDone(status) {
  return status === "Complete" || status === "Ready";
}

const sections = [
  { key: "products", label: "Products", href: "/admin/products", enField: "english", amField: "amharic" },
  { key: "news", label: "News", href: "/admin/news", enField: "en", amField: "am" },
  { key: "projects", label: "Projects", href: "/admin/projects", enField: "en", amField: "am" },
  { key: "awards", label: "Awards", href: "/admin/awards", enField: "en", amField: "am" },
];

router.get("/", (req, res) => {
  const breakdown = sections.map(({ key, label, href, enField, amField }) => {
    const items = rowsOf(key);
    return {
      key,
      label,
      href,
      total: items.length,
      enComplete: items.filter((i) => isDone(i[enField])).length,
      amComplete: items.filter((i) => isDone(i[amField])).length,
    };
  });

  const kb = rowsOf("knowledgeBase");
  breakdown.push({
    key: "knowledgeBase",
    label: "Knowledge Base",
    href: "/admin/knowledge-base",
    total: kb.length,
    enComplete: kb.filter((e) => e.questionEn && e.answerEn).length,
    amComplete: kb.filter((e) => e.questionAm && e.answerAm).length,
  });

  const languages = [
    { code: "en", name: "English", status: "Active", description: "Default language. Required for all content." },
    { code: "am", name: "Amharic", status: "Active", description: "Secondary language — coverage tracked per item below." },
    { code: "fr", name: "French", status: "Planned", description: "Future-ready per project spec; not yet enabled." },
    { code: "ar", name: "Arabic", status: "Planned", description: "Future-ready per project spec; not yet enabled." },
  ];

  res.json({ languages, breakdown });
});

module.exports = router;
