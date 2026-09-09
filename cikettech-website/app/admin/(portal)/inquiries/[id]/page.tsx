import { notFound } from "next/navigation";
import InquiryDetail from "./InquiryDetail";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Inquiry Detail | CIKETTECH Admin",
  description: "Review a customer inquiry submission.",
};

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getServerApiBase()}/api/admin/inquiries/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const inquiry = await res.json();

  return <InquiryDetail inquiry={inquiry} />;
}
