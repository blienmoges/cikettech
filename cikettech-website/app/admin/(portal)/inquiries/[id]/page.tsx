import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import InquiryDetail from "./InquiryDetail";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Inquiry Detail | CIKETTECH Admin",
  description: "Review a customer inquiry submission.",
};

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get("cikettech_admin_session")?.value;
  const res = await fetch(`${getServerApiBase()}/api/admin/inquiries/${encodeURIComponent(id)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const inquiry = await res.json();

  return <InquiryDetail inquiry={inquiry} />;
}
