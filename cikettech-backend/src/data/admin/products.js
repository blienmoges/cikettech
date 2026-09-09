const products = [
  {
    id: "1",
    code: "PRD-001",
    name: "AI Smart Parking",
    image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=200&q=70",
    english: "Complete",
    amharic: "Complete",
    status: "Published",
    updated: "Oct 24, 2023",
    snippet: "Automated vehicle access control using ANPR and AI for seamless entry management.",
    description:
      "An intelligent, automated access control solution engineered for commercial and institutional facilities, using advanced ANPR and machine learning for seamless entry and robust security.",
    features: ["High-Speed ANPR Recognition", "Cloud Dashboard", "Anti-Tailgating", "Ruggedized Hardware"],
    benefits: ["Reduced Operational Costs", "Enhanced Security", "Improved UX"],
  },
  {
    id: "2",
    code: "PRD-002",
    name: "Biometric Attendance",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dermalog_Fingerprint_Scanner_ZF1.jpg?width=200",
    english: "Complete",
    amharic: "Draft",
    status: "Draft",
    updated: "Oct 22, 2023",
    snippet: "Secure, rapid workforce tracking via facial recognition and fingerprint scanning.",
    description:
      "Engineered for high-security environments. Combines military-grade optical sensors with a proprietary anti-spoofing algorithm in a minimalist chassis.",
    features: ["Optical Silk ID Sensor", "< 0.5s Matching", "Encrypted Sync", "Enterprise Integration"],
    benefits: ["99.9% Accuracy", "Zero-knowledge architecture"],
  },
  {
    id: "3",
    code: "PRD-003",
    name: "Smart School Bell",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Public_address_speaker_in_Eschelbronn_07.JPG?width=200",
    english: "Complete",
    amharic: "Complete",
    status: "Published",
    updated: "Oct 15, 2023",
    snippet: "Automated scheduling and multi-zone audio distribution for campuses.",
    description:
      "A technically advanced, automated scheduling solution built on precision digital timing, custom audio zones, and centralized management.",
    features: ["Microsecond Precision", "Multi-Zone Audio Routing", "Cloud-Native Management", "Fail-Safe Operation"],
    benefits: ["Eliminates drift versus mechanical bells", "Remote schedule management"],
  },
  {
    id: "4",
    code: "PRD-004",
    name: "Smart Day Counter",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/USB_seven_segment_display_module_(48158381686).jpg?width=200",
    english: "Complete",
    amharic: "In Progress",
    status: "Draft",
    updated: "Oct 10, 2023",
    snippet: "Industrial-grade digital counters for safety records and operational milestones.",
    description:
      "An industrial-grade timekeeping module for extreme environments, with fail-safe memory and ultra-low power consumption.",
    features: ["Non-Volatile Flash Memory", "Ultra-Low Power Draw", "Universal I/O Protocol", "Industrial Hardening"],
    benefits: ["Operates on micro-amps", "IP67-rated enclosure"],
  },
];

module.exports = products;
