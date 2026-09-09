"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon, MailIcon, ClipboardIcon, ClockIcon, EyeIcon } from "../../../components/admin-icons";
import AdminPagination from "../AdminPagination";

type Inquiry = {
  id: string;
  name: string;
  initials: string;
  org: string;
  type: string;
  product: string;
  date: string;
  time: string;
  status: string;
};

const metrics = [
  { label: "New Inquiries", value: "24", icon: MailIcon },
  { label: "In Review", value: "18", icon: ClipboardIcon },
  { label: "Avg Resolution", value: "4.2h", icon: ClockIcon },
];

function statusClass(status: string) {
  return "admin-status admin-status-" + status.toLowerCase();
}

export default function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const [type, setType] = useState("All Types");
  const [search, setSearch] = useState("");

  const filtered = inquiries.filter((q) => {
    const matchesType = type === "All Types" || q.type === type;
    const matchesSearch = q.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Customer Inquiries</h1>
          <p>
            Manage and review incoming support requests, sales questions, and feedback from
            enterprise clients. Prioritize new tickets to maintain SLA targets.
          </p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/inquiries">
          <PlusIcon /> New Ticket
        </Link>
      </div>

      <div className="admin-metrics-grid">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="admin-metric-card">
              <div>
                <div className="admin-metric-label">{m.label.toUpperCase()}</div>
                <div className="admin-metric-value">{m.value}</div>
              </div>
              <div className="admin-metric-icon">
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-search-row">
          <div className="admin-search">
            <SearchIcon />
            <input placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="admin-type-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option>All Types</option>
            <option>Technical Support</option>
            <option>Sales Inquiry</option>
            <option>Feature Request</option>
            <option>Billing Inquiry</option>
          </select>
        </div>

        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Inquiry ID</th>
                <th>Full Name</th>
                <th>Organization</th>
                <th>Type &amp; Product</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td className="admin-table-name">INQ-{q.id}</td>
                  <td>
                    <div className="admin-name-cell">
                      <div className="admin-avatar-initials">{q.initials}</div>
                      {q.name}
                    </div>
                  </td>
                  <td>{q.org}</td>
                  <td>
                    <div className="admin-type-product">
                      <strong>{q.type}</strong>
                      <span>{q.product}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-date-cell">
                      <span>{q.date}</span>
                      <span>{q.time}</span>
                    </div>
                  </td>
                  <td>
                    <span className={statusClass(q.status)}>{q.status}</span>
                  </td>
                  <td>
                    <Link className="admin-view-btn" href={`/admin/inquiries/${q.id}`} aria-label="View">
                      <EyeIcon />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-row">
                    No inquiries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {filtered.length} of {inquiries.length} results
          </span>
          <AdminPagination pages={[1]} prevLabel="Prev" />
        </div>
      </div>
    </>
  );
}
