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

      <section className="news-hero">
        <p>
          <Link href="/">Home</Link> / <span>News</span>
        </p>
        <div className="news-hero-grid">
          <div>
            <p className="news-eyebrow">The CIKETTECH briefing</p>
            <h1>Ideas, systems, and technology in motion.</h1>
          </div>
          <p className="news-hero-summary">Technology updates, product innovation, and engineering news from CIKETTECH, plus the stories shaping the wider industry.</p>
        </div>
      </section>

      <section className="news-section news-section-featured" aria-label="CIKETTECH news">
        <div className="news-section-heading">
          <div><p className="news-eyebrow">Inside CIKETTECH</p><h2>Latest from our newsroom</h2></div>
          <p>Announcements, product progress, and practical notes from our engineering team.</p>
        </div>
        <div className="news-grid">
          {news.admin.map((article) => (
            <article className="news-card" key={article.id}>
              {article.image && (
                <div className="news-card-image">
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
              <div className="news-card-content">
                <p className="news-meta">{article.date}{article.category ? ` · ${article.category}` : ""}</p>
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <Link className="news-link" href={`/news/${article.id}`}>Read article <span aria-hidden="true">&#8594;</span></Link>
              </div>
            </article>
          ))}
          {news.admin.length === 0 && <p>No CIKETTECH technology news has been published yet.</p>}
        </div>
      </section>

      <section className="news-section news-section-external" aria-label="External technology news">
        <div className="news-section-heading">
          <div><p className="news-eyebrow">Around the web</p><h2>Technology news worth your time</h2></div>
          <p>External headlines are linked to their original publishers.</p>
        </div>
        <div className="external-news-list">
          {news.external.map((article) => (
            <article className="external-news-item" key={article.id}>
              <div><p className="news-meta">{article.source} · {article.date}</p><h3>{article.title}</h3><p>{article.summary}</p></div>
              <a className="news-link" href={article.url} target="_blank" rel="noreferrer">Original story <span aria-hidden="true">&#8599;</span></a>
            </article>
          ))}
          {news.external.length === 0 && <p>No external technology headlines are available right now.</p>}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
