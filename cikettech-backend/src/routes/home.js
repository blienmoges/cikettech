const express = require("express");
const { getHomePage } = require("../data/home");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getHomePage(req.query.lang === "am" ? "am" : "en"));
});

module.exports = router;
