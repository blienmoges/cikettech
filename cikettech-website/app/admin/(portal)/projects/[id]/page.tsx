import { notFound } from "next/navigation";
import ProjectForm from "../ProjectForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit Project | CIKETTECH Admin",
  description: "Edit a CIKETTECH project.",
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/admin/projects/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const project = await res.json();

  return <ProjectForm project={project} />;
}
