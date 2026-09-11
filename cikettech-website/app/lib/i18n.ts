import type { Locale } from "./locale";

/**
 * Static UI strings that don't come from the backend (nav labels, footer
 * headings, common buttons). Page content itself is localized server-side —
 * see apiGet() in app/lib/api.ts.
 *
 * Amharic text below is machine-translated. Swap in professional
 * translations here (or per-page, where noted) whenever they're available —
 * no other code changes needed.
 */
const dictionary = {
  home: { en: "Home", am: "ቤት" },
  products: { en: "Products", am: "ምርቶች" },
  technology: { en: "Technology", am: "ቴክኖሎጂ" },
  innovation: { en: "Innovation", am: "ፈጠራ" },
  impact: { en: "Impact", am: "ተጽዕኖ" },
  about: { en: "About", am: "ስለ እኛ" },
  contact: { en: "Contact", am: "አግኙን" },
  news: { en: "News", am: "ዜና" },
  projects: { en: "Projects", am: "ፕሮጀክቶች" },
  awards: { en: "Awards", am: "ሽልማቶች" },
  aiAssistant: { en: "AI Assistant", am: "የ AI ረዳት" },
  requestQuote: { en: "Request Quote", am: "ዋጋ ጠይቅ" },
  platform: { en: "Platform", am: "መድረክ" },
  company: { en: "Company", am: "ኩባንያ" },
  legalSupport: { en: "Legal & Support", am: "ህጋዊ እና ድጋፍ" },
  privacyPolicy: { en: "Privacy Policy", am: "የግላዊነት ፖሊሲ" },
  termsOfService: { en: "Terms of Service", am: "የአገልግሎት ውል" },
  security: { en: "Security", am: "ደህንነት" },
  status: { en: "Status", am: "ሁኔታ" },
  allRightsReserved: { en: "All rights reserved.", am: "መብቱ በህግ የተጠበቀ ነው።" },
  precisionTagline: { en: "Precision Engineering & Technology.", am: "ትክክለኛ ምህንድስና እና ቴክኖሎጂ።" },
  viewDetails: { en: "View Details", am: "ዝርዝር ይመልከቱ" },
  readArticle: { en: "Read Article", am: "ጽሁፉን ያንብቡ" },
  viewProject: { en: "View Project", am: "ፕሮጀክቱን ይመልከቱ" },
  viewAward: { en: "View Award", am: "ሽልማቱን ይመልከቱ" },
  viewAllAwards: { en: "View All Awards", am: "ሁሉንም ሽልማቶች ይመልከቱ" },
  contactUs: { en: "Contact Us", am: "ያግኙን" },
  idealApplicationsBenefits: { en: "Ideal Applications & System Benefits", am: "ተስማሚ አጠቃቀሞች እና የስርዓት ጥቅሞች" },
  productGallery: { en: "Product Gallery", am: "የምርት ማዕከለ-ስዕላት" },
  technicalSpecifications: { en: "Technical Specifications", am: "ቴክኒካዊ ዝርዝሮች" },
  requestAQuote: { en: "Request a Quote", am: "ዋጋ ይጠይቁ" },
  technicalSpecs: { en: "Technical Specs", am: "ቴክኒካዊ ዝርዝሮች" },
} as const;

type Key = keyof typeof dictionary;
export type TranslationOverrides = Partial<Record<Key, { en: string; am: string }>>;

export function t(locale: Locale, key: Key, overrides?: TranslationOverrides): string {
  return overrides?.[key]?.[locale] ?? dictionary[key][locale] ?? dictionary[key].en;
}

export function toTranslationOverrides(rows: { key: string; en: string; am: string }[]): TranslationOverrides {
  return Object.fromEntries(
    rows.filter((row) => row.key in dictionary).map((row) => [row.key, { en: row.en, am: row.am }])
  ) as TranslationOverrides;
}
