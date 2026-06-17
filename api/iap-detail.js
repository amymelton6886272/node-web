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

async function fetchWithTimeout(url, timeoutMs = 6000) {
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

function extractPriceSignals(text = '') {
  const patterns = [
    /(?:¥|￥|CNY|RMB)\s?\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?/gi,
    /\d+(?:\.\d+)?\s?(?:\u5143|\u4eba\u6c11\u5e01|month|mo|yr|year)/gi,
    /\d+\s?(?:\u5143|\u4eba\u6c11\u5e01)\s*[\/]\s*(?:\u6708|\u5e74)/gi,
    /\d+\s?(?:USD|HKD|JPY|KRW|TWD|EUR|GBP)\b/gi,
  ];

  const values = patterns.flatMap((pattern) => text.match(pattern) || []);
  return [...new Set(values)].slice(0, 8);
}

export default async function handler(req, res) {
  const trackId = String(req.query.trackId || '').trim();
  const country = String(req.query.country || 'cn').toLowerCase();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');

  if (!trackId) {
    res.status(400).json({ error: 'Missing trackId' });
    return;
  }

  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(trackId)}&country=${country}`;
    let trackViewUrl = '';
    let formattedPrice = '';
    try {
      const lookupRes = await fetchWithTimeout(lookupUrl, 5000);
      if (lookupRes.ok) {
        const lookupJson = await lookupRes.json();
        const app = (lookupJson.results || [])[0];
        trackViewUrl = app?.trackViewUrl || '';
        formattedPrice = app?.formattedPrice || '';
      }
    } catch {
      trackViewUrl = '';
      formattedPrice = '';
    }

    const appUrl = `https://apps.apple.com/${country}/app/id${trackId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(appUrl)}`;
    const response = await fetchWithTimeout(proxyUrl);

    if (!response.ok) {
      res.status(200).json({
        pageState: 'unavailable',
        iapItems: [],
        priceRange: [],
        iapState: 'unknown',
        trackViewUrl,
        formattedPrice,
      });
      return;
    }

    const html = await response.text();
    const iapItems = extractIapItems(html).slice(0, 8);
    const priceRange = extractPriceSignals(html);
    const hasSignal = iapItems.length > 0 || hasIapMarker(html);

    res.status(200).json({
      pageState: iapItems.length ? 'items' : 'page',
      iapItems,
      priceRange,
      iapState: hasSignal ? 'yes' : 'unknown',
      trackViewUrl,
      formattedPrice,
    });
  } catch {
    res.status(200).json({
      pageState: 'unavailable',
      iapItems: [],
      priceRange: [],
      iapState: 'unknown',
      trackViewUrl: '',
      formattedPrice: '',
    });
  }
}
