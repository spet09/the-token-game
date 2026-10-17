/**
 * GET /api/admin/pump-addresses
 *
 * Returns all coins with their pump.fun status.
 * Auth: x-admin-secret header (NEBULA_SECRET_KEY)
 *
 * Coin data is imported directly from the bundled module (no disk read).
 * Mint address overrides written via PATCH are stored in persistent storage
 * and merged in at read time.
 *
 * Query params:
 *   filter   'missing' | 'live' | 'all'  (default: all)
 *   q        string  — search by ticker or name
 *   edition  string  — filter to a specific edition's tickers (e.g. 'australia')
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';
import { existsSync, readFileSync } from 'fs';
import { PERMANENT_COINS, SEASONAL_YEAR_ONE, FINALE_COINS, YEAR_TWO_GROUPS } from '../../../../data/coins.js';
import { EDITIONS } from '../../../../data/editionCoins.js';

const OVERRIDES_PATH = '/shared-storage/public/assets/pump-overrides.json';

function loadOverrides(): Record<string, string> {
  try {
    if (existsSync(OVERRIDES_PATH)) {
      return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
    }
  } catch {}
  return {};
}

export default async function handler(req: Request, res: Response) {
  const adminSecret = getSecret('ADMIN_SECRET') ?? getSecret('NEBULA_SECRET_KEY');
  const provided = req.headers['x-admin-secret'] ?? (req.headers['authorization'] as string | undefined)?.replace('Bearer ', '');
  if (!adminSecret || provided !== adminSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const filter  = (req.query.filter  as string) ?? 'all';
  const q       = ((req.query.q      as string) ?? '').toLowerCase();
  const edition = ((req.query.edition as string) ?? '').toLowerCase();

  // Collect all coins from the bundled module
  const allCoins = [
    ...PERMANENT_COINS,
    ...SEASONAL_YEAR_ONE.flatMap((g) => g.coins),
    ...(FINALE_COINS ?? []),
    ...YEAR_TWO_GROUPS.flatMap((g) => g.coins),
  ];

  // Build edition ticker set if an edition filter is requested
  let editionTickers: Set<string> | null = null;
  if (edition) {
    const ed = EDITIONS.find((e) => e.id.toLowerCase() === edition);
    if (ed) {
      editionTickers = new Set(
        ed.seasonalGroups.flatMap((g) => g.coins.map((c) => c.ticker))
      );
    }
  }

  // Merge in any persisted overrides
  const overrides = loadOverrides();

  let coins = allCoins.map((c) => {
    const effectiveUrl = overrides[c.ticker] ?? c.buyUrl;
    const hasMint = effectiveUrl.includes('raydium.io') || (effectiveUrl.includes('/coin/') && effectiveUrl !== 'https://pump.fun');
    const mintAddress = hasMint
      ? (effectiveUrl.includes('outputMint=')
          ? effectiveUrl.split('outputMint=')[1]?.split('&')[0] ?? null
          : effectiveUrl.replace('https://pump.fun/coin/', '') || null)
      : null;
    return {
      ticker: c.ticker,
      name: c.name,
      buyUrl: effectiveUrl,
      status: c.status,
      hasMint,
      mintAddress,
    };
  });

  if (editionTickers) coins = coins.filter((c) => editionTickers!.has(c.ticker));
  if (filter === 'missing') coins = coins.filter((c) => !c.hasMint);
  if (filter === 'live')    coins = coins.filter((c) => c.hasMint);
  if (q) coins = coins.filter((c) => c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));

  const total   = allCoins.length;
  const missing = allCoins.filter((c) => {
    const url = overrides[c.ticker] ?? c.buyUrl;
    return !url.includes('raydium.io') && !url.includes('/coin/');
  }).length;

  // Also return edition list for the frontend dropdown
  const editionList = EDITIONS.map((e) => ({ id: e.id, label: e.name }));

  res.json({
    summary: { total, missing, live: total - missing },
    coins,
    editions: editionList,
  });
}
