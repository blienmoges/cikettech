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

type NewsSummary = { id: string; title: string; summary: string; image?: string; date: string; category?: string; source?: string; url?: string; external?: boolean };

export default async function NewsPage() {
  const news = await apiGet<{ admin: NewsSummary[]; external: NewsSummary[] }>("/api/news?category=Technology&includeExternal=true");

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>News</span>
        </p>
        <h1>Latest Technology News</h1>
        <div>Technology updates, product innovation, and engineering news from CIKETTECH.</div>
      </section>

      <section className="catalog-section" aria-label="News articles">
        <div className="catalog-grid">
          {news.admin.map((article) => (
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
                <p className="legal-updated">{article.date}{article.category ? ` · ${article.category}` : ""}</p>
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
          {news.admin.length === 0 && <p>No CIKETTECH technology news has been published yet.</p>}
        </div>
      </section>

      <section className="catalog-section" aria-label="External technology news">
        <div className="section-heading"><h2>Technology News From Around the Web</h2><p>External headlines are linked to their original publishers.</p></div>
        <div className="catalog-grid">
          {news.external.map((article) => (
            <article className="catalog-card" key={article.id}>
              <div className="catalog-content"><p className="legal-updated">{article.date} · {article.source}</p><h2>{article.title}</h2><p>{article.summary}</p><div className="catalog-actions"><a className="primary-button compact" href={article.url} target="_blank" rel="noreferrer">Read Original Article</a></div></div>
            </article>
          ))}
          {news.external.length === 0 && <p>No external technology headlines are available right now.</p>}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
