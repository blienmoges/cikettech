"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  TrashIcon,
  SaveIcon,
  InfoIcon,
} from "../../../../components/admin-icons";
import FileDropzone from "../../FileDropzone";
import { adminFetch, resolveMediaUrl } from "../../../../lib/api";

type ImageRecord = {
  id: string;
  name: string;
  date: string;
  size: string;
  src: string;
  category?: string;
  status?: string;
  altEn?: string;
  captionEn?: string;
  altAm?: string;
  captionAm?: string;
};

export default function ImageDetail({ image }: { image: ImageRecord }) {
  const router = useRouter();
  const [fileName, setFileName] = useState(image.name);
  const [src, setSrc] = useState(image.src);
  const [category, setCategory] = useState(image.category ?? "Product");
  const [status, setStatus] = useState(image.status ?? "Published");
  const [altEn, setAltEn] = useState(image.altEn ?? "");
  const [captionEn, setCaptionEn] = useState(image.captionEn ?? "");
  const [altAm, setAltAm] = useState(image.altAm ?? "");
  const [captionAm, setCaptionAm] = useState(image.captionAm ?? "");
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/images/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName, src, category, status, altEn, captionEn, altAm, captionAm }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Image details saved.");
      router.refresh();
    } catch {
      alert("Could not save this image. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await adminFetch(`/api/admin/images/${image.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 401) throw new Error("Delete failed");
      router.push("/admin/images");
      router.refresh();
    } catch {
      alert("Could not delete this image. Please try again.");
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/images">
        <ArrowLeftIcon /> Back to Images
      </Link>

      <div className="admin-page-head">
        <div>
          <h1>Image Details</h1>
          <p>Manage metadata and variations for this asset.</p>
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-btn-danger" onClick={onDelete}>
            <TrashIcon /> Delete Image
          </button>
          <button type="button" className="primary-button admin-new-btn" disabled={saving} onClick={onSave}>
            <SaveIcon /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="admin-grid admin-form-grid">
        <div className="admin-form-col">
          <div className="admin-card">
            <div className="admin-card-head-row">
              <h3 className="admin-plain-title">Current Asset</h3>
              <span className="admin-count-chip">{image.size}</span>
            </div>
            {src ? (
              <div
                className="admin-asset-preview"
                style={{ backgroundImage: `url('${resolveMediaUrl(src)}')` }}
              />
            ) : (
              <div className="admin-asset-preview" />
            )}
            <FileDropzone
              className="admin-dropzone admin-dropzone-secondary"
              label="Replace Image"
              hint="Drag and drop a new file here, or click to browse. Supports JPG, PNG, WEBP up to 10MB."
              accept="image/*"
              onUploaded={(result) => {
                setSrc(result.url);
                setFileName(result.name);
              }}
            />
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>
              <InfoIcon /> Asset Metadata
            </h3>
            <div className="admin-card-divider" />
            <label>
              File Name <span className="admin-required">*</span>
              <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </label>
            <div className="admin-feature-cols">
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Architecture</option>
                  <option>Product</option>
                  <option>People</option>
                  <option>Icon</option>
                </select>
              </label>
              <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </label>
            </div>

            <span className="admin-field-label-plain">Localization &amp; Accessibility</span>

            <div className="admin-lang-block">
              <div className="admin-lang-block-head">
                <span className="admin-lang-tag">EN</span> English
              </div>
              <label>
                Alternative Text
                <textarea rows={2} value={altEn} onChange={(e) => setAltEn(e.target.value)} />
              </label>
              <label>
                Caption
                <textarea rows={2} value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} />
              </label>
            </div>

            <div className="admin-lang-block">
              <div className="admin-lang-block-head">
                <span className="admin-lang-tag">AM</span> Amharic
              </div>
              <label>
                Alternative Text
                <textarea rows={2} value={altAm} onChange={(e) => setAltAm(e.target.value)} />
              </label>
              <label>
                Caption
                <textarea rows={2} value={captionAm} onChange={(e) => setCaptionAm(e.target.value)} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
