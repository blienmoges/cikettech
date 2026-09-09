import ProjectsList from "./ProjectsList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Projects | CIKETTECH Admin",
  description: "Manage CIKETTECH engineering and infrastructure projects.",
};

type Project = {
  id: string;
  title: string;
  image: string;
  en: string;
  am: string;
  status: string;
  updated: string;
};

export default async function AdminProjectsPage() {
  const projects = await apiGet<Project[]>("/api/admin/projects");
  return <ProjectsList projects={projects} />;
}
