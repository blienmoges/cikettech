import type { Metadata } from "next";
import React from "react";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import ContactForm from "./ContactForm";
import { apiGet } from "../lib/server-content";

export const metadata: Metadata = {
  title: "Contact | CIKETTECH",
  description: "Contact CIKETTECH for support, partnerships, or general inquiries.",
};

type ContactData = {
  hero: { heading: string; body: string };
  labels: { globalHq: string; directLine: string; email: string; avgResponseLatency: string };
  info: { globalHq: string[]; mapQuery: string; directLine: string; email: string; avgResponseLatency: string };
};

export default async function ContactPage() {
  const data = await apiGet<ContactData>("/api/contact");

  return (
    <main>
      <SiteHeader active="Contact" />

      <section className="contact-hero">
        <div className="contact-hero-inner">
          <h1>{data.hero.heading}</h1>
          <p>{data.hero.body}</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-grid">
          <aside className="contact-info">
            <div className="info-block">
              <h4>{data.labels.globalHq}</h4>
              <address>
                {data.info.globalHq.map((line, i) => (
                  <React.Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </address>
            </div>

            <div className="info-block">
              <h4>{data.labels.directLine}</h4>
              <div className="muted">{data.info.directLine}</div>
            </div>

            <div className="info-block">
              <h4>{data.labels.email}</h4>
              <div className="muted">{data.info.email}</div>
            </div>

            <div className="latency-card">
              <div className="latency-figure">{data.info.avgResponseLatency}</div>
              <div className="latency-label">{data.labels.avgResponseLatency}</div>
            </div>
          </aside>

          <div className="contact-form-card">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <iframe
          className="contact-map"
          title="CIKETTECH headquarters location"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(data.info.mapQuery)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <SiteFooter />
    </main>
  );
}
