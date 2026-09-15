const { db } = require("../../db");

function readCollection(name) {
  return db
    .prepare(`SELECT data FROM "${name}" ORDER BY seq ASC`)
    .all()
    .map((row) => JSON.parse(row.data));
}

function countOf(name) {
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM "${name}"`).get();
  return n;
}

function getDashboard() {
  const stats = [
    { label: "Products", value: String(countOf("products")), href: "/admin/products" },
    { label: "News", value: String(countOf("news")), href: "/admin/news" },
    { label: "Projects", value: String(countOf("projects")), href: "/admin/projects" },
    { label: "Awards", value: String(countOf("awards")), href: "/admin/awards" },
    { label: "Images", value: String(countOf("images")), href: "/admin/images" },
    { label: "Downloads", value: String(countOf("downloads")), href: "/admin/downloads" },
  ];

  const recentUpdates = [
    ...readCollection("products").map((p) => ({
      title: p.name,
      meta: `Product ${p.status === "Published" ? "Published" : "Updated"} • ${p.updated || ""}`,
      sortKey: p.updated,
    })),
    ...readCollection("news").map((a) => ({
      title: a.title,
      meta: `News Article ${a.status === "Published" ? "Published" : "Updated"} • ${a.date || ""}`,
      sortKey: a.date,
    })),
    ...readCollection("projects").map((p) => ({
      title: p.title,
      meta: `Project Status changed to '${p.status}' • ${p.updated || ""}`,
      sortKey: p.updated,
    })),
    ...readCollection("awards").map((a) => ({
      title: a.name,
      meta: `Award ${a.status === "Published" ? "Published" : "Updated"} • ${a.date || ""}`,
      sortKey: a.date,
    })),
  ]
    .filter((u) => u.sortKey && !Number.isNaN(new Date(u.sortKey).getTime()))
    .sort((a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime())
    .slice(0, 3)
    .map(({ title, meta }) => ({ title, meta }));

  const recentInquiries = readCollection("inquiries")
    .slice(-4)
    .reverse()
    .map((i) => ({
      id: i.id,
      name: i.name,
      type: i.type,
      product: i.product,
      date: i.time ? `${i.date}, ${i.time}` : i.date,
      status: i.status,
    }));

  const events = readCollection("analyticsEvents").filter((event) => event.type === "pageview");
  const trafficCounts = Array.from({ length: 7 }, (_, index) => {
    const start = Date.now() - (7 - index) * 24 * 60 * 60 * 1000;
    const end = start + 24 * 60 * 60 * 1000;
    return events.filter((event) => {
      const time = Date.parse(event.createdAt);
      return time >= start && time < end;
    }).length;
  });
  const maxTraffic = Math.max(...trafficCounts, 1);
  const trafficBars = trafficCounts.map((count) => Math.max(count ? 12 : 4, Math.round((count / maxTraffic) * 100)));

  const recentMedia = readCollection("images")
    .filter((image) => image.src)
    .slice(-4)
    .reverse()
    .map((image) => ({ id: image.id, name: image.name, date: image.date, src: image.src }));
  const latestDownloads = readCollection("downloads")
    .filter((document) => document.status === "Published")
    .slice(-4)
    .reverse()
    .map((document) => ({ id: document.id, title: document.title, type: document.type, language: document.language, date: document.date }));
  const inquiryCount = countOf("inquiries");

  return {
    stats,
    trafficBars,
    trafficTotal: events.length,
    recentUpdates,
    recentInquiries,
    recentMedia,
    latestDownloads,
    inquiryCount,
  };
}

module.exports = { getDashboard };
