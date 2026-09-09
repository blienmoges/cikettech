const express = require("express");
const { findUser, verifyPassword, updatePassword } = require("../../data/admin/users");
const { createResetToken, consumeResetToken } = require("../../data/admin/passwordResets");
const { signToken, requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = findUser(email);
  if (!user || !verifyPassword(user, password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  const token = signToken({ email: user.email, role: user.role });
  res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email is required." });

  const user = findUser(email);
  if (user) {
    const token = createResetToken(user.email);
    // No email provider is wired up for this project, so the reset link is logged
    // instead of sent. Point a provider (Resend, SendGrid, SES, ...) at this token
    // to deliver it for real; the endpoint below already validates and consumes it.
    console.log(
      `[password reset] ${user.email} -> http://localhost:3000/admin/reset-password?token=${token}`
    );
  }

  // Always return the same generic message, whether or not the account exists,
  // so this endpoint can't be used to discover which emails are registered.
  res.json({ message: `If an account exists for ${email}, a password reset link is on its way.` });
});

router.post("/reset-password", (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required." });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }
  const email = consumeResetToken(token);
  if (!email) return res.status(400).json({ error: "This reset link is invalid or has expired." });
  updatePassword(email, password);
  res.json({ message: "Password has been reset. You can now log in." });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.put("/password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }
  const user = findUser(req.user.email);
  if (!user || !verifyPassword(user, currentPassword)) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }
  updatePassword(user.email, newPassword);
  res.json({ message: "Password updated." });
});

module.exports = router;
