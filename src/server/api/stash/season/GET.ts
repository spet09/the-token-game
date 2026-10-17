/**
 * GET /api/stash/season
 * Returns the current active season with time remaining, total SOL, and stats.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { stashSeasons, stashBalanceLog, stashHoldings } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    // Get the active season
    const seasons = await db
      .select()
      .from(stashSeasons)
      .where(eq(stashSeasons.status, 'active'))
      .limit(1);

    if (seasons.length === 0) {
      return res.status(404).json({ error: 'No active season' });
    }

    const season = seasons[0];
    const now = new Date();
    const endsAt = new Date(season.endsAt);
    const startsAt = new Date(season.startsAt);
    const totalDuration = endsAt.getTime() - startsAt.getTime();
    const elapsed = now.getTime() - startsAt.getTime();
    const progressPct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    const msRemaining = Math.max(0, endsAt.getTime() - now.getTime());

    // Days / hours / minutes remaining
    const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));

    // Count eligible holders this season
    const eligibleCount = await db
      .select({ count: sql<number>`COUNT(DISTINCT wallet_address)` })
      .from(stashHoldings)
      .where(eq(stashHoldings.isEligible, true));

    // Sum fee deposits this season
    const feeSum = await db
      .select({ total: sql<string>`COALESCE(SUM(amount_sol), 0)` })
      .from(stashBalanceLog)
      .where(eq(stashBalanceLog.seasonId, season.id));

    const totalFeesSol = parseFloat(feeSum[0]?.total ?? '0');

    return res.json({
      season: {
        id: season.id,
        seasonNumber: season.seasonNumber,
        label: season.label,
        startsAt: season.startsAt,
        endsAt: season.endsAt,
        status: season.status,
        totalSol: parseFloat(season.totalSol as unknown as string),
      },
      countdown: {
        daysRemaining,
        hoursRemaining,
        minutesRemaining,
        msRemaining,
        progressPct: Math.round(progressPct),
      },
      stats: {
        eligibleHolders: eligibleCount[0]?.count ?? 0,
        totalFeesSol,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch season', message: String(err) });
  }
}
