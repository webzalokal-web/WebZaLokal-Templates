export type Language = "hr" | "en";

export type VenueCategory = "restaurant" | "cafe" | "bar";

export type LayoutVariant =
  | "editorial"
  | "bistro"
  | "street"
  | "minimal"
  | "cozy"
  | "brunch"
  | "cocktail"
  | "industrial"
  | "night";

export type LocalizedText = Record<Language, string>;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  muted: string;
  accent: string;
  accentStrong: string;
  contrast: string;
  border: string;
}

export interface ThemeDefinition {
  slug: string;
  category: VenueCategory;
  name: string;
  shortDescription: string;
  layout: LayoutVariant;
  colors: ThemeColors;
  displayFont: string;
  bodyFont: string;
  accentFont: string;
  radius: string;
  shadow: string;
}

export interface MenuItem {
  name: LocalizedText;
  description: LocalizedText;
  price: string;
  tag?: LocalizedText;
}

export interface FeatureItem {
  title: LocalizedText;
  description: LocalizedText;
}

export interface OpeningHours {
  days: LocalizedText;
  hours: string | LocalizedText;
}

export interface ContactConfig {
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
  instagramUrl?: string;
  reservationUrl?: string;
  orderUrl?: string;
  formEndpoint?: string;
}

export interface PhotoAsset {
  src: string;
  alt: LocalizedText;
  position?: string;
}

export interface MediaConfig {
  hero?: PhotoAsset;
  gallery?: PhotoAsset[];
}

export interface ClientSiteConfig {
  slug: string;
  themeSlug: string;
  brandName: string;
  categoryLabel: LocalizedText;
  eyebrow: LocalizedText;
  headline: LocalizedText;
  introduction: LocalizedText;
  aboutTitle: LocalizedText;
  aboutBody: LocalizedText;
  menuTitle: LocalizedText;
  menuIntro: LocalizedText;
  galleryTitle: LocalizedText;
  contactTitle: LocalizedText;
  contactIntro: LocalizedText;
  primaryCta: LocalizedText;
  secondaryCta: LocalizedText;
  visualLabel: LocalizedText;
  menu: MenuItem[];
  features: FeatureItem[];
  openingHours: OpeningHours[];
  contact: ContactConfig;
  media?: MediaConfig;
}
