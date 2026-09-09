import NewsList from "./NewsList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "News | CIKETTECH Admin",
  description: "Manage CIKETTECH news articles and press releases.",
};

type Article = {
  id: string;
  title: string;
  image: string;
  en: string;
  am: string;
  status: string;
  date: string;
};

export default async function AdminNewsPage() {
  const articles = await apiGet<Article[]>("/api/admin/news");
  return <NewsList articles={articles} />;
}
