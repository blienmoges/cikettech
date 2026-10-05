"use client";

import { useEffect } from "react";

const STORAGE_KEY = "cikettech_admin_theme";

export default function ThemeInit() {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const preferredDark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.setAttribute(
        "data-theme",
        preferredDark ? "dark" : "light",
      );
    } catch {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  return null;
}
