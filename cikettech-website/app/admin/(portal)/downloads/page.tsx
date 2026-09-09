import DownloadsList from "./DownloadsList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Downloads | CIKETTECH Admin",
  description: "Manage downloadable documents and resources available on the public website.",
};

type Document = {
  id: string;
  title: string;
  type: string;
  language: string;
  related: string;
  status: string;
  date: string;
};

export default async function AdminDownloadsPage() {
  const documents = await apiGet<Document[]>("/api/admin/downloads");
  return <DownloadsList documents={documents} />;
}
