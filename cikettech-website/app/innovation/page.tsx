import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Innovation | CIKETTECH",
  description:
    "See CIKETTECH's innovation workflow, product development process, research areas, and future technology direction.",
};

type InnovationData = {
  hero: { eyebrow: string; heading: string; body: string };
  workflowSection: { heading: string; body: string };
  processSection: { eyebrow: string; heading: string };
  researchSection: { heading: string };
  workflow: { title: string; description: string; icon: string }[];
  phases: { label: string; title: string; description: string; icon: string }[];
  researchAreas: { title: string; description: string; icon: string }[];
  future: { heading: string; body: string; link: string };
};

function InnovationIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm5 9 4.5 4.5-1.5 1.5-4.5-4.5 1.5-1.5Z",
    compass: "M12 3 6.5 21h2.2l1.1-3h4.4l1.1 3h2.2L12 3Zm0 6.5 1.5 6.5h-3L12 9.5Z",
    flask: "M9 3h6v2h-1v5.1l4.3 7.5A2.2 2.2 0 0 1 16.4 21H7.6a2.2 2.2 0 0 1-1.9-3.4l4.3-7.5V5H9V3Zm3 8-2.3 4h4.6L12 11Z",
    data: "M5 4h14v16H5V4Zm3 3v10h2V7H8Zm3.5 5v5h2v-5h-2Zm3.5-3v8h2V9h-2Z",
    code: "M8.5 8.5 5 12l3.5 3.5L7.1 17 2.2 12l4.9-5L8.5 8.5Zm7 0L16.9 7l4.9 5-4.9 5-1.4-1.5L19 12l-3.5-3.5ZM14 5l-2.7 14H9.2L11.9 5H14Z",
    stress: "M12 3 5 10h5l-2 8 7-10h-5l2-5Zm7 11h2v5h-5v-2h3v-3ZM3 14h2v3h3v2H3v-5Z",
    deploy: "M4 5h16v11H4V5Zm2 2v7h12V7H6Zm3 10h6v2H9v-2Zm2-8h2v2h-2V9Z",
    chip: "M9 3h6v3h3v3h3v6h-3v3h-3v3H9v-3H6v-3H3V9h3V6h3V3Zm0 6v6h6V9H9Z",
    network: "M12 4a2.5 2.5 0 0 1 2.3 3.5l2.2 2.2a2.5 2.5 0 1 1-1.4 1.4l-2.2-2.2a2.6 2.6 0 0 1-1.8 0l-2.2 2.2a2.5 2.5 0 1 1-1.4-1.4l2.2-2.2A2.5 2.5 0 0 1 12 4Zm0 10a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default async function InnovationPage() {
  const data = await apiGet<InnovationData>("/api/innovation");

  return (
    <main className="innovation-page">
      <SiteHeader active="Innovation" />

      <section className="innovation-hero">
        <div className="innovation-hero-copy">
          <p className="dark-breadcrumb">
            <Link href="/">Home</Link> <span>/</span> Innovation
          </p>
          <p className="innovation-pill">{data.hero.eyebrow}</p>
          <h1>{data.hero.heading}</h1>
          <p>{data.hero.body}</p>
        </div>
        <div className="innovation-hero-image" role="img" aria-label="Engineers prototyping electronics" />
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <h2>{data.workflowSection.heading}</h2>
          <p>{data.workflowSection.body}</p>
        </div>
        <div className="workflow-track">
          {data.workflow.map((step) => (
            <article className="workflow-step" key={step.title}>
              <div className="workflow-icon">
                <InnovationIcon name={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section">
        <p className="process-eyebrow">{data.processSection.eyebrow}</p>
        <h2>{data.processSection.heading}</h2>
        <div className="phase-track">
          {data.phases.map((phase) => (
            <article className="phase-step" key={phase.label}>
              <div className="phase-icon">
                <InnovationIcon name={phase.icon} />
              </div>
              <p>{phase.label}</p>
              <h3>{phase.title}</h3>
              <div>{phase.description}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="research-section">
        <h2>{data.researchSection.heading}</h2>
        <div className="research-grid">
          {data.researchAreas.map((area) => (
            <article className="research-card" key={area.title}>
              <div className="research-icon">
                <InnovationIcon name={area.icon} />
              </div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="future-section">
        <div>
          <h2>{data.future.heading}</h2>
          <p>{data.future.body}</p>
          <Link className="cyan-link" href="/impact">
            {data.future.link}
          </Link>
        </div>
        <div className="future-image" role="img" aria-label="Future digital technology visualization" />
      </section>

      <SiteFooter />
    </main>
  );
}
