const bcrypt = require("bcryptjs");
const { db } = require("../../db");

const ROLES = ["Administrator", "Editor"];

db.prepare(
  `CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    passwordHash TEXT NOT NULL,
    name TEXT,
    role TEXT
  )`
).run();

const DEMO_PASSWORD = "CikettechAdmin!2024";
const SEED_EMAIL = "admin@cikettech.com";

if (!db.prepare(`SELECT email FROM users WHERE email = ?`).get(SEED_EMAIL)) {
  db.prepare(`INSERT INTO users (email, passwordHash, name, role) VALUES (?, ?, ?, ?)`).run(
    SEED_EMAIL,
    bcrypt.hashSync(DEMO_PASSWORD, 10),
    "Admin User",
    "Administrator"
  );
}

function findUser(email) {
  return db.prepare(`SELECT * FROM users WHERE lower(email) = lower(?)`).get(String(email || ""));
}

function verifyPassword(user, password) {
  return bcrypt.compareSync(password || "", user.passwordHash);
}

function updatePassword(email, newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare(`UPDATE users SET passwordHash = ? WHERE lower(email) = lower(?)`).run(hash, email);
}

function listUsers() {
  return db
    .prepare(`SELECT email, name, role FROM users ORDER BY email ASC`)
    .all();
}

function countAdministrators() {
  return db.prepare(`SELECT COUNT(*) AS n FROM users WHERE role = 'Administrator'`).get().n;
}

function createUser({ email, password, name, role }) {
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanRole = ROLES.includes(role) ? role : "Editor";
  db.prepare(`INSERT INTO users (email, passwordHash, name, role) VALUES (?, ?, ?, ?)`).run(
    cleanEmail,
    bcrypt.hashSync(password, 10),
    String(name || "").trim() || cleanEmail,
    cleanRole
  );
  return { email: cleanEmail, name: name || cleanEmail, role: cleanRole };
}

function updateUserRole(email, role) {
  if (!ROLES.includes(role)) throw new Error("Invalid role.");
  db.prepare(`UPDATE users SET role = ? WHERE lower(email) = lower(?)`).run(role, email);
}

function deleteUser(email) {
  db.prepare(`DELETE FROM users WHERE lower(email) = lower(?)`).run(email);
}

module.exports = {
  ROLES,
  findUser,
  verifyPassword,
  updatePassword,
  listUsers,
  countAdministrators,
  createUser,
  updateUserRole,
  deleteUser,
  DEMO_PASSWORD,
};
