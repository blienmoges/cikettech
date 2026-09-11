"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LangButton from "../../components/LangButton";
import ThemeToggle from "../../components/ThemeToggle";
import { clearAdminToken } from "../../lib/api";
import {
  BrandMark,
  UserIcon,
  ChevronDownIcon,
  DashboardGridIcon,
  BoxIcon,
  CalendarIcon,
  ProjectsIcon,
  TrophyIcon,
  ImageIcon,
  DownloadIcon,
  GlobeIcon,
  QuestionIcon,
  BarChartIcon,
  BrainIcon,
  LogoutIcon,
} from "../../components/admin-icons";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: DashboardGridIcon },
  { label: "Products", href: "/admin/products", icon: BoxIcon },
  { label: "News", href: "/admin/news", icon: CalendarIcon },
  { label: "Projects", href: "/admin/projects", icon: ProjectsIcon },
  { label: "Awards", href: "/admin/awards", icon: TrophyIcon },
  { label: "Images", href: "/admin/images", icon: ImageIcon },
  { label: "Downloads", href: "/admin/downloads", icon: DownloadIcon },
  { label: "Languages", href: "/admin/languages", icon: GlobeIcon },
  { label: "Customer Inquiries", href: "/admin/inquiries", icon: QuestionIcon },
  { label: "Analytics", href: "/admin/analytics", icon: BarChartIcon },
  { label: "AI Knowledge Base", href: "/admin/knowledge-base", icon: BrainIcon },
  { label: "Users", href: "/admin/users", icon: UserIcon },
];

export default function AdminPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    clearAdminToken();
    router.push("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-sidebar-logo">
            <BrandMark />
            CIKETTECH
          </div>
          <p className="admin-sidebar-tag">Admin Portal</p>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""}>
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button type="button" className="admin-sidebar-logout" onClick={logOut}>
          <LogoutIcon />
          Log Out
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <ThemeToggle className="admin-lang-btn" />
          <LangButton className="admin-lang-btn" />
          <Link href="/admin/settings" className="admin-topbar-profile">
            <div className="admin-avatar">
              <UserIcon />
            </div>
            <span>Admin Profile</span>
            <ChevronDownIcon />
          </Link>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
