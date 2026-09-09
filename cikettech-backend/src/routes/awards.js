const express = require("express");
const { db } = require("../db");

const router = express.Router();

function published() {
  return db
    .prepare(`SELECT data FROM awards ORDER BY seq DESC`)
    .all()
    .map((row) => JSON.parse(row.data))
    .filter((item) => item.status === "Published");
}

router.get("/", (req, res) => {
  res.json(published());
});

router.get("/:id", (req, res) => {
  const award = published().find((item) => String(item.id) === req.params.id);
  if (!award) return res.status(404).json({ error: "Award not found." });
  res.json(award);
});

module.exports = router;
