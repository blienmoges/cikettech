import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getServerApiBase } from "../../../../lib/api";
import ImageDetail from "./ImageDetail";

export const metadata = {
  title: "Image Details | CIKETTECH Admin",
  description: "Manage metadata and variations for an image asset.",
};

type ImageRecord = {
  id: string;
  name: string;
  date: string;
  size: string;
  src: string;
  category?: string;
  status?: string;
  altEn?: string;
  captionEn?: string;
  altAm?: string;
  captionAm?: string;
};

export default async function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get("cikettech_admin_session")?.value;
  const res = await fetch(`${getServerApiBase()}/api/admin/images/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const image: ImageRecord = await res.json();
  return <ImageDetail image={image} />;
}
