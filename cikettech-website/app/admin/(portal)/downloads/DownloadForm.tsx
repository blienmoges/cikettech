"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SaveIcon, PublishIcon } from "../../../components/admin-icons";
import FileDropzone from "../FileDropzone";
import { useRouter } from "next/navigation";
import { adminFetch } from "../../../lib/api";

type DocRecord = {
  id?: string;
  title: string;
  description?: string;
  language: string;
  related: string;
  status: string;
  type?: string;
  fileUrl?: string;
};

function extToType(name: string) {
  const ext = name.split(".").pop()?.toUpperCase() ?? "";
  if (ext === "DOC" || ext === "DOCX") return "DOCX";
  if (ext === "ZIP") return "ZIP";
  return "PDF";
}

export default function DownloadForm({ doc }: { doc?: DocRecord }) {
  const router = useRouter();
  const isEdit = Boolean(doc?.id);

  const [title, setTitle] = useState(doc?.title ?? "");
  const [description, setDescription] = useState(doc?.description ?? "");
  const [language, setLanguage] = useState(doc?.language ?? "English");
  const [related, setRelated] = useState(doc?.related ?? "");
  const [status, setStatus] = useState(doc?.status ?? "Published");
  const [fileUrl, setFileUrl] = useState(doc?.fileUrl ?? "");
  const [fileType, setFileType] = useState(doc?.type ?? "PDF");
  const [saving, setSaving] = useState(false);

  async function onAction(action: "Draft saved" | "Published") {
    const nextStatus = action === "Published" ? "Published" : "Unpublished";
    setStatus(nextStatus);
    setSaving(true);
    const body = {
      title,
      description,
      language,
      related,
      status: nextStatus,
      type: fileType,
      fileUrl,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    try {
      const res = await adminFetch(`/api/admin/downloads${isEdit ? `/${doc!.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/downloads");
      router.refresh();
    } catch {
      alert("Could not save this document. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/downloads">
        <ArrowLeftIcon /> Back to Downloads
      </Link>

      <div className="admin-page-head">
        <div>
          <h1>{isEdit ? "Edit Document" : "Add New Document"}</h1>
          <p>Upload resources for client distribution or internal reference.</p>
        </div>
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
            <PublishIcon /> Publish Download
          </button>
        </div>
      </div>

      <div className="admin-card admin-download-form-card">
        <label>
          Document Title
          <input
            placeholder="e.g., Q3 System Architecture Overview"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <span className="admin-field-label-plain">File Upload</span>
        <FileDropzone
          label="Click to upload or drag and drop"
          hint="PDF, DOCX, ZIP up to 50MB"
          accept=".pdf,.doc,.docx,.zip"
          onUploaded={(result) => {
            setFileUrl(result.url);
            setFileType(extToType(result.name));
          }}
        />

        <label>
          Short Description
          <textarea
            rows={3}
            placeholder="Briefly describe the contents of this download..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="admin-feature-cols">
          <label>
            Language
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Amharic</option>
            </select>
          </label>
          <label>
            Related Product/Page
            <select value={related} onChange={(e) => setRelated(e.target.value)}>
              <option value="">Select association...</option>
              <option>AI Smart Parking</option>
              <option>Biometric Attendance</option>
              <option>Smart School Bell</option>
              <option>Smart Day Counter</option>
            </select>
          </label>
        </div>

        <span className="admin-field-label-plain">Publication Status</span>
        <div className="admin-radio-row">
          <label className="admin-radio">
            <input
              type="radio"
              name="doc-status"
              checked={status === "Published"}
              onChange={() => setStatus("Published")}
            />
            Published
          </label>
          <label className="admin-radio">
            <input
              type="radio"
              name="doc-status"
              checked={status === "Draft"}
              onChange={() => setStatus("Draft")}
            />
            Draft
          </label>
        </div>
      </div>
    </>
  );
}
