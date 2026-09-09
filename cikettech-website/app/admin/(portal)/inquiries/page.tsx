import InquiriesList from "./InquiriesList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Customer Inquiries | CIKETTECH Admin",
  description: "Manage and review incoming customer support requests and sales inquiries.",
};

type Inquiry = {
  id: string;
  name: string;
  initials: string;
  org: string;
  type: string;
  product: string;
  date: string;
  time: string;
  status: string;
};

export default async function AdminInquiriesPage() {
  const inquiries = await apiGet<Inquiry[]>("/api/admin/inquiries");
  return <InquiriesList inquiries={inquiries} />;
}
