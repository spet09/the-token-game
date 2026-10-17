/**
 * POST /api/wallet/spend
 * Deduct coins from a wallet for an in-game purchase.
 *
 * Body: { walletAddress, amount, itemId, itemName, category }
 * category: 'upgrade' | 'event' | 'cosmetic' | 'rpg' | 'other'
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances, coinSpends } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { walletAddress, amount, itemId, itemName, category } = req.body as {
    walletAddress: string;
    amount: number;
    itemId: string;
    itemName: string;
    category?: string;
  };

  if (!walletAddress || !amount || !itemId || !itemName) {
    res.status(400).json({ error: 'walletAddress, amount, itemId, itemName required' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
    res.status(400).json({ error: 'amount must be a positive integer' });
    return;
  }

  try {
    // Check balance
    const [balance] = await db
      .select({ totalCoins: coinBalances.totalCoins })
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, walletAddress))
      .limit(1);

    const current = balance?.totalCoins ?? 0;
    if (current < amount) {
      res.status(402).json({
        error: 'Insufficient coins',
        have: current,
        need: amount,
      });
      return;
    }

    // Deduct coins
    await db
      .update(coinBalances)
      .set({
        totalCoins: sql`total_coins - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(coinBalances.walletAddress, walletAddress));

    // Record spend
    await db.insert(coinSpends).values({
      walletAddress,
      coinsSpent: amount,
      itemId,
      itemName,
      category: (category ?? 'other') as 'upgrade' | 'event' | 'cosmetic' | 'rpg' | 'other',
    });

    const newBalance = current - amount;

    res.json({
      success: true,
      coinsSpent: amount,
      newBalance,
      itemId,
      itemName,
    });
  } catch (err) {
    console.error('wallet.spend: error', err);
    res.status(500).json({ error: 'Failed to process spend' });
  }
}
