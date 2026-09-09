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

// No real visitor-analytics pipeline is wired up yet (no page-view tracking
// exists anywhere in the app), so this stays illustrative until one is built.
const trafficBars = [38, 52, 70, 46, 82, 100];

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
      name: i.name,
      type: i.type,
      product: i.product,
      date: i.time ? `${i.date}, ${i.time}` : i.date,
      status: i.status,
    }));

  return { stats, trafficBars, recentUpdates, recentInquiries };
}

module.exports = { getDashboard };
