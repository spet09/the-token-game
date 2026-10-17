/**
 * GET /api/whitelist/coin/check?coinId=<id>&wallet=<address>
 * Check if a wallet can mint a specific coin.
 * Returns:
 *   - canMint: true/false
 *   - reason: 'whitelisted' | 'public_open' | 'not_whitelisted' | 'cooldown_active'
 *   - publicOpenAt: ISO timestamp when coin opens to public
 *   - cooldownRemaining: seconds remaining (if cooldown active)
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { coinWhitelist, whitelist } from '../../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { coinId, wallet } = req.query as { coinId?: string; wallet?: string };

  if (!coinId || !wallet) {
    return res.status(400).json({ error: 'coinId and wallet query params required' });
  }

  try {
    const now = new Date();

    // Check coin-specific whitelist entry
    const coinEntry = await db
      .select()
      .from(coinWhitelist)
      .where(
        and(
          eq(coinWhitelist.coinId, coinId),
          eq(coinWhitelist.walletAddress, wallet.trim())
        )
      )
      .limit(1);

    if (coinEntry.length > 0) {
      // Wallet is on the coin whitelist — always can mint during cooldown
      return res.json({
        canMint: true,
        reason: 'whitelisted',
        purchaseLimit: coinEntry[0].purchaseLimit,
        publicOpenAt: coinEntry[0].publicOpenAt,
      });
    }

    // Not on coin whitelist — check if cooldown has expired (public open)
    // Find any entry for this coin to get publicOpenAt
    const anyCoinEntry = await db
      .select()
      .from(coinWhitelist)
      .where(eq(coinWhitelist.coinId, coinId))
      .limit(1);

    if (anyCoinEntry.length === 0) {
      // No whitelist configured for this coin — open to all
      return res.json({ canMint: true, reason: 'no_whitelist_configured' });
    }

    const publicOpenAt = new Date(anyCoinEntry[0].publicOpenAt);

    if (now >= publicOpenAt) {
      // Cooldown expired — public sale is open
      return res.json({
        canMint: true,
        reason: 'public_open',
        publicOpenAt,
      });
    }

    // Cooldown still active and wallet not whitelisted
    const cooldownRemaining = Math.ceil((publicOpenAt.getTime() - now.getTime()) / 1000);

    // Check if wallet is globally approved (eligible to be added to whitelist)
    const globalEntry = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.walletAddress, wallet.trim()))
      .limit(1);

    return res.json({
      canMint: false,
      reason: 'cooldown_active',
      publicOpenAt,
      cooldownRemaining,
      globalStatus: globalEntry[0]?.status ?? 'not_registered',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Check failed', message: String(error) });
  }
}
