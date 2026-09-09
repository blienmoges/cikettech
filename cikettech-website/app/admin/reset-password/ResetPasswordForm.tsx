"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, CheckCircleIcon } from "../../components/admin-icons";
import { API_BASE } from "../../lib/api";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Request a new one from the Forgot Password page.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not reset your password. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="admin-reset-sent">
        <CheckCircleIcon />
        <p>Your password has been reset. You can now log in with your new password.</p>
        <Link className="admin-back-link" href="/admin/login">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form className="admin-login-form" onSubmit={onSubmit}>
      <label>
        New Password
        <div className="admin-input-icon">
          <LockIcon />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="admin-input-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </label>

      <label>
        Confirm New Password
        <div className="admin-input-icon">
          <LockIcon />
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </label>

      {error && <p className="admin-login-error">{error}</p>}

      <button className="primary-button admin-login-submit" type="submit" disabled={submitting}>
        {submitting ? "Resetting..." : "Reset Password"}
        <ArrowRightIcon />
      </button>

      <p className="admin-login-agree">
        <Link href="/admin/login">Back to Login</Link>
      </p>
    </form>
  );
}
