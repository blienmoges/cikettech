"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MailIcon, ArrowRightIcon, CheckCircleIcon } from "../../components/admin-icons";
import { API_BASE } from "../../lib/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || `If an account exists for ${email}, a password reset link is on its way.`);
      setSent(true);
    } catch {
      setMessage("Could not reach the server. Please try again.");
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="admin-reset-sent">
        <CheckCircleIcon />
        <p>{message}</p>
        <Link className="admin-back-link" href="/admin/login">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form className="admin-login-form" onSubmit={onSubmit}>
      <label>
        Email Address
        <div className="admin-input-icon">
          <MailIcon />
          <input
            type="email"
            placeholder="admin@cikettech.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </label>

      <button className="primary-button admin-login-submit" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Reset Link"}
        <ArrowRightIcon />
      </button>

      <p className="admin-login-agree">
        <Link href="/admin/login">Back to Login</Link>
      </p>
    </form>
  );
}
