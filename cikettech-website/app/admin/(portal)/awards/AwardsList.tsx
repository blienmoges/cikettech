"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon, ImageIcon } from "../../../components/admin-icons";
import { StatusBadge, RowActions } from "../AdminBadges";
import AdminPagination from "../AdminPagination";
import { resolveMediaUrl } from "../../../lib/api";

type Award = {
  id: string;
  name: string;
  org: string;
  image: string;
  status: string;
  date: string;
};

export default function AwardsList({ awards }: { awards: Award[] }) {
  const [status, setStatus] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const filtered = awards.filter((a) => {
    const matchesStatus = status === "All Statuses" || a.status === status;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Awards</h1>
          <p>Manage and publish company awards and recognitions.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/awards/new">
          <PlusIcon /> Add Award
        </Link>
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-search-row">
          <div className="admin-search">
            <SearchIcon />
            <input
              placeholder="Search awards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
                <th>Image</th>
                <th>Award Name</th>
                <th>Issuing Organization</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.image ? (
                      <div className="admin-product-thumb" style={{ backgroundImage: `url('${resolveMediaUrl(a.image)}')` }} />
                    ) : (
                      <div className="admin-product-thumb admin-thumb-empty">
                        <ImageIcon />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="admin-table-name">{a.name}</div>
                  </td>
                  <td>{a.org}</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>{a.date}</td>
                  <td>
                    <RowActions
                      editHref={`/admin/awards/${a.id}`}
                      published={a.status === "Published"}
                      resource="awards"
                      id={a.id}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-row">
                    No awards match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {filtered.length} of {awards.length} results
          </span>
          <AdminPagination pages={[1]} />
        </div>
      </div>
    </>
  );
}
