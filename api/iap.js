const IAP_MARKERS = [
  /offers?\s+in-app purchases?/i,
  /in-app purchases?/i,
  /app\s*\u5185\u8d2d/i,
  /\u5185\u8d2d/i,
];

function hasIapMarker(text = '') {
  return IAP_MARKERS.some((pattern) => pattern.test(text));
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

async function fetchAppPage(appUrl) {
  const res = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(appUrl)}`);
  if (!res.ok) throw new Error(`page ${res.status}`);
  return res.text();
}

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  const country = String(req.query.country || 'cn').toLowerCase();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');

  if (!q) {
    res.status(400).json({ error: 'Missing q' });
    return;
  }

  const lookupUrl = /^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/.test(q)
    ? `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(q)}&country=${country}`
    : /^(?:id)?\d{5,}$/.test(q)
      ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(q.replace(/^id/, ''))}&country=${country}`
      : `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&country=${country}&entity=software&limit=8`;

  try {
    const lookupRes = await fetch(lookupUrl);
    if (!lookupRes.ok) {
      res.status(502).json({ error: `lookup ${lookupRes.status}` });
      return;
    }

    const lookupJson = await lookupRes.json();
    const apps = (lookupJson.results || []).filter((app) => app.kind !== 'mac-software').slice(0, 5);

    const enriched = await Promise.all(
      apps.map(async (app) => {
        const base = {
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
        };

        if (!app.trackId) {
          return { ...base, iapState: base.offersIAP ? 'yes' : 'unknown', iapItems: [] };
        }

        try {
          const appUrl = `https://apps.apple.com/${country}/app/id${app.trackId}`;
          const html = await fetchAppPage(appUrl);
          const iapItems = extractIapItems(html).slice(0, 8);
          const hasSignal = iapItems.length > 0 || hasIapMarker(html);

          return {
            ...base,
            iapState: hasSignal || base.offersIAP ? 'yes' : 'no',
            iapItems,
            pageState: iapItems.length ? 'items' : 'page',
          };
        } catch {
          return {
            ...base,
            iapState: base.offersIAP ? 'yes' : 'unknown',
            iapItems: [],
            pageState: 'unavailable',
          };
        }
      }),
    );

    res.status(200).json({ apps: enriched });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error' });
  }
}
