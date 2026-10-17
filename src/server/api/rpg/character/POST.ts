/**
 * POST /api/rpg/character
 * Create or update a character for a wallet.
 * Body: { walletAddress, displayName, characterClass, nation, avatarSeed }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { rpgCharacters, rpgAbilities } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { ABILITIES_CATALOG } from '../../../../lib/rpg/levels.js';

export default async function handler(req: Request, res: Response) {
  const { walletAddress, displayName, characterClass, nation, avatarSeed } = req.body as {
    walletAddress: string;
    displayName: string;
    characterClass: 'warrior' | 'mage' | 'merchant' | 'explorer' | 'collector';
    nation: string;
    avatarSeed?: string;
  };

  if (!walletAddress || !displayName || !characterClass || !nation) {
    res.status(400).json({ error: 'walletAddress, displayName, characterClass, nation required' });
    return;
  }

  const validClasses = ['warrior', 'mage', 'merchant', 'explorer', 'collector'];
  if (!validClasses.includes(characterClass)) {
    res.status(400).json({ error: 'Invalid characterClass' });
    return;
  }

  // Upsert character
  const existing = await db.select({ id: rpgCharacters.id }).from(rpgCharacters).where(eq(rpgCharacters.walletAddress, walletAddress)).limit(1);

  if (existing.length > 0) {
    await db.update(rpgCharacters).set({ displayName, characterClass, nation, avatarSeed: avatarSeed ?? null, updatedAt: new Date() }).where(eq(rpgCharacters.walletAddress, walletAddress));
  } else {
    await db.insert(rpgCharacters).values({ walletAddress, displayName, characterClass, nation, avatarSeed: avatarSeed ?? null, level: 1, xp: 0, xpToNextLevel: 80, totalXpEarned: 0, powerPoints: 3 });

    // Grant level-1 starter ability
    const starterAbility = ABILITIES_CATALOG.find(a => a.levelRequired === 1);
    if (starterAbility) {
      await db.insert(rpgAbilities).values({ walletAddress, abilityId: starterAbility.id, abilityName: starterAbility.name, unlockedAtLevel: 1, isEquipped: true }).catch(() => {});
    }
  }

  const [character] = await db.select().from(rpgCharacters).where(eq(rpgCharacters.walletAddress, walletAddress)).limit(1);
  res.json({ success: true, character });
}
