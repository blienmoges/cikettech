import Link from "next/link";
import {
  BoxIcon,
  CalendarIcon,
  ProjectsIcon,
  TrophyIcon,
  ImageIcon,
  DownloadIcon,
  QuestionIcon,
  BarChartIcon,
  PlusIcon,
} from "../../../components/admin-icons";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Dashboard | CIKETTECH Admin",
  description: "CIKETTECH Admin Portal dashboard.",
};

type DashboardData = {
  stats: { label: string; value: string; href: string }[];
  trafficBars: number[];
  recentUpdates: { title: string; meta: string }[];
  recentInquiries: { name: string; type: string; product: string; date: string; status: string }[];
};

const statIcons: Record<string, React.ComponentType> = {
  Products: BoxIcon,
  News: CalendarIcon,
  Projects: ProjectsIcon,
  Awards: TrophyIcon,
  Images: ImageIcon,
  Downloads: DownloadIcon,
};

const updateIcons = [BoxIcon, CalendarIcon, ProjectsIcon];

function statusClass(status: string) {
  return "admin-status admin-status-" + status.toLowerCase().replace(/\s+/g, "-");
}

export default async function AdminDashboardPage() {
  const data = await apiGet<DashboardData>("/api/admin/dashboard");

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to the CIKETTECH Admin Portal. Here&apos;s a summary of your system.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/projects/new">
          <PlusIcon /> New Project
        </Link>
      </div>

      <div className="admin-grid">
        <div>
          <h2 className="admin-section-title">System Overview</h2>
          <div className="admin-stats-grid">
            {data.stats.map((stat) => {
              const Icon = statIcons[stat.label] ?? BoxIcon;
              return (
                <div key={stat.label} className="admin-stat-card">
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon">
                      <Icon />
                    </div>
                    <div className="admin-stat-value">{stat.value}</div>
                  </div>
                  <div className="admin-stat-bottom">
                    <span className="admin-stat-label">{stat.label.toUpperCase()}</span>
                    <Link className="text-action" href={stat.href}>
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card admin-traffic-card">
            <h3>
              <BarChartIcon /> Traffic Overview
            </h3>
            <div className="admin-bars">
              {data.trafficBars.map((h, i) => (
                <div
                  key={i}
                  className={"admin-bar" + (i === data.trafficBars.length - 1 ? " active" : "")}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <Link className="admin-outline-btn" href="/admin/analytics">
              View Full Analytics
            </Link>
          </div>

          <div className="admin-card admin-updates-card">
            <p className="admin-card-label">Recently Updated</p>
            <ul>
              {data.recentUpdates.map((u, i) => {
                const Icon = updateIcons[i % updateIcons.length];
                return (
                  <li key={u.title}>
                    <div className="admin-update-icon">
                      <Icon />
                    </div>
                    <div>
                      <div className="admin-update-title">{u.title}</div>
                      <div className="admin-update-meta">{u.meta}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="admin-inquiries-head">
        <h2 className="admin-section-title">
          <QuestionIcon /> Recent Customer Inquiries
        </h2>
        <Link className="text-action" href="/admin/inquiries">
          View All Inquiries
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Inquiry Type</th>
              <th>Product/Context</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.recentInquiries.map((row) => (
              <tr key={row.name}>
                <td className="admin-table-name">{row.name}</td>
                <td>{row.type}</td>
                <td>{row.product}</td>
                <td>{row.date}</td>
                <td>
                  <span className={statusClass(row.status)}>{row.status.toUpperCase()}</span>
                </td>
                <td>
                  <Link className="text-action" href="/admin/inquiries">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
