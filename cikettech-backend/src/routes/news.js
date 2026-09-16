const express = require("express");
const { db } = require("../db");

const router = express.Router();
let externalCache = { expiresAt: 0, items: [] };

function xmlValue(item, tag) {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
}

function decodeXml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

async function externalTechnologyNews() {
  if (process.env.EXTERNAL_NEWS_ENABLED === "false") return [];
  if (externalCache.expiresAt > Date.now()) return externalCache.items;

  const query = encodeURIComponent(process.env.EXTERNAL_NEWS_QUERY || "technology electronics artificial intelligence");
  const feedUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const response = await fetch(feedUrl, { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error(`RSS request failed with ${response.status}`);
    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 8).map((match, index) => {
      const item = match[1];
      return {
        id: `external-${index}-${Buffer.from(xmlValue(item, "link")).toString("base64url").slice(0, 12)}`,
        title: decodeXml(xmlValue(item, "title")),
        summary: decodeXml(xmlValue(item, "description")).replace(/<[^>]+>/g, "").slice(0, 240),
        date: new Date(xmlValue(item, "pubDate")).toISOString(),
        source: decodeXml(xmlValue(item, "source")) || "Google News",
        url: xmlValue(item, "link"),
        external: true,
      };
    }).filter((item) => item.title && item.url);
    externalCache = { expiresAt: Date.now() + 15 * 60 * 1000, items };
    return items;
  } catch (error) {
    console.error("External news fetch failed:", error.message);
    return externalCache.items;
  }
}

function published(category) {
  return db
    .prepare(`SELECT data FROM news ORDER BY seq DESC`)
    .all()
    .map((row) => JSON.parse(row.data))
    .filter((item) => item.status === "Published")
    .filter((item) => !category || String(item.category || "").toLowerCase() === category.toLowerCase())
    .sort((a, b) => {
      const first = Date.parse(a.date || "") || 0;
      const second = Date.parse(b.date || "") || 0;
      return second - first;
    });
}

router.get("/", async (req, res) => {
  const adminArticles = published(req.query.category);
  if (req.query.includeExternal !== "true") return res.json(adminArticles);
  const external = await externalTechnologyNews();
  res.json({ admin: adminArticles, external });
});

router.get("/:id", (req, res) => {
  const article = published().find((item) => String(item.id) === req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found." });
  res.json(article);
});

module.exports = router;
