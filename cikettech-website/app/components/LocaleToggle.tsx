"use client";

import { useRouter } from "next/navigation";
import { GlobeIcon } from "./admin-icons";

type Locale = "en" | "am";

export default function LocaleToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const next: Locale = locale === "en" ? "am" : "en";

  function toggle() {
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <button
      className="icon-button locale-toggle"
      type="button"
      onClick={toggle}
      aria-label={locale === "en" ? "Switch to Amharic" : "ወደ እንግሊዝኛ ቀይር"}
      title={locale === "en" ? "አማርኛ" : "English"}
    >
      <GlobeIcon />
      <span className="locale-toggle-label">{next.toUpperCase()}</span>
    </button>
  );
}
