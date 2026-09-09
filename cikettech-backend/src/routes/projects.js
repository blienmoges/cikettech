const express = require("express");
const { db } = require("../db");

const router = express.Router();

function published() {
  return db
    .prepare(`SELECT data FROM projects ORDER BY seq DESC`)
    .all()
    .map((row) => JSON.parse(row.data))
    .filter((item) => item.status === "Published" && item.visibility !== "Internal");
}

router.get("/", (req, res) => {
  res.json(published());
});

router.get("/:id", (req, res) => {
  const project = published().find((item) => String(item.id) === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json(project);
});

module.exports = router;
