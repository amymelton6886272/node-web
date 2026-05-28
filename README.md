# Wolffy

Wolffy is a bilingual Apple / iOS toolkit and safety knowledge site built with Vite + React.

## Vercel deployment

Use these settings in Vercel:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `deploy-build`

The project includes `vercel.json` with the same build output directory and SPA fallback rewrite.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static output is generated in:

```text
deploy-build
```
