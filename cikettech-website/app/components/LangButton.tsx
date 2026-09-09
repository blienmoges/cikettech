"use client";

import { GlobeIcon } from "./admin-icons";

export default function LangButton({ className }: { className?: string }) {
  return (
    <button
      className={className}
      type="button"
      aria-label="Change language"
      title="Change language"
      onClick={() => alert("Language switcher (demo) — English / Amharic")}
    >
      <GlobeIcon />
    </button>
  );
}
