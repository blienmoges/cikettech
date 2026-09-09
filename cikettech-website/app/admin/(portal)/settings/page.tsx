import SettingsClient from "./SettingsClient";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Settings | CIKETTECH Admin",
  description: "Manage your admin profile, password, and preferences.",
};

type Settings = {
  name: string;
  email: string;
  role: string;
  language: string;
  emailNotifications: boolean;
  socialLinks: { facebook: string; linkedin: string; twitter: string; instagram: string };
};

export default async function AdminSettingsPage() {
  const settings = await apiGet<Settings>("/api/admin/settings");
  return <SettingsClient initialSettings={settings} />;
}
