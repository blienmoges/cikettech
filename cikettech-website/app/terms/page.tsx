import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "Terms of Service | CIKETTECH",
  description: "The terms that govern your use of the CIKETTECH website and services.",
};

export default function TermsPage() {
  return (
    <main>
      <SiteHeader active="" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Terms of Service</span>
        </p>
        <h1>Terms of Service</h1>
        <div>The terms that govern your use of the CIKETTECH website and our products.</div>
      </section>

      <section className="legal-content">
        <p className="legal-updated">Last updated: September 7, 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using the CIKETTECH website, you agree to be bound by these Terms of
          Service. If you do not agree with any part of these terms, please do not use our
          website.
        </p>

        <h2>Use of the Website</h2>
        <p>
          You may use this website to learn about CIKETTECH products, request quotes, and contact
          our team. You agree not to misuse the website, attempt to gain unauthorized access to
          any part of it, or use it for any unlawful purpose.
        </p>

        <h2>Product Information &amp; Quotes</h2>
        <p>
          Product descriptions, specifications, and images on this website are provided for
          general informational purposes and are subject to change. Submitting a quote request
          does not constitute a binding order; final pricing and terms are confirmed directly with
          our sales team.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, and product designs, is
          the property of CIKETTECH or its licensors and is protected by applicable intellectual
          property laws. You may not reproduce or distribute this content without prior written
          permission.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          CIKETTECH provides this website on an &ldquo;as is&rdquo; basis and makes no warranties,
          express or implied, regarding its accuracy or availability. To the fullest extent
          permitted by law, CIKETTECH shall not be liable for any indirect or consequential
          damages arising from your use of this website.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use of the website
          after changes are posted constitutes acceptance of the updated terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about these terms can be directed to our team via the{" "}
          <Link href="/contact">Contact page</Link>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
