/**
 * Tienko Cross-Platform Auth Middleware
 *
 * Authenticates requests from partner Tienko ecosystem sites:
 *   tienko.io, tienko.exchange, tienko.market, tienko.ltd,
 *   thepeoplegame.io, curator.ltd
 *
 * Auth: Bearer token in Authorization header OR x-tienko-key header
 *   Authorization: Bearer <TIENKO_API_SECRET>
 *   x-tienko-key: <TIENKO_API_SECRET>
 *
 * The same TIENKO_API_SECRET must be configured on every partner site.
 * Never expose this key in frontend code — server-to-server only.
 *
 * CORS: Allows all Tienko ecosystem origins in production.
 *       In development, allows localhost on any port.
 */
import type { Request, Response, NextFunction } from 'express';
import { getSecret } from '#airo/secrets';

// All authorised Tienko ecosystem origins
const ALLOWED_ORIGINS = [
  'https://thetokengame.xyz',
  'https://www.thetokengame.xyz',
  'https://tienko.io',
  'https://www.tienko.io',
  'https://tienko.exchange',
  'https://www.tienko.exchange',
  'https://tienko.market',
  'https://www.tienko.market',
  'https://tienko.ltd',
  'https://www.tienko.ltd',
  'https://thepeoplegame.io',
  'https://www.thepeoplegame.io',
  'https://curator.ltd',
  'https://www.curator.ltd',
  // Preview / staging
  'https://thetokengame.com',
  'https://thegoldtokengame.com',
];

/** Apply CORS headers for Tienko ecosystem origins. */
export function tienkoCorsMw(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin ?? '';
  const isDev = process.env.NODE_ENV !== 'production';

  const allowed =
    ALLOWED_ORIGINS.includes(origin) ||
    (isDev && /^https?:\/\/localhost(:\d+)?$/.test(origin)) ||
    (isDev && /\.preview\.c37\.airoapp\.ai$/.test(origin));

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-tienko-key, x-tienko-platform',
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
}

/** Require a valid TIENKO_API_SECRET on protected endpoints. */
export function tienkoAuthMw(req: Request, res: Response, next: NextFunction) {
  const secret = getSecret('TIENKO_API_SECRET');
  if (!secret) {
    console.error('tienko-auth: TIENKO_API_SECRET not configured');
    res.status(503).json({ error: 'Cross-platform auth not configured' });
    return;
  }

  // Accept Bearer token or x-tienko-key header
  const authHeader = req.headers['authorization'] ?? '';
  const keyHeader = (req.headers['x-tienko-key'] as string | undefined) ?? '';

  const provided =
    authHeader.startsWith('Bearer ') ? authHeader.slice(7) : keyHeader;

  if (!provided || provided !== secret) {
    res.status(401).json({ error: 'Unauthorized — invalid or missing Tienko API key' });
    return;
  }

  // Attach the calling platform name for logging (optional header)
  (req as Request & { tienkoPlatform?: string }).tienkoPlatform =
    (req.headers['x-tienko-platform'] as string | undefined) ?? 'unknown';

  next();
}

/** Combined: CORS + auth. Use this on all /api/coins/* routes. */
export function tienkoMw(req: Request, res: Response, next: NextFunction) {
  tienkoCorsMw(req, res, () => tienkoAuthMw(req, res, next));
}
