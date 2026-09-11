import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerApiBase } from "../../lib/api";
import AdminPortalShell from "./AdminPortalShell";

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("cikettech_admin_session")?.value;
  if (!token) redirect("/admin/login");

  const session = await fetch(`${getServerApiBase()}/api/admin/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!session.ok) redirect("/admin/login");

  return <AdminPortalShell>{children}</AdminPortalShell>;
}
