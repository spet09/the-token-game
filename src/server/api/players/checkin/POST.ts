import type { Request, Response } from 'express';
import { playerStore } from '../store.js';

export default async function handler(req: Request, res: Response) {
  try {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '0.0.0.0';

    // Geo-lookup via ipapi.co (free, no key required, 1000 req/day)
    let country = 'Unknown';
    let countryCode = 'XX';
    let lat = 0;
    let lng = 0;

    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: { 'User-Agent': 'TheTokenGame/1.0' },
        signal: AbortSignal.timeout(3000),
      });
      if (geoRes.ok) {
        const geo = await geoRes.json() as {
          country_name?: string;
          country_code?: string;
          latitude?: number;
          longitude?: number;
        };
        country = geo.country_name || 'Unknown';
        countryCode = geo.country_code || 'XX';
        lat = geo.latitude ?? 0;
        lng = geo.longitude ?? 0;
      }
    } catch {
      // geo lookup failed — use defaults
    }

    const sessionId = playerStore.checkin({ ip, country, countryCode, lat, lng });

    res.json({ ok: true, sessionId, country, countryCode });
  } catch (err) {
    console.error('players.checkin.error', err);
    res.status(500).json({ error: 'Check-in failed' });
  }
}
