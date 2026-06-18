export const REGIONS = [
  { code: 'us', label: 'United States' },
  { code: 'cn', label: 'China' },
  { code: 'jp', label: 'Japan' },
  { code: 'hk', label: 'Hong Kong' },
  { code: 'tw', label: 'Taiwan' },
  { code: 'kr', label: 'Korea' },
  { code: 'in', label: 'India' },
  { code: 'ph', label: 'Philippines' },
  { code: 'pk', label: 'Pakistan' },
  { code: 'eg', label: 'Egypt' },
  { code: 'ng', label: 'Nigeria' },
  { code: 'tr', label: 'Turkey' },
  { code: 'br', label: 'Brazil' },
];

const compareCache = globalThis.__wolffyCompareCache || new Map();
if (!globalThis.__wolffyCompareCache) {
  globalThis.__wolffyCompareCache = compareCache;
}
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_VERSION = 'v5';
const APP17_BASE = 'https://app.17nas.com';
const APP_VBR_BASE = 'https://app.vbr.me';
const CNY_TO_USD_RATE = 0.147717;
const LIVE_RATES_FROM_CNY = {
  USD: 0.147717,
  CNY: 1,
  JPY: 23.69988,
  HKD: 1.157202,
  TWD: 4.666356,
  KRW: 223.713647,
  INR: 14.009723,
  PHP: 8.944544,
  PKR: 41.179377,
  EGP: 7.415808,
  NGN: 200.538985,
  TRY: 6.821282,
  BRL: 0.747496,
};
const AREA_TO_CURRENCY = {
  us: 'USD',
  cn: 'CNY',
  jp: 'JPY',
  hk: 'HKD',
  tw: 'TWD',
  kr: 'KRW',
  in: 'INR',
  ph: 'PHP',
  pk: 'PKR',
  eg: 'EGP',
  ng: 'NGN',
  tr: 'TRY',
  br: 'BRL',
};

const IAP_MARKERS = [
  /offers?\s+in-app purchases?/i,
  /in-app purchases?/i,
  /in-app purchase/i,
  /app\s*\u5185\u8d2d/i,
  /\u5185\u8d2d/i,
  /\u5185\u8d2d\u4e70/i,
  /\u8d2d\u4e70\u9879\u76ee/i,
  /\u81ea\u52a8\u7eed\u8d39/i,
  /\u8fde\u7eed\u5305\u6708/i,
  /\u8fde\u7eed\u5305\u5e74/i,
  /\u8ba2\u9605\u670d\u52a1/i,
  /\u53d6\u6d88\u8ba2\u9605/i,
  /\u30a2\u30d7\u30ea\u5185\u8ab2\u91d1/i,
  /\uc571\s*\ub0b4\s*\uad6c\uc785/i,
  /\u0e01\u0e32\u0e23\u0e0b\u0e37\u0e49\u0e2d\u0e20\u0e32\u0e22\u0e43\u0e19\u0e41\u0e2d\u0e1b/i,
  /compras?\s+dentro\s+do\s+app/i,
  /subscription/i,
  /subscriptions/i,
  /auto-?renew/i,
  /recurring billing/i,
  /itunes account/i,
  /app store account/i,
];

export function hasIapMarker(text = '') {
  return IAP_MARKERS.some((pattern) => pattern.test(text));
}

export function dedupe(values = []) {
  return [...new Set(values.filter(Boolean))];
}

export function extractPriceSignals(text = '') {
  const patterns = [
    /(?:CNY|RMB)\s?\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?/gi,
    /\d+(?:\.\d+)?\s?(?:\u5143|\u4eba\u6c11\u5e01|month|mo|yr|year)/gi,
    /\d+\s?(?:\u5143|\u4eba\u6c11\u5e01)\s*[\/]\s*(?:\u6708|\u5e74)/gi,
    /\d+\s?(?:USD|HKD|JPY|KRW|TWD|EUR|GBP)\b/gi,
  ];

  const values = patterns.flatMap((pattern) => text.match(pattern) || []);
  return dedupe(values).slice(0, 8);
}

function cleanLabel(value = '') {
  return String(value)
    .replace(/^[\s\-•·]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractDescriptionIapItems(text = '') {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const alias = new Map();
  const items = [];

  for (const line of lines) {
    const aliasMatch = line.match(/^[-•]?\s*([a-z])[-.)、]?\s*(.+)$/i);
    if (aliasMatch && !line.includes(':') && !line.includes('：')) {
      alias.set(aliasMatch[1].toLowerCase(), cleanLabel(aliasMatch[2]));
      continue;
    }

    const namedPrice = line.match(/^[-•]?\s*([a-z])[-.)、]?\s*([^：:]+)[：:]\s*(.+)$/i);
    if (!namedPrice) continue;

    const code = namedPrice[1].toLowerCase();
    const baseName = cleanLabel(namedPrice[2]) || alias.get(code) || `Subscription ${code.toUpperCase()}`;
    const detail = namedPrice[3];

    const typedOffers = [...detail.matchAll(/((?:连续)?包月|月卡|(?:连续)?包年|年卡|(?:连续)?包周|周卡|monthly|yearly|weekly)[^0-9]{0,8}(\d+(?:\.\d+)?\s*(?:元|人民币|USD|HKD|JPY|KRW|TWD|EUR|GBP)(?:\/(?:月|年|周|month|year|week))?)/gi)];
    if (typedOffers.length) {
      for (const match of typedOffers) {
        items.push({ name: `${baseName} - ${match[1]}`, price: match[2] });
      }
      continue;
    }

    const genericPrices = [...detail.matchAll(/(\d+(?:\.\d+)?\s*(?:元|人民币|USD|HKD|JPY|KRW|TWD|EUR|GBP)(?:\/(?:月|年|周|month|year|week))?)/gi)];
    for (const match of genericPrices) {
      items.push({ name: baseName, price: match[1] });
    }
  }

  return items.slice(0, 16);
}

export function inspectMetadata(app) {
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

export async function fetchWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function postJson(url, body, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`upstream ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function decodePossiblyMojibake(value = '') {
  const text = String(value || '');
  if (!/[ÃÂâåäæèé]/.test(text)) return text;
  try {
    return new TextDecoder('utf-8').decode(Uint8Array.from([...text].map((char) => char.charCodeAt(0) & 0xff)));
  } catch {
    return text;
  }
}

function formatMoney(item = {}) {
  if (item.formattedPrice) return item.formattedPrice;
  if (typeof item.price === 'number' && item.currency) return `${item.currency}${item.price}`;
  if (typeof item.price === 'number' && item.currencyCode) return `${item.currencyCode} ${item.price}`;
  if (typeof item.price === 'number') return String(item.price);
  return '';
}

function deriveCurrencyCode(area, value = '') {
  const text = String(value || '');
  if (/HK\$/i.test(text)) return 'HKD';
  if (/NT\$/i.test(text)) return 'TWD';
  if (/R\$/i.test(text)) return 'BRL';
  if (/EGP/i.test(text)) return 'EGP';
  if (/Rs\b/i.test(text)) return 'PKR';
  if (/₹/.test(text)) return 'INR';
  if (/₱/.test(text)) return 'PHP';
  if (/₺/.test(text)) return 'TRY';
  if (/₩|￦/.test(text)) return 'KRW';
  if (/¥/.test(text)) return area === 'cn' ? 'CNY' : 'JPY';
  if (/\$/.test(text)) return area === 'tw' ? 'TWD' : 'USD';
  return AREA_TO_CURRENCY[area] || '';
}

function parseLocalizedNumber(value) {
  const text = String(value || '').replace(/\s|\u00a0/g, '');
  if (!text) return null;
  if (/^(free|gratis|무료|免費|無料)$/i.test(text)) return 0;
  let numeric = text.replace(/[^\d.,-]/g, '');
  if (!numeric) return null;

  const lastComma = numeric.lastIndexOf(',');
  const lastDot = numeric.lastIndexOf('.');
  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      numeric = numeric.replace(/\./g, '').replace(',', '.');
    } else {
      numeric = numeric.replace(/,/g, '');
    }
  } else if (lastComma !== -1) {
    numeric = /,\d{1,2}$/.test(numeric) ? numeric.replace(',', '.') : numeric.replace(/,/g, '');
  } else if ((numeric.match(/\./g) || []).length > 1) {
    const parts = numeric.split('.');
    const decimal = parts.pop();
    numeric = `${parts.join('')}.${decimal}`;
  }

  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : null;
}

function enrichComparablePrice(area, formattedPrice, numericPrice = null) {
  const currencyCode = deriveCurrencyCode(area, formattedPrice);
  const normalizedPrice = typeof numericPrice === 'number' ? numericPrice : parseLocalizedNumber(formattedPrice);
  if (typeof normalizedPrice !== 'number') {
    return {
      numericPrice: null,
      currencyCode,
      cnyPrice: null,
      usdPrice: null,
    };
  }
  const cnyPrice = currencyCode && LIVE_RATES_FROM_CNY[currencyCode]
    ? normalizedPrice / LIVE_RATES_FROM_CNY[currencyCode]
    : null;
  return {
    numericPrice: normalizedPrice,
    currencyCode,
    cnyPrice,
    usdPrice: typeof cnyPrice === 'number' ? cnyPrice * CNY_TO_USD_RATE : null,
  };
}

function normalizeApp17Image(url = '') {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${APP17_BASE}${url}`;
}

async function loadApp17NasData(trackId) {
  try {
    const [snapshotResult, comparisonResult] = await Promise.allSettled([
      postJson(`${APP17_BASE}/app/getAppInfoSnapshot`, { appId: String(trackId) }, 10000),
      postJson(`${APP17_BASE}/app/getAppInfoComparison`, { appId: String(trackId) }, 10000),
    ]);

    const snapshotJson = snapshotResult.status === 'fulfilled' ? snapshotResult.value : null;
    const comparisonJson = comparisonResult.status === 'fulfilled' ? comparisonResult.value : null;
    const snapshot = snapshotJson?.code === 0 ? snapshotJson.data?.[0] : null;
    const comparisonRows = comparisonJson?.code === 0 ? comparisonJson.data || [] : [];
    if (!comparisonRows.length) return null;

    const comparison = comparisonRows.map((row) => ({
      object: row.object === '软件本体' ? 'App' : row.object,
      priceList: (row.priceList || []).map((price) => ({
        ...enrichComparablePrice(price.area, formatMoney(price), typeof price.cnyPrice === 'number' ? price.cnyPrice : (typeof price.price === 'number' ? price.price : null)),
        area: price.area,
        areaName: price.areaName,
        price: formatMoney(price),
        formattedPrice: formatMoney(price),
        trackViewUrl: snapshot?.appStoreUrl || '',
        currency: price.currency || '',
        currencyCode: price.currencyCode || deriveCurrencyCode(price.area, formatMoney(price)),
        cnyPrice: typeof price.cnyPrice === 'number' ? price.cnyPrice : null,
      })),
    }));

    return { snapshot, comparison };
  } catch {
    return null;
  }
}

async function loadAppVbrData(trackId) {
  try {
    const comparisonJson = await postJson(`${APP_VBR_BASE}/app/getAppInfoComparison`, { appId: String(trackId) }, 15000);
    const comparisonRows = comparisonJson?.code === 0 ? comparisonJson.data || [] : [];
    if (!comparisonRows.length) return null;

    const comparison = comparisonRows.map((row) => ({
      object: decodePossiblyMojibake(row.object) === '软件本体' ? 'App' : decodePossiblyMojibake(row.object),
      priceList: (row.priceList || []).map((price) => ({
        area: price.area,
        areaName: decodePossiblyMojibake(price.areaName),
        price: formatMoney(price),
        formattedPrice: formatMoney(price),
        numericPrice: typeof price.price === 'number' ? price.price : null,
        trackViewUrl: '',
        currency: decodePossiblyMojibake(price.currency || ''),
        currencyCode: price.currencyCode || deriveCurrencyCode(price.area, formatMoney(price)),
        cnyPrice: typeof price.cnyPrice === 'number' ? price.cnyPrice : null,
        usdPrice: typeof price.cnyPrice === 'number' ? price.cnyPrice * CNY_TO_USD_RATE : null,
      })),
    }));

    return { comparison };
  } catch {
    return null;
  }
}

export function extractIapItems(html) {
  try {
    const match = html.match(/<script type=\"application\/json\" id=\"serialized-server-data\">([\s\S]*?)<\/script>/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const product = data?.data?.[0]?.data || {};
    const shelfMapping = product?.shelfMapping || {};
    const shelfOrderings = product?.shelfOrderings || {};
    const interestingShelfNames = new Set(['subscriptions', 'inAppPurchases', ...Object.values(shelfOrderings).flat()]);
    const looksLikePrice = (value = '') => {
      const text = String(value || '').trim();
      if (!text) return false;
      if (/^(free|gratis|무료|免費|無料)$/i.test(text)) return true;
      return /(?:[$¥￥₩￦₹₱₺₦]|HK\$|NT\$|R\$|Rs\b|EGP|USD|CNY|JPY|KRW|TWD|HKD|INR|PHP|PKR|BRL|TRY|NGN)\s*[\d,.]+|[\d,.]+\s*(?:元|円|₩|￦|TL)/i.test(text);
    };

    const pushIfValid = (bucket, name, price) => {
      const cleanName = String(name || '').trim();
      const cleanPrice = String(price || '').trim();
      if (!cleanName || !cleanPrice) return;
      if (!looksLikePrice(cleanPrice)) return;
      bucket.push({ name: cleanName, price: cleanPrice });
    };

    const parsed = [];

    const extractPairsFromShelf = (shelf, shelfName = '') => {
      const bucket = [];
      const items = shelf?.items || [];
      for (const item of items) {
        const itemTitle = item?.title || item?.headline || item?.name || '';
        if (item?.$kind === 'textPair' && item.leadingText && item.trailingText) {
          pushIfValid(bucket, item.leadingText, item.trailingText);
        }
        for (const pair of item?.items_V3 || []) {
          if (pair?.$kind === 'textPair' && pair.leadingText && pair.trailingText) {
            pushIfValid(bucket, pair.leadingText, pair.trailingText);
          }
        }
        for (const pair of item?.textPairs || []) {
          if (Array.isArray(pair) && pair[0] && pair[1]) {
            pushIfValid(bucket, pair[0], pair[1]);
          }
        }
        for (const child of item?.items || []) {
          for (const pair of child?.textPairs || []) {
            if (Array.isArray(pair) && pair[0] && pair[1]) {
              pushIfValid(bucket, pair[0], pair[1]);
            }
          }
          for (const pair of child?.items_V3 || []) {
            if (pair?.$kind === 'textPair' && pair.leadingText && pair.trailingText) {
              pushIfValid(bucket, pair.leadingText, pair.trailingText);
            }
          }
        }
        if (item?.title && item?.offerLabel) {
          pushIfValid(bucket, item.title, item.offerLabel);
        }
        if (item?.name && item?.price) {
          pushIfValid(bucket, item.name, item.price);
        }
        if (itemTitle && item?.subtitle) {
          pushIfValid(bucket, itemTitle, item.subtitle);
        }
        if (itemTitle && item?.priceText) {
          pushIfValid(bucket, itemTitle, item.priceText);
        }
      }

      if (!bucket.length && shelfName && interestingShelfNames.has(shelfName) && shelf?.title) {
        const priceText = shelf?.subtitle || shelf?.metadata?.price || shelf?.offerLabel || shelf?.accessoryText;
        if (priceText) pushIfValid(bucket, shelf.title, priceText);
      }
      return bucket;
    };

    const infoRows = shelfMapping.information?.items || [];
    for (const row of infoRows) {
      const rowText = `${row?.title || ''} ${row?.subtitle || ''}`;
      const fromRow = extractPairsFromShelf(row);
      if (hasIapMarker(rowText) || fromRow.length) {
        parsed.push(...fromRow);
      }
    }

    for (const [name, shelf] of Object.entries(shelfMapping)) {
      if (interestingShelfNames.has(name) || /subscription|inapp|purchase/i.test(name) || hasIapMarker(`${shelf?.title || ''} ${JSON.stringify(shelf || {})}`)) {
        parsed.push(...extractPairsFromShelf(shelf, name));
      }
    }

    const info = shelfMapping.information?.items || [];
    const row = info.find((item) => hasIapMarker(item?.title || '') || extractPairsFromShelf(item).length);
    if (row) {
      parsed.push(...extractPairsFromShelf(row));
      for (const pair of row?.items_V3 || []) {
        if (pair?.$kind === 'textPair' && pair.leadingText && pair.trailingText) {
          pushIfValid(parsed, pair.leadingText, pair.trailingText);
        }
      }
      const oldPairs = row?.items?.flatMap((item) => item?.textPairs || []) || [];
      for (const pair of oldPairs) {
        if (pair?.[0] && pair?.[1]) pushIfValid(parsed, pair[0], pair[1]);
      }
    }

    return dedupe(parsed.map((item) => `${item.name}|||${item.price}`))
      .map((value) => {
        const [name, price] = value.split('|||');
        return { name, price };
      });
  } catch {
    return [];
  }
}

export function normalizeApp(app) {
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
    screenshotUrls: app.screenshotUrls || [],
    primaryGenreName: app.primaryGenreName,
    currentVersionReleaseDate: app.currentVersionReleaseDate || '',
    releaseNotes: app.releaseNotes || '',
    description: app.description,
    iapState: inspectMetadata(app),
    priceRange: dedupe([
      ...(app.formattedPrice && app.formattedPrice !== 'Free' ? [app.formattedPrice] : []),
      ...extractPriceSignals(app.description || ''),
    ]),
  };
}

export async function loadAppByRegion(trackId, region) {
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
    const appUrl = lookupApp?.trackViewUrl || `https://apps.apple.com/${region.code}/app/id${trackId}`;
    let response = await fetchWithTimeout(appUrl, 7000);
    if (!response.ok) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(appUrl)}`;
      response = await fetchWithTimeout(proxyUrl, 7000);
    }

    if (response.ok) {
      const html = await response.text();
      const looksLikeStorefront = /serialized-server-data|app-header|we-artwork__image|information-list__item|offers in-app purchases|in-app purchases/i.test(html);
      if (looksLikeStorefront) {
        iapItems = extractIapItems(html).slice(0, 8);
        pageSignals = extractPriceSignals(html);
        pageStateIap = iapItems.length > 0 || hasIapMarker(html) ? 'yes' : 'unknown';
        pageState = iapItems.length ? 'items' : 'page';
      }
    }
  } catch {
    pageState = 'unavailable';
  }

  if (!iapItems.length && lookupApp?.description) {
    iapItems = extractDescriptionIapItems(lookupApp.description);
    if (iapItems.length) {
      pageState = 'description';
      pageStateIap = 'yes';
    }
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

export function buildComparison(regions = []) {
  const itemsByName = new Map();

  const preferredAreas = ['cn', 'us', 'hk', 'tw', 'jp', 'kr', 'in', 'ph', 'pk', 'eg', 'ng', 'tr', 'br'];
  const tradToSimp = {
    '樂': '乐',
    '劇': '剧',
    '連': '连',
    '續': '续',
    '會員': '会员',
    '會': '会',
    '員': '员',
    '訂': '订',
    '閱': '阅',
    '體': '体',
    '軟': '软',
    '購': '购',
    '買': '买',
    '禮': '礼',
    '專': '专',
    '區': '区',
  };

  const simplifyText = (value = '') => {
    let result = String(value);
    for (const [trad, simp] of Object.entries(tradToSimp)) {
      result = result.replaceAll(trad, simp);
    }
    return result;
  };

  const normalizeItemKey = (value = '') => simplifyText(value)
    .toLowerCase()
    .replace(/[()（）]/g, '')
    .replace(/\s+/g, '')
    .replace(/[·•\-—_/]/g, '')
    .trim();

  const chooseDisplayName = (current, candidate, area) => {
    if (!current) return { name: candidate, area };
    const currentRank = preferredAreas.indexOf(current.area);
    const candidateRank = preferredAreas.indexOf(area);
    const safeCurrentRank = currentRank === -1 ? 999 : currentRank;
    const safeCandidateRank = candidateRank === -1 ? 999 : candidateRank;

    if (safeCandidateRank < safeCurrentRank) return { name: candidate, area };
    if (safeCandidateRank === safeCurrentRank && candidate.length < current.name.length) {
      return { name: candidate, area };
    }
    return current;
  };

  for (const region of regions) {
    for (const item of region.iapItems || []) {
      const name = item.name?.trim();
      if (!name) continue;
      const key = normalizeItemKey(name);
      if (!key) continue;
      if (!itemsByName.has(key)) {
        itemsByName.set(key, {
          display: { name, area: region.area },
          priceList: [],
        });
      }
      const bucket = itemsByName.get(key);
      bucket.display = chooseDisplayName(bucket.display, simplifyText(name), region.area);
      const normalizedPrice = {
        ...enrichComparablePrice(region.area, item.price),
        area: region.area,
        areaName: region.areaName,
        price: item.price,
        formattedPrice: item.price,
        trackViewUrl: region.trackViewUrl,
      };
      const existingIndex = bucket.priceList.findIndex((price) => price.area === region.area);
      if (existingIndex === -1) {
        bucket.priceList.push(normalizedPrice);
      } else {
        const existing = bucket.priceList[existingIndex];
        const existingComparable = typeof existing.cnyPrice === 'number' ? existing.cnyPrice : Number.POSITIVE_INFINITY;
        const nextComparable = typeof normalizedPrice.cnyPrice === 'number' ? normalizedPrice.cnyPrice : Number.POSITIVE_INFINITY;
        if (nextComparable < existingComparable) {
          bucket.priceList[existingIndex] = normalizedPrice;
        }
      }
    }
  }

  const comparison = [
    {
      object: 'App',
      priceList: regions.map((region) => ({
        ...enrichComparablePrice(region.area, region.formattedPrice || ''),
        area: region.area,
        areaName: region.areaName,
        price: region.formattedPrice || '',
        formattedPrice: region.formattedPrice || '',
        trackViewUrl: region.trackViewUrl,
      })),
    },
  ];

  for (const [, entry] of itemsByName.entries()) {
    comparison.push({ object: entry.display.name, priceList: entry.priceList });
  }

  return comparison;
}

export function buildSnapshot(app, regions, comparison) {
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

function buildSnapshotFromApp17(app, app17, comparison) {
  const comparisonAreas = new Set(
    comparison.flatMap((row) => row.priceList || []).map((price) => price.area).filter(Boolean),
  );

  return {
    appId: String(app.trackId),
    trackName: app.trackName,
    developer: app.artistName,
    appStoreUrl: app.trackViewUrl,
    appImage: app.artworkUrl100,
    capturedAt: app17?.snapshot?.capturedAt || Date.now(),
    dataSource: 'app17nas+apple',
    highlightArea: comparison[0]?.priceList?.[0]?.area || 'us',
    regionCount: comparisonAreas.size,
    objectCount: Math.max(0, comparison.length - 1),
  };
}

function buildSnapshotFromExternal(app, comparison, dataSource) {
  const comparisonAreas = new Set(
    comparison.flatMap((row) => row.priceList || []).map((price) => price.area).filter(Boolean),
  );

  return {
    appId: String(app.trackId),
    trackName: app.trackName,
    developer: app.artistName,
    appStoreUrl: app.trackViewUrl,
    appImage: app.artworkUrl100,
    capturedAt: Date.now(),
    dataSource,
    highlightArea: comparison[0]?.priceList?.[0]?.area || 'us',
    regionCount: comparisonAreas.size,
    objectCount: Math.max(0, comparison.length - 1),
  };
}

export async function queryIapCompare(q, country = 'us') {
  const cacheKey = `${CACHE_VERSION}::${country}::${q.trim().toLowerCase()}`;
  const cached = compareCache.get(cacheKey);
  const cacheStillFresh = cached && Date.now() - cached.time < CACHE_TTL_MS;
  const cacheLooksDegraded = cached?.value?.apps?.some((app) =>
    app?.snapshot?.dataSource === 'app17nas+apple'
    && (!Array.isArray(app.comparison) || app.comparison.filter((row) => row.object !== 'App').length === 0),
  );
  if (cacheStillFresh && !cacheLooksDegraded) {
    return cached.value;
  }

  const lookupUrl = /^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/.test(q)
    ? `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(q)}&country=${country}`
    : /^(?:id)?\d{5,}$/.test(q)
      ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(q.replace(/^id/, ''))}&country=${country}`
      : `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&country=${country}&entity=software&limit=5`;

  const lookupRes = await fetchWithTimeout(lookupUrl, 7000);
  if (!lookupRes.ok) {
    throw new Error(`lookup ${lookupRes.status}`);
  }

  const lookupJson = await lookupRes.json();
  const apps = (lookupJson.results || [])
    .filter((app) => app.kind !== 'mac-software')
    .slice(0, 3)
    .map(normalizeApp);

  const results = await Promise.all(apps.map(async (app) => {
    const appVbr = await loadAppVbrData(app.trackId);
    const appVbrHasDetailRows = appVbr?.comparison?.some((row) => row.object !== 'App' && (row.priceList || []).length > 0);
    if (appVbrHasDetailRows) {
      const snapshot = buildSnapshotFromExternal(app, appVbr.comparison, 'appVbr+apple');
      return {
        ...app,
        snapshot,
        regions: [],
        comparison: appVbr.comparison,
      };
    }

    const app17 = await loadApp17NasData(app.trackId);
    const app17HasDetailRows = app17?.comparison?.some((row) => row.object !== 'App' && (row.priceList || []).length > 0);
    if (app17HasDetailRows) {
      const snapshot = buildSnapshotFromApp17(app, app17, app17.comparison);
      return {
        ...app,
        artistName: app17.snapshot?.developer || app.artistName,
        trackViewUrl: app17.snapshot?.appStoreUrl || app.trackViewUrl,
        artworkUrl100: normalizeApp17Image(app17.snapshot?.appImage) || app.artworkUrl100,
        screenshotUrls: app17.snapshot?.screenshotUrls || app.screenshotUrls,
        description: app17.snapshot?.description || app.description,
        version: app17.snapshot?.version || app.version,
        releaseNotes: app17.snapshot?.releaseNotes || app.releaseNotes,
        currentVersionReleaseDate: app17.snapshot?.releaseDateText || app.currentVersionReleaseDate,
        snapshot,
        regions: [],
        comparison: app17.comparison,
      };
    }

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

  const payload = {
    areas: REGIONS.map((region) => ({ code: region.code, name: region.label })),
    apps: results,
  };

  compareCache.set(cacheKey, { time: Date.now(), value: payload });
  if (compareCache.size > 60) {
    const firstKey = compareCache.keys().next().value;
    if (firstKey) compareCache.delete(firstKey);
  }

  return payload;
}
