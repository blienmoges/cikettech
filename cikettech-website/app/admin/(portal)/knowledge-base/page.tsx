import Link from "next/link";
import { PlusIcon } from "../../../components/admin-icons";
import { StatusBadge, RowActions } from "../AdminBadges";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "AI Knowledge Base | CIKETTECH Admin",
  description: "Manage the approved information used by the website AI assistant.",
};

type Entry = {
  id: string;
  title: string;
  contentType: string;
  related: string;
  language: string;
  status: string;
  updated: string;
};

export default async function AdminKnowledgeBasePage() {
  const entries = await apiGet<Entry[]>("/api/admin/knowledge-base");

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>AI Knowledge Base</h1>
          <p>Manage the approved information used by the website AI assistant.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/knowledge-base/new">
          <PlusIcon /> Add Knowledge
        </Link>
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Knowledge Title</th>
                <th>Content Type</th>
                <th>Related Product/Page</th>
                <th>Language</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="admin-table-name">{e.title}</td>
                  <td>
                    <span className="admin-category-pill">{e.contentType}</span>
                  </td>
                  <td>{e.related}</td>
                  <td>{e.language}</td>
                  <td>
                    <StatusBadge status={e.status} />
                  </td>
                  <td>{e.updated}</td>
                  <td>
                    <RowActions
                      editHref={`/admin/knowledge-base/${e.id}`}
                      published={e.status === "Published"}
                      resource="knowledge-base"
                      id={e.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {entries.length} of {entries.length} results
          </span>
          <div className="admin-pagination">
            <button type="button" disabled>
              Previous
            </button>
            <button type="button" className="active">
              1
            </button>
            <button type="button" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
