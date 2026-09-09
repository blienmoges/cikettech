"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, PencilIcon, EyeIcon, GlobeIcon, GlobeSlashIcon, TrashIcon } from "../../components/admin-icons";
import { adminFetch, getCurrentUser } from "../../lib/api";

export type TranslationTier = "done" | "pending" | "missing";

export function TranslationBadge({ tier, label }: { tier: TranslationTier; label: string }) {
  const Icon = tier === "done" ? CheckCircleIcon : tier === "missing" ? AlertCircleIcon : ClockIcon;
  return (
    <span className={"admin-dot-badge " + tier}>
      <Icon />
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={"admin-status admin-status-" + cls}>{status}</span>;
}

export function RowActions({
  editHref,
  published,
  resource,
  id,
}: {
  editHref: string;
  published: boolean;
  /** Admin API resource path (e.g. "products", "news", "knowledge-base"). Omit to fall back to demo alerts. */
  resource?: string;
  id?: string;
}) {
  const router = useRouter();

  async function togglePublish() {
    if (!resource || !id) return alert((published ? "Unpublished" : "Published") + " (demo)");
    const res = await adminFetch(`/api/admin/${resource}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: published ? "Unpublished" : "Published" }),
    });
    if (res.ok) router.refresh();
    else if (res.status !== 401) alert("Could not update status.");
  }

  async function remove() {
    if (!confirm("Delete this item?")) return;
    if (!resource || !id) return alert("Deleted (demo)");
    const res = await adminFetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else if (res.status === 403) alert("Only Administrators can delete this.");
    else if (res.status !== 401) alert("Could not delete item.");
  }

  // Defaults to true (matches server render, no localStorage access there) and
  // is corrected after mount — avoids a hydration mismatch on this button.
  const [canDelete, setCanDelete] = useState(true);
  useEffect(() => {
    setCanDelete(getCurrentUser()?.role !== "Editor");
  }, []);

  return (
    <div className="admin-row-actions">
      <Link href={editHref} aria-label="Edit">
        <PencilIcon />
      </Link>
      <button type="button" aria-label="Preview" onClick={() => alert("Preview (demo)")}>
        <EyeIcon />
      </button>
      <button type="button" aria-label={published ? "Unpublish" : "Publish"} onClick={togglePublish}>
        {published ? <GlobeSlashIcon /> : <GlobeIcon />}
      </button>
      {canDelete && (
        <button type="button" aria-label="Delete" className="danger" onClick={remove}>
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
