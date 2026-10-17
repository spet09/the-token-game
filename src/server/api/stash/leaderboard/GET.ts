/**
 * GET /api/stash/leaderboard
 * Returns top holders by number of eligible coins this season.
 * Eligible = held for 7+ days.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { stashHoldings } from '../../../db/schema.js';
import { sql, desc } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Aggregate eligible holdings per wallet
    const rows = await db
      .select({
        walletAddress: stashHoldings.walletAddress,
        eligibleCoins: sql<number>`SUM(CASE WHEN acquired_at <= ${cutoff.toISOString()} THEN 1 ELSE 0 END)`,
        totalCoins: sql<number>`COUNT(*)`,
      })
      .from(stashHoldings)
      .groupBy(stashHoldings.walletAddress)
      .orderBy(desc(sql`SUM(CASE WHEN acquired_at <= ${cutoff.toISOString()} THEN 1 ELSE 0 END)`))
      .limit(20);

    const leaderboard = rows
      .filter((r) => Number(r.eligibleCoins) > 0)
      .map((r, i) => ({
        rank: i + 1,
        wallet: r.walletAddress,
        walletShort: `${r.walletAddress.slice(0, 4)}…${r.walletAddress.slice(-4)}`,
        eligibleCoins: Number(r.eligibleCoins),
        totalCoins: Number(r.totalCoins),
      }));

    return res.json({ leaderboard, updatedAt: now.toISOString() });
  } catch (err) {
    return res.status(500).json({ error: 'Leaderboard fetch failed', message: String(err) });
  }
}
