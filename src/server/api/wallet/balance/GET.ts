/**
 * GET /api/wallet/balance?wallet=<address>
 *              OR
 * GET /api/wallet/balance?email=<email>
 *
 * Returns the coin balance and purchase history for an account.
 * Accepts either a wallet address OR an email address as the lookup key.
 * Email is the primary account key when no wallet was connected at purchase time.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances, coinPurchases, coinSpends } from '../../../db/schema.js';
import { eq, or, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const wallet = (req.query.wallet as string | undefined)?.trim();
  const email  = (req.query.email  as string | undefined)?.trim().toLowerCase();

  if (!wallet && !email) {
    res.status(400).json({ error: 'wallet or email query parameter is required' });
    return;
  }

  // Build lookup key — try both wallet and email against the walletAddress column
  // (which stores accountKey = email or wallet depending on what was used at purchase)
  const lookupKey = wallet ?? email!;

  try {
    // Try exact match first
    let [balance] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, lookupKey))
      .limit(1);

    // If wallet provided but not found, also try looking up by linkedWallet column
    if (!balance && wallet) {
      const byLinked = await db
        .select()
        .from(coinBalances)
        .where(eq(coinBalances.linkedWallet, wallet))
        .limit(1);
      if (byLinked.length > 0) balance = byLinked[0];
    }

    const accountKey = balance?.walletAddress ?? lookupKey;

    const purchases = await db
      .select({
        id: coinPurchases.id,
        bundleName: coinPurchases.bundleName,
        coinsAwarded: coinPurchases.coinsAwarded,
        amountPaid: coinPurchases.amountPaid,
        currency: coinPurchases.currency,
        status: coinPurchases.status,
        deliveredAt: coinPurchases.deliveredAt,
        createdAt: coinPurchases.createdAt,
        accountEmail: coinPurchases.accountEmail,
      })
      .from(coinPurchases)
      .where(
        or(
          eq(coinPurchases.walletAddress, accountKey),
          ...(email ? [eq(coinPurchases.accountEmail, email)] : []),
        )
      )
      .orderBy(desc(coinPurchases.createdAt))
      .limit(20);

    const spends = await db
      .select()
      .from(coinSpends)
      .where(eq(coinSpends.walletAddress, accountKey))
      .orderBy(desc(coinSpends.createdAt))
      .limit(50);

    res.json({
      accountKey,
      wallet: balance?.linkedWallet ?? wallet ?? null,
      email: email ?? null,
      totalCoins: balance?.totalCoins ?? 0,
      totalSpentUsd: balance?.totalSpentUsd ?? '0.00',
      hasLinkedWallet: !!(balance?.linkedWallet),
      purchases,
      spends,
    });
  } catch (err) {
    console.error('wallet.balance: error', err);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
}
