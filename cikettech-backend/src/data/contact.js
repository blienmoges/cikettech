const { createInquiry } = require("./inquiryStore");

const content = {
  en: {
    hero: {
      heading: "Initiate Contact",
      body:
        "Connect with our engineering and support teams to discuss bespoke technical solutions, partnership inquiries, or general product support.",
    },
    labels: {
      globalHq: "GLOBAL HQ",
      directLine: "DIRECT LINE",
      email: "ELECTRONIC MAIL",
      avgResponseLatency: "AVG RESPONSE LATENCY",
    },
  },
  am: {
    hero: {
      heading: "ግንኙነት ይጀምሩ",
      body:
        "ልዩ የቴክኒክ መፍትሄዎችን፣ የሽርክና ጥያቄዎችን ወይም አጠቃላይ የምርት ድጋፍን ለመወያየት ከምህንድስና እና ድጋፍ ቡድኖቻችን ጋር ይገናኙ።",
    },
    labels: {
      globalHq: "ዋና መስሪያ ቤት",
      directLine: "ቀጥታ መስመር",
      email: "ኢሜይል",
      avgResponseLatency: "አማካይ የምላሽ ጊዜ",
    },
  },
};

const info = {
  globalHq: ["Bole Road, Millennium Business Park", "Addis Ababa, Ethiopia"],
  mapQuery: "Bole Road, Millennium Business Park, Addis Ababa, Ethiopia",
  directLine: "+251 11 618 0000",
  email: "protocols@cikettech.com",
  avgResponseLatency: "< 4h",
};

const categories = ["Customer Support", "Partnerships", "General"];

// In-memory store — resets on server restart. Swap for a real database when one is available.
const submissions = [];
let nextId = 1;

function getContactPage(lang) {
  const localized = content[lang] || content.en;
  return { ...localized, info, categories };
}

function submitContactForm({ firstName, lastName, email, company, message, category }) {
  const errors = [];
  if (!firstName || !firstName.trim()) errors.push("First name is required.");
  if (!lastName || !lastName.trim()) errors.push("Last name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email address is required.");
  if (!message || !message.trim()) errors.push("Message cannot be empty.");
  if (errors.length) {
    const err = new Error("Validation failed");
    err.details = errors;
    throw err;
  }

  const submission = {
    id: nextId++,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    company: (company || "").trim(),
    message: message.trim(),
    category: category && categories.includes(category) ? category : "General",
    submittedAt: new Date().toISOString(),
  };
  submissions.push(submission);

  createInquiry({
    name: `${submission.firstName} ${submission.lastName}`,
    org: submission.company,
    type: submission.category,
    email: submission.email,
    subject: `${submission.category} inquiry from ${submission.firstName} ${submission.lastName}`,
    message: submission.message,
  });

  return submission;
}

function listSubmissions() {
  return submissions;
}

module.exports = { getContactPage, submitContactForm, listSubmissions };
