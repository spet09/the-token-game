import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { journeyProfiles, journeyBadges, journeyProgress } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { wallet } = req.query;
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'wallet query param required' });
  }

  try {
    // Get or create profile
    let [profile] = await db.select().from(journeyProfiles)
      .where(eq(journeyProfiles.walletAddress, wallet)).limit(1);

    if (!profile) {
      await db.insert(journeyProfiles).values({
        walletAddress: wallet,
        currentStage: 1,
        xpPoints: 0,
        totalBadges: 0,
      });
      [profile] = await db.select().from(journeyProfiles)
        .where(eq(journeyProfiles.walletAddress, wallet)).limit(1);
    }

    const badges = await db.select().from(journeyBadges)
      .where(eq(journeyBadges.walletAddress, wallet));

    const progress = await db.select().from(journeyProgress)
      .where(eq(journeyProgress.walletAddress, wallet));

    return res.json({ profile, badges, progress });
  } catch (err) {
    console.error('journey/profile GET error', err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
}
