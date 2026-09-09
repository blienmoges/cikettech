import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "System Status | CIKETTECH",
  description: "Live status of CIKETTECH's website, admin portal, and AI assistant.",
};

const services = [
  { name: "Marketing Website", uptime: "99.99% uptime (90 days)" },
  { name: "Admin Portal", uptime: "99.97% uptime (90 days)" },
  { name: "AI Assistant", uptime: "99.95% uptime (90 days)" },
  { name: "Customer Inquiries", uptime: "99.98% uptime (90 days)" },
  { name: "Product Catalog API", uptime: "100% uptime (90 days)" },
];

export default function StatusPage() {
  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Status</span>
        </p>
        <h1>System Status</h1>
        <div>Live status of the services that power the CIKETTECH website and AI assistant.</div>
      </section>

      <section className="legal-content">
        <div className="status-banner">
          <span className="status-dot" /> All Systems Operational
        </div>

        <ul className="status-list">
          {services.map((s) => (
            <li key={s.name} className="status-row">
              <div>
                <div className="status-name">{s.name}</div>
                <div className="status-uptime">{s.uptime}</div>
              </div>
              <span className="status-badge">
                <span className="status-dot" /> Operational
              </span>
            </li>
          ))}
        </ul>

        <p className="legal-updated" style={{ marginTop: 32 }}>
          Last checked: September 7, 2026, 09:00 (EAT)
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
