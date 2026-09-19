import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import AwardForm from "../AwardForm";
import { getServerApiBase } from "../../../../lib/api";

export const metadata = {
  title: "Edit Award | CIKETTECH Admin",
  description: "Edit a CIKETTECH award or recognition.",
};

export default async function EditAwardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get("cikettech_admin_session")?.value;
  const res = await fetch(`${getServerApiBase()}/api/admin/awards/${encodeURIComponent(id)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const award = await res.json();

  return <AwardForm award={award} />;
}
