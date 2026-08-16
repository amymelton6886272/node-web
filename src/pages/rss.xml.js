import { articles, getArticlePath } from '../data/articles.js';
import { SITE } from '../astro/site.js';

export const prerender = true;

const escapeXml = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const rfc822 = (iso) => new Date(iso).toUTCString();

export async function GET() {
  const items = [...articles]
    .sort((a, b) => String(b.updatedAt || b.publishedAt).localeCompare(String(a.updatedAt || a.publishedAt)))
    .slice(0, 20)
    .map((a) => {
      const title = a.titleZh ? `${a.title} · ${a.titleZh}` : a.title;
      const desc = a.descriptionZh ? `${a.description}\n${a.descriptionZh}` : a.description;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE}${getArticlePath(a)}</link>
      <guid isPermaLink="true">${SITE}${getArticlePath(a)}</guid>
      <description>${escapeXml(desc)}</description>
      <pubDate>${rfc822(a.updatedAt || a.publishedAt)}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Storewise — App Store purchase safety guides</title>
    <link>${SITE}</link>
    <description>Bilingual (EN/中文) guides on App Store refunds, subscriptions, Apple Account security, family purchase controls, and scam recognition.</description>
    <language>en-zh</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
