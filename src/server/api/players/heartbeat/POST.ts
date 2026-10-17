import type { Request, Response } from 'express';
import { playerStore } from '../store.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const ok = playerStore.heartbeat(sessionId);
    res.json({ ok });
  } catch (err) {
    console.error('players.heartbeat.error', err);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
}
