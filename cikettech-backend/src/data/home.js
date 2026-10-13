const { getLocalizedProducts } = require("./products");

const content = {
  en: {
    hero: {
      heading: "Smart Electronic Products, Designed and Made in Ethiopia",
      subheading:
        "CIKETTECH designs and manufactures practical technology for safer access, better attendance, and smarter operations—from parking systems to solutions for schools and workplaces.",
      image: "electronic circuit board",
      viewProducts: "View Products",
    },
    featured: {
      heading: "Technology for Everyday Operations",
      subheading:
        "Explore smart products for parking, workforce attendance, schools, and daily operations.",
      viewDetails: "View Details",
    },
    why: { heading: "Built on Local Expertise" },
    cta: {
      heading: "Have a Technology Need to Solve?",
      body: "Tell us about your facility, school, or project. We can help you find the right product or discuss an electronic solution for your needs.",
      requestQuote: "Request a Quote",
      contactSales: "Contact Sales",
    },
    about: {
      eyebrow: "Designed and Made in Ethiopia",
      heading: "Local engineering for practical challenges.",
      body:
        "CIKETTECH is an Ethiopian technology company that designs and manufactures smart electronic products. Our work brings together embedded systems, artificial intelligence, computer vision, and electronics development to address real needs in schools, workplaces, and facilities.",
    },
    reasons: [
      {
        key: "precision",
        title: "Practical Product Engineering",
        description:
          "We turn real operational needs into focused electronic products, drawing on embedded systems and product development.",
      },
      {
        key: "reliability",
        title: "Technology That Connects",
        description:
          "Our capabilities span electronics, artificial intelligence, computer vision, and IoT connectivity.",
      },
      {
        key: "global",
        title: "Made in Ethiopia",
        description:
          "We design and manufacture smart electronic products locally, contributing to Ethiopia's growing technology and manufacturing sector.",
      },
    ],
  },
  am: {
    hero: {
      heading: "በኢትዮጵያ የተነደፉና የተመረቱ ብልህ የኤሌክትሮኒክስ ምርቶች",
      subheading:
        "CIKETTECH የተሻለ የመግቢያ ቁጥጥር፣ የሰራተኞች መገኘት ክትትል እና ውጤታማ አሰራርን የሚደግፉ ተግባራዊ ቴክኖሎጂዎችን ይነድፋል፤ ከፓርኪንግ ስርዓቶች እስከ ለትምህርት ቤቶችና ለስራ ቦታዎች የሚሆኑ መፍትሄዎች።",
      image: "electronic circuit board",
      viewProducts: "ምርቶችን ይመልከቱ",
    },
    featured: {
      heading: "ለዕለታዊ አሰራር የሚሆኑ ቴክኖሎጂዎች",
      subheading:
        "ለፓርኪንግ፣ ለሰራተኞች መገኘት ክትትል፣ ለትምህርት ቤቶች እና ለዕለታዊ አሰራር የተዘጋጁ ብልህ ምርቶችን ይመልከቱ።",
      viewDetails: "ዝርዝር ይመልከቱ",
    },
    why: { heading: "በአገር ውስጥ ብቃት የተገነባ" },
    cta: {
      heading: "ሊፈቱት የሚፈልጉት የቴክኖሎጂ ፍላጎት አለ?",
      body: "ስለ ተቋምዎ፣ ትምህርት ቤትዎ ወይም ፕሮጀክትዎ ይንገሩን። ተስማሚ ምርት እንዲያገኙ ወይም ለፍላጎትዎ የኤሌክትሮኒክስ መፍትሄ እንዲያቅዱ እንረዳዎታለን።",
      requestQuote: "ዋጋ ጠይቅ",
      contactSales: "የሽያጭ ክፍልን ያግኙ",
    },
    about: {
      eyebrow: "በኢትዮጵያ የተነደፉና የተመረቱ",
      heading: "ለተግባራዊ ፍላጎቶች የአገር ውስጥ ምህንድስና።",
      body:
        "CIKETTECH ብልህ የኤሌክትሮኒክስ ምርቶችን የሚነድፍና የሚያመርት የኢትዮጵያ የቴክኖሎጂ ኩባንያ ነው። ስራችን የተካተቱ ስርዓቶችን፣ ሰው ሰራሽ አስተውሎትን፣ የኮምፒውተር እይታን እና የኤሌክትሮኒክስ ምርት ልማትን በማጣመር በትምህርት ቤቶች፣ በስራ ቦታዎች እና በተቋማት ያሉ ተግባራዊ ፍላጎቶችን ይመልሳል።",
    },
    reasons: [
      {
        key: "precision",
        title: "ተግባራዊ የምርት ምህንድስና",
        description:
          "የተካተቱ ስርዓቶችንና የምርት ልማትን በመጠቀም ተግባራዊ ፍላጎቶችን ወደ ተስማሚ የኤሌክትሮኒክስ ምርቶች እንቀይራለን።",
      },
      {
        key: "reliability",
        title: "የተገናኙ ቴክኖሎጂዎች",
        description:
          "ብቃታችን ኤሌክትሮኒክስን፣ ሰው ሰራሽ አስተውሎትን፣ የኮምፒውተር እይታን እና የአይኦቲ ግንኙነትን ያካትታል።",
      },
      {
        key: "global",
        title: "በኢትዮጵያ የተመረተ",
        description:
          "በኢትዮጵያ ውስጥ ብልህ የኤሌክትሮኒክስ ምርቶችን በመንደፍና በማምረት ለአገሪቱ የቴክኖሎጂና የማምረቻ ዘርፍ እድገት እናበረክታለን።",
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
