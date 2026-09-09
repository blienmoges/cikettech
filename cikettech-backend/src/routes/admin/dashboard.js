const express = require("express");
const { getDashboard } = require("../../data/admin/dashboard");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getDashboard());
});

module.exports = router;
