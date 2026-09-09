const crypto = require("crypto");
const { db } = require("../../db");

db.prepare(
  `CREATE TABLE IF NOT EXISTS password_resets (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    expiresAt INTEGER NOT NULL
  )`
).run();

const TOKEN_TTL_MS = 30 * 60 * 1000;

function createResetToken(email) {
  const token = crypto.randomBytes(24).toString("hex");
  db.prepare(`INSERT INTO password_resets (token, email, expiresAt) VALUES (?, ?, ?)`).run(
    token,
    email.toLowerCase(),
    Date.now() + TOKEN_TTL_MS
  );
  return token;
}

function consumeResetToken(token) {
  const row = db.prepare(`SELECT * FROM password_resets WHERE token = ?`).get(token);
  if (!row) return null;
  db.prepare(`DELETE FROM password_resets WHERE token = ?`).run(token);
  if (row.expiresAt < Date.now()) return null;
  return row.email;
}

module.exports = { createResetToken, consumeResetToken };
