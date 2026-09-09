const express = require("express");
const { listLocalizedProducts, getLocalizedProductBySlug } = require("../data/products");

const router = express.Router();

function langOf(req) {
  return req.query.lang === "am" ? "am" : "en";
}

router.get("/", (req, res) => {
  res.json(listLocalizedProducts(langOf(req)));
});

router.get("/:slug", (req, res) => {
  const product = getLocalizedProductBySlug(req.params.slug, langOf(req));
  if (!product) {
    return res.status(404).json({ error: `No product found for slug "${req.params.slug}"` });
  }
  res.json(product);
});

module.exports = router;
