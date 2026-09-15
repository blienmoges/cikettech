import Link from "next/link";
import {
  BoxIcon,
  CalendarIcon,
  ProjectsIcon,
  TrophyIcon,
  ImageIcon,
  DownloadIcon,
  CloudUploadIcon,
  BrainIcon,
} from "../../../components/admin-icons";
import { apiGet } from "../../../lib/server-content";
import { resolveMediaUrl } from "../../../lib/api";

export const metadata = {
  title: "Dashboard | CIKETTECH Admin",
  description: "CIKETTECH Admin Portal dashboard.",
};

type DashboardData = {
  stats: { label: string; value: string; href: string }[];
  trafficBars: number[];
  trafficTotal: number;
  recentUpdates: { title: string; meta: string }[];
  recentInquiries: { id: string; name: string; type: string; product: string; date: string; status: string }[];
  recentMedia: { id: string; name: string; date: string; src: string }[];
  latestDownloads: { id: string; title: string; type: string; language: string; date: string }[];
  inquiryCount: number;
};

const statIcons: Record<string, React.ComponentType> = {
  Products: BoxIcon,
  News: CalendarIcon,
  Projects: ProjectsIcon,
  Awards: TrophyIcon,
  Images: ImageIcon,
  Downloads: DownloadIcon,
};

function statusClass(status: string) {
  return "admin-status admin-status-" + status.toLowerCase().replace(/\s+/g, "-");
}

export default async function AdminDashboardPage() {
  const data = await apiGet<DashboardData>("/api/admin/dashboard");

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-head admin-dashboard-head">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Here&apos;s what&apos;s happening across your website.</p>
        </div>
      </div>

      <div className="admin-dashboard-stats">
        {data.stats.slice(0, 4).map((stat) => {
          const Icon = statIcons[stat.label] ?? BoxIcon;
          return <Link key={stat.label} href={stat.href} className="admin-dashboard-stat"><span className="admin-dashboard-stat-icon"><Icon /></span><span><strong>{stat.value}</strong><small>{stat.label}</small></span><span className="admin-dashboard-stat-arrow">View</span></Link>;
        })}
      </div>

      <div className="admin-dashboard-columns">
        <section className="admin-dashboard-panel admin-quick-actions">
          <div className="admin-dashboard-panel-head"><div><span className="admin-kicker">Workspace</span><h2>Quick Actions</h2></div><span className="admin-hint">Create and manage</span></div>
          <div className="admin-quick-grid">
            <Link href="/admin/products/new"><BoxIcon />Add Product</Link>
            <Link href="/admin/images"><CloudUploadIcon />Upload Image</Link>
            <Link href="/admin/downloads/new"><DownloadIcon />Add Download</Link>
            <Link href="/admin/news/new"><CalendarIcon />Add News</Link>
            <Link href="/admin/awards/new"><TrophyIcon />Add Award</Link>
            <Link href="/admin/knowledge-base/new"><BrainIcon />Update Knowledge</Link>
          </div>
        </section>

        <section className="admin-dashboard-panel admin-dashboard-traffic">
          <div className="admin-dashboard-panel-head"><div><span className="admin-kicker">Last 7 days</span><h2>Traffic overview</h2></div><Link className="text-action" href="/admin/analytics">View analytics</Link></div>
          <div className="admin-dashboard-bars">{data.trafficBars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
          <div className="admin-dashboard-traffic-meta"><strong>{data.trafficTotal}</strong><span>tracked page views</span></div>
        </section>
      </div>

      <div className="admin-dashboard-columns admin-dashboard-columns-wide">
        <section className="admin-dashboard-panel">
          <div className="admin-dashboard-panel-head"><div><span className="admin-kicker">Content</span><h2>Recent media</h2></div><Link className="text-action" href="/admin/images">View all</Link></div>
          <div className="admin-media-grid">{data.recentMedia.length ? data.recentMedia.map((image) => <Link href={`/admin/images/${image.id}`} key={image.id} className="admin-media-item"><img src={resolveMediaUrl(image.src)} alt="" /><strong>{image.name}</strong><small>{image.date}</small></Link>) : <p className="admin-empty">No uploaded images yet.</p>}</div>
        </section>

        <section className="admin-dashboard-panel">
          <div className="admin-dashboard-panel-head"><div><span className="admin-kicker">Inbox</span><h2>Customer inquiries</h2></div><Link className="text-action" href="/admin/inquiries">View all</Link></div>
          <div className="admin-dashboard-inquiries">{data.recentInquiries.length ? data.recentInquiries.map((row) => <Link href={`/admin/inquiries/${row.id}`} key={row.id}><span className="admin-inquiry-avatar">{row.name.slice(0, 1)}</span><span><strong>{row.name}</strong><small>{row.type} · {row.date}</small></span><span className={statusClass(row.status)}>{row.status}</span></Link>) : <p className="admin-empty">No customer inquiries yet.</p>}</div>
        </section>
      </div>

      <section className="admin-dashboard-panel admin-dashboard-downloads">
        <div className="admin-dashboard-panel-head"><div><span className="admin-kicker">Resources</span><h2>Latest downloads</h2></div><Link className="text-action" href="/admin/downloads">View all</Link></div>
        <div className="admin-table-wrapper flush"><table className="admin-table"><thead><tr><th>Title</th><th>Type</th><th>Language</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.latestDownloads.length ? data.latestDownloads.map((item) => <tr key={item.id}><td className="admin-table-name">{item.title}</td><td>{item.type}</td><td>{item.language}</td><td>{item.date}</td><td><span className="admin-status admin-status-published">PUBLISHED</span></td></tr>) : <tr><td colSpan={5}>No published downloads yet.</td></tr>}</tbody></table></div>
      </section>
    </div>
  );
}
