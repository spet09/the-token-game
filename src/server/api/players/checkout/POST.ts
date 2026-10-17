import type { Request, Response } from 'express';
import { playerStore } from '../store.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    playerStore.checkout(sessionId);
    res.json({ ok: true });
  } catch (err) {
    console.error('players.checkout.error', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
}
