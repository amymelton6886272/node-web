import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { articles } from '../src/data/articles.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const SITE = 'https://souk.eu.org';

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: '2026-07-14' },
  { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: '2026-07-14' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: '2026-07-14' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.6', lastmod: '2026-07-14' },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.5', lastmod: '2026-07-14' },
  { path: '/terms', changefreq: 'monthly', priority: '0.6', lastmod: '2026-07-14' },
  { path: '/editorial', changefreq: 'monthly', priority: '0.5', lastmod: '2026-07-14' },
  { path: '/data-sources', changefreq: 'monthly', priority: '0.5', lastmod: '2026-07-14' },
  { path: '/price', changefreq: 'weekly', priority: '0.9', lastmod: '2026-07-14' },
  { path: '/appfree', changefreq: 'daily', priority: '0.9', lastmod: '2026-07-14' },
  { path: '/iap', changefreq: 'weekly', priority: '0.8', lastmod: '2026-07-14' },
  { path: '/icon', changefreq: 'weekly', priority: '0.7', lastmod: '2026-07-14' },
  { path: '/ip', changefreq: 'monthly', priority: '0.7', lastmod: '2026-07-14' },
  { path: '/address', changefreq: 'monthly', priority: '0.6', lastmod: '2026-07-14' },
  { path: '/guides', changefreq: 'weekly', priority: '0.9', lastmod: '2026-07-14' },
  { path: '/knowledge', changefreq: 'weekly', priority: '0.9', lastmod: '2026-07-14' },
  { path: '/articles', changefreq: 'weekly', priority: '0.9', lastmod: '2026-07-14' },
  { path: '/checklists', changefreq: 'weekly', priority: '0.8', lastmod: '2026-07-14' },
  { path: '/glossary', changefreq: 'monthly', priority: '0.7', lastmod: '2026-07-14' },
  { path: '/risk', changefreq: 'monthly', priority: '0.7', lastmod: '2026-07-14' },
  { path: '/subcost', changefreq: 'weekly', priority: '0.9', lastmod: '2026-07-15' },
  { path: '/trial', changefreq: 'weekly', priority: '0.9', lastmod: '2026-07-15' },
];

const articleRoutes = articles.map((article) => ({
  path: `/articles/${article.slug}`,
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: article.updatedAt,
}));

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const urls = [...staticRoutes, ...articleRoutes]
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
console.log(`Generated ${outPath}`);
