const express = require("express");
const { getWelcome, getReply } = require("../data/assistant");

const router = express.Router();

router.get("/welcome", (req, res) => {
  res.json(getWelcome());
});

router.post("/message", (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "`text` is required." });
  }
  res.json({ reply: getReply(text) });
});

module.exports = router;
