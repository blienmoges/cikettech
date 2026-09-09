const express = require("express");
const { getTechnologyPage } = require("../data/technology");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getTechnologyPage(req.query.lang === "am" ? "am" : "en"));
});

module.exports = router;
