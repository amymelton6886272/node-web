import type { APIRoute } from 'astro';
import { queryIapCompare } from '../../lib/iapCompareCore.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const q = String(url.searchParams.get('q') || '').trim();
  const country = String(url.searchParams.get('country') || 'us').toLowerCase();

  if (!q) {
    return new Response(JSON.stringify({ error: 'Missing q' }), {
      status: 400,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60',
      },
    });
  }

  try {
    const result = await queryIapCompare(q, country);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=180',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), {
      status: message.startsWith('lookup ') ? 502 : 500,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }
};
