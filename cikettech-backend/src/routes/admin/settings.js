const express = require("express");
const { getSettings, updateSettings } = require("../../data/admin/settings");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getSettings());
});

router.put("/", (req, res) => {
  res.json(updateSettings(req.body));
});

module.exports = router;
