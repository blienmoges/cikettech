const express = require("express");
const { getWelcome, getReply } = require("../data/assistant");

const router = express.Router();

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 12;

router.get("/welcome", (req, res) => {
  res.json(getWelcome());
});

router.post("/message", async (req, res) => {
  const { text, history } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "`text` is required." });
  }
  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` });
  }

  const safeHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_TURNS) : [];

  try {
    const reply = await getReply(text, safeHistory);
    res.json({ reply });
  } catch (err) {
    console.error("Assistant route error:", err);
    res.status(500).json({ error: "The assistant is temporarily unavailable." });
  }
});

module.exports = router;
