import { GlobeIcon } from "../../../components/admin-icons";
import { StatusBadge } from "../AdminBadges";
import { apiGet } from "../../../lib/server-content";
import Link from "next/link";

export const metadata = {
  title: "Languages | CIKETTECH Admin",
  description: "Manage supported languages and track translation coverage across all content.",
};

type Language = { code: string; name: string; status: string; description: string };
type Breakdown = { key: string; label: string; href: string; total: number; enComplete: number; amComplete: number };
type LanguagesData = { languages: Language[]; breakdown: Breakdown[] };

function pct(done: number, total: number) {
  if (!total) return 100;
  return Math.round((done / total) * 100);
}

export default async function AdminLanguagesPage() {
  const data = await apiGet<LanguagesData>("/api/admin/languages");

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Languages</h1>
          <p>Supported languages and translation coverage across every content type.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {data.languages.map((lang) => (
          <div key={lang.code} className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon">
                <GlobeIcon />
              </div>
              <div className="admin-stat-value">{lang.code.toUpperCase()}</div>
            </div>
            <div className="admin-stat-bottom">
              <span className="admin-stat-label">{lang.name.toUpperCase()}</span>
              <StatusBadge status={lang.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card admin-products-card">
        <h3>Translation Coverage</h3>
        <div className="admin-card-divider" />
        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Content Type</th>
                <th>Total Items</th>
                <th>English</th>
                <th>Amharic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((row) => (
                <tr key={row.key}>
                  <td className="admin-table-name">{row.label}</td>
                  <td>{row.total}</td>
                  <td>
                    {row.enComplete}/{row.total} ({pct(row.enComplete, row.total)}%)
                  </td>
                  <td>
                    {row.amComplete}/{row.total} ({pct(row.amComplete, row.total)}%)
                  </td>
                  <td>
                    <Link className="text-action" href={row.href}>
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-info-banner">
        <GlobeIcon />
        <div>
          <strong>About bilingual coverage</strong>
          <p>
            English and Amharic content is tracked per item across Products, News, Projects, Awards,
            and the AI Knowledge Base. French and Arabic are reserved for future expansion and are
            not yet enabled anywhere on the site.
          </p>
        </div>
      </div>
    </>
  );
}
