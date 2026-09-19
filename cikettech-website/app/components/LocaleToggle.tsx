"use client";

import LangButton from "./LangButton";

type Locale = "en" | "am";

export default function LocaleToggle({ locale }: { locale: Locale }) {
  return <LangButton className="locale-toggle" locale={locale} />;
}
