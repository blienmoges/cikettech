import { notFound } from "next/navigation";
import NewsForm from "../NewsForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit News Article | CIKETTECH Admin",
  description: "Edit a CIKETTECH news article.",
};

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/admin/news/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const article = await res.json();

  return <NewsForm article={article} />;
}
