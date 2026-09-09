import AwardsList from "./AwardsList";
import { apiGet } from "../../../lib/server-content";

export const metadata = {
  title: "Awards | CIKETTECH Admin",
  description: "Manage and publish CIKETTECH company awards and recognitions.",
};

type Award = {
  id: string;
  name: string;
  org: string;
  image: string;
  en: string;
  am: string;
  status: string;
  date: string;
};

export default async function AdminAwardsPage() {
  const awards = await apiGet<Award[]>("/api/admin/awards");
  return <AwardsList awards={awards} />;
}
