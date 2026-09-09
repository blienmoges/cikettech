const path = require("path");
const express = require("express");
const cors = require("cors");

const { seedAll } = require("./db/seed");
seedAll();

const homeRoutes = require("./routes/home");
const aboutRoutes = require("./routes/about");
const productRoutes = require("./routes/products");
const technologyRoutes = require("./routes/technology");
const innovationRoutes = require("./routes/innovation");
const impactRoutes = require("./routes/impact");
const socialLinksRoutes = require("./routes/socialLinks");
const contactRoutes = require("./routes/contact");
const assistantRoutes = require("./routes/assistant");
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

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
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
app.use("/api/quote", quoteRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/awards", awardsRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/languages", adminLanguagesRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/settings", requireAuthForMutations, adminSettingsRoutes);
app.use("/api/admin/products", requireAuthForMutations, adminProductRoutes);
app.use("/api/admin/news", requireAuthForMutations, adminNewsRoutes);
app.use("/api/admin/projects", requireAuthForMutations, adminProjectRoutes);
app.use("/api/admin/awards", requireAuthForMutations, adminAwardRoutes);
app.use("/api/admin/images", requireAuthForMutations, adminImageRoutes);
app.use("/api/admin/downloads", requireAuthForMutations, adminDownloadRoutes);
app.use("/api/admin/inquiries", requireAuthForMutations, adminInquiryRoutes);
app.use("/api/admin/knowledge-base", requireAuthForMutations, adminKnowledgeBaseRoutes);
app.use("/api/admin/uploads", requireAuthForMutations, adminUploadRoutes);
// Unlike other admin resources, user accounts (emails, roles) are sensitive —
// every method here requires a real Administrator session, not just mutations.
app.use("/api/admin/users", requireAuth, requireRole("Administrator"), adminUserRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

module.exports = app;
