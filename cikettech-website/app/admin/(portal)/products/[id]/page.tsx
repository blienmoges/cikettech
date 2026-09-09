import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit Product | CIKETTECH Admin",
  description: "Edit a CIKETTECH product listing.",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/admin/products/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const product = await res.json();

  return <ProductForm product={product} />;
}
