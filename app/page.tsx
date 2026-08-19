import Link from "next/link";
import type { CSSProperties } from "react";
import { getSampleSite } from "@/lib/sample-sites";
import { categoryNames, getThemesByCategory, themes } from "@/lib/themes";
import type { ThemeDefinition, VenueCategory } from "@/lib/schema";

const categories: VenueCategory[] = ["restaurant", "cafe", "bar", "shop"];

const categoryDescriptions: Record<VenueCategory, string> = {
  restaurant: "Od degustacijskog menija do hrane za van.",
  cafe: "Od specialty kave do cjelodnevnog bruncha.",
  bar: "Od tihog koktel bara do glasnog vikend programa.",
  shop: "Od vintage komada i biljaka do lokalnih dizajnerskih proizvoda.",
};

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

function themeStyle(theme: ThemeDefinition): ThemeStyle {
  return {
    "--card-bg": theme.colors.background,
    "--card-surface": theme.colors.surface,
    "--card-text": theme.colors.text,
    "--card-muted": theme.colors.muted,
    "--card-accent": theme.colors.accent,
    "--card-border": theme.colors.border,
    "--card-display": theme.displayFont,
    "--card-radius": theme.radius,
    "--card-shadow": theme.shadow,
  };
}

export default function TemplateCatalog() {
  return (
    <main className="catalog-shell">
      <header className="catalog-hero">
        <Link className="catalog-brand" href="/" aria-label="WebZaLokal predlošci — početna">
          <span>WZL</span>
          WebZaLokal / predlošci
        </Link>

        <div className="catalog-hero-copy">
          <p className="catalog-kicker">Početna kolekcija · {themes.length} smjerova</p>
          <h1>Ista pouzdana osnova. Dvanaest različitih karaktera.</h1>
          <p>
            Odaberite polazni smjer prema lokalu. Fotografije, sadržaj, boje,
            tipografiju i detalje zatim prilagođavamo stvarnoj narudžbi.
          </p>
        </div>

        <div className="catalog-stats" aria-label="Sadržaj kolekcije">
          <div><strong>{categories.length}</strong><span>kategorije</span></div>
          <div><strong>{themes.length}</strong><span>vizualnih smjerova</span></div>
          <div><strong>2</strong><span>jezika u demonstraciji</span></div>
        </div>
      </header>

      <div className="catalog-content">
        {categories.map((category, categoryIndex) => (
          <section className="catalog-category" key={category}>
            <header className="catalog-section-heading">
              <span>0{categoryIndex + 1}</span>
              <div>
                <p>Kategorija</p>
                <h2>{categoryNames[category]}</h2>
              </div>
              <p>{categoryDescriptions[category]}</p>
            </header>

            <div className="theme-grid">
              {getThemesByCategory(category).map((theme, index) => {
                const site = getSampleSite(theme.slug);
                if (!site) return null;

                return (
                  <Link
                    className={`theme-card theme-card--${theme.layout}`}
                    href={`/templates/${theme.slug}/`}
                    key={theme.slug}
                    style={themeStyle(theme)}
                  >
                    <div className="theme-card-preview" aria-hidden="true">
                      <div className="theme-card-nav"><i /><i /><i /></div>
                      <div className="theme-card-stage">
                        <span>{site.categoryLabel.hr}</span>
                        <strong>{site.brandName}</strong>
                        <b>0{index + 1}</b>
                      </div>
                      <div className="theme-card-lines"><i /><i /><i /></div>
                    </div>
                    <div className="theme-card-copy">
                      <div>
                        <span>{theme.name}</span>
                        <h3>{site.brandName}</h3>
                      </div>
                      <p>{theme.shortDescription}</p>
                      <span className="theme-card-link">Otvori demonstraciju <b aria-hidden="true">↗</b></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className="catalog-footer">
        <span>WebZaLokal</span>
        <p>Radna kolekcija predložaka · sadržaj je demonstracijski</p>
        <a href="https://webzalokal.webzalokal.workers.dev/">Paketi i kontakt ↗</a>
      </footer>
    </main>
  );
}
