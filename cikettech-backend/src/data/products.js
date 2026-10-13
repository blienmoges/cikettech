const products = [
  {
    slug: "parking-gate",
    name: "AI Smart Parking Gate System",
    shortName: "AI Smart Parking Gate",
    tagline: "AI-assisted vehicle access control",
    summary:
      "Streamline vehicle entry with AI-assisted recognition and automated gate control. Keep access activity organized and make parking operations easier to oversee.",
    description:
      "The AI Smart Parking Gate System coordinates vehicle recognition, gate operation, and access records in one parking entry solution. Designed for business and institutional facilities, it helps teams manage authorized vehicle access and maintain a clearer view of parking activity.",
    heroImage: "/smart-parking.PNG",
    listImage: "/smart-parking.PNG",
    homeImage: "/smart-parking.PNG",
    theme: "blue",
    features: [
      {
        title: "AI-Assisted Vehicle Recognition",
        description:
          "Support a consistent vehicle entry workflow with AI-assisted recognition.",
      },
      {
        title: "Organized Access Records",
        description: "Keep vehicle access activity available for routine parking and facility oversight.",
      },
      {
        title: "Coordinated Gate Operation",
        description: "Connect vehicle recognition with gate control at your facility entrance.",
      },
      {
        title: "Adaptable to Your Site",
        description: "Plan parking access around your facility's entry points, traffic flow, and operating needs.",
      },
    ],
    applications: [
      { title: "Office and Business Sites", description: "Coordinate staff and visitor vehicle entry at offices and business facilities." },
      { title: "Campuses and Institutions", description: "Organize vehicle access at campuses and other institutional locations." },
      { title: "Managed Parking Areas", description: "Bring gate operation and parking access oversight into one site workflow." },
    ],
    benefits: [
      { title: "Consistent Entry Process", description: "Coordinate vehicle recognition and gate operation at managed entrances." },
      { title: "Improved Parking Visibility", description: "Make access activity easier for facility teams to review." },
      { title: "Less Manual Coordination", description: "Support a more orderly arrival process for staff and visitors." },
    ],
    gallery: [
      "/smart-parking.PNG",
      "/smart-parking.PNG",
      "/smart-parking.PNG",
      "/smart-parking.PNG",
    ],
    specs: [
      { label: "Power Supply", value: "12–24V DC" },
      { label: "Memory Type", value: "EEPROM" },
      { label: "Power Consumption", value: "< 50W" },
      { label: "Display", value: "LED / Indicator" },
      { label: "Operating Temp", value: "-20°C to +60°C" },
      { label: "Interface", value: "Ethernet / RS-485" },
    ],
  },
  {
    slug: "biometric-attendance",
    name: "Biometric Attendance System",
    shortName: "Biometric Attendance",
    tagline: "Attendance for Workplaces and Institutions",
    summary:
      "Record attendance using biometric identification and organize workforce timekeeping. Suitable for organizations looking to move beyond manual attendance registers.",
    description:
      "The Biometric Attendance System helps organizations record staff attendance and manage timekeeping with biometric identification. It is designed for workplaces and institutions that want a more consistent alternative to paper-based attendance records.",
    heroImage: "/biometric.jpg",
    listImage: "/biometric.jpg",
    homeImage: "/biometric.jpg",
    theme: "blue",
    features: [
      {
        title: "Biometric Identification",
        description:
          "Use biometric identification to support staff attendance recording.",
      },
      {
        title: "Attendance Records",
        description: "Capture staff check-in and check-out activity for day-to-day timekeeping.",
      },
      {
        title: "Centralized Attendance Management",
        description: "Organize recorded attendance information for review and administrative follow-up.",
      },
      {
        title: "For Organizational Workflows",
        description: "Consider how attendance records can fit the existing processes of your workplace or institution.",
      },
    ],
    applications: [
      { title: "Offices", description: "Keep staff attendance records in an office environment." },
      { title: "Workplaces with Shift Schedules", description: "Support attendance tracking for teams working scheduled shifts." },
      { title: "Education and Other Institutions", description: "Organize staff attendance at schools and institutional facilities." },
    ],
    benefits: [
      { title: "Less Manual Record-Keeping", description: "Use a digital attendance process in place of paper registers." },
      { title: "Consistent Timekeeping", description: "Keep attendance activity organized for routine workplace administration." },
      { title: "Useful Attendance Visibility", description: "Make recorded attendance easier for authorized staff to review." },
    ],
    gallery: [
      "/biometric.jpg",
      "/biometric.jpg",
      "/biometric.jpg",
      "/biometric.jpg",
    ],
    specs: [
      { label: "Sensor Type", value: "Optical Silk ID" },
      { label: "Matching Speed", value: "< 0.5s per scan" },
      { label: "Template Capacity", value: "Up to 50,000 users" },
      { label: "Connectivity", value: "Ethernet / Wi-Fi / RS-485" },
      { label: "Encryption", value: "AES-256, end-to-end" },
      { label: "Operating Temp", value: "-10°C to +50°C" },
    ],
  },
  {
    slug: "school-bell",
    name: "Smart School Bell System",
    shortName: "Smart School Bell",
    tagline: "Smart Infrastructure",
    summary:
      "Schedule school bells and coordinate timed audio across learning spaces. Designed to help schools manage daily routines and communicate schedule changes.",
    description:
      "The Smart School Bell System helps schools manage bell schedules and timed announcements. It supports structured daily routines across educational facilities, with scheduling and audio distribution arranged around each school's needs.",
    heroImage: "/bell system.jpg",
    listImage: "/bell system.jpg",
    homeImage: "/bell system.jpg",
    theme: "blue",
    features: [
      {
        title: "Scheduled Bell Times",
        description:
          "Set bell times to support the daily timetable and recurring school routines.",
      },
      {
        title: "Audio by Area",
        description:
          "Plan bell and audio coverage for the areas included in your school's installation.",
      },
      {
        title: "Schedule Management",
        description:
          "Organize school bell schedules in a way that fits your timetable and operating routines.",
      },
      {
        title: "Designed for School Routines",
        description:
          "Use timed bell signals to help staff and students follow class changes and other scheduled activities.",
      },
    ],
    applications: [
      { title: "Schools", description: "Schedule bell signals around lessons, breaks, and the school day." },
      { title: "Multi-Building Campuses", description: "Plan timed bell coverage across the buildings included in the campus setup." },
      { title: "Education Facilities", description: "Support regular routines and scheduled announcements in learning environments." },
    ],
    benefits: [
      { title: "A More Predictable School Day", description: "Scheduled bell signals help mark class transitions and planned activities." },
      { title: "Simpler Schedule Changes", description: "Update bell times to reflect changes to the school timetable." },
      { title: "Clearer Daily Communication", description: "Use consistent audio signals to communicate routine schedule transitions." },
    ],
    gallery: [
      "/bell system.jpg",
      "/bell system.jpg",
      "/bell system.jpg",
      "/bell system.jpg",
    ],
    specs: [
      { label: "Power Supply", value: "100–240V AC / 12V DC backup" },
      { label: "Audio Output", value: "Up to 30W per zone" },
      { label: "Zones Supported", value: "Up to 64 independent zones" },
      { label: "Time Sync", value: "NTP / GPS (optional)" },
      { label: "Connectivity", value: "Ethernet / Wi-Fi" },
      { label: "Operating Temp", value: "-10°C to +50°C" },
    ],
  },
  {
    slug: "day-counter",
    name: "Smart Day Counter",
    shortName: "Smart Day Counter",
    tagline: "Day Counting for Workplaces and Projects",
    summary:
      "Display day counts for workplace safety milestones, project timelines, or other operational records that teams need to see at a glance.",
    description:
      "The Smart Day Counter provides a visible way to track elapsed days for a selected milestone or timeline. It can support workplace safety communication, project updates, and other settings where a shared day count is useful.",
    heroImage:
      "https://commons.wikimedia.org/wiki/Special:FilePath/USB_seven_segment_display_module_(48158381686).jpg?width=1200",
    listImage:
      "https://commons.wikimedia.org/wiki/Special:FilePath/USB_seven_segment_display_module_(48158381686).jpg?width=1200",
    homeImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1100&q=80",
    theme: "cyan",
    features: [
      {
        title: "Visible Day Count",
        description:
          "Show the current day count where staff and visitors can easily see it.",
      },
      {
        title: "Track a Selected Milestone",
        description: "Use a day count to communicate progress from a chosen start date or event.",
      },
      {
        title: "Useful Across Workflows",
        description: "Apply day counting to safety milestones, project timelines, or operational schedules.",
      },
      {
        title: "Easy-to-Understand Communication",
        description:
          "Make elapsed time easier to communicate with a dedicated digital counter.",
      },
    ],
    applications: [
      { title: "Workplace Safety", description: "Display the number of days since a selected safety milestone." },
      { title: "Projects", description: "Show elapsed days for a project phase, target, or other timeline." },
      { title: "Operational Areas", description: "Make a shared day count visible to teams across a facility." },
    ],
    benefits: [
      { title: "Clear Shared Updates", description: "Give teams and visitors a visible reference for a selected day count." },
      { title: "Less Manual Updating", description: "Use a dedicated counter instead of relying only on handwritten day totals." },
      { title: "Adaptable Uses", description: "Configure the counter around the milestone or timeline your organization wants to communicate." },
    ],
    gallery: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Digital_tally_counter.jpg?width=1200",
      "https://commons.wikimedia.org/wiki/Special:FilePath/USB_seven_segment_display_module_(48158381686).jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Controller_board_(14837601847).jpg?width=800",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=800&q=80",
    ],
    specs: [
      { label: "Power Supply", value: "12–24V DC" },
      { label: "Memory Type", value: "EEPROM" },
      { label: "Power Consumption", value: "< 50mW" },
      { label: "Display", value: "High-contrast OLED" },
      { label: "Operating Temp", value: "-40°C to +85°C" },
      { label: "Interface", value: "RS-485 / Modbus RTU" },
    ],
  },
];

function listProducts() {
  return products.map(({ slug, name, summary, listImage }) => ({ slug, name, summary, image: listImage }));
}

function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

const { productsAm, specLabelsAm } = require("./products.am");

function mergeArrayByIndex(en, am) {
  if (!am) return en;
  return en.map((item, i) => (am[i] ? { ...item, ...am[i] } : item));
}

function localizeProduct(product, lang) {
  if (lang !== "am") return product;
  const am = productsAm[product.slug];
  if (!am) return product;
  return {
    ...product,
    ...am,
    features: mergeArrayByIndex(product.features, am.features),
    applications: mergeArrayByIndex(product.applications, am.applications),
    benefits: mergeArrayByIndex(product.benefits, am.benefits),
    specs: product.specs.map((spec) => ({ ...spec, label: specLabelsAm[spec.label] || spec.label })),
  };
}

function getLocalizedProducts(lang) {
  return products.map((p) => localizeProduct(p, lang));
}

function listLocalizedProducts(lang) {
  return getLocalizedProducts(lang).map(({ slug, name, summary, listImage }) => ({
    slug,
    name,
    summary,
    image: listImage,
  }));
}

function getLocalizedProductBySlug(slug, lang) {
  const product = getProductBySlug(slug);
  return product ? localizeProduct(product, lang) : null;
}

module.exports = {
  products,
  listProducts,
  getProductBySlug,
  getLocalizedProducts,
  getLocalizedProductBySlug,
  listLocalizedProducts,
};
