import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { resolveMediaUrl } from "../lib/api";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Projects | CIKETTECH",
  description: "Deployments and initiatives CIKETTECH has delivered across East Africa.",
};

type ProjectSummary = { id: string; title: string; summary: string; image?: string; updated: string };

export default async function ProjectsPage() {
  const projects = await apiGet<ProjectSummary[]>("/api/projects");

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Projects</span>
        </p>
        <h1>Our Projects</h1>
        <div>Real-world deployments where CIKETTECH systems are already at work.</div>
      </section>

      <section className="catalog-section" aria-label="Projects">
        <div className="catalog-grid">
          {projects.map((project) => (
            <article className="catalog-card" key={project.id}>
              {project.image && (
                <div
                  className="catalog-image"
                  style={{ backgroundImage: `url(${resolveMediaUrl(project.image)})` }}
                  role="img"
                  aria-label={project.title}
                />
              )}
              <div className="catalog-content">
                <p className="legal-updated">Updated {project.updated}</p>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <div className="catalog-actions">
                  <Link className="primary-button compact" href={`/projects/${project.id}`}>
                    View Project
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {projects.length === 0 && <p>No projects are published yet.</p>}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
