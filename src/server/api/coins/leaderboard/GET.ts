/**
 * GET /api/coins/leaderboard
 *
 * Returns all Token Game coins ranked by on-chain transaction count
 * (a reliable public proxy for trading volume on Raydium).
 *
 * Strategy:
 *   - Load all coins from coins.ts + pump-overrides.json (same source as /api/coins/directory)
 *   - For each live coin (hasMint=true), call Solana RPC getSignaturesForAddress(mint, {limit:1000})
 *   - tx count = trading activity proxy (more txs = more traded)
 *   - Cache results for 10 minutes in /private/coin-leaderboard-cache.json
 *   - Pending coins (no mint) are included at the bottom with txCount=0
 *
 * Public endpoint — no auth required.
 */
import type { Request, Response } from 'express';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import {
  PERMANENT_COINS,
  SEASONAL_YEAR_ONE,
  FINALE_COINS,
  YEAR_TWO_GROUPS,
} from '../../../../data/coins.js';

const OVERRIDES_PATH = '/shared-storage/public/assets/pump-overrides.json';
const CACHE_FILE     = '/private/coin-leaderboard-cache.json';
const CACHE_TTL_MS   = 10 * 60 * 1000; // 10 minutes
const SOLANA_RPC     = 'https://api.mainnet-beta.solana.com';
const SIG_LIMIT      = 1000; // max per RPC call

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CoinLeaderboardEntry {
  rank:         number;
  ticker:       string;
  name:         string;
  image:        string | null;
  buyUrl:       string;
  mintAddress:  string | null;
  txCount:      number;
  status:       'live' | 'pending';
  permanent:    boolean;
  lastActivity: number | null;
}

interface CacheFile {
  updatedAt: number;
  entries:   CoinLeaderboardEntry[];
}

// ─── Load coins with overrides (same logic as /api/coins/directory) ───────────

function loadOverrides(): Record<string, string> {
  try {
    if (existsSync(OVERRIDES_PATH)) {
      return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
    }
  } catch { /* non-fatal */ }
  return {};
}

interface ResolvedCoin {
  ticker:    string;
  name:      string;
  image:     string | null;
  buyUrl:    string;
  hasMint:   boolean;
  mintAddress: string | null;
  permanent: boolean;
}

function loadCoins(): ResolvedCoin[] {
  const allCoins = [
    ...PERMANENT_COINS,
    ...SEASONAL_YEAR_ONE.flatMap((g) => g.coins),
    ...(FINALE_COINS ?? []),
    ...YEAR_TWO_GROUPS.flatMap((g) => g.coins),
  ];
  const overrides = loadOverrides();

  return allCoins.map((c) => {
    const effectiveUrl = overrides[c.ticker] ?? c.buyUrl;
    const hasMint = effectiveUrl.includes('raydium.io');
    const mintAddress = hasMint
      ? (effectiveUrl.includes('outputMint=')
          ? effectiveUrl.split('outputMint=')[1]?.split('&')[0] ?? null
          : null)
      : null;
    return {
      ticker:      c.ticker,
      name:        c.name,
      image:       c.image ?? null,
      buyUrl:      effectiveUrl,
      hasMint,
      mintAddress,
      permanent:   c.permanent ?? false,
    };
  });
}

// ─── Solana RPC helpers ───────────────────────────────────────────────────────

async function rpc(method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(SOLANA_RPC, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal:  AbortSignal.timeout(8000),
  });
  const json = await res.json() as { result?: unknown; error?: unknown };
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

interface SigEntry { blockTime: number | null }

async function getTxCount(mint: string): Promise<{ txCount: number; lastActivity: number | null }> {
  try {
    const sigs = await rpc('getSignaturesForAddress', [mint, { limit: SIG_LIMIT }]) as SigEntry[];
    return {
      txCount:      sigs.length,
      lastActivity: sigs[0]?.blockTime ?? null,
    };
  } catch {
    return { txCount: 0, lastActivity: null };
  }
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function loadCache(): CacheFile | null {
  try {
    const raw = readFileSync(CACHE_FILE, 'utf8');
    return JSON.parse(raw) as CacheFile;
  } catch {
    return null;
  }
}

function saveCache(entries: CoinLeaderboardEntry[]): void {
  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify({ updatedAt: Date.now(), entries }), 'utf8');
  } catch { /* non-fatal */ }
}

// ─── Build leaderboard ────────────────────────────────────────────────────────

async function buildLeaderboard(): Promise<CoinLeaderboardEntry[]> {
  const coins = loadCoins();

  const live    = coins.filter(c => c.hasMint && c.mintAddress);
  const pending = coins.filter(c => !c.hasMint || !c.mintAddress);

  // Fetch tx counts for all live coins in parallel (batched to avoid RPC rate limits)
  const BATCH = 5;
  const liveResults: CoinLeaderboardEntry[] = [];

  for (let i = 0; i < live.length; i += BATCH) {
    const batch = live.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(async (c) => {
        const { txCount, lastActivity } = await getTxCount(c.mintAddress!);
        return {
          rank:         0,
          ticker:       c.ticker,
          name:         c.name,
          image:        c.image,
          buyUrl:       c.buyUrl,
          mintAddress:  c.mintAddress,
          txCount,
          status:       'live' as const,
          permanent:    c.permanent,
          lastActivity,
        };
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled') liveResults.push(r.value);
    }
  }

  // Sort live coins: most txs first, then permanent first as tiebreaker
  liveResults.sort((a, b) => b.txCount - a.txCount || (b.permanent ? 1 : 0) - (a.permanent ? 1 : 0));

  // Pending coins — sorted alphabetically
  const pendingEntries: CoinLeaderboardEntry[] = pending
    .sort((a, b) => a.ticker.localeCompare(b.ticker))
    .map(c => ({
      rank:         0,
      ticker:       c.ticker,
      name:         c.name,
      image:        c.image,
      buyUrl:       c.buyUrl,
      mintAddress:  null,
      txCount:      0,
      status:       'pending' as const,
      permanent:    c.permanent,
      lastActivity: null,
    }));

  const all = [...liveResults, ...pendingEntries];
  all.forEach((e, i) => { e.rank = i + 1; });
  return all;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: Request, res: Response) {
  try {
    const forceRefresh = req.query.refresh === '1';

    if (!forceRefresh) {
      const cache = loadCache();
      if (cache && Date.now() - cache.updatedAt < CACHE_TTL_MS) {
        res.setHeader('X-Cache', 'HIT');
        return res.json({ entries: cache.entries, updatedAt: cache.updatedAt, cached: true });
      }
    }

    const entries = await buildLeaderboard();
    saveCache(entries);

    res.setHeader('X-Cache', 'MISS');
    return res.json({ entries, updatedAt: Date.now(), cached: false });
  } catch (err) {
    console.error('coin-leaderboard.error', err);
    // Try to serve stale cache on error
    const cache = loadCache();
    if (cache) return res.json({ entries: cache.entries, updatedAt: cache.updatedAt, cached: true, stale: true });
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
