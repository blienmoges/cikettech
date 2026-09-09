import ImagesList from "./ImagesList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Images | CIKETTECH Admin",
  description: "Manage and organize images used across the CIKETTECH website.",
};

type Img = { id: string; name: string; date: string; size: string; src: string };

export default async function AdminImagesPage() {
  const images = await apiGet<Img[]>("/api/admin/images");
  return <ImagesList images={images} />;
}
