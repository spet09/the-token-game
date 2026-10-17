/**
 * GET /api/coins/directory
 * Public endpoint — returns all coins with merged Raydium overrides.
 * No auth required (read-only, no secrets exposed).
 */
import type { Request, Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import {
  PERMANENT_COINS,
  SEASONAL_YEAR_ONE,
  FINALE_COINS,
  YEAR_TWO_GROUPS,
} from '../../../../data/coins.js';

const OVERRIDES_PATH = '/shared-storage/public/assets/pump-overrides.json';

function loadOverrides(): Record<string, string> {
  try {
    if (existsSync(OVERRIDES_PATH)) {
      return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
    }
  } catch {}
  return {};
}

export default async function handler(_req: Request, res: Response) {
  const allCoins = [
    ...PERMANENT_COINS,
    ...SEASONAL_YEAR_ONE.flatMap((g) => g.coins),
    ...(FINALE_COINS ?? []),
    ...YEAR_TWO_GROUPS.flatMap((g) => g.coins),
  ];

  const overrides = loadOverrides();

  const coins = allCoins.map((c) => {
    const effectiveUrl = overrides[c.ticker] ?? c.buyUrl;
    const hasMint = effectiveUrl.includes('raydium.io');
    const mintAddress = hasMint
      ? (effectiveUrl.includes('outputMint=')
          ? effectiveUrl.split('outputMint=')[1]?.split('&')[0] ?? null
          : null)
      : null;
    return {
      ticker: c.ticker,
      name: c.name,
      image: c.image ?? null,
      buyUrl: effectiveUrl,
      status: c.status ?? null,
      permanent: c.permanent ?? false,
      hasMint,
      mintAddress,
    };
  });

  const live = coins.filter((c) => c.hasMint).length;

  res.json({
    summary: { total: coins.length, live, missing: coins.length - live },
    coins,
  });
}
