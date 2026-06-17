const REGIONS = [
  { code: 'us', label: 'United States' },
  { code: 'cn', label: 'China' },
  { code: 'jp', label: 'Japan' },
  { code: 'hk', label: 'Hong Kong' },
  { code: 'tw', label: 'Taiwan' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'kr', label: 'Korea' },
];

const IAP_MARKERS = [
  /offers?\s+in-app purchases?/i,
  /in-app purchases?/i,
  /app\s*\u5185\u8d2d/i,
  /\u5185\u8d2d/i,
  /\u81ea\u52a8\u7eed\u8d39/i,
  /\u8fde\u7eed\u5305\u6708/i,
  /\u8fde\u7eed\u5305\u5e74/i,
  /\u8ba2\u9605\u670d\u52a1/i,
  /\u53d6\u6d88\u8ba2\u9605/i,
  /subscription/i,
  /subscriptions/i,
  /auto-?renew/i,
  /recurring billing/i,
  /itunes account/i,
  /app store account/i,
];

function hasIapMarker(text = '') {
  return IAP_MARKERS.some((pattern) => pattern.test(text));
}

function dedupe(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function extractPriceSignals(text = '') {
  const patterns = [
    /(?:CNY|RMB)\s?\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?/gi,
    /\d+(?:\.\d+)?\s?(?:\u5143|\u4eba\u6c11\u5e01|month|mo|yr|year)/gi,
    /\d+\s?(?:\u5143|\u4eba\u6c11\u5e01)\s*[\/]\s*(?:\u6708|\u5e74)/gi,
    /\d+\s?(?:USD|HKD|JPY|KRW|TWD|EUR|GBP)\b/gi,
  ];

  const values = patterns.flatMap((pattern) => text.match(pattern) || []);
  return dedupe(values).slice(0, 8);
}

function inspectMetadata(app) {
  const text = [
    app?.formattedPrice,
    app?.description,
    app?.trackViewUrl,
    ...(app?.advisories || []),
  ]
    .filter(Boolean)
    .join(' ');

  if (app?.offersIAP === true) return 'yes';
  if (hasIapMarker(text)) return 'yes';
  return 'unknown';
}

async function fetchWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function extractIapItems(html) {
  try {
    const match = html.match(/<script type=\"application\/json\" id=\"serialized-server-data\">([\s\S]*?)<\/script>/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const info = data?.data?.[0]?.data?.shelfMapping?.information?.items || [];
    const row = info.find((item) => hasIapMarker(item?.title || ''));
    const pairs = (row?.items_V3 || []).filter(
      (item) => item?.$kind === 'textPair' && item.leadingText && item.trailingText,
    );
    if (pairs.length) {
      return pairs.map((item) => ({ name: item.leadingText, price: item.trailingText }));
    }

    const oldPairs = row?.items?.flatMap((item) => item?.textPairs || []) || [];
    return oldPairs
      .filter((item) => item?.[0] && item?.[1])
      .map(([name, price]) => ({ name, price }));
  } catch {
    return [];
  }
}

function normalizeApp(app) {
  return {
    trackId: app.trackId,
    bundleId: app.bundleId,
    trackName: app.trackName,
    artistName: app.artistName,
    formattedPrice: app.formattedPrice,
    offersIAP: app.offersIAP === true,
    version: app.version,
    trackViewUrl: app.trackViewUrl,
    artworkUrl100: app.artworkUrl100,
    primaryGenreName: app.primaryGenreName,
    description: app.description,
    iapState: inspectMetadata(app),
    priceRange: dedupe([
      ...(app.formattedPrice && app.formattedPrice !== 'Free' ? [app.formattedPrice] : []),
      ...extractPriceSignals(app.description || ''),
    ]),
  };
}

async function loadAppByRegion(trackId, region) {
  const lookupUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(trackId)}&country=${region.code}`;
  let lookupApp = null;
  try {
    const lookupRes = await fetchWithTimeout(lookupUrl, 5000);
    if (lookupRes.ok) {
      const lookupJson = await lookupRes.json();
      lookupApp = (lookupJson.results || [])[0] || null;
    }
  } catch {
    lookupApp = null;
  }

  let pageState = 'unavailable';
  let iapItems = [];
  let pageSignals = [];
  let pageStateIap = 'unknown';

  try {
    const appUrl = `https://apps.apple.com/${region.code}/app/id${trackId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(appUrl)}`;
    const response = await fetchWithTimeout(proxyUrl, 7000);

    if (response.ok) {
      const html = await response.text();
      iapItems = extractIapItems(html).slice(0, 8);
      pageSignals = extractPriceSignals(html);
      pageStateIap = iapItems.length > 0 || hasIapMarker(html) ? 'yes' : 'unknown';
      pageState = iapItems.length ? 'items' : 'page';
    }
  } catch {
    pageState = 'unavailable';
  }

  const metaState = inspectMetadata(lookupApp);
  return {
    area: region.code,
    areaName: region.label,
    formattedPrice: lookupApp?.formattedPrice || '',
    trackViewUrl: lookupApp?.trackViewUrl || `https://apps.apple.com/${region.code}/app/id${trackId}`,
    iapState: metaState === 'yes' || pageStateIap === 'yes' ? 'yes' : metaState,
    pageState,
    priceRange: dedupe([
      ...(lookupApp?.formattedPrice && lookupApp.formattedPrice !== 'Free' ? [lookupApp.formattedPrice] : []),
      ...extractPriceSignals(lookupApp?.description || ''),
      ...pageSignals,
    ]),
    iapItems,
  };
}

function buildComparison(regions = []) {
  const itemsByName = new Map();

  for (const region of regions) {
    for (const item of region.iapItems || []) {
      const name = item.name?.trim();
      if (!name) continue;
      if (!itemsByName.has(name)) itemsByName.set(name, []);
      itemsByName.get(name).push({
        area: region.area,
        areaName: region.areaName,
        price: item.price,
        formattedPrice: item.price,
        trackViewUrl: region.trackViewUrl,
      });
    }
  }

  const comparison = [
    {
      object: 'App',
      priceList: regions.map((region) => ({
        area: region.area,
        areaName: region.areaName,
        price: region.formattedPrice || '',
        formattedPrice: region.formattedPrice || '',
        trackViewUrl: region.trackViewUrl,
      })),
    },
  ];

  for (const [name, priceList] of itemsByName.entries()) {
    comparison.push({ object: name, priceList });
  }

  return comparison;
}

function buildSnapshot(app, regions, comparison) {
  const itemCount = comparison.filter((item) => item.object !== 'App').length;
  const filledRegions = regions.filter((region) => region.iapItems?.length || region.priceRange?.length);
  const highlight = filledRegions[0]?.area || 'us';

  return {
    appId: String(app.trackId),
    trackName: app.trackName,
    developer: app.artistName,
    appStoreUrl: app.trackViewUrl,
    appImage: app.artworkUrl100,
    capturedAt: Date.now(),
    dataSource: 'live',
    highlightArea: highlight,
    regionCount: filledRegions.length,
    objectCount: itemCount,
  };
}

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  const country = String(req.query.country || 'us').toLowerCase();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=180');

  if (!q) {
    res.status(400).json({ error: 'Missing q' });
    return;
  }

  const lookupUrl = /^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/.test(q)
    ? `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(q)}&country=${country}`
    : /^(?:id)?\d{5,}$/.test(q)
      ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(q.replace(/^id/, ''))}&country=${country}`
      : `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&country=${country}&entity=software&limit=5`;

  try {
    const lookupRes = await fetchWithTimeout(lookupUrl, 7000);
    if (!lookupRes.ok) {
      res.status(502).json({ error: `lookup ${lookupRes.status}` });
      return;
    }

    const lookupJson = await lookupRes.json();
    const apps = (lookupJson.results || [])
      .filter((app) => app.kind !== 'mac-software')
      .slice(0, 3)
      .map(normalizeApp);

    const results = await Promise.all(apps.map(async (app) => {
      const regions = await Promise.all(REGIONS.map((region) => loadAppByRegion(app.trackId, region)));
      const comparison = buildComparison(regions);
      const snapshot = buildSnapshot(app, regions, comparison);
      return {
        ...app,
        snapshot,
        regions,
        comparison,
      };
    }));

    res.status(200).json({
      areas: REGIONS.map((region) => ({ code: region.code, name: region.label })),
      apps: results,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error' });
  }
}
