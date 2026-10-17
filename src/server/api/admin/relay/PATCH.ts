/**
 * PATCH /api/admin/relay?path=...
 * Server-side relay — injects NEBULA_SECRET_KEY for write operations.
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';

export default async function handler(req: Request, res: Response) {
  const { path } = req.query as Record<string, string>;
  if (!path) return res.status(400).json({ error: 'Missing path param' });

  const secret = getSecret('NEBULA_SECRET_KEY');
  if (!secret) return res.status(503).json({ error: 'NEBULA_SECRET_KEY not configured' });

  const url = `http://localhost:${process.env.PORT ?? 3000}/api/admin/${path}`;

  try {
    const upstream = await fetch(url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Relay error', detail: String(e) });
  }
}
