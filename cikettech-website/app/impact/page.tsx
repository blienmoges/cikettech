import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Impact | CIKETTECH",
  description:
    "How CIKETTECH invests in local manufacturing, education, industrial innovation, and circular electronics across Ethiopia.",
};

type ImpactData = {
  hero: { eyebrow: string; heading: string; body: string };
  sectionHeading: string;
  areas: { title: string; description: string; icon: string }[];
  cta: { heading: string; body: string; link: string };
};

function ImpactIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    factory: "M4 20V10l5 3V10l5 3V7l6 4v9H4Zm2-2h12v-5.4l-2-1.3v2.7l-5-3v3l-5-3V18Z",
    graduation: "M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z",
    gear: "M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm8.4 3.5-2-.3a6.4 6.4 0 0 0-.5-1.3l1.2-1.7-1.4-1.4-1.7 1.2a6.4 6.4 0 0 0-1.3-.5l-.3-2h-2l-.3 2a6.4 6.4 0 0 0-1.3.5L9.1 6.9 7.7 8.3l1.2 1.7a6.4 6.4 0 0 0-.5 1.3l-2 .3v2l2 .3c.1.5.3.9.5 1.3l-1.2 1.7 1.4 1.4 1.7-1.2c.4.2.8.4 1.3.5l.3 2h2l.3-2c.5-.1.9-.3 1.3-.5l1.7 1.2 1.4-1.4-1.2-1.7c.2-.4.4-.8.5-1.3l2-.3v-2Z",
    recycle:
      "M9.3 3.5 6 9l3.3 5.5 1.7-1-2-3.4h4.4l-1.6 2.8 1.7 1L16 8H8.8l1.7-2.9-1.2-1.6ZM4.5 15.5l3.2 5.5h4l-1.7-3H6.9l-1.2-2Zm14.2-6-3.4 5.9 1.7 1 1.7-3 2 3.5 1.7-1-3.7-6.4Z",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name] ?? paths.gear} />
    </svg>
  );
}

export default async function ImpactPage() {
  const data = await apiGet<ImpactData>("/api/impact");

  return (
    <main className="innovation-page">
      <SiteHeader active="Impact" />

      <section className="innovation-hero">
        <div className="innovation-hero-copy">
          <p className="dark-breadcrumb">
            <Link href="/">Home</Link> <span>/</span> Impact
          </p>
          <p className="innovation-pill">{data.hero.eyebrow}</p>
          <h1>{data.hero.heading}</h1>
          <p>{data.hero.body}</p>
        </div>
        <div className="innovation-hero-image" role="img" aria-label="Ethiopian engineers and technicians at work" />
      </section>

      <section className="research-section">
        <h2>{data.sectionHeading}</h2>
        <div className="research-grid">
          {data.areas.map((area) => (
            <article className="research-card" key={area.title}>
              <div className="research-icon">
                <ImpactIcon name={area.icon} />
              </div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="future-section">
        <div>
          <h2>{data.cta.heading}</h2>
          <p>{data.cta.body}</p>
          <Link className="cyan-link" href="/contact">
            {data.cta.link}
          </Link>
        </div>
        <div className="future-image" role="img" aria-label="CIKETTECH manufacturing facility" />
      </section>

      <SiteFooter />
    </main>
  );
}
