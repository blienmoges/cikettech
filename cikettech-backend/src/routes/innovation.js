const express = require("express");
const { getInnovationPage } = require("../data/innovation");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getInnovationPage(req.query.lang === "am" ? "am" : "en"));
});

module.exports = router;
