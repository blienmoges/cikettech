import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { apiGet } from "./lib/server-content";

type HomeData = {
  hero: { heading: string; subheading: string; image: string; viewProducts: string };
  featured: { heading: string; subheading: string; viewDetails: string };
  why: { heading: string };
  cta: { heading: string; body: string; requestQuote: string; contactSales: string };
  about: { eyebrow: string; heading: string; body: string };
  featuredProducts: { slug: string; title: string; description: string; image: string; href: string }[];
  reasons: { key: string; title: string; description: string }[];
};

const reasonIcons: Record<string, React.ReactNode> = {
  precision: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.9 2.9-3-3 2.9-2.9Z" />
    </svg>
  ),
  reliability: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.6 2.9 8.8 7 10 4.1-1.2 7-5.4 7-10V6l-7-3Zm3.5 7.2-4.2 4.2-2.1-2.1 1.4-1.4.7.7 2.8-2.8 1.4 1.4Z" />
    </svg>
  ),
  global: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.6 9h-3a15.8 15.8 0 0 0-1.2-5 8.1 8.1 0 0 1 4.2 5ZM12 4.1c.8 1.1 1.4 2.8 1.6 4.9h-3.2c.2-2.1.8-3.8 1.6-4.9ZM4.3 13h3a15.8 15.8 0 0 0 1.2 5 8.1 8.1 0 0 1-4.2-5Zm3-2h-3a8.1 8.1 0 0 1 4.2-5 15.8 15.8 0 0 0-1.2 5Zm4.7 8.9c-.8-1.1-1.4-2.8-1.6-4.9h3.2c-.2 2.1-.8 3.8-1.6 4.9Zm2-6.9h-4v-2h4v2Zm1.5 5a15.8 15.8 0 0 0 1.2-5h3a8.1 8.1 0 0 1-4.2 5Z" />
    </svg>
  ),
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CIKETTECH",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cikettech.com",
  description:
    "CIKETTECH designs and manufactures intelligent electronic systems for modern infrastructure, based in Addis Ababa, Ethiopia.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bole Road, Millennium Business Park",
    addressLocality: "Addis Ababa",
    addressCountry: "ET",
  },
};

export default async function Home() {
  const data = await apiGet<HomeData>("/api/home");

  return (
    <main id="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <SiteHeader active="Home" />

      <section className="hero">
        <div className="hero-copy">
          <h1>{data.hero.heading}</h1>
          <p>{data.hero.subheading}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/products">
              {data.hero.viewProducts}
            </Link>
          </div>
        </div>
        <div className="hero-image" role="img" aria-label={data.hero.image} />
      </section>

      <section className="about-section" id="about">
        <p className="eyebrow">{data.about.eyebrow}</p>
        <h2>{data.about.heading}</h2>
        <p>{data.about.body}</p>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <h2>{data.featured.heading}</h2>
          <p>{data.featured.subheading}</p>
        </div>
        <div className="product-grid">
          {data.featuredProducts.map((product) => (
            <article className="product-card" key={product.slug}>
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
                role="img"
                aria-label={product.title}
              />
              <div className="product-content">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <Link href={product.href}>{data.featured.viewDetails}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section" id="technology">
        <h2>{data.why.heading}</h2>
        <div className="reasons-grid">
          {data.reasons.map((reason) => (
            <article className="reason" key={reason.key}>
              <div className="reason-icon">{reasonIcons[reason.key]}</div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section" id="contact">
        <h2>{data.cta.heading}</h2>
        <p>{data.cta.body}</p>
        <div className="cta-actions">
          <Link className="quote-button" href="/contact">
            {data.cta.requestQuote}
          </Link>
          <Link className="contact-button" href="/contact">
            {data.cta.contactSales}
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
