/**
 * POST /api/rpg/pack
 * Open a value pack. Deducts coins, awards XP, generates random card rewards.
 * Body: { walletAddress, packTier }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { rpgCharacters, rpgPackPurchases, rpgInventory, coinBalances } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { PACK_DEFINITIONS } from '../../../../lib/rpg/levels.js';

// Card pool — items that can drop from packs

// Card pool — items that can drop from packs
const CARD_POOL = {
  common:    ['coin_shield', 'trade_boost', 'xp_token', 'market_lens', 'daily_scroll', 'bronze_key', 'copper_coin', 'basic_map'],
  uncommon:  ['silver_shield', 'double_trade', 'xp_crystal', 'market_eye', 'silver_key', 'speed_rune', 'fortune_card'],
  rare:      ['gold_shield', 'triple_xp', 'rare_lens', 'gold_key', 'power_stone', 'rare_scroll', 'nation_flag'],
  epic:      ['epic_shield', 'xp_surge', 'epic_lens', 'platinum_key', 'epic_rune', 'shadow_card'],
  legendary: ['legendary_shield', 'xp_overflow', 'omniscient_lens', 'master_key', 'legendary_rune', 'mythic_card'],
};

function randomCard(rarity: keyof typeof CARD_POOL): { itemId: string; itemName: string; rarity: keyof typeof CARD_POOL } {
  const pool = CARD_POOL[rarity];
  const itemId = pool[Math.floor(Math.random() * pool.length)];
  const itemName = itemId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { itemId, itemName, rarity };
}

function generateRewards(pack: typeof PACK_DEFINITIONS[0]): Array<{ itemId: string; itemName: string; rarity: string }> {
  const rewards: Array<{ itemId: string; itemName: string; rarity: string }> = [];
  const rarities: Array<keyof typeof CARD_POOL> = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  // Guaranteed minimum rarity card
  const minRarityIdx = rarities.indexOf(pack.guaranteedRarity as keyof typeof CARD_POOL);
  rewards.push(randomCard(pack.guaranteedRarity as keyof typeof CARD_POOL));

  // Fill remaining cards with weighted random rarities
  for (let i = 1; i < pack.cardsAwarded; i++) {
    const roll = Math.random();
    let rarity: keyof typeof CARD_POOL;
    if (roll < 0.01 && minRarityIdx <= 4) rarity = 'legendary';
    else if (roll < 0.05 && minRarityIdx <= 3) rarity = 'epic';
    else if (roll < 0.15 && minRarityIdx <= 2) rarity = 'rare';
    else if (roll < 0.35 && minRarityIdx <= 1) rarity = 'uncommon';
    else rarity = 'common';
    rewards.push(randomCard(rarity));
  }

  return rewards;
}

export default async function handler(req: Request, res: Response) {
  const { walletAddress, packTier } = req.body as { walletAddress: string; packTier: string };

  if (!walletAddress || !packTier) {
    res.status(400).json({ error: 'walletAddress and packTier required' });
    return;
  }

  const pack = PACK_DEFINITIONS.find(p => p.tier === packTier);
  if (!pack) { res.status(400).json({ error: 'Invalid packTier' }); return; }

  const [character] = await db.select().from(rpgCharacters).where(eq(rpgCharacters.walletAddress, walletAddress)).limit(1);
  if (!character) { res.status(404).json({ error: 'Character not found' }); return; }

  if (character.level < pack.levelRequired) {
    res.status(403).json({ error: `Requires level ${pack.levelRequired}. You are level ${character.level}.` });
    return;
  }

  // Check coin balance
  const [balance] = await db.select().from(coinBalances).where(eq(coinBalances.walletAddress, walletAddress)).limit(1);
  const currentCoins = balance?.totalCoins ?? 0;
  if (currentCoins < pack.usgcAmount) {
    res.status(402).json({ error: `Insufficient coins. Need ${pack.usgcAmount}, have ${currentCoins}.` });
    return;
  }

  // Deduct coins
  await db.update(coinBalances).set({
    totalCoins: sql`total_coins - ${pack.usgcAmount}`,
    updatedAt: new Date(),
  }).where(eq(coinBalances.walletAddress, walletAddress));

  // Generate rewards
  const rewards = generateRewards(pack);

  // Record pack purchase
  await db.insert(rpgPackPurchases).values({
    walletAddress,
    packTier: pack.tier,
    packName: pack.name,
    coinCost: pack.usgcAmount,
    xpAwarded: pack.xpAwarded,
    cardsAwarded: pack.cardsAwarded,
    rewardSnapshot: JSON.stringify(rewards),
    status: 'delivered',
  }).$returningId();

  // Add items to inventory
  for (const reward of rewards) {
    await db.insert(rpgInventory).values({
      walletAddress,
      itemId: reward.itemId,
      itemType: 'card',
      itemName: reward.itemName,
      rarity: reward.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
      quantity: 1,
      acquiredFrom: `pack_${pack.tier}`,
    }).catch(() => {
      // If item exists, increment quantity
      db.update(rpgInventory).set({ quantity: sql`quantity + 1` })
        .where(eq(rpgInventory.itemId, reward.itemId)).catch(() => {});
    });
  }

  res.json({
    success: true,
    pack: pack.name,
    rewards,
    xpAwarded: pack.xpAwarded,
    coinsSpent: pack.usgcAmount,
    coinsRemaining: currentCoins - pack.usgcAmount,
  });
}
