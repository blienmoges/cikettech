"use client";

import { useState } from "react";
import { adminFetch } from "../../../lib/api";

type Translation = { key: string; context: string; en: string; am: string; status: string };

export default function TranslationEditor({ initialTranslations }: { initialTranslations: Translation[] }) {
  const [translations, setTranslations] = useState(initialTranslations);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function update(key: string, field: "en" | "am", value: string) {
    setTranslations((items) => items.map((item) => item.key === key ? { ...item, [field]: value } : item));
  }

  async function save(item: Translation) {
    setSaving(item.key);
    setMessage("");
    try {
      const response = await adminFetch(`/api/admin/translations/${encodeURIComponent(item.key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en: item.en, am: item.am, status: "Published" }),
      });
      if (!response.ok) throw new Error();
      setMessage(`Saved ${item.key}.`);
    } catch {
      setMessage(`Could not save ${item.key}.`);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="admin-card admin-products-card">
      <div className="admin-card-head-row">
        <div>
          <h3>Translation Editor</h3>
          <p>Edit the English and Amharic labels used across the public navigation and shared actions.</p>
        </div>
        {message && <span className="admin-hint">{message}</span>}
      </div>
      <div className="admin-card-divider" />
      <div className="admin-table-wrapper flush">
        <table className="admin-table">
          <thead><tr><th>Key</th><th>Context</th><th>English</th><th>Amharic</th><th>Action</th></tr></thead>
          <tbody>
            {translations.map((item) => (
              <tr key={item.key}>
                <td className="admin-table-name">{item.key}</td>
                <td>{item.context}</td>
                <td><input className="admin-inline-input" value={item.en} onChange={(e) => update(item.key, "en", e.target.value)} /></td>
                <td><input className="admin-inline-input" value={item.am} dir="auto" onChange={(e) => update(item.key, "am", e.target.value)} /></td>
                <td><button type="button" className="text-action" disabled={saving === item.key} onClick={() => save(item)}>{saving === item.key ? "Saving..." : "Save"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}