"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, type CSSProperties } from "react";
import type { ClientSiteConfig, Language, LocalizedText, PhotoAsset, ThemeDefinition } from "@/lib/schema";

type TemplateSiteProps = {
  site: ClientSiteConfig;
  theme: ThemeDefinition;
};

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;
type PhotoStyle = CSSProperties & Record<"--photo" | "--photo-position", string>;

const interfaceText = {
  hr: {
    navAbout: "O nama",
    navMenu: "Ponuda",
    navGallery: "Galerija",
    navContact: "Kontakt",
    back: "Svi predlošci",
    hours: "Radno vrijeme",
    address: "Adresa",
    phone: "Telefon",
    email: "E-mail",
    directions: "Otvori kartu",
    formName: "Ime i prezime",
    formEmail: "E-mail adresa",
    formMessage: "Poruka",
    formPlaceholder: "Termin, broj osoba ili vaš upit…",
    formSubmit: "Pošalji upit",
    formSuccess: "Demonstracija je uspjela — u stvarnoj stranici ovaj upit ide izravno lokalu.",
    demo: "Demonstracijski sadržaj",
    galleryAlt: "Mjesto za fotografiju lokala",
    follow: "Instagram",
  },
  en: {
    navAbout: "About",
    navMenu: "Menu",
    navGallery: "Gallery",
    navContact: "Contact",
    back: "All templates",
    hours: "Opening hours",
    address: "Address",
    phone: "Phone",
    email: "Email",
    directions: "Open map",
    formName: "Full name",
    formEmail: "Email address",
    formMessage: "Message",
    formPlaceholder: "Date, party size, or your question…",
    formSubmit: "Send enquiry",
    formSuccess: "Demo complete — on a live client site, this enquiry goes directly to the venue.",
    demo: "Demonstration content",
    galleryAlt: "Venue photography placeholder",
    follow: "Instagram",
  },
};

function localized(value: LocalizedText, language: Language) {
  return value[language];
}

function makeThemeStyle(theme: ThemeDefinition): ThemeStyle {
  return {
    "--bg": theme.colors.background,
    "--surface": theme.colors.surface,
    "--surface-strong": theme.colors.surfaceStrong,
    "--text": theme.colors.text,
    "--muted": theme.colors.muted,
    "--accent": theme.colors.accent,
    "--accent-strong": theme.colors.accentStrong,
    "--contrast": theme.colors.contrast,
    "--border": theme.colors.border,
    "--display": theme.displayFont,
    "--body": theme.bodyFont,
    "--accent-font": theme.accentFont,
    "--radius": theme.radius,
    "--shadow": theme.shadow,
  };
}

function makePhotoStyle(photo: PhotoAsset): PhotoStyle {
  return {
    "--photo": `url("${photo.src}")`,
    "--photo-position": photo.position ?? "center",
  };
}

export function TemplateSite({ site, theme }: TemplateSiteProps) {
  const [language, setLanguage] = useState<Language>("hr");
  const [sent, setSent] = useState(false);
  const ui = interfaceText[language];
  const primaryHref = site.contact.orderUrl ?? site.contact.reservationUrl ?? "#kontakt";
  const heroPhoto = site.media?.hero;
  const initials = useMemo(
    () => site.brandName.split(/\s+/).map((word) => word[0]).join("").slice(0, 2),
    [site.brandName],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!site.contact.formEndpoint) {
      event.preventDefault();
      setSent(true);
    }
  }

  return (
    <div
      className={`venue-site venue-site--${theme.layout}`}
      data-theme={theme.slug}
      style={makeThemeStyle(theme)}
    >
      <a className="skip-link" href="#sadrzaj">Preskoči na sadržaj</a>

      <div className="demo-ribbon">
        <Link href="/">← {ui.back}</Link>
        <span>{theme.name} · {ui.demo}</span>
      </div>

      <header className="venue-header">
        <a className="venue-logo" href="#vrh" aria-label={`${site.brandName} — početna`}>
          <span>{initials}</span>
          <strong>{site.brandName}</strong>
        </a>

        <nav className="venue-nav" aria-label="Glavna navigacija">
          <a href="#o-nama">{ui.navAbout}</a>
          <a href="#ponuda">{ui.navMenu}</a>
          <a href="#galerija">{ui.navGallery}</a>
          <a href="#kontakt">{ui.navContact}</a>
        </nav>

        <div className="venue-actions">
          <div className="language-switcher" aria-label="Odabir jezika">
            {(["hr", "en"] as Language[]).map((item) => (
              <button
                aria-pressed={language === item}
                key={item}
                onClick={() => setLanguage(item)}
                type="button"
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="button button--small" href={primaryHref}>{localized(site.primaryCta, language)}</a>
        </div>
      </header>

      <main id="sadrzaj">
        <section className="venue-hero" id="vrh">
          <div className="hero-copy">
            <p className="eyebrow">{localized(site.eyebrow, language)}</p>
            <h1>{localized(site.headline, language)}</h1>
            <p className="hero-intro">{localized(site.introduction, language)}</p>
            <div className="hero-buttons">
              <a className="button" href={primaryHref}>{localized(site.primaryCta, language)}</a>
              <a className="text-link" href="#ponuda">{localized(site.secondaryCta, language)} <span>↓</span></a>
            </div>
          </div>

          <div
            className={`hero-visual visual-placeholder${heroPhoto ? " has-photo" : ""}`}
            role="img"
            aria-label={heroPhoto ? localized(heroPhoto.alt, language) : ui.galleryAlt}
            style={heroPhoto ? makePhotoStyle(heroPhoto) : undefined}
          >
            <span className="visual-number">01</span>
            <div className="visual-monogram">{initials}</div>
            <p>{localized(site.visualLabel, language)}</p>
          </div>

          <div className="hero-note">
            <span>{localized(site.categoryLabel, language)}</span>
            <i />
            <span>Zagreb</span>
          </div>
        </section>

        <section className="about-section section-shell" id="o-nama">
          <div className="section-index"><span>01</span><p>{ui.navAbout}</p></div>
          <div className="about-copy">
            <p className="eyebrow">{localized(site.categoryLabel, language)}</p>
            <h2>{localized(site.aboutTitle, language)}</h2>
            <p>{localized(site.aboutBody, language)}</p>
          </div>
          <div className="about-mark" aria-hidden="true">{initials}</div>
        </section>

        <section className="features-section section-shell" aria-label="Izdvojeno">
          {site.features.map((item, index) => (
            <article key={item.title.hr}>
              <span>0{index + 1}</span>
              <h3>{localized(item.title, language)}</h3>
              <p>{localized(item.description, language)}</p>
            </article>
          ))}
        </section>

        <section className="menu-section" id="ponuda">
          <header className="section-shell menu-heading">
            <div className="section-index"><span>02</span><p>{ui.navMenu}</p></div>
            <div>
              <p className="eyebrow">{localized(site.categoryLabel, language)}</p>
              <h2>{localized(site.menuTitle, language)}</h2>
              <p>{localized(site.menuIntro, language)}</p>
            </div>
          </header>

          <div className="menu-list section-shell">
            {site.menu.map((item, index) => (
              <article className="menu-item" key={item.name.hr}>
                <span className="menu-item-number">0{index + 1}</span>
                <div>
                  <div className="menu-item-title">
                    <h3>{localized(item.name, language)}</h3>
                    {item.tag && <span>{localized(item.tag, language)}</span>}
                  </div>
                  <p>{localized(item.description, language)}</p>
                </div>
                <strong>{item.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section section-shell" id="galerija">
          <header className="gallery-heading">
            <div className="section-index"><span>03</span><p>{ui.navGallery}</p></div>
            <h2>{localized(site.galleryTitle, language)}</h2>
          </header>
          <div className="gallery-grid">
            {["02", "03", "04"].map((number, index) => {
              const photo = site.media?.gallery?.[index];

              return (
                <div
                  className={`gallery-image gallery-image--${index + 1} visual-placeholder${photo ? " has-photo" : ""}`}
                  role="img"
                  aria-label={photo ? localized(photo.alt, language) : ui.galleryAlt}
                  key={number}
                  style={photo ? makePhotoStyle(photo) : undefined}
                >
                  <span>{number}</span>
                  <i aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </section>

        <section className="contact-section" id="kontakt">
          <div className="section-shell contact-grid">
            <div className="contact-intro">
              <div className="section-index"><span>04</span><p>{ui.navContact}</p></div>
              <p className="eyebrow">{site.brandName}</p>
              <h2>{localized(site.contactTitle, language)}</h2>
              <p>{localized(site.contactIntro, language)}</p>
            </div>

            <div className="contact-details">
              <div>
                <span>{ui.address}</span>
                <p>{site.contact.address}</p>
                <a href={site.contact.mapsUrl} rel="noreferrer" target="_blank">{ui.directions} ↗</a>
              </div>
              <div>
                <span>{ui.phone}</span>
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>
              </div>
              <div>
                <span>{ui.email}</span>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </div>
            </div>

            <div className="hours-card">
              <h3>{ui.hours}</h3>
              {site.openingHours.map((row) => (
                <div key={row.days.hr}>
                  <span>{localized(row.days, language)}</span>
                  <strong>{typeof row.hours === "string" ? row.hours : localized(row.hours, language)}</strong>
                </div>
              ))}
            </div>

            <form
              action={site.contact.formEndpoint}
              className="contact-form"
              method="post"
              onSubmit={handleSubmit}
            >
              <label>
                <span>{ui.formName}</span>
                <input name="name" required type="text" />
              </label>
              <label>
                <span>{ui.formEmail}</span>
                <input name="email" required type="email" />
              </label>
              <label>
                <span>{ui.formMessage}</span>
                <textarea name="message" placeholder={ui.formPlaceholder} required rows={4} />
              </label>
              <button className="button" type="submit">{ui.formSubmit}</button>
              {sent && <p className="form-success" role="status">{ui.formSuccess}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="venue-footer">
        <a className="venue-logo" href="#vrh"><span>{initials}</span><strong>{site.brandName}</strong></a>
        <p>© {new Date().getFullYear()} {site.brandName}</p>
        <div>
          {site.contact.instagramUrl && <a href={site.contact.instagramUrl} rel="noreferrer" target="_blank">{ui.follow} ↗</a>}
          <a href={`mailto:${site.contact.email}`}>{ui.email}</a>
        </div>
      </footer>
    </div>
  );
}
