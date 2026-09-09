import { notFound } from "next/navigation";
import DownloadForm from "../DownloadForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit Document | CIKETTECH Admin",
  description: "Edit a downloadable document.",
};

export default async function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/admin/downloads/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const doc = await res.json();

  return <DownloadForm doc={doc} />;
}
