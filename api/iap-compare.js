import { queryIapCompare } from '../src/lib/iapCompareCore.js';

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  const country = String(req.query.country || 'us').toLowerCase();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=180');

  if (!q) {
    res.status(400).json({ error: 'Missing q' });
    return;
  }

  try {
    const result = await queryIapCompare(q, country);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    res.status(message.startsWith('lookup ') ? 502 : 500).json({ error: message });
  }
}
