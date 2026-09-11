const { db, seedIfEmpty } = require("../db");
const seedInquiries = require("./admin/inquiries");

seedIfEmpty("inquiries", seedInquiries);

function nextId() {
  const rows = db.prepare(`SELECT id FROM inquiries`).all();
  const nums = rows.map((r) => Number(r.id)).filter((n) => Number.isFinite(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

function initialsOf(name) {
  const parts = String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase());
  return parts.join("") || "??";
}

/** Writes a public form submission (contact or quote request) into the same
 * `inquiries` collection the admin Customer Inquiries page reads from. */
function createInquiry({ name, org, type, product, email, phone, subject, message }) {
  const now = new Date();
  const id = nextId();
  const record = {
    id,
    name,
    initials: initialsOf(name),
    org: org || "N/A",
    type: type || "General",
    product: product || "N/A",
    date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    createdAt: now.toISOString(),
    status: "New",
    email,
    phone: phone || "N/A",
    subject,
    message,
  };
  db.prepare(`INSERT INTO inquiries (id, data) VALUES (?, ?)`).run(id, JSON.stringify(record));
  return record;
}

module.exports = { createInquiry };
