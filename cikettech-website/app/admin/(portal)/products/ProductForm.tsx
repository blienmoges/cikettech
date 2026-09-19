"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  SaveIcon,
  PublishIcon,
  InfoIcon,
  StarIcon,
  GearIcon,
  ImageIcon,
  TrashIcon,
  PlusIcon,
} from "../../../components/admin-icons";
import FileDropzone from "../FileDropzone";
import { adminFetch, resolveMediaUrl } from "../../../lib/api";

type Product = {
  id?: string;
  code?: string;
  name: string;
  snippet: string;
  description: string;
  features: string[];
  benefits: string[];
  status: string;
  image?: string;
};

const emptyProduct: Product = {
  name: "",
  snippet: "",
  description: "",
  features: [],
  benefits: [],
  status: "Draft",
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product?.id);
  const initial = product ?? emptyProduct;

  const [name, setName] = useState(initial.name);
  const [snippet, setSnippet] = useState(initial.snippet);
  const [description, setDescription] = useState(initial.description);
  const [features, setFeatures] = useState(initial.features);
  const [benefits, setBenefits] = useState(initial.benefits);
  const [status, setStatus] = useState(initial.status);
  const [image, setImage] = useState(initial.image ?? "");
  const [newFeature, setNewFeature] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [saving, setSaving] = useState(false);

  function addFeature() {
    if (!newFeature.trim()) return;
    setFeatures((f) => [...f, newFeature.trim()]);
    setNewFeature("");
  }

  function addBenefit() {
    if (!newBenefit.trim()) return;
    setBenefits((b) => [...b, newBenefit.trim()]);
    setNewBenefit("");
  }

  async function onAction(action: "Draft saved" | "Published") {
    const nextStatus = action === "Published" ? "Published" : "Draft";
    setStatus(nextStatus);
    setSaving(true);
    const body = {
      name,
      snippet,
      description,
      features,
      benefits,
      status: nextStatus,
      code: initial.code || `PRD-${Math.floor(Math.random() * 900 + 100)}`,
      english: "Complete",
      amharic: "Draft",
      image,
      updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    try {
      const res = await adminFetch(`/api/admin/products${isEdit ? `/${product!.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch {
      alert("Could not save this product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/products">
        <ArrowLeftIcon /> Back to Products
      </Link>

      <div className="admin-page-head">
        <h1>{isEdit ? "Edit Product" : "Add New Product"}</h1>
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
              Product Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Short Description (Snippet)
              <textarea rows={2} value={snippet} onChange={(e) => setSnippet(e.target.value)} />
            </label>
            <label>
              Full Description
              <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
          </div>

          <div className="admin-card">
            <h3>
              <StarIcon /> Features &amp; Benefits
            </h3>
            <div className="admin-card-divider" />
            <div className="admin-feature-cols">
              <div>
                <span className="admin-form-label">Key Features</span>
                {features.map((f, i) => (
                  <div className="admin-list-row" key={i}>
                    <input
                      value={f}
                      onChange={(e) =>
                        setFeatures((arr) => arr.map((x, xi) => (xi === i ? e.target.value : x)))
                      }
                    />
                    <button
                      type="button"
                      aria-label="Remove feature"
                      onClick={() => setFeatures((arr) => arr.filter((_, xi) => xi !== i))}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
                <div className="admin-list-row add">
                  <input
                    placeholder="Add feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <button type="button" aria-label="Add feature" onClick={addFeature}>
                    <PlusIcon />
                  </button>
                </div>
              </div>

              <div>
                <span className="admin-form-label">Core Benefits</span>
                {benefits.map((b, i) => (
                  <div className="admin-list-row" key={i}>
                    <input
                      value={b}
                      onChange={(e) =>
                        setBenefits((arr) => arr.map((x, xi) => (xi === i ? e.target.value : x)))
                      }
                    />
                    <button
                      type="button"
                      aria-label="Remove benefit"
                      onClick={() => setBenefits((arr) => arr.filter((_, xi) => xi !== i))}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
                <div className="admin-list-row add">
                  <input
                    placeholder="Add benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <button type="button" aria-label="Add benefit" onClick={addBenefit}>
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>
              <GearIcon /> Status
            </h3>
            <div className="admin-card-divider" />
            <div className="admin-status-row">
              <span>Current Status:</span>
              <span className={"admin-status admin-status-" + status.toLowerCase()}>{status}</span>
            </div>
            <label>
              Visibility
              <select defaultValue="Public (Everyone)">
                <option>Public (Everyone)</option>
                <option>Internal Only</option>
                <option>Hidden</option>
              </select>
            </label>
            <label>
              Category
              <select defaultValue="Software Solutions">
                <option>Software Solutions</option>
                <option>Hardware Systems</option>
                <option>Access Control</option>
              </select>
            </label>
          </div>

          <div className="admin-card">
            <h3>
              <ImageIcon /> Media Gallery
            </h3>
            <div className="admin-card-divider" />
            <FileDropzone
              label="Click to upload or drag & drop"
              hint="SVG, PNG, JPG or GIF (max. 800×400px)"
              accept="image/*"
              onUploaded={(result) => setImage(result.url)}
            />
            <div
              className="admin-media-thumb"
              style={{
                backgroundImage: `url('${
                  resolveMediaUrl(image) ||
                  "https://commons.wikimedia.org/wiki/Special:FilePath/Controller_board_(14837601847).jpg?width=300"
                }')`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
