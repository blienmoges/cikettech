import Link from "next/link";
import { SiteHeader, SiteFooter } from "../../components/site-chrome";
import QuoteForm from "../QuoteForm";
import { apiGet } from "../../lib/server-content";
import { getLocale } from "../../lib/locale";
import { t } from "../../lib/i18n";

export const metadata = {
  title: "AI Smart Parking Gate System | CIKETTECH",
  description: "AI Smart Parking Gate System - product detail, features, gallery and quote form.",
};

type ProductDetail = {
  name: string;
  description: string;
  heroImage: string;
  features: { title: string; description: string }[];
  applications: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  gallery: string[];
  specs: { label: string; value: string }[];
};

export default async function ParkingGatePage() {
  const [product, locale] = await Promise.all([
    apiGet<ProductDetail>("/api/products/parking-gate"),
    getLocale(),
  ]);

  return (
    <main>
      <SiteHeader active="Products" />

      <section className="product-hero">
        <div className="product-hero-copy">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact">
              {t(locale, "requestAQuote")}
            </Link>
            <Link className="secondary-button" href="#specs">
              {t(locale, "technicalSpecs")}
            </Link>
          </div>
        </div>

        <div
          className="product-hero-image"
          role="img"
          aria-label={product.name}
          style={{ backgroundImage: `url('${product.heroImage}')` }}
        />
      </section>

      <section className="capabilities-section">
        <div className="section-heading">
          <h2>Core Features</h2>
        </div>

        <div className="capabilities-grid">
          {product.features.map((f) => (
            <article className="cap-card" key={f.title}>
              <div className="cap-icon" />
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </article>
          ))}
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
          <div className="gallery-large" style={{ backgroundImage: `url('${product.gallery[0]}')` }} />
          <div>
            {product.gallery.slice(1).map((src) => (
              <div key={src} className="gallery-small" style={{ backgroundImage: `url('${src}')` }} />
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
          <p>Contact our engineering sales team to discuss tailored system requirements.</p>
        </div>
        <div className="quote-card-wrapper">
          <QuoteForm defaultProduct={product.name} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
