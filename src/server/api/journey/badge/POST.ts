import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { journeyProfiles, journeyBadges } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

const BADGE_DEFS = [
  { badgeId: 'novice',      badgeName: 'Novice Badge',        stage: 1 },
  { badgeId: 'trader',      badgeName: 'Trader Badge',        stage: 2 },
  { badgeId: 'analyst',     badgeName: 'Analyst Badge',       stage: 3 },
  { badgeId: 'creator',     badgeName: 'Creator Badge',       stage: 4 },
  { badgeId: 'market',      badgeName: 'Market Badge',        stage: 5 },
  { badgeId: 'exchange',    badgeName: 'Exchange Badge',      stage: 6 },
  { badgeId: 'tokenomics',  badgeName: 'Tokenomics Degree',   stage: 7 },
];

export default async function handler(req: Request, res: Response) {
  const { wallet, badgeId } = req.body;
  if (!wallet || !badgeId) {
    return res.status(400).json({ error: 'wallet and badgeId required' });
  }

  const badgeDef = BADGE_DEFS.find(b => b.badgeId === badgeId);
  if (!badgeDef) {
    return res.status(400).json({ error: 'Unknown badgeId' });
  }

  try {
    // Check if already earned
    const [existing] = await db.select().from(journeyBadges)
      .where(and(
        eq(journeyBadges.walletAddress, wallet),
        eq(journeyBadges.badgeId, badgeId)
      )).limit(1);

    if (existing) {
      return res.json({ alreadyEarned: true, badge: existing });
    }

    // Award badge
    await db.insert(journeyBadges).values({
      walletAddress: wallet,
      badgeId: badgeDef.badgeId,
      badgeName: badgeDef.badgeName,
      stage: badgeDef.stage,
      siteEarned: 'thetokengame.xyz',
    });

    // Update profile stage + XP + badge count
    const [profile] = await db.select().from(journeyProfiles)
      .where(eq(journeyProfiles.walletAddress, wallet)).limit(1);

    if (profile) {
      const newStage = Math.max(profile.currentStage, badgeDef.stage + 1);
      const newXp = profile.xpPoints + (badgeDef.stage * 100);
      await db.update(journeyProfiles)
        .set({
          currentStage: Math.min(newStage, 7),
          xpPoints: newXp,
          totalBadges: profile.totalBadges + 1,
        })
        .where(eq(journeyProfiles.walletAddress, wallet));
    }

    const [newBadge] = await db.select().from(journeyBadges)
      .where(and(
        eq(journeyBadges.walletAddress, wallet),
        eq(journeyBadges.badgeId, badgeId)
      )).limit(1);

    return res.status(201).json({ awarded: true, badge: newBadge });
  } catch (err) {
    console.error('journey/badge POST error', err);
    return res.status(500).json({ error: 'Failed to award badge' });
  }
}
