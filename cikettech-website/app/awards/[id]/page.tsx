import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { getServerApiBase, resolveMediaUrl } from "../../lib/api";

type Award = {
  id: string;
  name: string;
  org: string;
  image?: string;
  date: string;
  description?: string;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/awards/${id}`, { cache: "no-store" });
  if (!res.ok) return { title: "Awards | CIKETTECH" };
  const award: Award = await res.json();
  return { title: `${award.name} | CIKETTECH Awards`, description: award.description || award.org };
}

export default async function AwardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/awards/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const award: Award = await res.json();

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <Link href="/awards">Awards</Link> / <span>{award.name}</span>
        </p>
        <h1>{award.name}</h1>
        <div>
          {award.org} &bull; {award.date}
        </div>
      </section>

      {award.image && (
        <section className="legal-content">
          <div
            className="catalog-image"
            style={{ backgroundImage: `url(${resolveMediaUrl(award.image)})`, height: 360, borderRadius: 12 }}
            role="img"
            aria-label={award.name}
          />
        </section>
      )}

      <section className="legal-content">
        {award.description && <p>{award.description}</p>}
        <Link className="cyan-link" href="/awards">
          &larr; Back to Awards
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
