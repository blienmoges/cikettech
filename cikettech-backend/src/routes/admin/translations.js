const { createCrudRouter } = require("../../utils/crud");
const { db, ensureCollection } = require("../../db");

const seed = [
  { key: "home", context: "Navigation", en: "Home", am: "ቤት", status: "Published" },
  { key: "products", context: "Navigation", en: "Products", am: "ምርቶች", status: "Published" },
  { key: "technology", context: "Navigation", en: "Technology", am: "ቴክኖሎጂ", status: "Published" },
  { key: "innovation", context: "Navigation", en: "Innovation", am: "ፈጠራ", status: "Published" },
  { key: "impact", context: "Navigation", en: "Impact", am: "ተጽዕኖ", status: "Published" },
  { key: "about", context: "Navigation", en: "About", am: "ስለ እኛ", status: "Published" },
  { key: "contact", context: "Navigation", en: "Contact", am: "አግኙን", status: "Published" },
  { key: "requestQuote", context: "Common action", en: "Request Quote", am: "ዋጋ ጠይቅ", status: "Published" },
  { key: "aiAssistant", context: "Footer", en: "AI Assistant", am: "የ AI ረዳት", status: "Published" },
  { key: "platform", context: "Footer", en: "Platform", am: "መድረክ", status: "Published" },
  { key: "company", context: "Footer", en: "Company", am: "ኩባንያ", status: "Published" },
  { key: "legalSupport", context: "Footer", en: "Legal & Support", am: "ህጋዊ እና ድጋፍ", status: "Published" },
  { key: "privacyPolicy", context: "Footer", en: "Privacy Policy", am: "የግላዊነት ፖሊሲ", status: "Published" },
  { key: "termsOfService", context: "Footer", en: "Terms of Service", am: "የአገልግሎት ውል", status: "Published" },
  { key: "security", context: "Footer", en: "Security", am: "ደህንነት", status: "Published" },
  { key: "status", context: "Footer", en: "Status", am: "ሁኔታ", status: "Published" },
  { key: "allRightsReserved", context: "Footer", en: "All rights reserved.", am: "መብቱ በህግ የተጠበቀ ነው።", status: "Published" },
  { key: "precisionTagline", context: "Footer", en: "Precision Engineering & Technology.", am: "ትክክለኛ ምህንድስና እና ቴክኖሎጂ።", status: "Published" },
  { key: "contactUs", context: "Common action", en: "Contact Us", am: "ያግኙን", status: "Published" },
  { key: "idealApplicationsBenefits", context: "Product pages", en: "Ideal Applications & System Benefits", am: "ተስማሚ አጠቃቀሞች እና የስርዓት ጥቅሞች", status: "Published" },
  { key: "productGallery", context: "Product pages", en: "Product Gallery", am: "የምርት ማዕከለ-ስዕላት", status: "Published" },
  { key: "technicalSpecifications", context: "Product pages", en: "Technical Specifications", am: "ቴክኒካዊ ዝርዝሮች", status: "Published" },
  { key: "requestAQuote", context: "Common action", en: "Request a Quote", am: "ዋጋ ይጠይቁ", status: "Published" },
  { key: "technicalSpecs", context: "Product pages", en: "Technical Specs", am: "ቴክኒካዊ ዝርዝሮች", status: "Published" },
  { key: "news", context: "Footer", en: "News", am: "ዜና", status: "Published" },
  { key: "projects", context: "Footer", en: "Projects", am: "ፕሮጀክቶች", status: "Published" },
  { key: "awards", context: "Footer", en: "Awards", am: "ሽልማቶች", status: "Published" },
];

ensureCollection("translations");
const existingKeys = new Set(db.prepare("SELECT id FROM translations").all().map((row) => row.id));
const insertMissing = db.prepare("INSERT INTO translations (id, data) VALUES (?, ?)");
for (const item of seed) {
  if (!existingKeys.has(item.key)) insertMissing.run(item.key, JSON.stringify({ ...item }));
}

module.exports = createCrudRouter({ collection: "translations", seed, idKey: "key", deleteRoles: ["Administrator"] });