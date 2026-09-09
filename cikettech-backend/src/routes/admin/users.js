const express = require("express");
const {
  ROLES,
  findUser,
  listUsers,
  createUser,
  updateUserRole,
  deleteUser,
  countAdministrators,
} = require("../../data/admin/users");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(listUsers());
});

router.post("/", (req, res) => {
  const { email, password, name, role } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email address is required." });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }
  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${ROLES.join(", ")}.` });
  }
  if (findUser(email)) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }
  const user = createUser({ email, password, name, role });
  res.status(201).json(user);
});

router.patch("/:email", (req, res) => {
  const { role } = req.body || {};
  const user = findUser(req.params.email);
  if (!user) return res.status(404).json({ error: "No user found for that email." });
  if (!role || !ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${ROLES.join(", ")}.` });
  }
  if (user.role === "Administrator" && role !== "Administrator" && countAdministrators() <= 1) {
    return res.status(400).json({ error: "At least one Administrator must remain." });
  }
  updateUserRole(user.email, role);
  res.json({ email: user.email, name: user.name, role });
});

router.delete("/:email", (req, res) => {
  const user = findUser(req.params.email);
  if (!user) return res.status(404).json({ error: "No user found for that email." });
  if (req.user?.email?.toLowerCase() === user.email.toLowerCase()) {
    return res.status(400).json({ error: "You can't delete your own account while logged in as it." });
  }
  if (user.role === "Administrator" && countAdministrators() <= 1) {
    return res.status(400).json({ error: "At least one Administrator must remain." });
  }
  deleteUser(user.email);
  res.json({ message: "Deleted.", email: user.email });
});

module.exports = router;
