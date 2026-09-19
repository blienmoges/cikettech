"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SaveIcon,
  PublishIcon,
  InfoIcon,
  DocIcon,
  ImageIcon,
  GearIcon,
  TagIcon,
  CloseIcon,
} from "../../../components/admin-icons";
import EditorToolbar from "../EditorToolbar";
import FileDropzone from "../FileDropzone";
import { useRouter } from "next/navigation";
import { adminFetch, resolveMediaUrl } from "../../../lib/api";

type Article = {
  id?: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  date?: string;
  category?: string;
  image?: string;
};

export default function NewsForm({ article }: { article?: Article }) {
  const router = useRouter();
  const isEdit = Boolean(article?.id);

  const [title, setTitle] = useState(article?.title ?? "");
  const [summary, setSummary] = useState(article?.summary ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState(article?.status ?? "Draft");
  const [pubDate, setPubDate] = useState("");
  const [category, setCategory] = useState(article?.category ?? "Product Update");
  const [image, setImage] = useState(article?.image ?? "");
  const [tags, setTags] = useState(["Technology", "Update 2024"]);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  function addTag() {
    if (!newTag.trim()) return;
    setTags((t) => [...t, newTag.trim()]);
    setNewTag("");
  }

  async function onAction(action: "Draft saved" | "Published") {
    const nextStatus = action === "Published" ? "Published" : "Draft";
    setStatus(nextStatus);
    setSaving(true);
    const body = {
      title,
      summary,
      content,
      status: nextStatus,
      category,
      en: "Complete",
      am: "Draft",
      image,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    try {
      const res = await adminFetch(`/api/admin/news${isEdit ? `/${article!.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/news");
      router.refresh();
    } catch {
      alert("Could not save this article. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/news">
        <ArrowLeftIcon /> Back to News
      </Link>

      <div className="admin-page-head">
        <h1>{isEdit ? "Edit News Article" : "Add News Article"}</h1>
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
              <InfoIcon /> Article Details
            </h3>
            <div className="admin-card-divider" />
            <label>
              News Title <span className="admin-required">*</span>
              <input
                placeholder="Enter article headline..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              Short Summary
              <textarea
                rows={3}
                placeholder="A brief excerpt to display on news listing cards..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
          </div>

          <div className="admin-card">
            <div className="admin-card-head-row">
              <h3>
                <DocIcon /> Main Content
              </h3>
              <EditorToolbar textareaRef={contentRef} value={content} onChange={setContent} withImage />
            </div>
            <div className="admin-card-divider" />
            <textarea
              ref={contentRef}
              className="admin-content-area"
              rows={10}
              placeholder="Write the full article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>
              <ImageIcon /> Featured Image
            </h3>
            <div className="admin-card-divider" />
            <FileDropzone
              label="Click to upload or drag & drop"
              hint="SVG, PNG, JPG or GIF (max. 800×400px)"
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
              <GearIcon /> Publishing Setup
            </h3>
            <div className="admin-card-divider" />
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </label>
            <label>
              Publication Date
              <input type="date" value={pubDate} onChange={(e) => setPubDate(e.target.value)} />
            </label>
            <label>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Technology</option>
                <option>Product Update</option>
                <option>Press Release</option>
                <option>Company News</option>
              </select>
            </label>
          </div>

          <div className="admin-card">
            <h3>
              <TagIcon /> Tags
            </h3>
            <div className="admin-card-divider" />
            <div className="admin-list-row add">
              <input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button type="button" className="admin-add-tag-btn" onClick={addTag}>
                Add
              </button>
            </div>
            <div className="admin-tag-list">
              {tags.map((t, i) => (
                <span className="admin-tag-chip" key={t}>
                  {t}
                  <button
                    type="button"
                    aria-label={`Remove ${t}`}
                    onClick={() => setTags((arr) => arr.filter((_, xi) => xi !== i))}
                  >
                    <CloseIcon />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
