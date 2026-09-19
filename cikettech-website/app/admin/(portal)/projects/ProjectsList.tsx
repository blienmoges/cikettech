"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "../../../components/admin-icons";
import { StatusBadge, RowActions } from "../AdminBadges";
import AdminPagination from "../AdminPagination";
import { resolveMediaUrl } from "../../../lib/api";

type Project = {
  id: string;
  title: string;
  image: string;
  status: string;
  updated: string;
};

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [status, setStatus] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchesStatus = status === "All Statuses" || p.status === status;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Projects</h1>
          <p>Manage and track your ongoing and completed projects across all languages.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/projects/new">
          <PlusIcon /> Add Project
        </Link>
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-search-row">
          <div className="admin-search">
            <SearchIcon />
            <input
              placeholder="Search projects..."
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
                <th>Project Title</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-thumb" style={{ backgroundImage: `url('${resolveMediaUrl(p.image)}')` }} />
                  </td>
                  <td>
                    <div className="admin-table-name admin-news-title">{p.title}</div>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>{p.updated}</td>
                  <td>
                    <RowActions
                      editHref={`/admin/projects/${p.id}`}
                      published={p.status === "Published"}
                      resource="projects"
                      id={p.id}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-empty-row">
                    No projects match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {filtered.length} of {projects.length} entries
          </span>
          <AdminPagination pages={[1]} prevLabel="Prev" />
        </div>
      </div>
    </>
  );
}
