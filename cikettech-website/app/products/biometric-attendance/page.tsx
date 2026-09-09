import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import DeploymentQuoteForm from "./DeploymentQuoteForm";
import { apiGet } from "../../lib/server-content";
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
  const [product, locale] = await Promise.all([
    apiGet<ProductDetail>("/api/products/biometric-attendance"),
    getLocale(),
  ]);
  const [main, matching, sync, integration] = product.features;

  return (
    <main>
      <SiteHeader active="Products" />

      <section className="product-hero-banner">
        <div className="product-hero-banner-inner">
          <span className="capability-pill">Next-Gen Access Control</span>
          <h1>
            Precision Biometric
            <span>Attendance System</span>
          </h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="#specs">
              {t(locale, "technicalSpecs")}
            </Link>
            <Link className="secondary-button" href="#demo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
              View Demo
            </Link>
          </div>
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
        <div className="deploy-quote-card">
          <div className="deploy-quote-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
              <path d="M14 3v4h4" />
              <path d="M12 11.5v5M10.3 12.8c0-.7.8-1.3 1.7-1.3s1.7.6 1.7 1.3-.8 1.2-1.7 1.2-1.7.5-1.7 1.2.8 1.3 1.7 1.3 1.7-.6 1.7-1.3" />
            </svg>
          </div>
          <h2>Request a Deployment Quote</h2>
          <p>Provide your facility details for a customized implementation plan.</p>
          <DeploymentQuoteForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
