const { getLocalizedProducts } = require("./products");

const content = {
  en: {
    hero: {
      heading: "Intelligent Technology Designed and Manufactured in Ethiopia",
      subheading:
        "We engineer precision smart solutions for modern infrastructure, advancing local technology to global standards.",
      image: "computer processor hardware",
      viewProducts: "View Products",
    },
    featured: {
      heading: "Featured Products",
      subheading: "Smart solutions engineered for efficiency and security.",
      viewDetails: "View Details",
    },
    why: { heading: "Why Choose CIKETTECH" },
    cta: {
      heading: "Looking for a Smart Electronic Solution?",
      body: "Contact us today to discuss how our intelligent systems can optimize your infrastructure and operations.",
      requestQuote: "Request a Quote",
      contactSales: "Contact Sales",
    },
    about: {
      eyebrow: "About Us",
      heading: "Pioneering Local Innovation",
      body:
        "CIKETTECH is a forward-thinking technology company based in Ethiopia, dedicated to designing, developing, and manufacturing intelligent electronic systems. We bridge the gap between complex engineering and practical everyday solutions, ensuring quality, reliability, and precision in every product we create.",
    },
    reasons: [
      {
        key: "precision",
        title: "Precision Engineering",
        description: "Designed with rigorous standards to ensure flawless operation in demanding environments.",
      },
      {
        key: "reliability",
        title: "Reliability",
        description: "Built with high-quality components to deliver consistent performance day after day.",
      },
      {
        key: "global",
        title: "Local Expertise, Global Standards",
        description: "Proudly manufactured in Ethiopia while adhering to international technological benchmarks.",
      },
    ],
  },
  am: {
    hero: {
      heading: "በኢትዮጵያ የተነደፈ እና የተመረተ ብልህ ቴክኖሎጂ",
      subheading:
        "ለዘመናዊ መሠረተ ልማት ትክክለኛ ብልህ መፍትሄዎችን እንነድፋለን፣ የአገር ውስጥ ቴክኖሎጂን ወደ ዓለም አቀፍ ደረጃ በማሳደግ።",
      image: "computer processor hardware",
      viewProducts: "ምርቶችን ይመልከቱ",
    },
    featured: {
      heading: "ተለይተው የቀረቡ ምርቶች",
      subheading: "ለቅልጥፍና እና ደህንነት የተነደፉ ብልህ መፍትሄዎች።",
      viewDetails: "ዝርዝር ይመልከቱ",
    },
    why: { heading: "ለምን ሲከትቴክን ይምረጡ" },
    cta: {
      heading: "ብልህ የኤሌክትሮኒክስ መፍትሄ እየፈለጉ ነው?",
      body: "ብልህ ስርዓቶቻችን መሠረተ ልማትዎን እና ስራዎችዎን እንዴት ማሻሻል እንደሚችሉ ለመወያየት ዛሬ ያግኙን።",
      requestQuote: "ዋጋ ጠይቅ",
      contactSales: "የሽያጭ ክፍልን ያግኙ",
    },
    about: {
      eyebrow: "ስለ እኛ",
      heading: "የአገር ውስጥ ፈጠራን በመምራት ላይ",
      body:
        "ሲከትቴክ በኢትዮጵያ የሚገኝ የወደፊት አስተሳሰብ ያለው የቴክኖሎጂ ኩባንያ ሲሆን፣ ብልህ የኤሌክትሮኒክስ ስርዓቶችን በመንደፍ፣ በማልማት እና በማምረት ላይ ያተኮረ ነው። ውስብስብ ምህንድስናን ከዕለታዊ ተግባራዊ መፍትሄዎች ጋር በማገናኘት፣ በምንፈጥረው እያንዳንዱ ምርት ላይ ጥራትን፣ አስተማማኝነትን እና ትክክለኛነትን እናረጋግጣለን።",
    },
    reasons: [
      {
        key: "precision",
        title: "ትክክለኛ ምህንድስና",
        description: "በአስቸጋሪ አካባቢዎች ውስጥ ያለ ስህተት አሠራርን ለማረጋገጥ በጥብቅ ደረጃዎች የተነደፈ።",
      },
      {
        key: "reliability",
        title: "አስተማማኝነት",
        description: "ቀን በቀን ወጥ የሆነ አፈጻጸምን ለማቅረብ በከፍተኛ ጥራት ክፍሎች የተገነባ።",
      },
      {
        key: "global",
        title: "የአገር ውስጥ ብቃት፣ ዓለም አቀፍ ደረጃዎች",
        description: "ከዓለም አቀፍ የቴክኖሎጂ መመዘኛዎች ጋር በመጣጣም በኢትዮጵያ በኩራት የሚመረት።",
      },
    ],
  },
};

function getHomePage(lang) {
  const localized = content[lang] || content.en;
  return {
    ...localized,
    featuredProducts: getLocalizedProducts(lang).map(({ slug, shortName, summary, homeImage }) => ({
      slug,
      title: shortName,
      description: summary,
      image: homeImage,
      href: `/products/${slug}`,
    })),
  };
}

module.exports = { getHomePage };
