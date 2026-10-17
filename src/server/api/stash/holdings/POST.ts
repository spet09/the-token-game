/**
 * POST /api/stash/holdings
 * Record that a wallet acquired a coin (starts the 7-day holding clock).
 * Body: { walletAddress: string, coinId: string, acquiredAt?: string }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { stashHoldings, stashSeasons } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { walletAddress, coinId, acquiredAt } = req.body as {
    walletAddress?: string;
    coinId?: string;
    acquiredAt?: string;
  };

  if (!walletAddress || !coinId) {
    return res.status(400).json({ error: 'walletAddress and coinId are required' });
  }

  try {
    // Get active season
    const seasons = await db
      .select()
      .from(stashSeasons)
      .where(eq(stashSeasons.status, 'active'))
      .limit(1);

    const seasonId = seasons[0]?.id ?? null;

    // Check for existing holding record
    const existing = await db
      .select()
      .from(stashHoldings)
      .where(
        and(
          eq(stashHoldings.walletAddress, walletAddress.trim()),
          eq(stashHoldings.coinId, coinId.trim())
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        error: 'Holding already recorded',
        holding: existing[0],
      });
    }

    const acquiredDate = acquiredAt ? new Date(acquiredAt) : new Date();

    const result = await db.insert(stashHoldings).values({
      walletAddress: walletAddress.trim(),
      coinId: coinId.trim(),
      acquiredAt: acquiredDate,
      isEligible: false,
      seasonId,
    });

    const insertId = Number(result[0].insertId);
    const newHolding = await db
      .select()
      .from(stashHoldings)
      .where(eq(stashHoldings.id, insertId))
      .limit(1);

    return res.status(201).json({
      message: 'Holding recorded — 7-day clock started',
      holding: newHolding[0],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record holding', message: String(err) });
  }
}
