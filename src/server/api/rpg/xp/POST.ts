/**
 * POST /api/rpg/xp
 * Award XP to a wallet. Handles level-ups and ability unlocks automatically.
 * Body: { walletAddress, source, sourceRef?, platform?, xpOverride? }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { rpgCharacters, rpgXpLog, rpgAbilities } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { XP_AWARDS, levelFromXp, xpToNextLevel, xpProgress, ABILITIES_CATALOG } from '../../../../lib/rpg/levels.js';

export default async function handler(req: Request, res: Response) {
  const { walletAddress, source, sourceRef, platform, xpOverride } = req.body as {
    walletAddress: string;
    source: string;
    sourceRef?: string;
    platform?: string;
    xpOverride?: number;
  };

  if (!walletAddress || !source) {
    res.status(400).json({ error: 'walletAddress and source required' });
    return;
  }

  const [character] = await db.select().from(rpgCharacters).where(eq(rpgCharacters.walletAddress, walletAddress)).limit(1);
  if (!character) {
    res.status(404).json({ error: 'Character not found — create one first' });
    return;
  }

  const xpKey = source.startsWith('pack_') ? source : source;
  const xpAmount = xpOverride ?? XP_AWARDS[xpKey] ?? 10;

  const newTotalXp = character.totalXpEarned + xpAmount;
  const levelBefore = character.level;
  const levelAfter = levelFromXp(newTotalXp);
  const newXpToNext = xpToNextLevel(levelAfter);
  const leveledUp = levelAfter > levelBefore;
  const powerPointsGained = leveledUp ? (levelAfter - levelBefore) : 0;

  // Update character
  await db.update(rpgCharacters).set({
    totalXpEarned: newTotalXp,
    level: levelAfter,
    xp: newTotalXp,
    xpToNextLevel: newXpToNext,
    powerPoints: character.powerPoints + powerPointsGained,
    updatedAt: new Date(),
  }).where(eq(rpgCharacters.walletAddress, walletAddress));

  // Log XP event
  await db.insert(rpgXpLog).values({
    walletAddress,
    xpAwarded: xpAmount,
    source,
    sourceRef: sourceRef ?? null,
    platform: platform ?? 'thetokengame.xyz',
    levelBefore,
    levelAfter,
  });

  // Auto-unlock abilities for new levels
  const newlyUnlocked: string[] = [];
  if (leveledUp) {
    const existingAbilities = await db.select({ abilityId: rpgAbilities.abilityId }).from(rpgAbilities).where(eq(rpgAbilities.walletAddress, walletAddress));
    const existingIds = new Set(existingAbilities.map(a => a.abilityId));

    for (let lvl = levelBefore + 1; lvl <= levelAfter; lvl++) {
      const toUnlock = ABILITIES_CATALOG.filter(a =>
        a.levelRequired === lvl &&
        !existingIds.has(a.id) &&
        (!a.classRequired || a.classRequired === character.characterClass)
      );
      for (const ability of toUnlock) {
        await db.insert(rpgAbilities).values({
          walletAddress,
          abilityId: ability.id,
          abilityName: ability.name,
          unlockedAtLevel: lvl,
          isEquipped: false,
        }).catch(() => {});
        newlyUnlocked.push(ability.name);
      }
    }
  }

  const progress = xpProgress(newTotalXp);

  res.json({
    success: true,
    xpAwarded: xpAmount,
    levelBefore,
    levelAfter,
    leveledUp,
    powerPointsGained,
    newlyUnlockedAbilities: newlyUnlocked,
    progress,
  });
}
