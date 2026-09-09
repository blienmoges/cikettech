import ProductsList from "./ProductsList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Products Management | CIKETTECH Admin",
  description: "Manage the CIKETTECH product catalog.",
};

type Product = {
  id: string;
  code: string;
  name: string;
  image: string;
  english: string;
  amharic: string;
  status: string;
  updated: string;
};

export default async function AdminProductsPage() {
  const products = await apiGet<Product[]>("/api/admin/products");
  return <ProductsList products={products} />;
}
