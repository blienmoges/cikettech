import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Products | CIKETTECH",
  description:
    "Explore CIKETTECH smart electronic systems for access control, attendance, scheduling, and operational tracking.",
};

type ProductSummary = { slug: string; name: string; summary: string; image: string };

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7V5.8C8 4.2 9.4 3 11 3h2c1.7 0 3 1.2 3 2.8V7h2.2c1 0 1.8.8 1.8 1.8v7.4c0 1-.8 1.8-1.8 1.8H5.8c-1 0-1.8-.8-1.8-1.8V8.8C4 7.8 4.8 7 5.8 7H8Zm2 0h4V5.8c0-.5-.4-.8-1-.8h-2c-.6 0-1 .3-1 .8V7Zm-3 4.2V14h3v-2.8H7Zm7 0V14h3v-2.8h-3Zm-3.8 5.3h3.6v-1.7h-3.6v1.7Z" />
    </svg>
  );
}

export default async function ProductsPage() {
  const products = await apiGet<ProductSummary[]>("/api/products");

  return (
    <main>
      <SiteHeader active="Products" />

      <section className="products-page-hero">
        <p>
          <Link href="/">Home</Link> / <span>Products</span>
        </p>
        <h1>Our Products</h1>
        <div>
          Engineered for precision and built for reliability, our suite of smart systems leverages
          cutting-edge technology to streamline operations and enhance security.
        </div>
      </section>

      <section className="catalog-section" aria-label="Product catalog">
        <div className="catalog-grid">
          {products.map((product) => {
            const href = `/products/${product.slug}`;
            return (
              <article className="catalog-card" key={product.slug}>
                <div
                  className="catalog-image"
                  style={{ backgroundImage: `url(${product.image})` }}
                  role="img"
                  aria-label={product.name}
                />
                <div className="catalog-content">
                  <h2>{product.name}</h2>
                  <p>{product.summary}</p>
                  <div className="catalog-actions">
                    <Link className="primary-button compact" href={href}>
                      View Details
                    </Link>
                    <Link className="text-action" href={`${href}#quote`}>
                      Request a Quote
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="products-cta">
        <h2>Interested in One of Our Products?</h2>
        <p>
          Our engineering team is ready to discuss your specific requirements and architect a
          tailored solution for your institution.
        </p>
        <Link className="primary-button" href="/contact">
          Contact CIKETTECH
        </Link>
      </section>

      <SiteFooter />

      <Link className="support-fab" href="/contact" aria-label="Contact support">
        <SupportIcon />
      </Link>
    </main>
  );
}
