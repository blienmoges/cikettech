const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { seedAll } = require("./db/seed");
const { db, ensureCollection } = require("./db");
seedAll();
ensureCollection("performanceMetrics");
ensureCollection("analyticsEvents");

const homeRoutes = require("./routes/home");
const aboutRoutes = require("./routes/about");
const productRoutes = require("./routes/products");
const technologyRoutes = require("./routes/technology");
const innovationRoutes = require("./routes/innovation");
const impactRoutes = require("./routes/impact");
const socialLinksRoutes = require("./routes/socialLinks");
const contactRoutes = require("./routes/contact");
const assistantRoutes = require("./routes/assistant");
const translationRoutes = require("./routes/translations");
const quoteRoutes = require("./routes/quote");
const newsRoutes = require("./routes/news");
const projectsRoutes = require("./routes/projects");
const awardsRoutes = require("./routes/awards");

const adminAuthRoutes = require("./routes/admin/auth");
const adminDashboardRoutes = require("./routes/admin/dashboard");
const adminLanguagesRoutes = require("./routes/admin/languages");
const adminAnalyticsRoutes = require("./routes/admin/analytics");
const adminSettingsRoutes = require("./routes/admin/settings");
const adminProductRoutes = require("./routes/admin/products");
const adminNewsRoutes = require("./routes/admin/news");
const adminProjectRoutes = require("./routes/admin/projects");
const adminAwardRoutes = require("./routes/admin/awards");
const adminImageRoutes = require("./routes/admin/images");
const adminDownloadRoutes = require("./routes/admin/downloads");
const adminInquiryRoutes = require("./routes/admin/inquiries");
const adminKnowledgeBaseRoutes = require("./routes/admin/knowledgeBase");
const adminUploadRoutes = require("./routes/admin/uploads");
const adminUserRoutes = require("./routes/admin/users");
const { requireAuthForMutations, requireAuth, requireRole } = require("./middleware/auth");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// crossOriginResourcePolicy is relaxed to "cross-origin" because the Next.js
// frontend (a different origin/port) legitimately loads uploaded images and
// documents from this API's /uploads route — helmet's default "same-origin"
// would silently block that.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/admin") && req.path !== "/api/health") {
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }
  next();
});
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.json({ name: "CIKETTECH API", status: "ok", health: "/api/health" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/metrics", (req, res) => {
  const { metrics, path: pagePath } = req.body || {};
  if (!metrics || typeof metrics !== "object" || typeof pagePath !== "string" || pagePath.length > 200) {
    return res.status(400).json({ error: "Valid metrics and path are required." });
  }
  const safeMetrics = Object.fromEntries(
    ["lcp", "cls", "inp"].filter((key) => Number.isFinite(Number(metrics[key]))).map((key) => [key, Number(metrics[key])])
  );
  if (!Object.keys(safeMetrics).length) return res.status(400).json({ error: "At least one metric is required." });
  db.prepare("INSERT INTO performanceMetrics (id, data) VALUES (?, ?)").run(
    `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    JSON.stringify({ path: pagePath, metrics: safeMetrics, createdAt: new Date().toISOString() })
  );
  res.status(204).end();
});

app.post("/api/analytics/events", (req, res) => {
  const { type, path: pagePath, visitorId, locale, device } = req.body || {};
  if (type !== "pageview" || typeof pagePath !== "string" || pagePath.length > 200 || typeof visitorId !== "string") {
    return res.status(400).json({ error: "Invalid analytics event." });
  }
  db.prepare("INSERT INTO analyticsEvents (id, data) VALUES (?, ?)").run(
    `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    JSON.stringify({ type, path: pagePath, visitorId: visitorId.slice(0, 100), locale: locale === "am" ? "am" : "en", device: ["Desktop", "Mobile", "Tablet"].includes(device) ? device : "Desktop", createdAt: new Date().toISOString() })
  );
  res.status(204).end();
});

app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/products", productRoutes);
app.use("/api/technology", technologyRoutes);
app.use("/api/innovation", innovationRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/translations", translationRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/awards", awardsRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", requireAuth, adminDashboardRoutes);
app.use("/api/admin/languages", requireAuth, adminLanguagesRoutes);
app.use("/api/admin/translations", requireAuth, require("./routes/admin/translations"));
app.use("/api/admin/analytics", requireAuth, adminAnalyticsRoutes);
app.use("/api/admin/settings", requireAuth, adminSettingsRoutes);
app.use("/api/admin/products", requireAuth, adminProductRoutes);
app.use("/api/admin/news", requireAuth, adminNewsRoutes);
app.use("/api/admin/projects", requireAuth, adminProjectRoutes);
app.use("/api/admin/awards", requireAuth, adminAwardRoutes);
app.use("/api/admin/images", requireAuth, adminImageRoutes);
app.use("/api/admin/downloads", requireAuth, adminDownloadRoutes);
app.use("/api/admin/inquiries", requireAuth, adminInquiryRoutes);
app.use("/api/admin/knowledge-base", requireAuth, adminKnowledgeBaseRoutes);
app.use("/api/admin/uploads", requireAuth, adminUploadRoutes);
// Unlike other admin resources, user accounts (emails, roles) are sensitive —
// every method here requires a real Administrator session, not just mutations.
app.use("/api/admin/users", requireAuth, requireRole("Administrator"), adminUserRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

module.exports = app;
