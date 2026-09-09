import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { apiGet } from "../lib/server-content";
import { getLocale } from "../lib/locale";
import { t } from "../lib/i18n";

export const metadata: Metadata = {
  title: "About | CIKETTECH",
  description:
    "Company profile, mission, values, team, and awards for CIKETTECH — smart electronic products in Ethiopia.",
};

type AboutData = {
  hero: { eyebrow: string; heading: string; body: string; image: string };
  sections: {
    profileHeading: string;
    profileBody: string;
    missionLabel: string;
    visionLabel: string;
    valuesHeading: string;
    valuesBody: string;
    teamHeading: string;
    teamBody: string;
    awardsHeading: string;
    noAwards: string;
    ctaHeading: string;
    ctaBody: string;
  };
  profileCards: { title: string; copy: string; icon: string }[];
  mission: string;
  vision: string;
  values: { title: string; description: string }[];
  team: { name: string; role: string; image: string }[];
};

type AwardSummary = { id: string; name: string; org: string; date: string; image?: string };

export default async function AboutPage() {
  const [data, awards, locale] = await Promise.all([
    apiGet<AboutData>("/api/about"),
    apiGet<AwardSummary[]>("/api/awards"),
    getLocale(),
  ]);

  return (
    <main>
      <SiteHeader active="About" />

      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="dark-breadcrumb">
            <Link href="/">{t(locale, "home")}</Link> <span>/</span> {t(locale, "about")}
          </p>
          <p className="innovation-pill">{data.hero.eyebrow}</p>
          <h1>{data.hero.heading}</h1>
          <p>{data.hero.body}</p>
          <div style={{ marginTop: 28 }}>
            <Link className="primary-button" href="/contact">
              {t(locale, "contactUs")}
            </Link>
          </div>
        </div>

        <div
          className="about-hero-image"
          role="img"
          aria-label={data.hero.image}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </section>

      <section className="company-profile" aria-label="Company Profile">
        <div className="section-heading">
          <h2>{data.sections.profileHeading}</h2>
          <p>{data.sections.profileBody}</p>
        </div>

        <div className="profile-cards">
          {data.profileCards.map((c) => (
            <article className="profile-card" key={c.title}>
              <div className="profile-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                </svg>
              </div>
              <h3>{c.title}</h3>
              <p>{c.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mission-vision">
        <div className="mission">
          <div className="card-head">
            <div className="card-icon" />
            <h3>{data.sections.missionLabel}</h3>
          </div>
          <p>{data.mission}</p>
        </div>
        <div className="vision">
          <div className="card-head">
            <div className="card-icon" />
            <h3>{data.sections.visionLabel}</h3>
          </div>
          <p>{data.vision}</p>
        </div>
      </section>

      <section className="values-section">
        <div className="section-heading">
          <h2>{data.sections.valuesHeading}</h2>
          <p>{data.sections.valuesBody}</p>
        </div>
        <div className="values-grid">
          {data.values.map((v) => (
            <article className="value-card" key={v.title}>
              <h4>{v.title}</h4>
              <p>{v.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="team-section">
        <div className="section-heading">
          <h2>{data.sections.teamHeading}</h2>
          <p>{data.sections.teamBody}</p>
        </div>

        <div className="team-grid">
          {data.team.map((member) => (
            <figure className="team-card" key={member.name}>
              <div
                className="team-photo"
                style={{ backgroundImage: `url(${member.image})`, backgroundSize: "cover" }}
                role="img"
                aria-label={member.name}
              />
              <figcaption>
                <strong>{member.name}</strong>
                <div className="muted">{member.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="awards-section">
        <div className="section-heading">
          <h2>{data.sections.awardsHeading}</h2>
        </div>
        {awards.length > 0 ? (
          <>
            <div className="catalog-grid awards-preview-grid">
              {awards.slice(0, 3).map((award) => (
                <article className="catalog-card" key={award.id}>
                  {award.image && (
                    <div
                      className="catalog-image"
                      style={{ backgroundImage: `url(${award.image})` }}
                      role="img"
                      aria-label={award.name}
                    />
                  )}
                  <div className="catalog-content">
                    <p className="legal-updated">
                      {award.org} &bull; {award.date}
                    </p>
                    <h2>{award.name}</h2>
                    <Link className="text-action" href={`/awards/${award.id}`}>
                      {t(locale, "viewAward")}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link className="secondary-button" href="/awards">
                {t(locale, "viewAllAwards")}
              </Link>
            </div>
          </>
        ) : (
          <div className="awards-placeholder">{data.sections.noAwards}</div>
        )}
      </section>

      <section className="about-cta">
        <h2>{data.sections.ctaHeading}</h2>
        <p>{data.sections.ctaBody}</p>
        <Link className="primary-button" href="/contact">
          {t(locale, "contactUs")}
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
