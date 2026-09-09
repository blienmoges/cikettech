const products = [
  {
    slug: "parking-gate",
    name: "AI Smart Parking Gate System",
    shortName: "AI Smart Parking Gate",
    tagline: null,
    summary:
      "Advanced license plate recognition and automated barrier control for seamless vehicle access management. Designed for high-traffic corporate and institutional facilities.",
    description:
      "An intelligent, automated access control solution engineered for commercial and institutional facilities. Utilizing advanced ANPR and machine learning, this system ensures seamless entry, robust security, and comprehensive vehicle flow management.",
    heroImage:
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=85",
    listImage:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85",
    homeImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=80",
    theme: "blue",
    features: [
      {
        title: "High-Speed ANPR Recognition",
        description:
          "Edge-deployed AI models process license plates locally in under 200ms, ensuring near-zero latency during peak traffic.",
      },
      {
        title: "Cloud Dashboard",
        description: "Real-time analytics, capacity management, and access logs via secure cloud portal.",
      },
      {
        title: "Anti-Tailgating",
        description: "LiDAR and camera sensors detect unauthorized vehicles following authorized entries.",
      },
      {
        title: "Ruggedized Hardware",
        description: "IP65-rated housings designed to operate reliably in outdoor installations.",
      },
    ],
    applications: [
      { title: "Corporate Campuses", description: "Streamline employee access and manage visitor parking dynamically." },
      { title: "Commercial Retail", description: "Ticketless entry with payment integration for retail parking experiences." },
      { title: "Residential Complexes", description: "Secure, touchless entry for residents with guest pre-registration flows." },
    ],
    benefits: [
      { title: "Reduced Operational Costs", description: "Eliminate need for toll staff and physical ticketing equipment." },
      { title: "Enhanced Security", description: "Maintain a searchable database of vehicle entries with timestamped images." },
      { title: "Improved UX", description: "Frictionless entry for VIPs, employees, and tenants without manual checks." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
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
    tagline: "Precision Biometric Attendance System",
    summary:
      "Secure, rapid, and hygienic workforce tracking utilizing advanced facial recognition and fingerprint scanning technologies, fully integrated with central HR systems.",
    description:
      "Engineered for high-security environments. Our flagship biometric terminal combines military-grade optical sensors with a proprietary anti-spoofing algorithm, delivered in a minimalist, architectural chassis.",
    heroImage:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dermalog_Fingerprint_Scanner_ZF1.jpg?width=1200",
    listImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    homeImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80",
    theme: "blue",
    features: [
      {
        title: "Optical Silk ID Sensor",
        description:
          "Our proprietary sensor reads beneath the skin surface, ensuring rapid authentication even with dry, wet, or rough fingerprints. Features active liveness detection.",
        badge: "99.9% Accuracy",
      },
      {
        title: "< 0.5s Matching",
        description: "Powered by a dedicated NPU for localized, instantaneous template matching without network latency.",
      },
      {
        title: "Encrypted Sync",
        description: "End-to-end AES-256 encryption for all biometric data in transit and at rest. Zero-knowledge architecture.",
      },
      {
        title: "Enterprise Integration",
        description: "Seamlessly connects with major ERPs, HRMS, and Active Directory systems via RESTful API and webhooks.",
      },
    ],
    applications: [
      { title: "Corporate Offices", description: "Replace manual sign-in sheets with frictionless, tamper-proof clock-in/clock-out records." },
      { title: "Manufacturing & Warehousing", description: "Withstand dusty, high-traffic environments while tracking shift attendance across large workforces." },
      { title: "Healthcare & Education Facilities", description: "Verify identity for staff access and attendance where both hygiene and accuracy matter." },
    ],
    benefits: [
      { title: "99.9% Matching Accuracy", description: "Optical Silk ID sensing with active liveness detection virtually eliminates buddy-punching and spoofing." },
      { title: "Seamless HR Integration", description: "RESTful API and webhook support sync attendance data directly into existing payroll and HR systems." },
      { title: "Enterprise-Grade Data Security", description: "End-to-end AES-256 encryption and a zero-knowledge architecture protect biometric data at rest and in transit." },
    ],
    gallery: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dermalog_Fingerprint_Scanner_ZF1.jpg?width=1200",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Fingerprint_Scanner_Mercato.JPG?width=800",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Energy_Efficient_Processors.jpg?width=800",
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
      "Automated scheduling and multi-zone audio distribution for educational campuses. Ensure precise timing and clear communication across diverse facilities.",
    description:
      "A technically advanced, automated scheduling solution designed to replace obsolete mechanical bells with precision digital timing, custom audio zones, and centralized management. Built for modern educational facilities demanding reliability and minimal maintenance.",
    heroImage:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Public_address_speaker_in_Eschelbronn_07.JPG?width=1200",
    listImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
    homeImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=80",
    theme: "blue",
    features: [
      {
        title: "Microsecond Precision",
        description:
          "NTP-synchronized timing ensures absolute accuracy across all campus zones, eliminating drift typical in legacy systems.",
      },
      {
        title: "Multi-Zone Audio Routing",
        description:
          "Configure custom audio alerts, emergency broadcasts, and standard bell tones independently for classrooms, hallways, and outdoor areas via a centralized dashboard.",
      },
      {
        title: "Cloud-Native Management",
        description:
          "Manage schedules remotely through a secure, responsive web interface. Deploy firmware updates and monitor system health across multiple campuses from a single pane of glass.",
      },
      {
        title: "Fail-Safe Operation",
        description:
          "Local caching of schedules guarantees uninterrupted operation even during network outages. Battery backup maintains timing integrity.",
      },
    ],
    applications: [
      { title: "K-12 Campuses", description: "Automate class-change bells, assemblies, and emergency alerts across every building." },
      { title: "University & Multi-Building Campuses", description: "Coordinate independent bell schedules and zone-specific announcements from one dashboard." },
      { title: "Factory & Shift-Based Facilities", description: "Repurpose the same scheduling engine for shift-change signals and safety drills." },
    ],
    benefits: [
      { title: "Zero Timing Drift", description: "NTP synchronization keeps every zone perfectly aligned, eliminating the slow drift of mechanical bells." },
      { title: "Centralized Control", description: "Update schedules for an entire district from a single web dashboard instead of visiting each building." },
      { title: "Uninterrupted Operation", description: "Local schedule caching and battery backup keep bells ringing on time during a network or power outage." },
    ],
    gallery: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Public_address_speaker_in_Eschelbronn_07.JPG?width=1200",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Controller_board_(14837601847).jpg?width=800",
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
    tagline: "Precision Instrumentation",
    summary:
      "Industrial-grade digital counters for tracking safety records, project timelines, and operational metrics with high visibility.",
    description:
      "An industrial-grade timekeeping module designed for extreme environments. Ensuring precise chronological tracking with fail-safe memory and ultra-low power consumption.",
    heroImage:
      "https://commons.wikimedia.org/wiki/Special:FilePath/USB_seven_segment_display_module_(48158381686).jpg?width=1200",
    listImage:
      "https://commons.wikimedia.org/wiki/Special:FilePath/USB_seven_segment_display_module_(48158381686).jpg?width=1200",
    homeImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1100&q=80",
    theme: "cyan",
    features: [
      {
        title: "Non-Volatile Flash Memory",
        description:
          "Retains count data indefinitely without external power. Critical for systems requiring absolute chronological integrity across power cycles and unexpected outages.",
      },
      {
        title: "Ultra-Low Power Draw",
        description: "Operates on micro-amps, making it suitable for battery-backed or solar-powered remote installations.",
      },
      {
        title: "Universal I/O Protocol",
        description: "Standardized interfaces including RS-485 and Modbus for seamless integration with legacy and modern PLCs.",
      },
      {
        title: "Industrial Hardening",
        description:
          "Encased in an IP67-rated machined aluminum shell. Resistant to extreme temperatures, vibration, and electromagnetic interference.",
      },
    ],
    applications: [
      { title: "Workplace Safety Milestones", description: "Track days-since-last-incident across factories, warehouses, and job sites." },
      { title: "Project & Production Timelines", description: "Display elapsed days for construction phases, production runs, or maintenance cycles." },
      { title: "Regulatory & Compliance Records", description: "Maintain a tamper-evident chronological log for safety audits and inspections." },
    ],
    benefits: [
      { title: "Eliminates Manual Tracking", description: "Replaces error-prone whiteboards and paper logs with an automated, always-accurate display." },
      { title: "Set-and-Forget Reliability", description: "Non-volatile memory and ultra-low power draw mean the count survives outages without a battery swap schedule." },
      { title: "Fast, Low-Cost Deployment", description: "Simple RS-485/Modbus wiring integrates with existing PLCs and signage without custom engineering." },
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
