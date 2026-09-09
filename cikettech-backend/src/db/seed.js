const { seedIfEmpty } = require("./index");

const products = require("../data/admin/products");
const news = require("../data/admin/news");
const projects = require("../data/admin/projects");
const awards = require("../data/admin/awards");
const downloads = require("../data/admin/downloads");
const inquiries = require("../data/admin/inquiries");
const knowledgeBase = require("../data/admin/knowledgeBase");
const images = require("../data/admin/images");

function seedAll() {
  seedIfEmpty("products", products);
  seedIfEmpty("news", news);
  seedIfEmpty("projects", projects);
  seedIfEmpty("awards", awards);
  seedIfEmpty("downloads", downloads);
  seedIfEmpty("inquiries", inquiries);
  seedIfEmpty("knowledgeBase", knowledgeBase);
  seedIfEmpty("images", images);
}

module.exports = { seedAll };
