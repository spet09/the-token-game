/**
 * GET /api/player/profile?wallet=<address>
 *
 * Returns a unified player profile combining:
 *  - RPG character (level, XP, class, power points)
 *  - Coin balance
 *  - Inventory card count
 *  - Power Level score (composite)
 *  - Rank (position among all players by power level)
 *  - Estimated USD value of coin holdings
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import {
  rpgCharacters,
  rpgAbilities,
  rpgInventory,
  coinBalances,
} from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { xpProgress } from '../../../../lib/rpg/levels.js';

// ─── Power Level formula ──────────────────────────────────────────────────────
// Weighted composite: level (heavy), coins, card count, abilities, power points
function calcPowerLevel(opts: {
  level: number;
  totalXpEarned: number;
  coins: number;
  cardCount: number;
  abilityCount: number;
  powerPoints: number;
}): number {
  const { level, totalXpEarned, coins, cardCount, abilityCount, powerPoints } = opts;
  return Math.floor(
    level * 120 +
    Math.floor(totalXpEarned / 100) +
    Math.floor(coins / 50) +
    cardCount * 15 +
    abilityCount * 25 +
    powerPoints * 10
  );
}

// ─── Coin → USD estimate ──────────────────────────────────────────────────────
// Based on bundle pricing: ~500 coins / $4.99 ≈ $0.00998 per coin
const COIN_USD_RATE = 0.00998;

export default async function handler(req: Request, res: Response) {
  const wallet = (req.query.wallet as string | undefined)?.trim();
  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' });
    return;
  }

  try {
    // Fetch all data in parallel
    const [characterRows, abilityRows, inventoryRows, balanceRows] = await Promise.all([
      db.select().from(rpgCharacters).where(eq(rpgCharacters.walletAddress, wallet)).limit(1),
      db.select().from(rpgAbilities).where(eq(rpgAbilities.walletAddress, wallet)),
      db.select().from(rpgInventory).where(eq(rpgInventory.walletAddress, wallet)),
      db.select().from(coinBalances).where(eq(coinBalances.walletAddress, wallet)).limit(1),
    ]);

    const character = characterRows[0] ?? null;
    const coinBalance = balanceRows[0] ?? null;
    const coins = coinBalance?.totalCoins ?? 0;
    const totalSpentUsd = parseFloat(coinBalance?.totalSpentUsd ?? '0');

    const level = character?.level ?? 1;
    const totalXpEarned = character?.totalXpEarned ?? 0;
    const powerPoints = character?.powerPoints ?? 0;
    const cardCount = inventoryRows.length;
    const abilityCount = abilityRows.length;

    const powerLevel = calcPowerLevel({ level, totalXpEarned, coins, cardCount, abilityCount, powerPoints });
    const estimatedUsd = parseFloat((coins * COIN_USD_RATE + totalSpentUsd).toFixed(2));

    // Rank: count players with higher power level + 1
    // We approximate by counting characters with higher level (fast, no full scan needed)
    const [rankRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(rpgCharacters)
      .where(sql`total_xp_earned > ${totalXpEarned}`);
    const rank = (rankRow?.count ?? 0) + 1;

    // XP progress within current level
    const progress = xpProgress(totalXpEarned);

    res.json({
      wallet,
      hasCharacter: !!character,
      // Identity
      displayName: character?.displayName ?? null,
      characterClass: character?.characterClass ?? null,
      avatarSeed: character?.avatarSeed ?? null,
      nation: character?.nation ?? null,
      // Level & XP
      level,
      totalXpEarned,
      xp: character?.xp ?? 0,
      xpToNextLevel: character?.xpToNextLevel ?? 80,
      progress,          // { level, current, needed, pct }
      powerPoints,
      // Economy
      coins,
      totalSpentUsd: totalSpentUsd.toFixed(2),
      estimatedUsd: estimatedUsd.toFixed(2),
      // Composite scores
      powerLevel,
      rank,
      // Inventory
      cardCount,
      abilityCount,
    });
  } catch (err) {
    console.error('player.profile: error', err);
    res.status(500).json({ error: 'Failed to fetch player profile' });
  }
}
