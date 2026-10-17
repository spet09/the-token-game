/**
 * GET /api/rpg/character?wallet=<address>
 * Returns the RPG character, abilities, and inventory summary for a wallet.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { rpgCharacters, rpgAbilities, rpgInventory, rpgXpLog } from '../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { xpProgress, ABILITIES_CATALOG } from '../../../../lib/rpg/levels.js';

export default async function handler(req: Request, res: Response) {
  const wallet = (req.query.wallet as string | undefined)?.trim();
  if (!wallet) { res.status(400).json({ error: 'wallet required' }); return; }

  const [character] = await db.select().from(rpgCharacters).where(eq(rpgCharacters.walletAddress, wallet)).limit(1);
  if (!character) { res.status(404).json({ error: 'Character not found', hasCharacter: false }); return; }

  const abilities = await db.select().from(rpgAbilities).where(eq(rpgAbilities.walletAddress, wallet));
  const inventory = await db.select().from(rpgInventory).where(eq(rpgInventory.walletAddress, wallet));
  const recentXp = await db.select().from(rpgXpLog).where(eq(rpgXpLog.walletAddress, wallet)).orderBy(desc(rpgXpLog.createdAt)).limit(10);

  const progress = xpProgress(character.totalXpEarned);
  const unlockedAbilityIds = new Set(abilities.map(a => a.abilityId));
  const availableAbilities = ABILITIES_CATALOG.filter(a => a.levelRequired <= character.level && !unlockedAbilityIds.has(a.id));

  res.json({
    character,
    progress,
    abilities,
    availableAbilities,
    inventory,
    recentXp,
    hasCharacter: true,
  });
}
