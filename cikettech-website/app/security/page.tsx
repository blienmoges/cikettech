import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "Security | CIKETTECH",
  description: "How CIKETTECH protects customer data and maintains a secure platform.",
};

export default function SecurityPage() {
  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Security</span>
        </p>
        <h1>Security</h1>
        <div>How we protect customer data across our website, products, and AI assistant.</div>
      </section>

      <section className="legal-content">
        <h2>Infrastructure &amp; Data Protection</h2>
        <p>
          CIKETTECH systems are hosted on reputable cloud infrastructure with encryption in
          transit for all traffic between your browser and our servers. Access to production
          systems and customer data is restricted to authorized personnel only.
        </p>

        <h2>Account &amp; Admin Access</h2>
        <p>
          Our admin portal is protected by authenticated login and is not indexed or linked from
          the public site. Administrative actions are scoped to authorized staff accounts.
        </p>

        <h2>Responsible Disclosure</h2>
        <p>
          If you believe you have found a security vulnerability in our website or products, we
          encourage you to report it to us responsibly through our{" "}
          <Link href="/contact">Contact page</Link> so our team can investigate and address it
          promptly.
        </p>

        <h2>Ongoing Review</h2>
        <p>
          We periodically review our security practices as our products and infrastructure
          evolve. For more on how we handle personal data, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
