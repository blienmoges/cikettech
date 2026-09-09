import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import SchoolBellQuoteForm from "./SchoolBellQuoteForm";
import { apiGet } from "../../lib/server-content";
import { getLocale } from "../../lib/locale";
import { t } from "../../lib/i18n";

export const metadata = {
  title: "Smart School Bell System | CIKETTECH",
  description: "Smart School Bell System product page with capabilities and quote form.",
};

type ProductDetail = {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string;
  features: { title: string; description: string }[];
  applications: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  gallery: string[];
  specs: { label: string; value: string }[];
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 2h6" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="10" width="8" height="11" rx="1.5" />
      <path d="M12 10V6M9 3.5a4 4 0 0 1 6 0M6.5 1.5a7.5 7.5 0 0 1 11 0" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 19 6.5v5.5c0 4.5-3 7-7 8.5-4-1.5-7-4-7-8.5V6.5L12 3.5Z" />
      <path d="m9.2 12.2 1.9 1.9 3.7-3.9" />
    </svg>
  );
}

const featureIcons = [ClockIcon, BroadcastIcon, DashboardIcon, ShieldIcon];

export default async function SchoolBellPage() {
  const [product, locale] = await Promise.all([
    apiGet<ProductDetail>("/api/products/school-bell"),
    getLocale(),
  ]);

  return (
    <main>
      <SiteHeader active="Products" />

      <section className="product-hero">
        <div className="product-hero-copy">
          {product.tagline && <span className="capability-pill">{product.tagline}</span>}
          <h1>{product.name}.</h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact">
              {t(locale, "requestQuote")}
            </Link>
            <Link className="secondary-button" href="#specs">
              {t(locale, "technicalSpecs")}
            </Link>
          </div>
        </div>
        <div className="product-hero-image">
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 900px) 100vw, 640px"
            unoptimized={product.heroImage.includes("wikimedia.org")}
            priority
          />
        </div>
      </section>

      <section className="capabilities-section">
        <div className="section-heading">
          <h2>Engineered for Precision.</h2>
          <p>
            The core architecture of the Smart School Bell System is built on a foundation of
            reliability, scalability, and ease of integration.
          </p>
        </div>

        <div className="capabilities-grid cols-2">
          {product.features.map((f, i) => {
            const Icon = featureIcons[i] ?? ClockIcon;
            return (
              <article className="cap-card" key={f.title}>
                <div className="cap-icon-tile">
                  <Icon />
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <h2>{t(locale, "idealApplicationsBenefits")}</h2>
        </div>

        <div className="capabilities-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            {product.applications.map((a) => (
              <article className="cap-card" key={a.title}>
                <h4>{a.title}</h4>
                <p>{a.description}</p>
              </article>
            ))}
          </div>

          <div>
            {product.benefits.map((b) => (
              <article className="cap-card" key={b.title}>
                <h4>{b.title}</h4>
                <p>{b.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="section-heading">
          <h2>{t(locale, "productGallery")}</h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-large">
            <Image
              src={product.gallery[0]}
              alt={`${product.name} gallery photo 1`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 900px) 100vw, 640px"
              unoptimized={product.gallery[0].includes("wikimedia.org")}
            />
          </div>
          <div>
            {product.gallery.slice(1).map((src, i) => (
              <div key={src} className="gallery-small">
                <Image
                  src={src}
                  alt={`${product.name} gallery photo ${i + 2}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="360px"
                  unoptimized={src.includes("wikimedia.org")}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="specs" className="specs-section">
        <div className="section-heading">
          <h2>{t(locale, "technicalSpecifications")}</h2>
        </div>
        <div className="specs-table">
          {Array.from({ length: Math.ceil(product.specs.length / 2) }).map((_, rowIdx) => {
            const left = product.specs[rowIdx * 2];
            const right = product.specs[rowIdx * 2 + 1];
            return (
              <div className="spec-row" key={left.label}>
                <div>{left.label}</div>
                <div>{left.value}</div>
                {right && (
                  <>
                    <div>{right.label}</div>
                    <div>{right.value}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="quote" className="quote-section">
        <div className="section-heading">
          <h2>{t(locale, "requestAQuote")}</h2>
          <p>
            Provide details about your facility requirements, and our engineering team will
            architect a tailored solution.
          </p>
        </div>
        <div className="quote-card-wrapper">
          <SchoolBellQuoteForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
