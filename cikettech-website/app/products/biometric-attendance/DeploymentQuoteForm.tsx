"use client";

import React, { useState } from "react";
import { API_BASE } from "../../lib/api";

export default function DeploymentQuoteForm() {
  const [values, setValues] = useState({
    company: "",
    email: "",
    phone: "",
    terminals: "1-10 (Small Facility)",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.company,
          email: values.email,
          phone: values.phone,
          org: values.company,
          product: "Biometric Attendance System",
          message: `Estimated terminals: ${values.terminals}. ${values.details}`.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      alert("Thanks! Your deployment quote request has been submitted.");
      setValues((v) => ({ ...v, company: "", email: "", phone: "", details: "" }));
    } catch {
      alert("Could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="quote-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label>
          Company Name
          <input name="company" value={values.company} onChange={onChange} placeholder="Acme Corp" />
        </label>
        <label>
          Work Email
          <input name="email" type="email" value={values.email} onChange={onChange} placeholder="admin@acme.com" />
        </label>
        <label>
          Phone Number
          <input name="phone" type="tel" required value={values.phone} onChange={onChange} placeholder="+251 9XX XXX XXX" />
        </label>
      </div>

      <label>
        Estimated Terminals Needed
        <select name="terminals" value={values.terminals} onChange={onChange}>
          <option>1-10 (Small Facility)</option>
          <option>11-50 (Mid-Size Facility)</option>
          <option>51-200 (Large Facility)</option>
          <option>200+ (Enterprise Campus)</option>
        </select>
      </label>

      <label>
        Deployment Details
        <textarea
          name="details"
          value={values.details}
          onChange={onChange}
          placeholder="Briefly describe your environment and integration needs..."
        />
      </label>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
