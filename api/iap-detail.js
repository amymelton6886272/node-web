const IAP_MARKERS = [
  /offers?\s+in-app purchases?/i,
  /in-app purchases?/i,
  /app\s*\u5185\u8d2d/i,
  /\u5185\u8d2d/i,
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
    const appUrl = `https://apps.apple.com/${country}/app/id${trackId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(appUrl)}`;
    const response = await fetchWithTimeout(proxyUrl);

    if (!response.ok) {
      res.status(200).json({ pageState: 'unavailable', iapItems: [], iapState: 'unknown' });
      return;
    }

    const html = await response.text();
    const iapItems = extractIapItems(html).slice(0, 8);
    const hasSignal = iapItems.length > 0 || hasIapMarker(html);

    res.status(200).json({
      pageState: iapItems.length ? 'items' : 'page',
      iapItems,
      iapState: hasSignal ? 'yes' : 'unknown',
    });
  } catch {
    res.status(200).json({ pageState: 'unavailable', iapItems: [], iapState: 'unknown' });
  }
}
