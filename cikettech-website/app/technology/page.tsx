import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Technology | CIKETTECH",
  description:
    "Explore CIKETTECH capabilities across embedded systems, AI, computer vision, PCB design, IoT connectivity, and product testing.",
};

type TechnologyData = {
  hero: { eyebrow: string; heading: string; summary: string };
  section: { heading: string; body: string };
  cta: { heading: string; link: string };
  competencies: { title: string; description: string; icon: string }[];
};

function CapabilityIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    chip: "M9 3h6v3h3v3h3v6h-3v3h-3v3H9v-3H6v-3H3V9h3V6h3V3Zm0 6v6h6V9H9Zm2 2h2v2h-2v-2Z",
    ai: "M7 8h3l4-4v16l-4-4H7l-3-3v-2l3-3Zm10 1.2 2-1.2v8l-2-1.2V9.2Z",
    eye: "M12 5c5 0 8.5 4.2 9.5 7-1 2.8-4.5 7-9.5 7s-8.5-4.2-9.5-7c1-2.8 4.5-7 9.5-7Zm0 3.5A3.5 3.5 0 1 0 12 15a3.5 3.5 0 0 0 0-7Zm0 2A1.5 1.5 0 1 1 12 13a1.5 1.5 0 0 1 0-3Z",
    board: "M4 4h16v16H4V4Zm4 4v3h3V8H8Zm5 0v3h3V8h-3Zm-5 5v3h3v-3H8Zm5 0v3h3v-3h-3Z",
    tool: "M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.9 2.9-3-3 2.9-2.9Z",
    device: "M6 5h9a2 2 0 0 1 2 2v2h1a2 2 0 0 1 2 2v8H8v-2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v8h9V7H6Zm4 4h8v6h-8v-6Z",
    signal: "M12 18.5a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Zm-4-4A5.7 5.7 0 0 1 12 13a5.7 5.7 0 0 1 4 1.5l-1.5 1.5A3.5 3.5 0 0 0 12 15a3.5 3.5 0 0 0-2.5 1L8 14.5Zm-3.1-3.1A10 10 0 0 1 12 8.5a10 10 0 0 1 7.1 2.9l-1.5 1.5A7.9 7.9 0 0 0 12 10.6a7.9 7.9 0 0 0-5.6 2.3l-1.5-1.5Z",
    test: "M12 3a9 9 0 1 0 9 9h-3a6 6 0 1 1-6-6V3Zm2 0v5h5a8.8 8.8 0 0 0-5-5Zm-5 9 2 2 4-4 1.4 1.4L11 16.8l-3.4-3.4L9 12Z",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default async function TechnologyPage() {
  const data = await apiGet<TechnologyData>("/api/technology");

  return (
    <main>
      <SiteHeader active="Technology" />

      <section className="technology-hero">
        <div className="technology-hero-copy">
          <p className="dark-breadcrumb">
            <Link href="/">Home</Link> <span>/</span> Technology
          </p>
          <p className="capability-pill">{data.hero.eyebrow}</p>
          <h1>{data.hero.heading}</h1>
          <p className="technology-summary">{data.hero.summary}</p>
        </div>
        <div className="technology-hero-image" role="img" aria-label="Illuminated circuit board" />
      </section>

      <section className="competencies-section">
        <div className="section-heading">
          <h2>{data.section.heading}</h2>
          <p>{data.section.body}</p>
        </div>

        <div className="competency-grid">
          {data.competencies.map((competency) => (
            <article className="competency-card" key={competency.title}>
              <div className="competency-icon">
                <CapabilityIcon name={competency.icon} />
              </div>
              <h3>{competency.title}</h3>
              <p>{competency.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="technology-cta">
        <h2>{data.cta.heading}</h2>
        <Link className="primary-button" href="/innovation">
          {data.cta.link}
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
