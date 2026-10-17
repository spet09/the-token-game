/**
 * GET /api/stash/eligibility?wallet=<address>
 * Check if a wallet is eligible for The Stash this season.
 * A wallet is eligible if it holds at least one coin for 7+ days.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { stashHoldings, stashSeasons } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

const HOLD_DAYS_REQUIRED = 7;

export default async function handler(req: Request, res: Response) {
  const wallet = req.query.wallet as string | undefined;

  if (!wallet) {
    return res.status(400).json({ error: 'wallet query param required' });
  }

  try {
    const now = new Date();
    const cutoff = new Date(now.getTime() - HOLD_DAYS_REQUIRED * 24 * 60 * 60 * 1000);

    // Get active season
    const seasons = await db
      .select()
      .from(stashSeasons)
      .where(eq(stashSeasons.status, 'active'))
      .limit(1);

    const activeSeason = seasons[0] ?? null;

    // Find all holdings for this wallet
    const holdings = await db
      .select()
      .from(stashHoldings)
      .where(eq(stashHoldings.walletAddress, wallet.trim()));

    if (holdings.length === 0) {
      return res.json({
        eligible: false,
        reason: 'no_holdings',
        holdDaysRequired: HOLD_DAYS_REQUIRED,
        holdings: [],
        activeSeason: activeSeason?.label ?? null,
      });
    }

    // Mark any holdings that have crossed the 7-day threshold
    const eligibleHoldings = holdings.filter(
      (h) => new Date(h.acquiredAt) <= cutoff
    );

    const isEligible = eligibleHoldings.length > 0;

    // Calculate days held for each coin
    const holdingsWithDays = holdings.map((h) => {
      const acquiredAt = new Date(h.acquiredAt);
      const daysHeld = (now.getTime() - acquiredAt.getTime()) / (1000 * 60 * 60 * 24);
      const daysUntilEligible = Math.max(0, HOLD_DAYS_REQUIRED - daysHeld);
      return {
        coinId: h.coinId,
        acquiredAt: h.acquiredAt,
        daysHeld: Math.floor(daysHeld * 10) / 10,
        isEligible: daysHeld >= HOLD_DAYS_REQUIRED,
        daysUntilEligible: Math.ceil(daysUntilEligible * 10) / 10,
      };
    });

    return res.json({
      eligible: isEligible,
      reason: isEligible ? 'holds_7_days' : 'holding_period_not_met',
      holdDaysRequired: HOLD_DAYS_REQUIRED,
      eligibleCoinCount: eligibleHoldings.length,
      totalCoinCount: holdings.length,
      holdings: holdingsWithDays,
      activeSeason: activeSeason?.label ?? null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Eligibility check failed', message: String(err) });
  }
}
