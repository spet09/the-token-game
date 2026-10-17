/**
 * POST /api/whitelist/coin
 * Add an approved wallet to a specific coin's whitelist.
 * Sets the 1-hour cooldown (publicOpenAt = now + 1 hour).
 * Body: { coinId: string, walletAddress: string, purchaseLimit?: number }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinWhitelist, whitelist } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { coinId, walletAddress, purchaseLimit = 1 } = req.body as {
    coinId?: string;
    walletAddress?: string;
    purchaseLimit?: number;
  };

  if (!coinId || !walletAddress) {
    return res.status(400).json({ error: 'coinId and walletAddress are required' });
  }

  try {
    // Verify wallet is globally approved
    const globalEntry = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.walletAddress, walletAddress.trim()))
      .limit(1);

    if (globalEntry.length === 0 || globalEntry[0].status !== 'approved') {
      return res.status(403).json({
        error: 'Wallet is not globally approved',
        status: globalEntry[0]?.status ?? 'not_registered',
      });
    }

    // Check if already on this coin's whitelist
    const existing = await db
      .select()
      .from(coinWhitelist)
      .where(
        and(
          eq(coinWhitelist.coinId, coinId),
          eq(coinWhitelist.walletAddress, walletAddress.trim())
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already on this coin whitelist', entry: existing[0] });
    }

    // publicOpenAt = 1 hour from now
    const publicOpenAt = new Date(Date.now() + 60 * 60 * 1000);

    const result = await db.insert(coinWhitelist).values({
      coinId,
      walletAddress: walletAddress.trim(),
      purchaseLimit,
      publicOpenAt,
    });

    const insertId = Number(result[0].insertId);
    const newEntry = await db
      .select()
      .from(coinWhitelist)
      .where(eq(coinWhitelist.id, insertId))
      .limit(1);

    return res.status(201).json({
      message: 'Added to coin whitelist',
      entry: newEntry[0],
      publicOpenAt,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add to coin whitelist', message: String(error) });
  }
}
