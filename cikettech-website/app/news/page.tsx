import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { resolveMediaUrl } from "../lib/api";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "News | CIKETTECH",
  description: "Announcements, press releases, and company updates from CIKETTECH.",
};

type NewsSummary = { id: string; title: string; summary: string; image?: string; date: string };

export default async function NewsPage() {
  const articles = await apiGet<NewsSummary[]>("/api/news");

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>News</span>
        </p>
        <h1>Latest News</h1>
        <div>Announcements, press releases, and updates from across CIKETTECH.</div>
      </section>

      <section className="catalog-section" aria-label="News articles">
        <div className="catalog-grid">
          {articles.map((article) => (
            <article className="catalog-card" key={article.id}>
              {article.image && (
                <div className="catalog-image">
                  <Image
                    src={resolveMediaUrl(article.image)}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={article.image.includes("wikimedia.org")}
                  />
                </div>
              )}
              <div className="catalog-content">
                <p className="legal-updated">{article.date}</p>
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <div className="catalog-actions">
                  <Link className="primary-button compact" href={`/news/${article.id}`}>
                    Read Article
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {articles.length === 0 && <p>No news articles are published yet.</p>}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
