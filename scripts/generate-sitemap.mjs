import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { articles } from '../src/data/articles.js';
import { getAllSeriesForIndex } from '../src/data/related.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const SITE = 'https://souk.eu.org';
const TODAY = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: TODAY },
  { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
  { path: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
  { path: '/privacy', changefreq: 'monthly', priority: '0.6', lastmod: TODAY },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.5', lastmod: TODAY },
  { path: '/terms', changefreq: 'monthly', priority: '0.6', lastmod: TODAY },
  { path: '/editorial', changefreq: 'monthly', priority: '0.5', lastmod: TODAY },
  { path: '/data-sources', changefreq: 'monthly', priority: '0.5', lastmod: TODAY },
  { path: '/guides', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
  { path: '/knowledge', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
  { path: '/articles', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
  { path: '/series', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
  { path: '/checklists', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { path: '/glossary', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
  { path: '/risk', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
];

const seriesRoutes = getAllSeriesForIndex().map((series) => ({
  path: series.href,
  changefreq: 'weekly',
  priority: '0.85',
  lastmod: series.latestUpdated || TODAY,
}));

const articleRoutes = articles.map((article) => ({
  path: `/articles/${article.slug}`,
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: article.updatedAt || TODAY,
}));

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const urls = [...staticRoutes, ...seriesRoutes, ...articleRoutes]
  .map(({ path, lastmod, changefreq, priority }) => [
    '  <url>',
    `    <loc>${xmlEscape(SITE + path)}</loc>`,
    `    <lastmod>${xmlEscape(lastmod)}</lastmod>`,
    `    <changefreq>${xmlEscape(changefreq)}</changefreq>`,
    `    <priority>${xmlEscape(priority)}</priority>`,
    '  </url>',
  ].join('\n'))
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outPath = join(projectRoot, 'public', 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf8');
console.log(`Generated ${outPath} (${staticRoutes.length + seriesRoutes.length + articleRoutes.length} URLs)`);
