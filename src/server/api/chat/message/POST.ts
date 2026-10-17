// POST /api/chat/message
// Body: { channel, username, countryCode, text }
import type { Request, Response } from 'express';
import { chatStore } from '../store.js';

// Simple rate-limit: max 3 messages per 5 s per IP
const rateLimiter = new Map<string, number[]>();
const RATE_WINDOW_MS = 5_000;
const RATE_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimiter.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (times.length >= RATE_MAX) return true;
  times.push(now);
  rateLimiter.set(ip, times);
  return false;
}

export default function handler(req: Request, res: Response) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '0.0.0.0';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Slow down — max 3 messages per 5 seconds' });
  }

  const { channel = 'global', username, countryCode = 'XX', text } = req.body as {
    channel?: string;
    username?: string;
    countryCode?: string;
    text?: string;
  };

  if (!username?.trim()) return res.status(400).json({ error: 'Username required' });
  if (!text?.trim()) return res.status(400).json({ error: 'Message text required' });

  // Curator channel is read-only for regular users
  if (channel === 'curator') {
    return res.status(403).json({ error: 'Curator channel is read-only' });
  }

  const result = chatStore.post({ channel, username: username.trim(), countryCode, text });
  if ('error' in result) return res.status(400).json(result);

  res.status(201).json(result);
}
