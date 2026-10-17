import type { Request, Response } from 'express';
import { QUESTS } from '../../../../data/quests';

/**
 * GET /api/quests/:questId
 * Returns a single quest by ID.
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { questId } = req.params;
    const quest = QUESTS.find((q) => q.id === questId || q.slug === questId);
    if (!quest) return res.status(404).json({ error: 'Quest not found' });
    res.json({ quest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest', message: String(error) });
  }
}
