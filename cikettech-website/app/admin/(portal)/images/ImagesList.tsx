"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublishIcon, DashboardGridIcon, ListViewIcon, ShieldLockIcon } from "../../../components/admin-icons";
import AdminPagination from "../AdminPagination";
import { adminFetch, resolveMediaUrl } from "../../../lib/api";

type Img = { id: string; name: string; date: string; size: string; src: string };

export default function ImagesList({ images }: { images: Img[] }) {
  const [project, setProject] = useState("All Projects");
  const [type, setType] = useState("All Types");
  const [view, setView] = useState<"grid" | "list">("grid");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(files: FileList | null) {
    if (!files || !files.length) return;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await adminFetch("/api/admin/uploads", { method: "POST", body: formData });
      if (!uploadRes.ok) continue;
      const uploaded = await uploadRes.json();

      await adminFetch(`/api/admin/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          src: uploaded.url,
        }),
      });
    }
    router.refresh();
  }

  const filtered = images.filter((img) => {
    if (type === "All Types") return true;
    return img.name.toLowerCase().endsWith(type.toLowerCase());
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Images</h1>
          <p>Manage and organize images used across the CIKETTECH website.</p>
        </div>
        <button type="button" className="primary-button admin-new-btn" onClick={() => inputRef.current?.click()}>
          <PublishIcon /> Upload Images
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-image-filter-row">
          <span className="admin-filter-label">Filter By:</span>
          <select className="admin-type-select" value={project} onChange={(e) => setProject(e.target.value)}>
            <option>All Projects</option>
            <option>AI Smart Parking</option>
            <option>Biometric Attendance</option>
            <option>Smart School Bell</option>
          </select>
          <select className="admin-type-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option>All Types</option>
            <option>JPG</option>
            <option>PNG</option>
            <option>SVG</option>
          </select>
          <div className="admin-image-filter-spacer" />
          <span className="admin-hint">
            Showing {filtered.length} of {images.length}
          </span>
          <div className="admin-view-toggle">
            <button
              type="button"
              className={view === "grid" ? "active" : ""}
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <DashboardGridIcon />
            </button>
            <button
              type="button"
              className={view === "list" ? "active" : ""}
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <ListViewIcon />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="admin-image-grid">
            {filtered.map((img) => (
              <Link key={img.id} href={`/admin/images/${img.id}`} className="admin-image-card">
                {img.src ? (
                  <div
                    className="admin-image-thumb"
                    style={{ backgroundImage: `url('${resolveMediaUrl(img.src)}')` }}
                  />
                ) : (
                  <div className="admin-image-thumb admin-image-thumb-locked">
                    <ShieldLockIcon />
                  </div>
                )}
                <div className="admin-image-card-body">
                  <div className="admin-image-name">{img.name}</div>
                  <div className="admin-image-meta">
                    <span>{img.date}</span>
                    <span className="admin-count-chip">{img.size}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="admin-table-wrapper flush">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((img) => (
                  <tr key={img.id}>
                    <td>
                      <Link className="admin-table-name" href={`/admin/images/${img.id}`}>
                        {img.name}
                      </Link>
                    </td>
                    <td>{img.date}</td>
                    <td>
                      <span className="admin-count-chip">{img.size}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-table-footer">
          <div />
          <AdminPagination pages={[1]} prevLabel="<" nextLabel=">" />
        </div>
      </div>
    </>
  );
}
