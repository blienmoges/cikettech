import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy | CIKETTECH",
  description: "How CIKETTECH collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Privacy Policy</span>
        </p>
        <h1>Privacy Policy</h1>
        <div>How we collect, use, and protect your information across the CIKETTECH website.</div>
      </section>

      <section className="legal-content">
        <p className="legal-updated">Last updated: September 7, 2026</p>

        <h2>Information We Collect</h2>
        <p>
          When you request a quote, submit a contact form, or reach out through our support
          channels, we collect information such as your name, email address, phone number,
          organization, and the details of your inquiry. We also collect basic analytics data
          about how visitors use our website, such as pages viewed and general location.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to quote requests, product inquiries, and support tickets.</li>
          <li>To improve our products, services, and website experience.</li>
          <li>To send updates about products or services you have expressed interest in.</li>
        </ul>

        <h2>How We Protect Your Information</h2>
        <p>
          We apply reasonable technical and organizational measures to protect the personal
          information we hold from unauthorized access, alteration, disclosure, or destruction.
          Access to customer data within CIKETTECH is restricted to staff who need it to do their
          jobs.
        </p>

        <h2>Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share information with trusted service
          providers who help us operate our business (such as hosting or email delivery), and only
          to the extent necessary for them to perform those services.
        </p>

        <h2>Your Choices</h2>
        <p>
          You may contact us at any time to ask what information we hold about you, to request a
          correction, or to request that we delete it, subject to any legal or contractual
          obligations we may have to retain certain records.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please reach out through our{" "}
          <Link href="/contact">Contact page</Link>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
