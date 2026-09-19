"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobeIcon } from "./admin-icons";

type Locale = "en" | "am";

function readLocale(): Locale {
  return document.cookie.match(/(?:^|; )lang=([^;]*)/)?.[1] === "am" ? "am" : "en";
}

export default function LangButton({ className, locale }: { className?: string; locale?: Locale }) {
  const router = useRouter();
  const [clientLocale, setClientLocale] = useState<Locale>("en");
  const selectedLocale = locale ?? clientLocale;

  useEffect(() => {
    if (!locale) setClientLocale(readLocale());
  }, [locale]);

  function changeLocale(nextLocale: Locale) {
    document.cookie = `lang=${nextLocale}; path=/; max-age=31536000`;
    setClientLocale(nextLocale);
    router.refresh();
  }

  return (
    <label className={`language-select ${className ?? ""}`} title="Choose language">
      <GlobeIcon />
      <span className="sr-only">Language</span>
      <select value={selectedLocale} onChange={(event) => changeLocale(event.target.value as Locale)} aria-label="Choose language">
        <option value="en">English</option>
        <option value="am">Amharic</option>
      </select>
    </label>
  );
}
