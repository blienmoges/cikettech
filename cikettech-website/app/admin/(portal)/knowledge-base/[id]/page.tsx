import { notFound } from "next/navigation";
import KnowledgeForm from "../KnowledgeForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit Knowledge Entry | CIKETTECH Admin",
  description: "Edit an AI knowledge base entry.",
};

export default async function EditKnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/admin/knowledge-base/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const entry = await res.json();

  return <KnowledgeForm entry={entry} />;
}
