import type {
  ClientSiteConfig,
  LocalizedText,
  ThemeDefinition,
} from "./schema";

export type ValidationIssue = {
  path: string;
  message: string;
};

function hasBothLanguages(value: LocalizedText) {
  return value.hr.trim().length > 0 && value.en.trim().length > 0;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isActionUrl(value: string) {
  return value.startsWith("#") || isHttpUrl(value);
}

export function validateSiteConfig(
  site: ClientSiteConfig,
  theme: ThemeDefinition,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (path: string, message: string) => issues.push({ path, message });

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug)) {
    add("slug", "mora koristiti mala slova, brojeve i crtice");
  }

  if (site.themeSlug !== theme.slug) {
    add("themeSlug", `mora odgovarati odabranoj temi ${theme.slug}`);
  }

  if (!site.brandName.trim()) add("brandName", "ne smije biti prazan");

  const localizedFields: Array<[keyof ClientSiteConfig, LocalizedText]> = [
    ["categoryLabel", site.categoryLabel],
    ["eyebrow", site.eyebrow],
    ["headline", site.headline],
    ["introduction", site.introduction],
    ["aboutTitle", site.aboutTitle],
    ["aboutBody", site.aboutBody],
    ["menuTitle", site.menuTitle],
    ["menuIntro", site.menuIntro],
    ["galleryTitle", site.galleryTitle],
    ["contactTitle", site.contactTitle],
    ["contactIntro", site.contactIntro],
    ["primaryCta", site.primaryCta],
    ["secondaryCta", site.secondaryCta],
    ["visualLabel", site.visualLabel],
  ];

  for (const [path, value] of localizedFields) {
    if (!hasBothLanguages(value)) add(String(path), "mora sadržavati HR i EN tekst");
  }

  if (site.menu.length < 1) add("menu", "mora sadržavati barem jednu stavku");
  site.menu.forEach((item, index) => {
    if (!hasBothLanguages(item.name)) add(`menu.${index}.name`, "nedostaje HR ili EN naziv");
    if (!hasBothLanguages(item.description)) add(`menu.${index}.description`, "nedostaje HR ili EN opis");
    if (!item.price.trim()) add(`menu.${index}.price`, "cijena ili oznaka ne smije biti prazna");
  });

  if (site.features.length < 3) add("features", "preporučene su najmanje tri prednosti");
  site.features.forEach((item, index) => {
    if (!hasBothLanguages(item.title)) add(`features.${index}.title`, "nedostaje HR ili EN naslov");
    if (!hasBothLanguages(item.description)) add(`features.${index}.description`, "nedostaje HR ili EN opis");
  });

  if (site.openingHours.length < 1) add("openingHours", "mora sadržavati barem jedan redak");
  site.openingHours.forEach((row, index) => {
    if (!hasBothLanguages(row.days)) add(`openingHours.${index}.days`, "nedostaje HR ili EN oznaka dana");
    if (typeof row.hours === "string" && !row.hours.trim()) {
      add(`openingHours.${index}.hours`, "ne smije biti prazno");
    }
    if (typeof row.hours !== "string" && !hasBothLanguages(row.hours)) {
      add(`openingHours.${index}.hours`, "nedostaje HR ili EN tekst");
    }
  });

  if (!site.contact.address.trim()) add("contact.address", "ne smije biti prazna");
  if (!site.contact.phone.trim()) add("contact.phone", "ne smije biti prazan");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.contact.email)) {
    add("contact.email", "nije valjana e-mail adresa");
  }
  if (!isHttpUrl(site.contact.mapsUrl)) add("contact.mapsUrl", "mora biti potpuna HTTP(S) poveznica");

  const actionUrls: Array<[string, string | undefined]> = [
    ["contact.instagramUrl", site.contact.instagramUrl],
    ["contact.reservationUrl", site.contact.reservationUrl],
    ["contact.orderUrl", site.contact.orderUrl],
    ["contact.shopUrl", site.contact.shopUrl],
  ];
  for (const [path, value] of actionUrls) {
    if (value && !isActionUrl(value)) add(path, "mora biti sidro ili potpuna HTTP(S) poveznica");
  }
  if (site.contact.formEndpoint && !isHttpUrl(site.contact.formEndpoint)) {
    add("contact.formEndpoint", "mora biti potpuna HTTP(S) poveznica");
  }

  if (site.seo?.siteUrl && !isHttpUrl(site.seo.siteUrl)) {
    add("seo.siteUrl", "mora biti potpuna HTTP(S) poveznica");
  }
  if (site.seo?.allowIndexing && !site.seo.siteUrl) {
    add("seo.allowIndexing", "ne smije biti uključen bez produkcijske domene");
  }

  const photos = [site.media?.hero, ...(site.media?.gallery ?? [])].filter(
    (photo) => photo !== undefined,
  );
  photos.forEach((photo, index) => {
    if (!(photo.src.startsWith("/") || isHttpUrl(photo.src))) {
      add(`media.${index}.src`, "mora biti putanja iz public mape ili HTTP(S) URL");
    }
    if (!hasBothLanguages(photo.alt)) add(`media.${index}.alt`, "nedostaje HR ili EN alternativni tekst");
  });

  return issues;
}

export function assertSiteConfig(site: ClientSiteConfig, theme: ThemeDefinition) {
  const issues = validateSiteConfig(site, theme);
  if (issues.length === 0) return;

  const details = issues.map((issue) => `- ${issue.path}: ${issue.message}`).join("\n");
  throw new Error(`Neispravna konfiguracija za ${site.brandName}:\n${details}`);
}
