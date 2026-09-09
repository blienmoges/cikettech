"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from "../../components/admin-icons";
import { API_BASE, setAdminToken } from "../../lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not log in. Please check your credentials.");
        return;
      }
      setAdminToken(data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          />
        </div>
      </label>

      <div className="admin-login-row">
        <label htmlFor="admin-password">Password</label>
        <Link href="/admin/forgot-password">Forgot password?</Link>
      </div>
      <div className="admin-input-icon">
        <LockIcon />
        <input
          id="admin-password"
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

      {error && <p className="admin-login-error">{error}</p>}

      <button className="primary-button admin-login-submit" type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Log In"}
        <ArrowRightIcon />
      </button>

      <p className="admin-login-agree">By logging in, you agree to the internal usage policy.</p>
    </form>
  );
}
