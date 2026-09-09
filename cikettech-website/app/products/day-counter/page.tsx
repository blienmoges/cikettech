import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import QuoteForm from "../QuoteForm";
import { apiGet } from "../../lib/server-content";
import { getLocale } from "../../lib/locale";
import { t } from "../../lib/i18n";

export const metadata = {
  title: "Smart Day Counter | CIKETTECH",
  description: "Smart Day Counter product page with specs, capabilities, and quote form.",
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

function ChipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
      <path d="M9 3v2M12 3v2M15 3v2M9 19v2M12 19v2M15 19v2M3 9h2M3 12h2M3 15h2M19 9h2M19 12h2M19 15h2" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="8" width="16" height="8" rx="1.5" />
      <path d="M21.5 10.5v3" />
      <path d="M6 11v2M9 11v2" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v5M15 2v5M7 7h10v3a5 5 0 0 1-10 0V7Z" />
      <path d="M12 15v3M9 21h6" />
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

const featureIcons = [ChipIcon, BatteryIcon, PlugIcon, ShieldIcon];

export default async function DayCounterPage() {
  const [product, locale] = await Promise.all([
    apiGet<ProductDetail>("/api/products/day-counter"),
    getLocale(),
  ]);
  const [wide, small, ...rest] = product.features;

  return (
    <main className="theme-cyan">
      <SiteHeader active="Products" />

      <section className="product-hero">
        <div className="product-hero-copy">
          <p className="eyebrow">Precision Instrumentation</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact">
              Request Specifications
            </Link>
            <Link className="secondary-button" href="#specs">
              Technical Data Sheet
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
          <h2>Core Capabilities</h2>
          <p>
            Engineered for absolute reliability, the Smart Day Counter integrates seamlessly into
            existing industrial automation frameworks.
          </p>
        </div>

        <div className="capabilities-grid">
          {wide && (
            <article className="cap-card wide">
              <div className="cap-icon-tile">
                <ChipIcon />
              </div>
              <h3>{wide.title}</h3>
              <p>{wide.description}</p>
              <div className="cap-image tall">
                <Image
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Controller_board_(14837601847).jpg?width=900"
                  alt="Controller board close-up"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 900px) 100vw, 480px"
                  unoptimized
                />
              </div>
            </article>
          )}

          {small && (
            <article className="cap-card small">
              <div className="cap-icon-tile">
                <BatteryIcon />
              </div>
              <h3>{small.title}</h3>
              <p>{small.description}</p>
            </article>
          )}

          {rest.map((f, i) => {
            const Icon = featureIcons[i + 2] ?? PlugIcon;
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

          <div className="cap-image-tile">
            <Image
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Digital_tally_counter.jpg?width=600"
              alt="Smart Day Counter enclosure"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 900px) 100vw, 320px"
              unoptimized
            />
          </div>
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
          <p>Get pricing and availability information for the Smart Day Counter.</p>
        </div>

        <div className="quote-card-wrapper">
          <QuoteForm defaultProduct={product.name} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
