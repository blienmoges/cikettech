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
import { API_BASE } from "../../../lib/api";

type AnalyticsData = {
  range: string;
  kpis: { label: string; value: string; delta: string; up: boolean }[];
  traffic: { months: string[]; points: number[] };
  engagementByCategory: { label: string; value: number }[];
  mostViewedPages: { path: string; views: string }[];
  languageUsage: { label: string; pct: number }[];
  deviceBreakdown: { label: string; pct: string }[];
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

  useEffect(() => {
    if (range === initialData.range) return;
    fetch(`${API_BASE}/api/admin/analytics?range=${encodeURIComponent(range)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

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
            <button
              type="button"
              className="admin-icon-only"
              aria-label="More options"
              onClick={() => alert("Download CSV / Refresh chart (demo)")}
            >
              <DotsVerticalIcon />
            </button>
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
            <button
              type="button"
              className="admin-icon-only"
              aria-label="More options"
              onClick={() => alert("Download CSV / Refresh chart (demo)")}
            >
              <DotsVerticalIcon />
            </button>
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
