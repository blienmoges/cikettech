"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ArchiveIcon,
  TrashIcon,
  CalendarIcon,
  ReplyIcon,
  ExternalLinkIcon,
} from "../../../../components/admin-icons";
import { adminFetch } from "../../../../lib/api";
import { useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  org: string;
  type: string;
  product: string;
  date: string;
  time: string;
  status: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [status, setStatusValue] = useState(inquiry.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function setStatus(status: string) {
    setSavingStatus(true);
    setError("");
    try {
      const res = await adminFetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatusValue(status);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this inquiry.");
    } finally {
      setSavingStatus(false);
    }
  }

  async function deleteInquiry() {
    if (!confirm("Delete this inquiry?")) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/inquiries/${inquiry.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/inquiries");
        return;
      }
      if (res.status === 403) alert("Only Administrators can delete inquiries.");
      else if (res.status !== 401) alert("Could not delete this inquiry.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/inquiries">
        <ArrowLeftIcon /> Back to Customer Inquiries
      </Link>

      <div className="admin-page-head">
        <div className="admin-inquiry-title">
          <h1>Inquiry #INQ-{inquiry.id}</h1>
          <span className={"admin-status admin-status-" + status.toLowerCase()}>{status}</span>
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-outline-btn compact" disabled={savingStatus || status === "Reviewed"} onClick={() => setStatus("Reviewed")}>
            <CheckCircleIcon /> Mark as Reviewed
          </button>
          <button type="button" className="admin-outline-btn compact" disabled={savingStatus || status === "Closed"} onClick={() => setStatus("Closed")}>
            <ArchiveIcon /> Mark as Closed
          </button>
          <button type="button" className="admin-btn-danger" disabled={deleting} onClick={deleteInquiry}>
            <TrashIcon /> Delete Inquiry
          </button>
        </div>
      </div>

      {error && <p className="admin-login-error">{error}</p>}

      <div className="admin-card admin-inquiry-card">
        <div className="admin-card-head-row">
          <h3>Submission Details</h3>
          <span className="admin-submitted-meta">
            <CalendarIcon /> Submitted: {inquiry.date}, {inquiry.time}
          </span>
        </div>
        <div className="admin-card-divider" />

        <div className="admin-detail-grid">
          <div>
            <div className="admin-detail-field">
              <span className="admin-form-label">Full Name</span>
              <div className="admin-detail-value">{inquiry.name}</div>
            </div>
            <div className="admin-detail-field">
              <span className="admin-form-label">Email Address</span>
              <div className="admin-detail-value">
                <a className="admin-detail-link" href={`mailto:${inquiry.email}`}>
                  {inquiry.email} <ExternalLinkIcon />
                </a>
              </div>
            </div>
            <div className="admin-detail-field">
              <span className="admin-form-label">Phone Number</span>
              <div className="admin-detail-value">{inquiry.phone}</div>
            </div>
          </div>
          <div>
            <div className="admin-detail-field">
              <span className="admin-form-label">Organization</span>
              <div className="admin-detail-value">{inquiry.org}</div>
            </div>
            <div className="admin-detail-field">
              <span className="admin-form-label">Inquiry Type</span>
              <div className="admin-detail-value">{inquiry.type}</div>
            </div>
            <div className="admin-detail-field">
              <span className="admin-form-label">Product Reference</span>
              <div className="admin-detail-value">{inquiry.product}</div>
            </div>
          </div>
        </div>

        <div className="admin-detail-field admin-detail-field-full">
          <span className="admin-form-label">Subject</span>
          <div className="admin-detail-value admin-detail-subject">{inquiry.subject}</div>
        </div>

        <div className="admin-detail-field admin-detail-field-full">
          <span className="admin-form-label">Full Message</span>
          <div className="admin-message-box">
            <p>{inquiry.message}</p>
          </div>
        </div>

        <div className="admin-inquiry-footer">
          <a
            className="admin-outline-btn compact"
            href={`mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(`Re: ${inquiry.subject}`)}&body=${encodeURIComponent(`Hello ${inquiry.name},\n\nThank you for contacting CIKETTECH.\n\n`)}`}
          >
            <ReplyIcon /> Reply to Customer
          </a>
        </div>
      </div>
    </>
  );
}
