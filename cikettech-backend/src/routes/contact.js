const express = require("express");
const { getContactPage, submitContactForm } = require("../data/contact");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getContactPage(req.query.lang === "am" ? "am" : "en"));
});

router.post("/", (req, res) => {
  try {
    const submission = submitContactForm(req.body || {});
    res.status(201).json({ message: "Request submitted.", submission });
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.details || [] });
  }
});

module.exports = router;
