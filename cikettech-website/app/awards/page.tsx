import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { resolveMediaUrl } from "../lib/api";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Awards | CIKETTECH",
  description: "Recognition CIKETTECH has received for engineering and sustainability.",
};

type AwardSummary = { id: string; name: string; org: string; image?: string; date: string; description?: string };

export default async function AwardsPage() {
  const awards = await apiGet<AwardSummary[]>("/api/awards");

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Awards</span>
        </p>
        <h1>Awards &amp; Recognition</h1>
        <div>Industry recognition for CIKETTECH&apos;s engineering and sustainability work.</div>
      </section>

      <section className="catalog-section" aria-label="Awards">
        <div className="catalog-grid">
          {awards.map((award) => (
            <article className="catalog-card" key={award.id}>
              {award.image && (
                <div
                  className="catalog-image"
                  style={{ backgroundImage: `url(${resolveMediaUrl(award.image)})` }}
                  role="img"
                  aria-label={award.name}
                />
              )}
              <div className="catalog-content">
                <p className="legal-updated">
                  {award.org} &bull; {award.date}
                </p>
                <h2>{award.name}</h2>
                {award.description && <p>{award.description}</p>}
                <div className="catalog-actions">
                  <Link className="primary-button compact" href={`/awards/${award.id}`}>
                    View Award
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {awards.length === 0 && <p>No awards are published yet.</p>}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
