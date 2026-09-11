const kpis = [
  { label: "Total Visitors", value: "124.5K", delta: "+12.5%", up: true },
  { label: "Page Views", value: "412.8K", delta: "+8.2%", up: true },
  { label: "Customer Inquiries", value: "1,842", delta: "-3.1%", up: false },
  { label: "Quote Requests", value: "456", delta: "+15.4%", up: true },
];

const traffic = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  points: [64, 79, 59, 92, 115, 104, 129],
};

const engagementByCategory = [
  { label: "Software", value: 850 },
  { label: "Hardware", value: 420 },
  { label: "Services", value: 600 },
  { label: "Consulting", value: 310 },
  { label: "Support", value: 530 },
];

const mostViewedPages = [
  { path: "/home", views: "45.2K" },
  { path: "/products/enterprise", views: "28.9K" },
  { path: "/about-us", views: "15.4K" },
  { path: "/contact", views: "12.1K" },
  { path: "/news/q3-update", views: "8.7K" },
];

const languageUsage = [
  { label: "English", pct: 78 },
  { label: "Amharic", pct: 22 },
];

const deviceBreakdown = [
  { label: "Desktop", pct: "65% of traffic" },
  { label: "Mobile", pct: "32% of traffic" },
  { label: "Tablet", pct: "3% of traffic" },
];

const { db } = require("../../db");

function records(collection) {
  return db.prepare(`SELECT data FROM "${collection}"`).all().map((row) => JSON.parse(row.data));
}

function sinceFor(range) {
  const days = range === "7D" ? 7 : range === "3M" ? 90 : 30;
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function getAnalytics(range = "30D") {
  const selectedRange = ["7D", "30D", "3M"].includes(range) ? range : "30D";
  const since = sinceFor(selectedRange);
  const events = records("analyticsEvents").filter((event) => Date.parse(event.createdAt) >= since);
  const inquiries = records("inquiries").filter((item) => Date.parse(item.createdAt || item.date) >= since);
  const pageviews = events.filter((event) => event.type === "pageview");
  const visitors = new Set(pageviews.map((event) => event.visitorId).filter(Boolean));
  const buckets = selectedRange === "7D" ? 7 : selectedRange === "3M" ? 12 : 10;
  const bucketSize = (Date.now() - since) / buckets;
  const trafficPoints = Array.from({ length: buckets }, (_, index) => {
    const start = since + index * bucketSize;
    return pageviews.filter((event) => {
      const time = Date.parse(event.createdAt);
      return time >= start && time < start + bucketSize;
    }).length;
  });
  const labels = trafficPoints.map((_, index) => `${index + 1}`);
  const performance = records("performanceMetrics").filter((item) => Date.parse(item.createdAt) >= since);
  const vitals = ["lcp", "cls", "inp"].map((metric) => {
    const values = performance.map((item) => item.metrics?.[metric]).filter(Number.isFinite);
    return { metric, samples: values.length, average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null };
  });
  const pageCounts = new Map();
  pageviews.forEach((event) => pageCounts.set(event.path, (pageCounts.get(event.path) || 0) + 1));
  const mostViewedPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([path, views]) => ({ path, views: String(views) }));
  const deviceCounts = new Map();
  pageviews.forEach((event) => deviceCounts.set(event.device || "Desktop", (deviceCounts.get(event.device || "Desktop") || 0) + 1));
  return {
    range: selectedRange,
    kpis: [
      { label: "Total Visitors", value: String(visitors.size), delta: "live", up: true },
      { label: "Page Views", value: String(pageviews.length), delta: "live", up: true },
      { label: "Customer Inquiries", value: String(inquiries.length), delta: "live", up: true },
      { label: "Quote Requests", value: String(inquiries.filter((item) => item.type === "Quote").length), delta: "live", up: true },
    ],
    traffic: { months: labels, points: trafficPoints },
    engagementByCategory: [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value]) => ({ label, value })),
    mostViewedPages,
    languageUsage: [
      { label: "English", pct: pageviews.length ? Math.round((pageviews.filter((e) => e.locale !== "am").length / pageviews.length) * 100) : 0 },
      { label: "Amharic", pct: pageviews.length ? Math.round((pageviews.filter((e) => e.locale === "am").length / pageviews.length) * 100) : 0 },
    ],
    deviceBreakdown: ["Desktop", "Mobile", "Tablet"].map((label) => ({ label, pct: `${pageviews.length ? Math.round(((deviceCounts.get(label) || 0) / pageviews.length) * 100) : 0}% of traffic` })),
    vitals,
  };
}

module.exports = { getAnalytics };
