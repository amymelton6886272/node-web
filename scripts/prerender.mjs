/**
 * Prerender script — uses Playwright to generate static HTML for each route.
 * Prefers static HTML so public pages remain readable without waiting for client hydration.
 *
 * Usage: node scripts/prerender.mjs [base_url] [output_dir]
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const BASE_URL = process.argv[2] || 'http://127.0.0.1:4173';
const OUTPUT_DIR = process.argv[3] || join(projectRoot, 'deploy-build');

const ROUTES = [
  '/', '/about', '/contact', '/disclaimer', '/privacy',
  '/price', '/appfree', '/iap', '/icon',
  '/guides', '/knowledge', '/checklists', '/glossary', '/risk',
];

async function prerender() {
  console.log(`Prerendering ${ROUTES.length} routes from ${BASE_URL}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });

  let success = 0;
  let failed = 0;

  for (const route of ROUTES) {
    try {
      const page = await context.newPage();
      const url = `${BASE_URL}${route}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for React to render
      await page.waitForSelector('#root', { timeout: 10000 });

      // Get the full HTML
      const html = await page.content();

      // Determine output path
      const outPath = route === '/'
        ? join(OUTPUT_DIR, 'index.html')
        : join(OUTPUT_DIR, route.slice(1), 'index.html');

      // Ensure directory exists
      const dir = dirname(outPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      // Write the prerendered HTML
      writeFileSync(outPath, html, 'utf-8');
      console.log(`  ✓ ${route} → ${outPath.replace(projectRoot + '/', '')}`);

      await page.close();
      success++;
    } catch (err) {
      console.error(`  ✗ ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\nPrerender complete: ${success} success, ${failed} failed`);

  // Update sitemap lastmod dates
  try {
    const sitemapPath = join(OUTPUT_DIR, 'sitemap.xml');
    if (existsSync(sitemapPath)) {
      const today = new Date().toISOString().split('T')[0];
      let sitemap = readFileSync(sitemapPath, 'utf-8');
      sitemap = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
      writeFileSync(sitemapPath, sitemap, 'utf-8');
      console.log(`Sitemap updated: ${sitemapPath}`);
    }
  } catch (e) {
    console.warn('Sitemap update skipped:', e.message);
  }
}

prerender().catch(console.error);
