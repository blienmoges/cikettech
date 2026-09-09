"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SaveIcon,
  PublishIcon,
  InfoIcon,
  BoxIcon,
  LinkIcon,
  GearIcon,
} from "../../../components/admin-icons";
import { useRouter } from "next/navigation";
import { adminFetch } from "../../../lib/api";

type Entry = {
  id?: string;
  title: string;
  contentType: string;
  related: string;
  status: string;
  questionEn?: string;
  answerEn?: string;
  questionAm?: string;
  answerAm?: string;
  relatedPage?: string;
};

export default function KnowledgeForm({ entry }: { entry?: Entry }) {
  const router = useRouter();
  const isEdit = Boolean(entry?.id);

  const [title, setTitle] = useState(entry?.title ?? "");
  const [contentType, setContentType] = useState(entry?.contentType ?? "");
  const [lang, setLang] = useState<"en" | "am">("en");
  const [questionEn, setQuestionEn] = useState(entry?.questionEn ?? "");
  const [answerEn, setAnswerEn] = useState(entry?.answerEn ?? "");
  const [questionAm, setQuestionAm] = useState(entry?.questionAm ?? "");
  const [answerAm, setAnswerAm] = useState(entry?.answerAm ?? "");
  const [relatedProduct, setRelatedProduct] = useState(entry?.related ?? "Global (Applies to all)");
  const [relatedPage, setRelatedPage] = useState(entry?.relatedPage ?? "");
  const [status, setStatus] = useState(entry?.status ?? "Published");
  const [saving, setSaving] = useState(false);

  async function onAction(action: "Draft saved" | "Published") {
    const nextStatus = action === "Published" ? "Published" : "Draft";
    setStatus(nextStatus);
    setSaving(true);
    const body = {
      title,
      contentType,
      related: relatedProduct,
      relatedPage,
      language: questionAm || answerAm ? "EN/AM" : "EN",
      status: nextStatus,
      questionEn,
      answerEn,
      questionAm,
      answerAm,
      updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    try {
      const res = await adminFetch(`/api/admin/knowledge-base${isEdit ? `/${entry!.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/knowledge-base");
      router.refresh();
    } catch {
      alert("Could not save this entry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/knowledge-base">
        <ArrowLeftIcon /> Back to AI Knowledge Base
      </Link>

      <div className="admin-page-head">
        <h1>{isEdit ? "Edit Knowledge Entry" : "Add New Knowledge Entry"}</h1>
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
            <PublishIcon /> Publish Entry
          </button>
        </div>
      </div>

      <div className="admin-info-banner">
        <InfoIcon />
        <div>
          <strong>Important Guideline</strong>
          <p>
            The AI assistant should answer using only approved CIKETTECH website knowledge.
            Ensure accuracy and adherence to brand voice.
          </p>
        </div>
      </div>

      <div className="admin-grid admin-form-grid">
        <div className="admin-form-col">
          <div className="admin-card">
            <h3>Core Details</h3>
            <div className="admin-card-divider" />
            <label>
              Knowledge Title
              <input
                placeholder="e.g., How to configure the CIKETTECH Smart Router"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              Content Type
              <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
                <option value="">Select a content type...</option>
                <option value="Product Info">Product Info</option>
                <option value="FAQ">FAQ</option>
                <option value="Company Info">Company Info</option>
              </select>
            </label>
          </div>

          <div className="admin-card">
            <div className="admin-lang-tabs">
              <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
                English Content Section
              </button>
              <button type="button" className={lang === "am" ? "active" : ""} onClick={() => setLang("am")}>
                Amharic Content Section
              </button>
            </div>
            <div className="admin-tab-panel">
              {lang === "en" ? (
                <>
                  <label>
                    Question or Topic (EN)
                    <textarea
                      rows={2}
                      placeholder="What is the user likely to ask?"
                      value={questionEn}
                      onChange={(e) => setQuestionEn(e.target.value)}
                    />
                  </label>
                  <div className="admin-card-head-row">
                    <span className="admin-field-label-plain">Approved Answer (EN)</span>
                    <span className="admin-hint">Supports markdown formatting</span>
                  </div>
                  <textarea
                    rows={7}
                    placeholder="Provide the official, approved response..."
                    value={answerEn}
                    onChange={(e) => setAnswerEn(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <label>
                    Question or Topic (AM)
                    <textarea
                      rows={2}
                      placeholder="What is the user likely to ask?"
                      value={questionAm}
                      onChange={(e) => setQuestionAm(e.target.value)}
                    />
                  </label>
                  <div className="admin-card-head-row">
                    <span className="admin-field-label-plain">Approved Answer (AM)</span>
                    <span className="admin-hint">Supports markdown formatting</span>
                  </div>
                  <textarea
                    rows={7}
                    placeholder="Provide the official, approved response..."
                    value={answerAm}
                    onChange={(e) => setAnswerAm(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>Relationships</h3>
            <div className="admin-card-divider" />
            <label>
              Related Product
              <div className="admin-input-icon">
                <BoxIcon />
                <select value={relatedProduct} onChange={(e) => setRelatedProduct(e.target.value)}>
                  <option>Global (Applies to all)</option>
                  <option>AI Smart Parking</option>
                  <option>Biometric Attendance</option>
                  <option>Smart School Bell</option>
                  <option>Smart Day Counter</option>
                </select>
              </div>
            </label>
            <label>
              Related Website Page
              <div className="admin-input-icon">
                <LinkIcon />
                <input
                  placeholder="https://cikettech.com/..."
                  value={relatedPage}
                  onChange={(e) => setRelatedPage(e.target.value)}
                />
              </div>
            </label>
          </div>

          <div className="admin-card">
            <h3>
              <GearIcon /> Publishing
            </h3>
            <div className="admin-card-divider" />
            <span className="admin-form-label">Publication Status</span>
            <div className="admin-radio-cards">
              <label className={"admin-radio-card" + (status === "Published" ? " selected" : "")}>
                <input
                  type="radio"
                  name="kb-status"
                  checked={status === "Published"}
                  onChange={() => setStatus("Published")}
                />
                <div>
                  <strong>Published</strong>
                  <span>Active in AI responses immediately</span>
                </div>
              </label>
              <label className={"admin-radio-card" + (status === "Draft" ? " selected" : "")}>
                <input
                  type="radio"
                  name="kb-status"
                  checked={status === "Draft"}
                  onChange={() => setStatus("Draft")}
                />
                <div>
                  <strong>Draft</strong>
                  <span>Save for review later</span>
                </div>
              </label>
              <label className={"admin-radio-card" + (status === "Archived" ? " selected" : "")}>
                <input
                  type="radio"
                  name="kb-status"
                  checked={status === "Archived"}
                  onChange={() => setStatus("Archived")}
                />
                <div>
                  <strong>Archived</strong>
                  <span>Remove from active knowledge</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
