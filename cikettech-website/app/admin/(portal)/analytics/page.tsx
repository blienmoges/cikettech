import AnalyticsClient from "./AnalyticsClient";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Analytics | CIKETTECH Admin",
  description: "Overview of platform performance and user engagement.",
};

type AnalyticsData = {
  range: string;
  kpis: { label: string; value: string; delta: string; up: boolean }[];
  traffic: { months: string[]; points: number[] };
  engagementByCategory: { label: string; value: number }[];
  mostViewedPages: { path: string; views: string }[];
  languageUsage: { label: string; pct: number }[];
  deviceBreakdown: { label: string; pct: string }[];
};

export default async function AdminAnalyticsPage() {
  const data = await apiGet<AnalyticsData>("/api/admin/analytics?range=30D");
  return <AnalyticsClient initialData={data} />;
}
