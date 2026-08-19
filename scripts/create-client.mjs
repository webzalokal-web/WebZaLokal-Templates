#!/usr/bin/env node

import {
  access,
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const themes = {
  "restaurant-fine-dining": { category: "restaurant", name: "Fine dining" },
  "restaurant-neighborhood-bistro": { category: "restaurant", name: "Kvartovski bistro" },
  "restaurant-fast-food": { category: "restaurant", name: "Fast food / štand" },
  "cafe-specialty-minimal": { category: "cafe", name: "Specialty minimal" },
  "cafe-neighborhood-cozy": { category: "cafe", name: "Kvartovski cozy" },
  "cafe-brunch-patisserie": { category: "cafe", name: "Brunch / slastičarnica" },
  "bar-cocktail-lounge": { category: "bar", name: "Cocktail lounge" },
  "bar-craft-pub": { category: "bar", name: "Craft pub" },
  "bar-night-event": { category: "bar", name: "Night / event" },
};

const categoryContent = {
  restaurant: {
    categoryLabel: { hr: "Restoran", en: "Restaurant" },
    eyebrow: { hr: "Okusi zbog kojih se vraćate", en: "Flavours worth returning for" },
    headline: { hr: "Mjesto kojem se gosti vraćaju.", en: "A place guests return to." },
    introduction: {
      hr: "Ovdje dolazi stvarni kratki opis restorana, njegove kuhinje i atmosfere.",
      en: "Add the real short description of the restaurant, its food, and atmosphere here.",
    },
    aboutTitle: { hr: "Naša priča počinje za stolom.", en: "Our story begins at the table." },
    aboutBody: {
      hr: "Zamijenite ovaj tekst stvarnom pričom lokala, sastojcima, ljudima i razlogom zbog kojeg je poseban.",
      en: "Replace this text with the venue story, its ingredients, people, and what makes it special.",
    },
    menuTitle: { hr: "Izdvojeno iz ponude", en: "Selected from the menu" },
    menuIntro: { hr: "Unesite aktualna jela i potvrđene cijene.", en: "Add current dishes and confirmed prices." },
    galleryTitle: { hr: "Prostor, detalji i tanjuri", en: "The room, details, and plates" },
    contactTitle: { hr: "Rezervirajte svoj stol.", en: "Reserve your table." },
    contactIntro: { hr: "Dodajte stvarne upute za rezervaciju.", en: "Add the real reservation instructions." },
    primaryCta: { hr: "Rezervirajte stol", en: "Reserve a table" },
    secondaryCta: { hr: "Pogledajte ponudu", en: "Explore the menu" },
    visualLabel: { hr: "Fotografija restorana", en: "Restaurant photography" },
    menu: [
      ["Jelo 01", "Dish 01", "Kratki opis sastojaka", "Short ingredient description", "0 €"],
      ["Jelo 02", "Dish 02", "Kratki opis sastojaka", "Short ingredient description", "0 €"],
      ["Jelo 03", "Dish 03", "Kratki opis sastojaka", "Short ingredient description", "0 €"],
      ["Desert", "Dessert", "Kratki opis deserta", "Short dessert description", "0 €"],
    ],
    features: [
      ["Kuhinja", "Cuisine", "Opišite glavni kulinarski smjer.", "Describe the main culinary direction."],
      ["Sastojci", "Ingredients", "Istaknite podrijetlo i kvalitetu.", "Highlight origin and quality."],
      ["Atmosfera", "Atmosphere", "Objasnite kakav doživljaj gost može očekivati.", "Explain the experience guests can expect."],
    ],
  },
  cafe: {
    categoryLabel: { hr: "Kafić", en: "Café" },
    eyebrow: { hr: "Vaša pauza u gradu", en: "Your pause in the city" },
    headline: { hr: "Dobra kava ima svoje mjesto.", en: "Good coffee has its place." },
    introduction: {
      hr: "Ovdje dolazi stvarni kratki opis kafića, ponude i atmosfere.",
      en: "Add the real short description of the café, its menu, and atmosphere here.",
    },
    aboutTitle: { hr: "Mjesto za još jednu šalicu.", en: "A place for one more cup." },
    aboutBody: {
      hr: "Zamijenite ovaj tekst stvarnom pričom kafića, ljudima i navikama gostiju.",
      en: "Replace this text with the café story, its people, and the habits of its guests.",
    },
    menuTitle: { hr: "Kava i još ponešto", en: "Coffee and a little more" },
    menuIntro: { hr: "Unesite aktualnu ponudu i potvrđene cijene.", en: "Add the current menu and confirmed prices." },
    galleryTitle: { hr: "Vaš omiljeni kut", en: "Your favourite corner" },
    contactTitle: { hr: "Svratite na kavu.", en: "Drop in for coffee." },
    contactIntro: { hr: "Dodajte stvarne informacije za goste.", en: "Add the real guest information." },
    primaryCta: { hr: "Pogledajte ponudu", en: "View the menu" },
    secondaryCta: { hr: "Kako do nas", en: "Find us" },
    visualLabel: { hr: "Fotografija kafića", en: "Café photography" },
    menu: [
      ["Espresso", "Espresso", "Opis zrna ili pripreme", "Bean or preparation details", "0 €"],
      ["Kava s mlijekom", "Coffee with milk", "Opis napitka", "Drink description", "0 €"],
      ["Hladni napitak", "Cold drink", "Opis napitka", "Drink description", "0 €"],
      ["Kolač dana", "Cake of the day", "Opis slastice", "Pastry description", "0 €"],
    ],
    features: [
      ["Kava", "Coffee", "Opišite zrna, pržionicu ili pripremu.", "Describe the beans, roaster, or preparation."],
      ["Ponuda", "Menu", "Istaknite kolače, brunch ili posebnu ponudu.", "Highlight cakes, brunch, or a special menu."],
      ["Atmosfera", "Atmosphere", "Objasnite kakav je ritam i osjećaj prostora.", "Explain the pace and feeling of the space."],
    ],
  },
  bar: {
    categoryLabel: { hr: "Bar", en: "Bar" },
    eyebrow: { hr: "Večer počinje ovdje", en: "The evening starts here" },
    headline: { hr: "Svaka dobra večer ima adresu.", en: "Every good night has an address." },
    introduction: {
      hr: "Ovdje dolazi stvarni kratki opis bara, pića, glazbe i atmosfere.",
      en: "Add the real short description of the bar, its drinks, music, and atmosphere here.",
    },
    aboutTitle: { hr: "Piće, glazba i pravi ljudi.", en: "Drinks, music, and the right people." },
    aboutBody: {
      hr: "Zamijenite ovaj tekst stvarnom pričom bara, programom i razlogom zbog kojeg se gosti vraćaju.",
      en: "Replace this text with the bar story, programme, and why guests keep coming back.",
    },
    menuTitle: { hr: "Pića i program", en: "Drinks and programme" },
    menuIntro: { hr: "Unesite aktualnu ponudu, događaje i cijene.", en: "Add current drinks, events, and prices." },
    galleryTitle: { hr: "Nakon zalaska", en: "After dark" },
    contactTitle: { hr: "Vidimo se za šankom.", en: "See you at the bar." },
    contactIntro: { hr: "Dodajte informacije o rezervacijama i programu.", en: "Add booking and programme information." },
    primaryCta: { hr: "Rezervirajte", en: "Book a table" },
    secondaryCta: { hr: "Pogledajte ponudu", en: "View the menu" },
    visualLabel: { hr: "Fotografija bara", en: "Bar photography" },
    menu: [
      ["Piće 01", "Drink 01", "Kratki opis", "Short description", "0 €"],
      ["Piće 02", "Drink 02", "Kratki opis", "Short description", "0 €"],
      ["Piće 03", "Drink 03", "Kratki opis", "Short description", "0 €"],
      ["Događaj", "Event", "Datum, vrijeme i program", "Date, time, and programme", "0 €"],
    ],
    features: [
      ["Ponuda", "Drinks", "Opišite glavnu ponudu pića.", "Describe the main drinks offering."],
      ["Program", "Programme", "Istaknite glazbu, kvizove ili događaje.", "Highlight music, quizzes, or events."],
      ["Atmosfera", "Atmosphere", "Objasnite kakvu večer gost može očekivati.", "Explain the kind of night guests can expect."],
    ],
  },
};

function usage() {
  return `
WebZaLokal generator klijenta

Uporaba:
  npm run new-client -- --theme <tema> --slug <slug> --name "Naziv lokala" [--output <mapa>]

Primjer:
  npm run new-client -- --theme restaurant-fine-dining --slug restoran-primjer --name "Restoran Primjer"

Opcije:
  --list-themes   Ispiši svih devet dostupnih tema
  --help          Prikaži ovu pomoć
`;
}

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--help" || key === "--list-themes") {
      result[key.slice(2)] = true;
      continue;
    }
    if (!["--theme", "--slug", "--name", "--output"].includes(key)) {
      throw new Error(`Nepoznata opcija: ${key}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Nedostaje vrijednost za ${key}`);
    result[key.slice(2)] = value;
    index += 1;
  }
  return result;
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function copyRepositoryFile(source, destination, outputRoot) {
  const sourcePath = resolve(repositoryRoot, source);
  const destinationPath = resolve(outputRoot, destination);
  await mkdir(dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
}

function createClientConfig({ category, name, slug, theme }) {
  const content = categoryContent[category];
  const menu = content.menu.map(([nameHr, nameEn, descriptionHr, descriptionEn, price]) => ({
    name: { hr: nameHr, en: nameEn },
    description: { hr: descriptionHr, en: descriptionEn },
    price,
  }));
  const features = content.features.map(([titleHr, titleEn, descriptionHr, descriptionEn]) => ({
    title: { hr: titleHr, en: titleEn },
    description: { hr: descriptionHr, en: descriptionEn },
  }));

  return {
    slug,
    themeSlug: theme,
    brandName: name,
    categoryLabel: content.categoryLabel,
    eyebrow: content.eyebrow,
    headline: content.headline,
    introduction: content.introduction,
    aboutTitle: content.aboutTitle,
    aboutBody: content.aboutBody,
    menuTitle: content.menuTitle,
    menuIntro: content.menuIntro,
    galleryTitle: content.galleryTitle,
    contactTitle: content.contactTitle,
    contactIntro: content.contactIntro,
    primaryCta: content.primaryCta,
    secondaryCta: content.secondaryCta,
    visualLabel: content.visualLabel,
    menu,
    features,
    openingHours: [
      { days: { hr: "Pon — Pet", en: "Mon — Fri" }, hours: "08:00 — 22:00" },
      { days: { hr: "Subota", en: "Saturday" }, hours: "09:00 — 23:00" },
      { days: { hr: "Nedjelja", en: "Sunday" }, hours: { hr: "Zatvoreno", en: "Closed" } },
    ],
    contact: {
      address: "Unesite stvarnu adresu, Grad",
      phone: "+385 1 000 0000",
      email: "kontakt@primjer.hr",
      mapsUrl: "https://maps.google.com/",
      instagramUrl: "https://instagram.com/",
      reservationUrl: "#kontakt",
    },
    seo: {
      siteUrl: "",
      title: { hr: `${name} | Službena stranica`, en: `${name} | Official website` },
      description: content.introduction,
      priceRange: "€€",
      allowIndexing: false,
    },
    locationLabel: { hr: "Grad", en: "City" },
  };
}

function clientLayoutSource() {
  return `import type { Metadata } from "next";
import type { ReactNode } from "react";
import { clientSite } from "@/lib/client";
import "./globals.css";

const siteUrl = clientSite.seo?.siteUrl || undefined;
const allowIndexing = Boolean(siteUrl && clientSite.seo?.allowIndexing);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: clientSite.seo?.title?.hr ?? clientSite.brandName,
  description: clientSite.seo?.description?.hr ?? clientSite.introduction.hr,
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  openGraph: {
    type: "website",
    locale: "hr_HR",
    title: clientSite.seo?.title?.hr ?? clientSite.brandName,
    description: clientSite.seo?.description?.hr ?? clientSite.introduction.hr,
    url: siteUrl,
    images: clientSite.seo?.ogImage ? [clientSite.seo.ogImage] : undefined,
  },
  robots: { index: allowIndexing, follow: allowIndexing },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
`;
}

function clientPageSource() {
  return `import { TemplateSite } from "@/components/template-site";
import { clientSite } from "@/lib/client";
import { getTheme } from "@/lib/themes";
import { assertSiteConfig } from "@/lib/validate-site";

function requireTheme(slug: string) {
  const selectedTheme = getTheme(slug);
  if (!selectedTheme) throw new Error(\`Nepoznata tema: \${slug}\`);
  return selectedTheme;
}

const theme = requireTheme(clientSite.themeSlug);
assertSiteConfig(clientSite, theme);

export default function Home() {
  return <TemplateSite demoMode={false} site={clientSite} theme={theme} />;
}
`;
}

function robotsSource() {
  return `import type { MetadataRoute } from "next";
import { clientSite } from "@/lib/client";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = clientSite.seo?.siteUrl;
  if (!siteUrl || !clientSite.seo?.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: \`\${siteUrl.replace(/\\\/$/, "")}/sitemap.xml\`,
  };
}
`;
}

function sitemapSource() {
  return `import type { MetadataRoute } from "next";
import { clientSite } from "@/lib/client";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = clientSite.seo?.siteUrl;
  if (!siteUrl || !clientSite.seo?.allowIndexing) return [];

  return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }];
}
`;
}

function notFoundSource(name) {
  const backLabel = JSON.stringify(`Natrag na ${name}`);
  return `import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>Stranica nije pronađena.</h1>
      <Link href="/">{${backLabel}}</Link>
    </main>
  );
}
`;
}

function clientWorkflowSource() {
  return `name: Quality checks

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      NEXT_TELEMETRY_DISABLED: "1"
      NPM_CONFIG_UPDATE_NOTIFIER: "false"
      WRANGLER_SEND_METRICS: "false"
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: ./node_modules/.bin/wrangler deploy --dry-run
`;
}

function clientReadme({ name, slug, theme, themeName }) {
  return `# ${name}

Samostalni WebZaLokal projekt generiran iz teme **${themeName}** (\`${theme}\`).

## Prije objave

1. Ispunite \`docs/BRIEF.md\`.
2. Zamijenite sav privremeni sadržaj u \`lib/client.ts\`.
3. Dodajte fotografije u \`public/clients/${slug}/\` i povežite ih kroz \`media\` konfiguraciju.
4. Spojite kontaktni obrazac preko \`contact.formEndpoint\`.
5. Unesite produkcijsku domenu u \`seo.siteUrl\`.
6. Tek nakon konačne provjere postavite \`seo.allowIndexing\` na \`true\`.
7. Pokrenite \`npm run check\` i Cloudflare dry-run.

## Naredbe

\`\`\`bash
npm install
npm run dev
npm run check
npx wrangler deploy --dry-run
npx wrangler deploy
\`\`\`

Cloudflare Worker ime: \`webzalokal-${slug}\`.
`;
}

async function writeText(outputRoot, path, content) {
  const destination = resolve(outputRoot, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

async function createProject(options) {
  const theme = themes[options.theme];
  if (!theme) throw new Error(`Nepoznata tema: ${options.theme}. Pokrenite --list-themes.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.slug ?? "")) {
    throw new Error("Slug mora koristiti mala slova, brojeve i jednostruke crtice.");
  }
  if (options.slug.length > 48) throw new Error("Slug smije imati najviše 48 znakova.");
  if (!options.name?.trim()) throw new Error("Naziv lokala je obavezan.");

  const outputRoot = resolve(
    process.cwd(),
    options.output ?? `../WebZaLokal-${options.slug}`,
  );
  if (await pathExists(outputRoot)) {
    throw new Error(`Odredišna mapa već postoji: ${outputRoot}`);
  }

  await mkdir(outputRoot, { recursive: true });

  const copiedFiles = [
    [".gitignore", ".gitignore"],
    ["app/globals.css", "app/globals.css"],
    ["components/template-site.tsx", "components/template-site.tsx"],
    ["docs/NOVI-KLIJENT.md", "docs/BRIEF.md"],
    ["eslint.config.mjs", "eslint.config.mjs"],
    ["lib/schema.ts", "lib/schema.ts"],
    ["lib/themes.ts", "lib/themes.ts"],
    ["lib/validate-site.ts", "lib/validate-site.ts"],
    ["next-env.d.ts", "next-env.d.ts"],
    ["next.config.ts", "next.config.ts"],
    ["public/favicon.svg", "public/favicon.svg"],
    ["tsconfig.json", "tsconfig.json"],
  ];
  await Promise.all(
    copiedFiles.map(([source, destination]) => copyRepositoryFile(source, destination, outputRoot)),
  );

  const packageJson = JSON.parse(await readFile(resolve(repositoryRoot, "package.json"), "utf8"));
  packageJson.name = `webzalokal-${options.slug}`;
  packageJson.version = "1.0.0";
  delete packageJson.scripts["new-client"];
  delete packageJson.scripts["test:client"];

  const packageLock = JSON.parse(await readFile(resolve(repositoryRoot, "package-lock.json"), "utf8"));
  packageLock.name = packageJson.name;
  packageLock.version = packageJson.version;
  packageLock.packages[""].name = packageJson.name;
  packageLock.packages[""].version = packageJson.version;

  const wrangler = JSON.parse(await readFile(resolve(repositoryRoot, "wrangler.jsonc"), "utf8"));
  wrangler.name = `webzalokal-${options.slug}`;

  const config = createClientConfig({
    category: theme.category,
    name: options.name.trim(),
    slug: options.slug,
    theme: options.theme,
  });

  await Promise.all([
    writeText(outputRoot, "package.json", JSON.stringify(packageJson, null, 2)),
    writeText(outputRoot, "package-lock.json", JSON.stringify(packageLock, null, 2)),
    writeText(outputRoot, "wrangler.jsonc", JSON.stringify(wrangler, null, 2)),
    writeText(
      outputRoot,
      "lib/client.ts",
      `import type { ClientSiteConfig } from "./schema";\n\nexport const clientSite: ClientSiteConfig = ${JSON.stringify(config, null, 2)};\n`,
    ),
    writeText(outputRoot, "app/layout.tsx", clientLayoutSource()),
    writeText(outputRoot, "app/page.tsx", clientPageSource()),
    writeText(outputRoot, "app/robots.ts", robotsSource()),
    writeText(outputRoot, "app/sitemap.ts", sitemapSource()),
    writeText(outputRoot, "app/not-found.tsx", notFoundSource(options.name.trim())),
    writeText(outputRoot, ".github/workflows/check.yml", clientWorkflowSource()),
    writeText(outputRoot, "README.md", clientReadme({
      name: options.name.trim(),
      slug: options.slug,
      theme: options.theme,
      themeName: theme.name,
    })),
    writeText(outputRoot, `public/clients/${options.slug}/.gitkeep`, ""),
  ]);

  return outputRoot;
}

try {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    process.exit(0);
  }
  if (options["list-themes"]) {
    for (const [slug, theme] of Object.entries(themes)) {
      process.stdout.write(`${slug.padEnd(36)} ${theme.name}\n`);
    }
    process.exit(0);
  }
  if (!options.theme || !options.slug || !options.name) {
    throw new Error(`Obavezni su --theme, --slug i --name.\n${usage()}`);
  }

  const output = await createProject(options);
  process.stdout.write(`\nKlijentski projekt je spreman:\n${output}\n\n`);
  process.stdout.write("Sljedeće: ispunite docs/BRIEF.md i lib/client.ts.\n");
} catch (error) {
  process.stderr.write(`\nGreška: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
