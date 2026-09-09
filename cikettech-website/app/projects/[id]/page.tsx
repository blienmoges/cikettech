import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { getServerApiBase, resolveMediaUrl } from "../../lib/api";

type Project = {
  id: string;
  title: string;
  summary: string;
  description?: string;
  image?: string;
  updated: string;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/projects/${id}`, { cache: "no-store" });
  if (!res.ok) return { title: "Projects | CIKETTECH" };
  const project: Project = await res.json();
  return { title: `${project.title} | CIKETTECH Projects`, description: project.summary };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/projects/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const project: Project = await res.json();

  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <Link href="/projects">Projects</Link> / <span>{project.title}</span>
        </p>
        <h1>{project.title}</h1>
        <div>{project.summary}</div>
      </section>

      {project.image && (
        <section className="legal-content">
          <div
            className="catalog-image"
            style={{ height: 360, borderRadius: 12, overflow: "hidden" }}
          >
            <Image
              src={resolveMediaUrl(project.image)}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
              unoptimized={project.image.includes("wikimedia.org")}
            />
          </div>
        </section>
      )}

      <section className="legal-content">
        <p className="legal-updated">Last updated {project.updated}</p>
        <p>{project.description || project.summary}</p>
        <Link className="cyan-link" href="/projects">
          &larr; Back to Projects
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
