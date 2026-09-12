"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AIWidget, { BotIcon } from "./ai-assistant";

export default function CustomerAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname === "/assistant") return null;

  return (
    <div className="customer-assistant">
      {open && (
        <div className="customer-assistant-panel" role="dialog" aria-label="CIKETTECH AI Assistant">
          <AIWidget />
        </div>
      )}
      <button
        type="button"
        className="customer-assistant-button"
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <BotIcon />
      </button>
    </div>
  );
}