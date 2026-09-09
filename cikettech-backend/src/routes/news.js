const express = require("express");
const { db } = require("../db");

const router = express.Router();

function published() {
  return db
    .prepare(`SELECT data FROM news ORDER BY seq DESC`)
    .all()
    .map((row) => JSON.parse(row.data))
    .filter((item) => item.status === "Published");
}

router.get("/", (req, res) => {
  res.json(published());
});

router.get("/:id", (req, res) => {
  const article = published().find((item) => String(item.id) === req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found." });
  res.json(article);
});

module.exports = router;
