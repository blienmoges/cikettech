"use client";

import React, { useState } from "react";
import { API_BASE } from "../../lib/api";

export default function SchoolBellQuoteForm() {
  const [values, setValues] = useState({
    organization: "",
    email: "",
    phone: "",
    zones: "1 - 5 Zones",
    campus: "Single Building",
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
          name: values.organization,
          email: values.email,
          phone: values.phone,
          org: values.organization,
          product: "Smart School Bell System",
          message: `Zones: ${values.zones}. Campus type: ${values.campus}. ${values.details}`.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      alert("Thanks! Your quote request has been submitted.");
      setValues((v) => ({ ...v, organization: "", email: "", phone: "", details: "" }));
    } catch {
      alert("Could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="quote-form uc" onSubmit={onSubmit}>
      <div className="field-row">
        <label>
          Organization Name
          <input name="organization" value={values.organization} onChange={onChange} />
        </label>
        <label>
          Contact Email
          <input name="email" type="email" value={values.email} onChange={onChange} />
        </label>
        <label>
          Phone Number
          <input name="phone" type="tel" required value={values.phone} onChange={onChange} placeholder="+251 9XX XXX XXX" />
        </label>
      </div>

      <div className="field-row">
        <label>
          Number of Zones
          <select name="zones" value={values.zones} onChange={onChange}>
            <option>1 - 5 Zones</option>
            <option>6 - 15 Zones</option>
            <option>16 - 40 Zones</option>
            <option>40+ Zones</option>
          </select>
        </label>
        <label>
          Campus Type
          <select name="campus" value={values.campus} onChange={onChange}>
            <option>Single Building</option>
            <option>Multi-Building Campus</option>
            <option>District-Wide</option>
          </select>
        </label>
      </div>

      <label>
        Project Details
        <textarea name="details" value={values.details} onChange={onChange} />
      </label>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
