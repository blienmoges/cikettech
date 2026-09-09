"use client";

import { useState } from "react";
import Link from "next/link";
import { CloudUploadIcon, SearchIcon, PdfFileIcon, DocxFileIcon } from "../../../components/admin-icons";
import { StatusBadge, RowActions } from "../AdminBadges";
import AdminPagination from "../AdminPagination";
import { resolveMediaUrl } from "../../../lib/api";

type Document = {
  id: string;
  title: string;
  type: string;
  language: string;
  related: string;
  status: string;
  date: string;
  fileUrl?: string;
};

export default function DownloadsList({ documents }: { documents: Document[] }) {
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const filtered = documents.filter((d) => {
    const matchesType = type === "All Types" || d.type === type;
    const matchesStatus = status === "All Statuses" || d.status === status;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Downloads</h1>
          <p>Manage downloadable documents and resources available on the public website.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/downloads/new">
          <CloudUploadIcon /> Upload Document
        </Link>
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-search-row">
          <div className="admin-search">
            <SearchIcon />
            <input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-type-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option>All Types</option>
            <option>PDF</option>
            <option>DOCX</option>
            <option>ZIP</option>
          </select>
          <select className="admin-type-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All Statuses</option>
            <option>Published</option>
            <option>Unpublished</option>
          </select>
        </div>

        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Type</th>
                <th>Language</th>
                <th>Related Product/Page</th>
                <th>Status</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="admin-doc-cell">
                      <span className={d.type === "PDF" ? "admin-doc-icon pdf" : "admin-doc-icon docx"}>
                        {d.type === "PDF" ? <PdfFileIcon /> : <DocxFileIcon />}
                      </span>
                      {d.fileUrl ? (
                        <a
                          className="admin-table-name"
                          href={resolveMediaUrl(d.fileUrl)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {d.title}
                        </a>
                      ) : (
                        <span className="admin-table-name">{d.title}</span>
                      )}
                    </div>
                  </td>
                  <td>{d.type}</td>
                  <td>{d.language}</td>
                  <td>{d.related}</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>{d.date}</td>
                  <td>
                    <RowActions
                      editHref={`/admin/downloads/${d.id}`}
                      published={d.status === "Published"}
                      resource="downloads"
                      id={d.id}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-row">
                    No documents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {filtered.length} of {documents.length} entries
          </span>
          <AdminPagination pages={[1]} prevLabel="<" nextLabel=">" />
        </div>
      </div>
    </>
  );
}
