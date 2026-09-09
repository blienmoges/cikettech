const content = {
  en: {
    hero: {
      eyebrow: "Our Impact",
      heading: "Technology That Gives Back",
      body:
        "Beyond the products we build, CIKETTECH is invested in strengthening Ethiopia's technology ecosystem — from local manufacturing capacity to the engineers of tomorrow.",
    },
    sectionHeading: "Areas of Impact",
    areas: [
      {
        title: "Local Manufacturing",
        description:
          "CIKETTECH designs, assembles, and tests its products locally in Ethiopia — building domestic engineering capacity instead of relying on imported, one-size-fits-all electronics.",
        icon: "factory",
      },
      {
        title: "Education Support",
        description:
          "We partner with technical schools and universities to provide hands-on training, equipment donations, and internship placements for the next generation of Ethiopian engineers.",
        icon: "graduation",
      },
      {
        title: "Industrial Innovation",
        description:
          "Our access-control, attendance, and scheduling systems modernize institutions and industrial sites across the region, replacing manual processes with reliable, connected infrastructure.",
        icon: "gear",
      },
      {
        title: "Circular Electronics",
        description:
          "Products are engineered for long service life and repairability, with take-back and refurbishment programs that reduce electronic waste across our installed base.",
        icon: "recycle",
      },
    ],
    cta: {
      heading: "Want to Partner With Us?",
      body: "Whether you're an institution, a school, or a manufacturing partner, let's talk about how CIKETTECH can support your goals.",
      link: "Get in Touch",
    },
  },
  am: {
    hero: {
      eyebrow: "የእኛ ተጽዕኖ",
      heading: "ተመላሽ የምታደርግ ቴክኖሎጂ",
      body:
        "ከምንገነባቸው ምርቶች ባሻገር፣ ሲከትቴክ የኢትዮጵያን የቴክኖሎጂ ስነ-ምህዳር ለማጠናከር ኢንቨስት አድርጓል — ከአገር ውስጥ የማምረት አቅም እስከ ነገ ኢንጂነሮች ድረስ።",
    },
    sectionHeading: "የተጽዕኖ ዘርፎች",
    areas: [
      {
        title: "የአገር ውስጥ ማምረት",
        description:
          "ሲከትቴክ ምርቶቹን በኢትዮጵያ በአገር ውስጥ ይነድፋል፣ ይገጣጥማል እና ይሞክራል — ከውጭ በሚገቡ አንድ-መጠን-ለሁሉም ኤሌክትሮኒክስ ላይ ከመመስረት ይልቅ የአገር ውስጥ የምህንድስና አቅምን ይገነባል።",
        icon: "factory",
      },
      {
        title: "የትምህርት ድጋፍ",
        description:
          "ለሚቀጥለው ትውልድ የኢትዮጵያ ኢንጂነሮች ተግባራዊ ስልጠና፣ የመሳሪያ ልገሳ እና የልምምድ እድሎችን ለማቅረብ ከቴክኒክ ትምህርት ቤቶች እና ዩኒቨርሲቲዎች ጋር እንተባበራለን።",
        icon: "graduation",
      },
      {
        title: "የኢንዱስትሪ ፈጠራ",
        description:
          "የመዳረሻ ቁጥጥር፣ የክትትል እና የጊዜ ሰሌዳ ስርዓቶቻችን በክልሉ ውስጥ ተቋማትን እና የኢንዱስትሪ ቦታዎችን ያዘምናሉ፣ በእጅ የሚደረጉ ሂደቶችን በአስተማማኝ፣ በተገናኘ መሠረተ ልማት ይተካሉ።",
        icon: "gear",
      },
      {
        title: "ዑደታዊ ኤሌክትሮኒክስ",
        description:
          "ምርቶች ረጅም የአገልግሎት ዘመን እና ሊጠገኑ በሚችሉ መልኩ የተነደፉ ሲሆን፣ በተተከሉበት ቦታ ሁሉ የኤሌክትሮኒክስ ቆሻሻን የሚቀንሱ የመመለሻ እና የእድሳት ፕሮግራሞች አሏቸው።",
        icon: "recycle",
      },
    ],
    cta: {
      heading: "ከእኛ ጋር መተባበር ይፈልጋሉ?",
      body: "ተቋም፣ ትምህርት ቤት ወይም የማምረቻ አጋር ቢሆኑም፣ ሲከትቴክ ግቦችዎን እንዴት ሊደግፍ እንደሚችል እንነጋገር።",
      link: "ያግኙን",
    },
  },
};

function getImpactPage(lang) {
  return content[lang] || content.en;
}

module.exports = { getImpactPage };
