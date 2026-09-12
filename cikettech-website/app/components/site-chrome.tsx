import Image from "next/image";
import Link from "next/link";
import { apiGet, getTranslations } from "../lib/server-content";
import { getLocale } from "../lib/locale";
import { t } from "../lib/i18n";
import LocaleToggle from "./LocaleToggle";

const navItems = [
  { label: "Home", key: "home", href: "/" },
  { label: "Products", key: "products", href: "/products" },
  { label: "Technology", key: "technology", href: "/technology" },
  { label: "Innovation", key: "innovation", href: "/innovation" },
  { label: "Impact", key: "impact", href: "/impact" },
  { label: "About", key: "about", href: "/about" },
  { label: "News", key: "news", href: "/news" },
  { label: "Contact", key: "contact", href: "/contact" },
] as const;

function Logo() {
  return (
    <Link className="logo" href="/" aria-label="CIKETTECH home">
      <Image src="/cikettech-logo.svg" alt="" width={214} height={54} priority />
    </Link>
  );
}

export async function SiteHeader({ active = "Home" }: { active?: string }) {
  const [locale, translations] = await Promise.all([getLocale(), getTranslations()]);

  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.label} className={item.label === active ? "active" : ""} href={item.href}>
            {t(locale, item.key, translations)}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <LocaleToggle locale={locale} />
        <Link className="quote-button" href="/contact">
          {t(locale, "requestQuote", translations)}
        </Link>
      </div>
    </header>
  );
}

type SocialLinks = { facebook?: string; linkedin?: string; twitter?: string; instagram?: string };

const socialIcons: Record<keyof SocialLinks, { label: string; path: string }> = {
  facebook: {
    label: "Facebook",
    path: "M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5H16.5V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10.5H8v3h2.3V21h3.2Z",
  },
  linkedin: {
    label: "LinkedIn",
    path: "M6.9 8.4H3.7V20h3.2V8.4ZM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.3 20h-3.2v-6.3c0-1.5-.5-2.5-1.9-2.5a2 2 0 0 0-1.9 1.4c-.1.2-.1.6-.1.9V20H10s0-10.6 0-11.6h3.2v1.6c.4-.7 1.2-1.7 3-1.7 2.2 0 3.9 1.5 3.9 4.6V20Z",
  },
  twitter: {
    label: "X (Twitter)",
    path: "M4 4h4.3l4 5.6L16.9 4H20l-6.2 7.4L20.4 20h-4.3l-4.4-6.1L6.6 20H3.4l6.6-7.9L4 4Z",
  },
  instagram: {
    label: "Instagram",
    path: "M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm0 2A2.5 2.5 0 0 0 5.5 8v8A2.5 2.5 0 0 0 8 18.5h8a2.5 2.5 0 0 0 2.5-2.5V8A2.5 2.5 0 0 0 16 5.5H8Zm4 2.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.6-3.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  },
};

export async function SiteFooter() {
  const [socialLinks, locale, translations] = await Promise.all([
    apiGet<SocialLinks>("/api/social-links").catch(() => ({}) as SocialLinks),
    getLocale(),
    getTranslations(),
  ]);
  const activeSocials = (Object.keys(socialIcons) as (keyof SocialLinks)[]).filter((key) => socialLinks[key]);

  return (
    <footer className="site-footer">
      <div>
        <Logo />
        <p>&copy; 2024 CIKETTECH. {t(locale, "allRightsReserved", translations)}</p>
        <p>{t(locale, "precisionTagline", translations)}</p>
        {activeSocials.length > 0 && (
          <div className="footer-social-links">
            {activeSocials.map((key) => (
              <a
                key={key}
                href={socialLinks[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={socialIcons[key].label}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={socialIcons[key].path} />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="footer-col">
        <h4>{t(locale, "platform", translations)}</h4>
        <Link href="/">{t(locale, "home", translations)}</Link>
        <Link href="/products">{t(locale, "products", translations)}</Link>
        <Link href="/technology">{t(locale, "technology", translations)}</Link>
        <Link href="/assistant">{t(locale, "aiAssistant", translations)}</Link>
      </div>
      <div className="footer-col">
        <h4>{t(locale, "company", translations)}</h4>
        <Link href="/innovation">{t(locale, "innovation", translations)}</Link>
        <Link href="/impact">{t(locale, "impact", translations)}</Link>
        <Link href="/about">{t(locale, "about", translations)}</Link>
        <Link href="/news">{t(locale, "news", translations)}</Link>
        <Link href="/projects">{t(locale, "projects", translations)}</Link>
        <Link href="/awards">{t(locale, "awards", translations)}</Link>
      </div>
      <div className="footer-col">
        <h4>{t(locale, "legalSupport", translations)}</h4>
        <Link href="/contact">{t(locale, "contact", translations)}</Link>
        <Link href="/privacy">{t(locale, "privacyPolicy", translations)}</Link>
        <Link href="/terms">{t(locale, "termsOfService", translations)}</Link>
        <Link href="/security">{t(locale, "security", translations)}</Link>
        <Link href="/status">{t(locale, "status", translations)}</Link>
      </div>
    </footer>
  );
}
