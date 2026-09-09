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

  async function setStatus(status: string) {
    const res = await adminFetch(`/api/admin/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
    else if (res.status !== 401) alert("Could not update this inquiry.");
  }

  async function deleteInquiry() {
    if (!confirm("Delete this inquiry?")) return;
    const res = await adminFetch(`/api/admin/inquiries/${inquiry.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/inquiries");
    else if (res.status !== 401) alert("Could not delete this inquiry.");
  }

  return (
    <>
      <Link className="admin-back-link" href="/admin/inquiries">
        <ArrowLeftIcon /> Back to Customer Inquiries
      </Link>

      <div className="admin-page-head">
        <div className="admin-inquiry-title">
          <h1>Inquiry #INQ-{inquiry.id}</h1>
          <span className={"admin-status admin-status-" + inquiry.status.toLowerCase()}>{inquiry.status}</span>
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-outline-btn compact" onClick={() => setStatus("Reviewed")}>
            <CheckCircleIcon /> Mark as Reviewed
          </button>
          <button type="button" className="admin-outline-btn compact" onClick={() => setStatus("Closed")}>
            <ArchiveIcon /> Mark as Closed
          </button>
          <button type="button" className="admin-btn-danger" onClick={deleteInquiry}>
            <TrashIcon /> Delete Inquiry
          </button>
        </div>
      </div>

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
          <button type="button" className="admin-outline-btn compact" onClick={() => alert("Reply sent (demo)")}>
            <ReplyIcon /> Reply to Customer
          </button>
        </div>
      </div>
    </>
  );
}
