const express = require("express");
const { getAboutPage } = require("../data/about");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getAboutPage(req.query.lang === "am" ? "am" : "en"));
});

module.exports = router;
