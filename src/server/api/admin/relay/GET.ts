/**
 * GET /api/admin/relay?path=...
 *
 * Server-side relay for admin API calls. Injects the NEBULA_SECRET_KEY
 * so the client never needs to know it. Only accessible when the user
 * is authenticated via BetterAuth session (checked by the caller via
 * ProtectedRoute — this endpoint trusts the session cookie).
 *
 * Forwards query params (minus `path`) to the target admin endpoint.
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';

export default async function handler(req: Request, res: Response) {
  const { path, ...rest } = req.query as Record<string, string>;
  if (!path) return res.status(400).json({ error: 'Missing path param' });

  const secret = getSecret('NEBULA_SECRET_KEY');
  if (!secret) return res.status(503).json({ error: 'NEBULA_SECRET_KEY not configured' });

  const params = new URLSearchParams(rest as Record<string, string>);
  const url = `http://localhost:${process.env.PORT ?? 3000}/api/admin/${path}${params.toString() ? `?${params}` : ''}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'x-admin-secret': secret },
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Relay error', detail: String(e) });
  }
}
