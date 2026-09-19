"use client";

import React, { useState } from "react";
import { API_BASE } from "../lib/api";

type QuoteFormProps = {
  defaultProduct?: string;
};

export default function QuoteForm({ defaultProduct }: QuoteFormProps) {
  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    company: "",
    product: defaultProduct || "",
    quantity: "1",
    req: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target as HTMLInputElement;
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
          name: `${values.first} ${values.last}`.trim(),
          email: values.email,
          phone: values.phone,
          org: values.company,
          product: values.product,
          message: `Quantity requested: ${values.quantity}. ${values.req}`.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      alert(`Thanks! Your quote request for ${values.product || "this product"} has been submitted.`);
      setValues((v) => ({ ...v, first: "", last: "", email: "", phone: "", company: "", req: "" }));
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
          First Name
          <input name="first" value={values.first} onChange={onChange} />
        </label>
        <label>
          Last Name
          <input name="last" value={values.last} onChange={onChange} />
        </label>
      </div>

      <div className="field-row">
        <label>
          Email
          <input name="email" value={values.email} onChange={onChange} />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" required value={values.phone} onChange={onChange} placeholder="+251 9XX XXX XXX" />
        </label>
      </div>

      <label>
        Company
        <input name="company" value={values.company} onChange={onChange} />
      </label>

      <div className="field-row">
        <label>
          Product
          <select name="product" value={values.product} onChange={onChange}>
            {defaultProduct ? <option value={defaultProduct}>{defaultProduct}</option> : <option value="">Select a product</option>}
            <option value="Smart Day Counter">Smart Day Counter</option>
            <option value="Smart School Bell System">Smart School Bell System</option>
            <option value="AI Smart Parking Gate System">AI Smart Parking Gate System</option>
            <option value="Precision Biometric Attendance System">Precision Biometric Attendance System</option>
          </select>
        </label>

        <label>
          Quantity
          <select name="quantity" value={values.quantity} onChange={onChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10+</option>
          </select>
        </label>
      </div>

      <label>
        Requirements
        <textarea name="req" value={values.req} onChange={onChange} />
      </label>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
