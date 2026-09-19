"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "../../../components/admin-icons";
import { StatusBadge, RowActions } from "../AdminBadges";
import { resolveMediaUrl } from "../../../lib/api";

type Article = {
  id: string;
  title: string;
  image: string;
  en: string;
  am: string;
  status: string;
  date: string;
};

export default function NewsList({ articles }: { articles: Article[] }) {
  const [status, setStatus] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    const matchesStatus = status === "All Statuses" || a.status === status;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>News</h1>
          <p>Manage articles, press releases, and company updates.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/news/new">
          <PlusIcon /> Add News
        </Link>
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-search-row">
          <div className="admin-search">
            <SearchIcon />
            <input
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-type-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All Statuses</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Publication</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="admin-product-thumb" style={{ backgroundImage: `url('${resolveMediaUrl(a.image)}')` }} />
                  </td>
                  <td>
                    <div className="admin-table-name admin-news-title">{a.title}</div>
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>{a.date}</td>
                  <td>
                    <RowActions
                      editHref={`/admin/news/${a.id}`}
                      published={a.status === "Published"}
                      resource="news"
                      id={a.id}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-empty-row">
                    No articles match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {filtered.length} of {articles.length} entries
          </span>
        </div>
      </div>
    </>
  );
}
