/**
 * POST /api/admin/credit-coins
 *
 * Manually credit coins to a wallet address.
 * Used for support cases where a purchase completed without a wallet address.
 *
 * Body: { secret, walletAddress, coins, bundleName, amountPaid, note }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances, coinPurchases } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { getSecret } from '#airo/secrets';

export default async function handler(req: Request, res: Response) {
  // Simple secret guard — use NEBULA_SECRET_KEY as admin token
  const adminSecret = getSecret('NEBULA_SECRET_KEY');
  const { secret, walletAddress, coins, bundleName, amountPaid, note } = req.body as {
    secret: string;
    walletAddress: string;
    coins: number;
    bundleName?: string;
    amountPaid?: number;
    note?: string;
  };

  if (!secret || secret !== adminSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!walletAddress || !coins || coins <= 0) {
    res.status(400).json({ error: 'walletAddress and coins (>0) are required' });
    return;
  }

  try {
    const wallet = walletAddress.trim();
    const coinsToCredit = Math.floor(coins);
    const bundle = bundleName ?? 'Manual Credit';
    const paid = amountPaid ?? 0;
    const fakeSessionId = `manual_credit_${Date.now()}_${wallet.slice(0, 8)}`;

    // Insert purchase record
    await db.insert(coinPurchases).values({
      stripeSessionId: fakeSessionId,
      walletAddress: wallet,
      bundleId: 'manual_credit',
      bundleName: bundle,
      coinsAwarded: coinsToCredit,
      amountPaid: paid,
      currency: 'usd',
      status: 'delivered',
      deliveredAt: new Date(),
      failureReason: note ? `Note: ${note}` : null,
    });

    // Upsert coin balance
    const [existing] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, wallet))
      .limit(1);

    if (existing) {
      await db
        .update(coinBalances)
        .set({
          totalCoins: sql`${coinBalances.totalCoins} + ${coinsToCredit}`,
        })
        .where(eq(coinBalances.walletAddress, wallet));
    } else {
      await db.insert(coinBalances).values({
        walletAddress: wallet,
        totalCoins: coinsToCredit,
        totalSpentUsd: (paid / 100).toFixed(2),
      });
    }

    const [updated] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, wallet))
      .limit(1);

    console.log(`admin.credit-coins: ✅ credited ${coinsToCredit} coins to ${wallet}`);

    res.json({
      success: true,
      wallet,
      coinsAdded: coinsToCredit,
      newBalance: updated?.totalCoins ?? coinsToCredit,
      bundleName: bundle,
    });
  } catch (err) {
    console.error('admin.credit-coins: error', err);
    res.status(500).json({ error: 'Failed to credit coins' });
  }
}
