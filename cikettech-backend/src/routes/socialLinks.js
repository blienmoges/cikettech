const express = require("express");
const { getSettings } = require("../data/admin/settings");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getSettings().socialLinks);
});

module.exports = router;
