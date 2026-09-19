import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import DeploymentQuoteForm from "./DeploymentQuoteForm";
import { apiGet, getTranslations } from "../../lib/server-content";
import { getLocale } from "../../lib/locale";
import { t } from "../../lib/i18n";

export const metadata = {
  title: "Precision Biometric Attendance System | CIKETTECH",
  description: "Precision Biometric Attendance System product page with architecture and quote form.",
};

type ProductDetail = {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string;
  features: { title: string; description: string; badge?: string }[];
  applications: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  gallery: string[];
  specs: { label: string; value: string }[];
};

export default async function BiometricAttendancePage() {
  const [product, locale, translations] = await Promise.all([
    apiGet<ProductDetail>("/api/products/biometric-attendance"),
    getLocale(),
    getTranslations(),
  ]);
  const [main, matching, sync, integration] = product.features;

  return (
    <main>
      <SiteHeader active="Products" />

      <section className="product-hero">
        <div className="product-hero-copy">
          <p className="eyebrow">Next-Gen Access Control</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="#quote">
              {t(locale, "requestAQuote", translations)}
            </Link>
            <Link className="secondary-button" href="#specs">
              {t(locale, "technicalSpecs", translations)}
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
          <h2>System Architecture</h2>
          <p>Technical specifications and core capabilities.</p>
        </div>

        <div className="capabilities-grid">
          {main && (
            <article className="cap-card wide">
              <div className="cap-card-head">
                <div className="cap-icon-tile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 11c.6 2 .6 4.2-1 6.2M8.4 9.3c1.9-1.5 4.4-1.5 6.3 0M6.2 6.9c3.2-2.7 8.6-2.7 11.8 0M4 4.5c4.6-4 12-4 16.6 0M9.4 13.1c.5 1.9-.1 3.8-1.4 5.3M12 3.4c-4.9 0-8.9 3.7-8.9 8.4 0 2.1.5 4 1.2 5.7" />
                  </svg>
                </div>
                {main.badge && <span className="cap-badge">{main.badge}</span>}
              </div>
              <h3>{main.title}</h3>
              <p>{main.description}</p>
              <div className="cap-image tall">
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 900px) 100vw, 480px"
                  unoptimized={product.heroImage.includes("wikimedia.org")}
                />
              </div>
            </article>
          )}

          {matching && (
            <article className="cap-card">
              <div className="cap-icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="13" r="8" />
                  <path d="M12 9v4l3 2M9 2h6" />
                </svg>
              </div>
              <h3>{matching.title}</h3>
              <p>{matching.description}</p>
            </article>
          )}

          {sync && (
            <article className="cap-card">
              <div className="cap-icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </div>
              <h3>{sync.title}</h3>
              <p>{sync.description}</p>
            </article>
          )}

          {integration && (
            <article className="cap-card">
              <div className="cap-icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
                  <path d="M6.5 10v2a2 2 0 0 0 2 2h1M17.5 10v2a2 2 0 0 1-2 2h-1" />
                </svg>
              </div>
              <h3>{integration.title}</h3>
              <p>{integration.description}</p>
              <Link className="text-action" href="/technology">
                View API Docs
              </Link>
            </article>
          )}

          <div className="cap-placeholder">Integration Topology</div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <h2>{t(locale, "idealApplicationsBenefits", translations)}</h2>
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
          <h2>{t(locale, "productGallery", translations)}</h2>
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
          <h2>{t(locale, "technicalSpecifications", translations)}</h2>
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
          <h2>{t(locale, "requestAQuote", translations)}</h2>
          <p>Provide your facility details for a customized implementation plan.</p>
        </div>
        <div className="quote-card-wrapper">
          <DeploymentQuoteForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
