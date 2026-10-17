import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { journeyProgress, journeyProfiles } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

// XP awarded per task completion
const TASK_XP: Record<string, number> = {
  visited_world_map: 10,
  registered_whitelist: 25,
  held_coin_7days: 50,
  joined_discord: 15,
  visited_stash: 10,
  connected_wallet: 20,
  viewed_edition: 5,
  earned_whitelist_approval: 40,
};

export default async function handler(req: Request, res: Response) {
  const { wallet, stage, taskKey } = req.body;
  if (!wallet || !stage || !taskKey) {
    return res.status(400).json({ error: 'wallet, stage, taskKey required' });
  }

  try {
    // Idempotent — don't double-count
    const [existing] = await db.select().from(journeyProgress)
      .where(and(
        eq(journeyProgress.walletAddress, wallet),
        eq(journeyProgress.taskKey, taskKey)
      )).limit(1);

    if (existing) {
      return res.json({ alreadyCompleted: true });
    }

    await db.insert(journeyProgress).values({ walletAddress: wallet, stage, taskKey });

    // Award XP
    const xp = TASK_XP[taskKey] ?? 5;
    const [profile] = await db.select().from(journeyProfiles)
      .where(eq(journeyProfiles.walletAddress, wallet)).limit(1);

    if (profile) {
      await db.update(journeyProfiles)
        .set({ xpPoints: profile.xpPoints + xp })
        .where(eq(journeyProfiles.walletAddress, wallet));
    } else {
      await db.insert(journeyProfiles).values({
        walletAddress: wallet,
        currentStage: 1,
        xpPoints: xp,
        totalBadges: 0,
      });
    }

    return res.status(201).json({ completed: true, xpAwarded: xp });
  } catch (err) {
    console.error('journey/progress POST error', err);
    return res.status(500).json({ error: 'Failed to record progress' });
  }
}
