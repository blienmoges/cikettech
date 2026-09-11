const express = require("express");
const { db } = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT data FROM translations ORDER BY seq ASC").all().map((row) => JSON.parse(row.data));
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json(rows.filter((item) => item.status === "Published"));
});

module.exports = router;