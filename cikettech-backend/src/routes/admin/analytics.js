const express = require("express");
const { getAnalytics } = require("../../data/admin/analytics");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getAnalytics(req.query.range));
});

module.exports = router;
