"use client";

import React, { useEffect, useState } from "react";
import {
  PeopleIcon,
  EyeIcon,
  MessageIcon,
  DocDollarIcon,
  DotsVerticalIcon,
  CalendarIcon,
  DesktopIcon,
  MobileIcon,
  TabletIcon,
} from "../../../components/admin-icons";
import { API_BASE, adminFetch } from "../../../lib/api";

type AnalyticsData = {
  range: string;
  kpis: { label: string; value: string; delta: string; up: boolean }[];
  traffic: { months: string[]; points: number[] };
  engagementByCategory: { label: string; value: number }[];
  mostViewedPages: { path: string; views: string }[];
  languageUsage: { label: string; pct: number }[];
  deviceBreakdown: { label: string; pct: string }[];
  vitals?: { metric: string; samples: number; average: number | null }[];
};

const kpiIcons: Record<string, React.ComponentType> = {
  "Total Visitors": PeopleIcon,
  "Page Views": EyeIcon,
  "Customer Inquiries": MessageIcon,
  "Quote Requests": DocDollarIcon,
};

const deviceIcons: Record<string, React.ComponentType> = {
  Desktop: DesktopIcon,
  Mobile: MobileIcon,
  Tablet: TabletIcon,
};

const trafficMax = 140;
const categoryMax = 900;

function chartPath(points: number[], max: number, width: number, height: number) {
  const step = width / (points.length - 1);
  return points.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${height - (v / max) * height}`).join(" ");
}

export default function AnalyticsClient({ initialData }: { initialData: AnalyticsData }) {
  const [range, setRange] = useState(initialData.range);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh(nextRange = range) {
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/analytics?range=${encodeURIComponent(nextRange)}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError("Could not refresh analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (range !== initialData.range) refresh(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  function downloadCsv() {
    const rows = [
      ["Metric", "Value"],
      ...data.kpis.map((item) => [item.label, item.value]),
      ...data.mostViewedPages.map((item) => [`Page views: ${item.path}`, item.views]),
      ...data.deviceBreakdown.map((item) => [`Device: ${item.label}`, item.pct]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `cikettech-analytics-${data.range.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const width = 640;
  const height = 220;
  const linePath = chartPath(data.traffic.points, trafficMax, width, height);
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const yTicks = [140, 120, 100, 80, 60, 40, 20, 0];
  const catTicks = [900, 800, 700, 600, 500, 400, 300, 200, 100, 0];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Analytics</h1>
          <p>Overview of platform performance and user engagement.</p>
        </div>
        <div className="admin-range-tabs">
          {["7D", "30D", "3M"].map((r) => (
            <button key={r} type="button" className={range === r ? "active" : ""} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
          <button
            type="button"
            className={"admin-range-custom" + (range === "Custom" ? " active" : "")}
            onClick={() => setRange("Custom")}
          >
            <CalendarIcon /> Custom
          </button>
          <button type="button" className="admin-outline-btn compact" onClick={() => refresh()} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button type="button" className="admin-outline-btn compact" onClick={downloadCsv}>
            Export CSV
          </button>
        </div>
      </div>

      {error && <p className="admin-login-error">{error}</p>}

      <div className="admin-card admin-vitals-card">
        <div className="admin-card-head-row"><h2>Core Web Vitals</h2><span className="admin-hint">Real-user samples: {data.vitals?.reduce((sum, item) => sum + item.samples, 0) ?? 0}</span></div>
        <div className="admin-vitals-grid">
          {(data.vitals ?? []).map((item) => {
            const limits: Record<string, number> = { lcp: 2500, cls: 0.1, inp: 200 };
            const average = item.average;
            const good = average !== null && average <= limits[item.metric];
            return <div key={item.metric} className="admin-vital"><strong>{item.metric.toUpperCase()}</strong><span>{average === null ? "No data" : `${average.toFixed(item.metric === "cls" ? 3 : 0)}${item.metric === "cls" ? "" : " ms"}`}</span><small className={average === null ? "" : good ? "good" : "needs-attention"}>{average === null ? "Awaiting samples" : good ? "Good" : "Needs attention"}</small></div>;
          })}
        </div>
      </div>

      <div className="admin-kpi-grid">
        {data.kpis.map((k) => {
          const Icon = kpiIcons[k.label] ?? PeopleIcon;
          return (
            <div key={k.label} className="admin-kpi-card">
              <div className="admin-kpi-top">
                <span className="admin-metric-label">{k.label.toUpperCase()}</span>
                <Icon />
              </div>
              <div className="admin-kpi-value">{k.value}</div>
              <div className={"admin-kpi-delta" + (k.up ? " up" : " down")}>
                {k.up ? "↗" : "↘"} {k.delta} vs last period
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-charts-grid">
        <div className="admin-card admin-chart-card">
          <div className="admin-card-head-row">
            <h2>Traffic Overview</h2>
            <span className="admin-chart-actions" aria-label="Traffic chart actions">
              <button type="button" className="admin-icon-only" aria-label="Refresh traffic chart" onClick={() => refresh()} disabled={loading}><DotsVerticalIcon /></button>
            </span>
          </div>
          <div className="admin-chart-row">
            <div className="admin-chart-yaxis">
              {yTicks.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="admin-chart-area">
              <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="admin-line-chart">
                <defs>
                  <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#trafficFill)" stroke="none" />
                <path d={linePath} fill="none" stroke="var(--blue)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                {data.traffic.points.map((v, i) => {
                  const step = width / (data.traffic.points.length - 1);
                  return (
                    <circle
                      key={i}
                      cx={i * step}
                      cy={height - (v / trafficMax) * height}
                      r="4.5"
                      fill="#ffffff"
                      stroke="var(--blue)"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="admin-chart-xaxis">
            {data.traffic.months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="admin-card admin-chart-card">
          <div className="admin-card-head-row">
            <h2>Engagement by Category</h2>
            <span className="admin-chart-actions" aria-label="Engagement chart actions">
              <button type="button" className="admin-icon-only" aria-label="Refresh engagement chart" onClick={() => refresh()} disabled={loading}><DotsVerticalIcon /></button>
            </span>
          </div>
          <div className="admin-chart-row">
            <div className="admin-chart-yaxis admin-chart-yaxis-tall">
              {catTicks.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="admin-bar-chart-area">
              {data.engagementByCategory.map((b) => (
                <div key={b.label} className="admin-bar-col">
                  <div className="admin-bar-tall" style={{ height: `${(b.value / categoryMax) * 100}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="admin-chart-xaxis admin-chart-xaxis-indent">
            {data.engagementByCategory.map((b) => (
              <span key={b.label}>{b.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-insights-grid">
        <div className="admin-card">
          <h3 className="admin-plain-title">Most Viewed Pages</h3>
          <div className="admin-card-divider" />
          <ul className="admin-list-simple">
            {data.mostViewedPages.map((p) => (
              <li key={p.path}>
                <span>{p.path}</span>
                <span className="admin-count-chip">{p.views}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card">
          <h3 className="admin-plain-title">Language Usage</h3>
          <div className="admin-card-divider" />
          <div className="admin-lang-usage">
            {data.languageUsage.map((l) => (
              <div key={l.label} className="admin-lang-usage-row">
                <div className="admin-lang-usage-head">
                  <span>{l.label}</span>
                  <span>{l.pct}%</span>
                </div>
                <div className="admin-progress-track">
                  <div className="admin-progress-fill" style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-plain-title">Device Breakdown</h3>
          <div className="admin-card-divider" />
          <ul className="admin-device-list">
            {data.deviceBreakdown.map((d) => {
              const Icon = deviceIcons[d.label] ?? DesktopIcon;
              return (
                <li key={d.label}>
                  <div className="admin-device-icon">
                    <Icon />
                  </div>
                  <div>
                    <div className="admin-device-label">{d.label}</div>
                    <div className="admin-device-pct">{d.pct}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
