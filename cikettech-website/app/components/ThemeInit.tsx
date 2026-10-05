"use client";

import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("cikettech_admin_theme");
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      // Ignore storage access issues in restricted browsers.
    }
  }, []);

  return null;
}
