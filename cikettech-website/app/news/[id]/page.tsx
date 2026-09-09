import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { getServerApiBase, resolveMediaUrl } from "../../lib/api";

type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  date: string;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/news/${id}`, { cache: "no-store" });
  if (!res.ok) return { title: "News | CIKETTECH" };
  const article: NewsArticle = await res.json();
  return { title: `${article.title} | CIKETTECH News`, description: article.summary };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/news/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const article: NewsArticle = await res.json();

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <Link href="/news">News</Link> / <span>{article.title}</span>
        </p>
        <h1>{article.title}</h1>
        <div>{article.summary}</div>
      </section>

      {article.image && (
        <section className="legal-content">
          <div
            className="catalog-image"
            style={{ backgroundImage: `url(${resolveMediaUrl(article.image)})`, height: 360, borderRadius: 12 }}
            role="img"
            aria-label={article.title}
          />
        </section>
      )}

      <section className="legal-content">
        <p className="legal-updated">Published {article.date}</p>
        <p>{article.content}</p>
        <Link className="cyan-link" href="/news">
          &larr; Back to News
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
