const express = require("express");
const { getImpactPage } = require("../data/impact");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getImpactPage(req.query.lang === "am" ? "am" : "en"));
});

module.exports = router;
