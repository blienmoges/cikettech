import type { MetadataRoute } from "next";
import { apiGet } from "./lib/server-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cikettech.com";

const staticRoutes = [
  "",
  "/products",
  "/technology",
  "/innovation",
  "/impact",
  "/about",
  "/contact",
  "/assistant",
  "/news",
  "/projects",
  "/awards",
  "/privacy",
  "/terms",
  "/security",
  "/status",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, news, projects, awards] = await Promise.all([
    apiGet<{ slug: string }[]>("/api/products").catch(() => []),
    apiGet<{ id: string }[]>("/api/news").catch(() => []),
    apiGet<{ id: string }[]>("/api/projects").catch(() => []),
    apiGet<{ id: string }[]>("/api/awards").catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const p of products) {
    entries.push({ url: `${SITE_URL}/products/${p.slug}`, lastModified: new Date(), priority: 0.8 });
  }
  for (const n of news) {
    entries.push({ url: `${SITE_URL}/news/${n.id}`, lastModified: new Date(), priority: 0.5 });
  }
  for (const p of projects) {
    entries.push({ url: `${SITE_URL}/projects/${p.id}`, lastModified: new Date(), priority: 0.5 });
  }
  for (const a of awards) {
    entries.push({ url: `${SITE_URL}/awards/${a.id}`, lastModified: new Date(), priority: 0.5 });
  }

  return entries;
}
