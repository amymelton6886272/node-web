# Storewise

Storewise is a bilingual Apple / iOS toolkit and safety knowledge site built with Astro + React islands.

## Vercel deployment

Use these settings in Vercel:

- Framework Preset: `Astro`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `deploy-build`

The project includes `vercel.json` with the same build output directory and static asset headers. No SPA fallback rewrite is needed because Astro generates one HTML page per route.

## Local development

```bash
npm install
npm run dev
```

## AdSense configuration

Copy `.env.example` to `.env` and fill in the slot ID created in your AdSense dashboard:

```text
VITE_ADSENSE_CLIENT=ca-pub-3968202495808020
VITE_ADSENSE_SLOT=your_ad_slot_id
```

Ad units are rendered only after meaningful page content. Development builds show a placeholder instead of requesting live ads.

Current publisher-support pages:

- `/about`
- `/contact`
- `/privacy`
- `/disclaimer`
- `/terms`
- `/editorial`
- `/data-sources`

## Build

```bash
npm run build
```

The static output is generated in:

```text
deploy-build
```

`npm run build` automatically runs `npm run sitemap` first. The sitemap is generated from the fixed site routes plus `src/data/articles.js`, so new articles only need to be added in one data file.

## Preview

```bash
npm run preview:only -- --port 4173
```
