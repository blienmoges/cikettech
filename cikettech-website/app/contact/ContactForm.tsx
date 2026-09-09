"use client";

import React, { useState } from "react";
import { API_BASE } from "../lib/api";

const categories = ["Customer Support", "Partnerships", "General"];

export default function ContactForm() {
  const [category, setCategory] = useState(categories[0]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrors([]);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.details && data.details.length ? data.details : [data.error || "Something went wrong."]);
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm({ firstName: "", lastName: "", email: "", company: "", message: "" });
    } catch {
      setErrors(["Could not reach the server. Please try again."]);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-form">
        <p>Thanks — your message has been received. Our team will follow up within 4 hours.</p>
      </div>
    );
  }

  return (
    <>
      <nav className="contact-tabs" aria-label="Contact categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={c === category ? "tab active" : "tab"}
            onClick={() => setCategory(c)}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </nav>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label>
            FIRST NAME
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
          </label>
          <label>
            LAST NAME
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
          </label>
        </div>

        <label>
          PROFESSIONAL EMAIL
          <input name="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" />
        </label>

        <label>
          ORGANIZATION / COMPANY (OPTIONAL)
          <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" />
        </label>

        <label>
          MESSAGE PAYLOAD
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?" />
        </label>

        {errors.length > 0 && (
          <ul className="contact-form-errors">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "SENDING..." : "TRANSMIT REQUEST →"}
          </button>
        </div>
      </form>
    </>
  );
}
