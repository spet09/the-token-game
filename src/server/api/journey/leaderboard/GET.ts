import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { journeyProfiles } from '../../../db/schema.js';
import { desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const leaders = await db.select().from(journeyProfiles)
      .orderBy(desc(journeyProfiles.xpPoints))
      .limit(50);

    return res.json({ leaders });
  } catch (err) {
    console.error('journey/leaderboard GET error', err);
    return res.status(500).json({ error: 'Failed to load leaderboard' });
  }
}
