# WebZaLokal Templates

Privatna radna kolekcija modularnih web-predložaka za ugostiteljske lokale. Sadrži zajedničku tehničku osnovu i devet različitih vizualnih smjerova — tri za restorane, tri za kafiće i tri za barove.

## Što je uključeno

| Kategorija | Vizualni smjerovi |
| --- | --- |
| Restoran | Fine dining, kvartovski bistro, fast food / štand |
| Kafić | Specialty minimal, kvartovski cozy, brunch / slastičarnica |
| Bar | Cocktail lounge, craft pub, night / event |

Svaki demo uključuje:

- responzivnu početnu stranicu;
- HR/EN prebacivanje sadržaja;
- predstavljanje lokala i ključnih prednosti;
- jelovnik, cjenik ili program;
- galeriju i podršku za stvarne fotografije;
- radno vrijeme, kartu, telefon, e-mail i Instagram;
- upitni obrazac spreman za spajanje na odabrani servis;
- osnovne SEO metapodatke;
- statički build prilagođen Cloudflare Workers Static Assets hostingu.

## Lokalno pokretanje

Zahtjev: Node.js 22.13 ili noviji.

```bash
npm install
npm run dev
```

Otvorite `http://localhost:3000`. Početna stranica prikazuje svih devet smjerova.

Provjera projekta:

```bash
npm run check
```

## Stvaranje novog klijentskog projekta

Kada stigne prvi klijent, ne treba ručno kopirati katalog niti brisati preostalih osam stilova. Generator stvara zaseban projekt s odabranom temom, jedinstvenim Cloudflare imenom, početnim sadržajem i sigurnim SEO postavkama:

```bash
npm run new-client -- \
  --theme restaurant-fine-dining \
  --slug ime-lokala \
  --name "Ime Lokala"
```

Dostupne teme:

```bash
npm run new-client -- --list-themes
```

Generator namjerno postavlja `seo.allowIndexing` na `false`. Google indeksiranje uključuje se tek nakon što su potvrđeni domena, sadržaj, cijene, radno vrijeme, fotografije i kontaktni obrazac.

Automatski test generatora:

```bash
npm run test:client
```

Test stvara privremeni probni lokal, pokreće njegov lint, produkcijski build i Cloudflare `deploy --dry-run`, a zatim briše isključivo tu privremenu mapu.

## Struktura

```text
app/                         rute, metapodaci i zajednički CSS
components/template-site.tsx univerzalna funkcionalna stranica lokala
scripts/create-client.mjs    generator zasebnog klijentskog projekta
lib/schema.ts                tipovi svih podataka
lib/themes.ts                devet dizajnerskih sustava
lib/validate-site.ts         provjera obaveznih podataka prije builda
lib/sample-sites.ts          demonstracijski sadržaj za devet lokala
public/                      fotografije, logotip i ostali statički materijali
docs/NOVI-KLIJENT.md         radni postupak za konkretnu narudžbu
wrangler.jsonc               Cloudflare Static Assets konfiguracija
```

## Kako nastaje stranica stvarnog klijenta

1. Ispuni se brief iz `docs/NOVI-KLIJENT.md` i odabere najbliži od devet smjerova.
2. Naredbom `npm run new-client` generira se zaseban projekt i za njega otvori privatni repozitorij.
3. U generiranom `lib/client.ts` zamijeni se privremeni sadržaj stvarnim podacima.
4. Fotografije se stave u `public/clients/<slug>/` i povežu preko `media.hero` i `media.gallery`.
5. Paleta, font, raspored i detalji dorade se prema fotografijama lokala i dizajnerskim komentarima.
6. U `wrangler.jsonc` promijeni se jedinstveni `name`, npr. `webzalokal-ime-lokala`.
7. Spoji se stvarni endpoint obrasca kroz `contact.formEndpoint`, provjere sve poveznice te pokrenu `npm run check` i deployment.

Svaki push i pull request dodatno prolazi GitHub Actions provjeru: instalacija iz zaključanog `package-lock.json`, lint, TypeScript/Next.js build, test generatora i Cloudflare dry-run.

Primjer dodavanja fotografija u konfiguraciju lokala:

```ts
media: {
  hero: {
    src: "/clients/ime-lokala/hero.jpg",
    alt: t("Interijer lokala", "Venue interior"),
    position: "center 60%",
  },
  gallery: [
    {
      src: "/clients/ime-lokala/galerija-01.jpg",
      alt: t("Glavni prostor", "Main room"),
    },
  ],
},
```

## Cloudflare deployment

Produkcijski build stvara statičke datoteke u `out/`, a Wrangler ih objavljuje kao Static Assets:

```bash
npm run build
npx wrangler deploy
```

Prije prvog deploymenta treba biti prijavljen Cloudflare račun (`npx wrangler login`) i u `wrangler.jsonc` postavljeno jedinstveno ime projekta.

## Važno

Svi nazivi, adrese, jelovnici i cijene u kolekciji su demonstracijski. Predložak je polazište, a ne gotova stranica koja se bez prilagodbe objavljuje za više klijenata.
