const express = require("express");
const { createInquiry } = require("../data/inquiryStore");

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, phone, org, product, message } = req.body || {};
  const errors = [];
  if (!name || !String(name).trim()) errors.push("Name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email address is required.");
  if (!product || !String(product).trim()) errors.push("Product is required.");
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const inquiry = createInquiry({
    name: String(name).trim(),
    org: org ? String(org).trim() : "",
    type: "Sales Inquiry",
    product: String(product).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : "",
    subject: `Quote Request: ${String(product).trim()}`,
    message: message && String(message).trim() ? String(message).trim() : `Quote requested for ${String(product).trim()}.`,
  });

  res.status(201).json({ message: "Quote request submitted.", inquiry });
});

module.exports = router;
