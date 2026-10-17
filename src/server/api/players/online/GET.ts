import type { Request, Response } from 'express';
import { playerStore } from '../store.js';

export default async function handler(_req: Request, res: Response) {
  try {
    const counts = playerStore.getCountryCounts();
    const total = playerStore.getOnline().length;

    res.json({ total, countries: counts });
  } catch (err) {
    console.error('players.online.error', err);
    res.status(500).json({ error: 'Failed to fetch online players' });
  }
}
