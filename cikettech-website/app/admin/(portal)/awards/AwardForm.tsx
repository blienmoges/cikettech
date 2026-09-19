"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SaveIcon,
  PublishIcon,
  InfoIcon,
  DocIcon,
  ImageIcon,
  GearIcon,
} from "../../../components/admin-icons";
import FileDropzone from "../FileDropzone";
import { useRouter } from "next/navigation";
import { adminFetch, resolveMediaUrl } from "../../../lib/api";

type Award = {
  id?: string;
  name: string;
  org: string;
  date: string;
  description?: string;
  status: string;
  image?: string;
};

export default function AwardForm({ award }: { award?: Award }) {
  const router = useRouter();
  const isEdit = Boolean(award?.id);

  const [name, setName] = useState(award?.name ?? "");
  const [org, setOrg] = useState(award?.org ?? "");
  const [date, setDate] = useState("");
  const [lang, setLang] = useState<"en" | "am">("en");
  const [descEn, setDescEn] = useState(award?.description ?? "");
  const [descAm, setDescAm] = useState("");
  const [status, setStatus] = useState(award?.status ?? "Draft");
  const [image, setImage] = useState(award?.image ?? "");
  const [saving, setSaving] = useState(false);

  async function onAction(action: "Draft saved" | "Published") {
    const nextStatus = action === "Published" ? "Published" : status;
    setStatus(nextStatus);
    setSaving(true);
    const body = {
      name,
      org,
      description: descEn,
      status: nextStatus,
      en: "Ready",
      am: descAm ? "Ready" : "Draft",
      image,
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    try {
      const res = await adminFetch(`/api/admin/awards${isEdit ? `/${award!.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/awards");
      router.refresh();
    } catch {
      alert("Could not save this award. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/awards">
        <ArrowLeftIcon /> Back to Awards
      </Link>

      <div className="admin-page-head">
        <h1>{isEdit ? "Edit Award" : "Add New Award"}</h1>
        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-outline-btn compact"
            disabled={saving}
            onClick={() => onAction("Draft saved")}
          >
            <SaveIcon /> Save Draft
          </button>
          <button
            type="button"
            className="primary-button admin-new-btn"
            disabled={saving}
            onClick={() => onAction("Published")}
          >
            <PublishIcon /> Publish
          </button>
        </div>
      </div>

      <div className="admin-grid admin-form-grid">
        <div className="admin-form-col">
          <div className="admin-card">
            <h3>
              <InfoIcon /> Basic Information
            </h3>
            <div className="admin-card-divider" />
            <div className="admin-feature-cols">
              <label>
                Award Name <span className="admin-required">*</span>
                <input
                  placeholder="e.g., Excellence in Technology 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Issuing Organization <span className="admin-required">*</span>
                <input
                  placeholder="e.g., CIKETTECH Foundation"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                />
              </label>
            </div>
            <label>
              Award Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>

          <div className="admin-card">
            <h3>
              <DocIcon /> Award Description
            </h3>
            <div className="admin-card-divider" />
            <div className="admin-lang-tabs">
              <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
                English Content
              </button>
              <button type="button" className={lang === "am" ? "active" : ""} onClick={() => setLang("am")}>
                Amharic Content
              </button>
            </div>
            <div className="admin-tab-panel">
              {lang === "en" ? (
                <textarea
                  rows={6}
                  placeholder="Enter detailed description of the award in English..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                />
              ) : (
                <textarea
                  rows={6}
                  placeholder="Enter detailed description of the award in Amharic..."
                  value={descAm}
                  onChange={(e) => setDescAm(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>
              <ImageIcon /> Award Image
            </h3>
            <div className="admin-card-divider" />
            <FileDropzone
              label="Click to upload or drag & drop"
              hint="PNG, JPG, GIF up to 10MB"
              accept="image/*"
              onUploaded={(result) => setImage(result.url)}
            />
            {image && (
              <div
                className="admin-media-thumb"
                style={{ backgroundImage: `url('${resolveMediaUrl(image)}')` }}
              />
            )}
          </div>

          <div className="admin-card">
            <h3>
              <GearIcon /> Publication Status
            </h3>
            <div className="admin-card-divider" />
            <div className="admin-radio-row">
              <label className="admin-radio">
                <input
                  type="radio"
                  name="pub-status"
                  checked={status === "Draft"}
                  onChange={() => setStatus("Draft")}
                />
                Draft
              </label>
              <label className="admin-radio">
                <input
                  type="radio"
                  name="pub-status"
                  checked={status === "Published"}
                  onChange={() => setStatus("Published")}
                />
                Published
              </label>
              <label className="admin-radio">
                <input
                  type="radio"
                  name="pub-status"
                  checked={status === "Archived"}
                  onChange={() => setStatus("Archived")}
                />
                Archived
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
