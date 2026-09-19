import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProductForm from "../ProductForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit Product | CIKETTECH Admin",
  description: "Edit a CIKETTECH product listing.",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get("cikettech_admin_session")?.value;
  const res = await fetch(`${getServerApiBase()}/api/admin/products/${encodeURIComponent(id)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const product = await res.json();

  return <ProductForm product={product} />;
}
