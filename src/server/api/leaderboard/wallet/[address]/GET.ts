/**
 * GET /api/leaderboard/wallet/:address
 *
 * Returns on-chain Token Game holdings for a single wallet.
 * Used by the "Where do you rank?" card when a user connects their wallet.
 */

import type { Request, Response } from 'express';
import { ALL_MINTS, MINT_TO_TICKER, PERMANENT_TICKERS } from '../../../../../data/coinMints.js';
import { getHeldMints } from '../../solana.js';

function getTier(coins: number): string {
  if (coins >= 25) return 'Platinum';
  if (coins >= 12) return 'Gold';
  if (coins >= 6)  return 'Silver';
  if (coins >= 3)  return 'Bronze';
  return 'None';
}

export default async function handler(req: Request, res: Response) {
  const raw = req.params.address;
  const address: string = Array.isArray(raw) ? raw[0] : raw;

  // Basic Solana address validation (base58, 32–44 chars)
  if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const targetMints = new Set(ALL_MINTS);
    const held = await getHeldMints(address, targetMints);
    const tickers = [...held].map((m) => MINT_TO_TICKER[m]).filter(Boolean);
    const permanent = tickers.filter((t) => PERMANENT_TICKERS.has(t)).length;
    const seasonal = tickers.length - permanent;

    res.json({
      address,
      coins: tickers.length,
      permanent,
      seasonal,
      tier: getTier(tickers.length),
      tickers,
    });
  } catch (err) {
    console.error('leaderboard.wallet.error', { address, err });
    res.status(500).json({ error: 'Failed to fetch wallet data' });
  }
}
