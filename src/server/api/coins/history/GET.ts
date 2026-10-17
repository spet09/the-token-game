/**
 * GET /api/coins/history?accountKey=<email|wallet>&limit=50&offset=0
 *
 * Unified transaction history — all purchases and spends for an account,
 * across all Tienko ecosystem platforms.
 *
 * Auth: Bearer <TIENKO_API_SECRET>  OR  x-tienko-key: <TIENKO_API_SECRET>
 *
 * Query params:
 *   accountKey  string  — email or wallet address
 *   limit       number  — max records per type (default 50, max 200)
 *   offset      number  — pagination offset (default 0)
 *   type        string  — "purchases" | "spends" | "all" (default "all")
 *
 * Response:
 *   {
 *     accountKey, totalCoins, totalSpentUsd,
 *     purchases: [...],
 *     spends: [...],
 *     totals: { purchaseCount, spendCount, coinsEarned, coinsSpent }
 *   }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances, coinPurchases, coinSpends } from '../../../db/schema.js';
import { eq, or, desc, sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const accountKey = ((req.query.accountKey as string | undefined) ?? '').trim().toLowerCase();
  const limit = Math.min(parseInt((req.query.limit as string) ?? '50', 10), 200);
  const offset = parseInt((req.query.offset as string) ?? '0', 10);
  const type = (req.query.type as string | undefined) ?? 'all';

  if (!accountKey) {
    res.status(400).json({ error: 'accountKey query parameter is required' });
    return;
  }

  try {
    // ── Balance ───────────────────────────────────────────────────────────────
    const [balance] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, accountKey))
      .limit(1);

    // ── Purchases ─────────────────────────────────────────────────────────────
    const purchases = (type === 'all' || type === 'purchases')
      ? await db
          .select({
            id: coinPurchases.id,
            bundleId: coinPurchases.bundleId,
            bundleName: coinPurchases.bundleName,
            coinsAwarded: coinPurchases.coinsAwarded,
            amountPaid: coinPurchases.amountPaid,
            currency: coinPurchases.currency,
            status: coinPurchases.status,
            platform: sql<string>`SUBSTRING_INDEX(${coinPurchases.bundleName}, ' — ', 1)`,
            deliveredAt: coinPurchases.deliveredAt,
            createdAt: coinPurchases.createdAt,
            accountEmail: coinPurchases.accountEmail,
          })
          .from(coinPurchases)
          .where(
            or(
              eq(coinPurchases.walletAddress, accountKey),
              accountKey.includes('@')
                ? eq(coinPurchases.accountEmail, accountKey)
                : undefined,
            )
          )
          .orderBy(desc(coinPurchases.createdAt))
          .limit(limit)
          .offset(offset)
      : [];

    // ── Spends ────────────────────────────────────────────────────────────────
    const spends = (type === 'all' || type === 'spends')
      ? await db
          .select()
          .from(coinSpends)
          .where(eq(coinSpends.walletAddress, accountKey))
          .orderBy(desc(coinSpends.createdAt))
          .limit(limit)
          .offset(offset)
      : [];

    // ── Totals ────────────────────────────────────────────────────────────────
    const coinsEarned = purchases.reduce((sum, p) => sum + (p.coinsAwarded ?? 0), 0);
    const coinsSpent  = spends.reduce((sum, s) => sum + (s.coinsSpent ?? 0), 0);

    res.json({
      accountKey,
      totalCoins:    balance?.totalCoins    ?? 0,
      totalSpentUsd: balance?.totalSpentUsd ?? '0.00',
      linkedWallet:  balance?.linkedWallet  ?? null,
      purchases,
      spends,
      totals: {
        purchaseCount: purchases.length,
        spendCount:    spends.length,
        coinsEarned,
        coinsSpent,
      },
    });
  } catch (err) {
    console.error('coins.history: error', err);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
}
