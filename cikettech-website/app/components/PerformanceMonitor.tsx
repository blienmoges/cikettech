"use client";

import { useEffect } from "react";
import { API_BASE } from "../lib/api";

export default function PerformanceMonitor() {
  useEffect(() => {
    const metrics: Record<string, number> = {};
    const observers: PerformanceObserver[] = [];
    const visitorKey = "cikettech_visitor_id";
    const visitorId = localStorage.getItem(visitorKey) || crypto.randomUUID();
    localStorage.setItem(visitorKey, visitorId);
    const locale = document.cookie.match(/(?:^|; )lang=([^;]*)/)?.[1] === "am" ? "am" : "en";
    const device = window.matchMedia("(max-width: 640px)").matches ? "Mobile" : window.matchMedia("(max-width: 1024px)").matches ? "Tablet" : "Desktop";
    navigator.sendBeacon(`${API_BASE}/api/analytics/events`, new Blob([JSON.stringify({ type: "pageview", path: window.location.pathname, visitorId, locale, device })], { type: "application/json" }));

    function observe(type: string, handler: (entry: PerformanceEntry) => void) {
      if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return;
      const observer = new PerformanceObserver((list) => list.getEntries().forEach(handler));
      observer.observe({ type, buffered: true });
      observers.push(observer);
    }

    observe("largest-contentful-paint", (entry) => { metrics.lcp = entry.startTime; });
    observe("layout-shift", (entry) => {
      const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
      if (!shift.hadRecentInput) metrics.cls = (metrics.cls || 0) + (shift.value || 0);
    });
    observe("event", (entry) => {
      const event = entry as PerformanceEntry & { duration?: number };
      metrics.inp = Math.max(metrics.inp || 0, event.duration || 0);
    });

    function send() {
      if (!Object.keys(metrics).length) return;
      const body = JSON.stringify({ metrics, path: window.location.pathname });
      navigator.sendBeacon(`${API_BASE}/api/metrics`, new Blob([body], { type: "application/json" }));
    }

    window.addEventListener("pagehide", send);
    return () => {
      window.removeEventListener("pagehide", send);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}
