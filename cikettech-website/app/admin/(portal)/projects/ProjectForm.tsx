"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SaveIcon,
  PublishIcon,
  InfoIcon,
  ImageIcon,
  GearIcon,
  PlusIcon,
} from "../../../components/admin-icons";
import EditorToolbar from "../EditorToolbar";
import FileDropzone from "../FileDropzone";
import { useRouter } from "next/navigation";
import { adminFetch, resolveMediaUrl } from "../../../lib/api";

type Project = {
  id?: string;
  title: string;
  summary: string;
  description?: string;
  status: string;
  visibility: string;
  image?: string;
};

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project?.id);

  const [title, setTitle] = useState(project?.title ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState(project?.status ?? "Draft");
  const [visibility, setVisibility] = useState(project?.visibility ?? "Public");
  const [image, setImage] = useState(project?.image ?? "");
  const [gallery, setGallery] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function onAction(action: "Draft saved" | "Published") {
    const nextStatus = action === "Published" ? "Published" : status === "Published" ? "Published" : "Unpublished";
    setStatus(nextStatus);
    setSaving(true);
    const body = {
      title,
      summary,
      description,
      status: nextStatus,
      visibility,
      en: "Complete",
      am: "Draft",
      image,
      updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    try {
      const res = await adminFetch(`/api/admin/projects${isEdit ? `/${project!.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      alert("Could not save this project. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/projects">
        <ArrowLeftIcon /> Back to Projects
      </Link>

      <div className="admin-page-head">
        <h1>{isEdit ? "Edit Project" : "Add New Project"}</h1>
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
            <label>
              Project Title
              <input
                placeholder="e.g. NextGen AI Platform"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              Short Description
              <textarea
                rows={2}
                placeholder="Brief summary of the project..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
          </div>

          <div className="admin-card">
            <h3>Full Description</h3>
            <div className="admin-card-divider" />
            <EditorToolbar textareaRef={descriptionRef} value={description} onChange={setDescription} />
            <textarea
              ref={descriptionRef}
              className="admin-content-area"
              rows={10}
              placeholder="Enter detailed project description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>
              <ImageIcon /> Main Image
            </h3>
            <div className="admin-card-divider" />
            <FileDropzone
              label="Drag and drop image here or browse"
              hint="Recommended size: 1200x800px (Max 5MB)"
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
              <GearIcon /> Status &amp; Visibility
            </h3>
            <div className="admin-card-divider" />
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Draft</option>
                <option>Published</option>
                <option>Unpublished</option>
              </select>
            </label>
            <span className="admin-form-label admin-radio-label">Visibility</span>
            <div className="admin-radio-row">
              <label className="admin-radio">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "Public"}
                  onChange={() => setVisibility("Public")}
                />
                Public
              </label>
              <label className="admin-radio">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "Internal"}
                  onChange={() => setVisibility("Internal")}
                />
                Internal Only
              </label>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-head-row">
              <h3>
                <ImageIcon /> Gallery Images
              </h3>
              <span className="admin-count-badge">{gallery.length}/5</span>
            </div>
            <div className="admin-card-divider" />
            <div className="admin-gallery-grid">
              {gallery.map((src, i) => (
                <div key={i} className="admin-gallery-thumb" style={{ backgroundImage: `url('${src}')` }} />
              ))}
              {gallery.length < 5 && (
                <button
                  type="button"
                  className="admin-gallery-add"
                  onClick={() =>
                    setGallery((g) => [
                      ...g,
                      "https://commons.wikimedia.org/wiki/Special:FilePath/Controller_board_(14837601847).jpg?width=200",
                    ])
                  }
                  aria-label="Add gallery image"
                >
                  <PlusIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
