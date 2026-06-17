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

    const normalized = apps.map((app) => ({
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
      iapItems: [],
      pageState: 'idle',
    }));

    res.status(200).json({ apps: normalized });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error' });
  }
}
