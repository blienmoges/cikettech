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

function getAnalytics(range) {
  // `range` (7D/30D/3M/Custom) would select a different dataset with a real analytics
  // provider. All ranges return the same demo dataset for now.
  return { range: range || "30D", kpis, traffic, engagementByCategory, mostViewedPages, languageUsage, deviceBreakdown };
}

module.exports = { getAnalytics };
