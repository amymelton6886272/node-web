import { readFileSync, writeFileSync } from 'node:fs';
import { articles } from '../src/data/articles.js';

const NEW_SLUGS = [
  'fake-apple-support-refund-scams-how-to-verify',
  'apple-account-recovery-locked-out-guide',
  'passkeys-apple-account-security-upgrade-2026',
  'subscription-dark-patterns-recognition-guide',
  'prevent-accidental-in-app-purchases-complete-setup',
  'app-store-review-manipulation-fake-ratings-guide',
];

const CAT_COLORS = {
  Security: ['#059669', '#34d399', '#ecfdf5', '#d1fae5'],
  'Account Safety': ['#2563eb', '#60a5fa', '#eff6ff', '#dbeafe'],
  Family: ['#d97706', '#fbbf24', '#fffbeb', '#fef3c7'],
  Subscriptions: ['#7c3aed', '#a78bfa', '#f5f3ff', '#ede9fe'],
  'App Safety': ['#dc2626', '#f87171', '#fef2f2', '#fee2e2'],
};

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// split a title into up to 2 lines for the og card
function wrap(title, max1 = 46, max2 = 60) {
  if (title.length <= max1) return [title, ''];
  const words = title.split(' ');
  let l1 = '';
  for (const w of words) {
    if ((l1 + ' ' + w).trim().length > max1) break;
    l1 = (l1 + ' ' + w).trim();
  }
  let l2 = title.slice(l1.length).trim();
  if (l2.length > max2) {
    const cut = l2.lastIndexOf(' ', max2);
    l2 = l2.slice(0, cut > max2 * 0.6 ? cut : max2) + '…';
  }
  return [l1, l2];
}

for (const a of articles) {
  if (!NEW_SLUGS.includes(a.slug)) continue;
  const cat = a.category;
  const [c1, c2, bg1, bg2] = CAT_COLORS[cat] || ['#475569', '#94a3b8', '#f8fafc', '#e2e8f0'];
  const [l1, l2] = wrap(a.title);
  const desc = a.description.length > 150 ? a.description.slice(0, 147) + '…' : a.description;

  // ---- OG 1200x630 (dark brand style like existing) ----
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0e1118"/>
      <stop offset="55%" style="stop-color:#1a1f2e"/>
      <stop offset="100%" style="stop-color:#172554"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#fb7185"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="140" r="220" fill="#f59e0b" opacity="0.10"/>
  <circle cx="1100" cy="520" r="160" fill="#60a5fa" opacity="0.07"/>
  <circle cx="80" cy="560" r="130" fill="#f59e0b" opacity="0.06"/>
  <rect x="0" y="0" width="8" height="630" fill="url(#accent)"/>
  <text x="64" y="120" font-size="22" font-weight="700" fill="#f59e0b" font-family="Segoe UI, -apple-system, sans-serif" letter-spacing="3">STOREWISE · ${esc(cat.toUpperCase())}</text>
  <text x="62" y="196" font-size="52" font-weight="800" fill="#e6e9f3" font-family="Segoe UI, -apple-system, sans-serif">${esc(l1)}</text>${l2 ? `<text x="64" y="280" fill="#e5e9f2" font-size="34" font-weight="700" font-family="Segoe UI, -apple-system, sans-serif">${esc(l2)}</text>` : ''}
  <line x1="64" y1="430" x2="1136" y2="430" stroke="#293244" stroke-width="1"/>
  <text x="64" y="472" font-size="18" fill="#9aa6bb" font-family="Segoe UI, -apple-system, sans-serif">${esc(desc)}</text>
  <text x="64" y="540" font-size="16" fill="#697386" font-family="Segoe UI, -apple-system, sans-serif">${esc(a.readTime)} read · Updated ${a.updatedAt} · Check before you pay</text>
</svg>`;
  writeFileSync(`public/og/${a.slug}.svg`, og, 'utf8');

  // ---- Hero 800x320 (category color, light style like existing) ----
  const circles = Array.from({ length: 6 }, (_, i) => {
    const x = 120 + ((i * 173) % 700), y = 40 + ((i * 97) % 240), r = 68 + ((i * 31) % 44);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? c2 : c1}" opacity="0.1"/>`;
  }).join('');
  const rects = Array.from({ length: 3 }, (_, i) => {
    const x = 218 + i * 140, y = 76 + (i % 2) * 123, s = 87 + i * 5;
    return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="12" fill="none" stroke="${c1}" stroke-width="2" opacity="0.15" transform="rotate(${40 + i * 43} ${x + s / 2} ${y + s / 2})"/>`;
  }).join('');
  const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
  <defs>
    <linearGradient id="bg-${a.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="100%" style="stop-color:${bg2}"/>
    </linearGradient>
    <linearGradient id="acc-${a.slug}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="320" fill="url(#bg-${a.slug})" rx="20"/>
  ${circles}${rects}
  <rect x="40" y="40" width="8" height="240" fill="url(#acc-${a.slug})" rx="4"/>
  <text x="72" y="86" font-size="15" font-weight="700" fill="${c1}" font-family="Segoe UI, -apple-system, sans-serif" letter-spacing="2">STOREWISE · ${esc(cat.toUpperCase())}</text>
  <text x="72" y="136" font-size="30" font-weight="800" fill="#1f2937" font-family="Segoe UI, -apple-system, sans-serif">${esc(l1)}</text>
  ${l2 ? `<text x="72" y="174" font-size="21" font-weight="700" fill="#374151" font-family="Segoe UI, -apple-system, sans-serif">${esc(l2)}</text>` : ''}
  <text x="72" y="246" font-size="14" fill="#6b7280" font-family="Segoe UI, -apple-system, sans-serif">${esc(desc)}</text>
</svg>`;
  writeFileSync(`public/images/articles/${a.slug}.svg`, hero, 'utf8');
  console.log('generated:', a.slug);
}
