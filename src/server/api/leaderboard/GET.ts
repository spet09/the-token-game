/**
 * GET /api/leaderboard
 *
 * Returns ranked collectors based on on-chain token holdings.
 *
 * Strategy:
 * 1. Load the known-wallets registry from persistent storage (written by
 *    POST /api/leaderboard/register when a user connects their wallet).
 * 2. For each registered wallet, query Solana RPC for which Token Game
 *    mints they hold.
 * 3. Rank by total coins held, break ties by permanent coins held.
 * 4. Cache results for 5 minutes to avoid hammering the RPC.
 *
 * The registry grows organically as users connect their wallets on the site.
 */

import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ALL_MINTS, MINT_TO_TICKER, PERMANENT_TICKERS } from '../../../data/coinMints.js';
import { getHeldMints } from './solana.js';

const REGISTRY_PATH = '/private/leaderboard-wallets.json';
const CACHE_PATH = '/private/leaderboard-cache.json';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'None';

function getTier(coins: number): Tier {
  if (coins >= 25) return 'Platinum';
  if (coins >= 12) return 'Gold';
  if (coins >= 6)  return 'Silver';
  if (coins >= 3)  return 'Bronze';
  return 'None';
}

function shortAddress(addr: string): string {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  coins: number;
  permanent: number;
  seasonal: number;
  tier: Tier;
  tickers: string[];
}

interface CacheFile {
  updatedAt: number;
  entries: LeaderboardEntry[];
}

interface Registry {
  wallets: Array<{ address: string; displayName?: string; registeredAt: number }>;
}

async function loadRegistry(): Promise<Registry> {
  try {
    const raw = await fs.readFile(REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw) as Registry;
  } catch {
    return { wallets: [] };
  }
}

async function loadCache(): Promise<CacheFile | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf-8');
    return JSON.parse(raw) as CacheFile;
  } catch {
    return null;
  }
}

async function saveCache(entries: LeaderboardEntry[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await fs.writeFile(CACHE_PATH, JSON.stringify({ updatedAt: Date.now(), entries }));
  } catch {
    // non-fatal
  }
}

async function buildLeaderboard(wallets: Registry['wallets']): Promise<LeaderboardEntry[]> {
  const targetMints = new Set(ALL_MINTS);
  const results: LeaderboardEntry[] = [];

  // Query wallets in parallel (batches of 5 to avoid rate limits)
  const BATCH = 5;
  for (let i = 0; i < wallets.length; i += BATCH) {
    const batch = wallets.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      batch.map(async (w) => {
        const held = await getHeldMints(w.address, targetMints);
        const tickers = [...held].map((m) => MINT_TO_TICKER[m]).filter(Boolean);
        const permanent = tickers.filter((t) => PERMANENT_TICKERS.has(t)).length;
        const seasonal = tickers.length - permanent;
        return {
          rank: 0,
          address: shortAddress(w.address),
          displayName: w.displayName || shortAddress(w.address),
          coins: tickers.length,
          permanent,
          seasonal,
          tier: getTier(tickers.length),
          tickers,
        } satisfies LeaderboardEntry;
      })
    );

    for (const r of settled) {
      if (r.status === 'fulfilled') results.push(r.value);
    }
  }

  // Sort: most coins first, then most permanent coins as tiebreaker
  results.sort((a, b) => b.coins - a.coins || b.permanent - a.permanent);

  // Assign ranks
  results.forEach((e, i) => { e.rank = i + 1; });

  return results;
}

export default async function handler(req: Request, res: Response) {
  try {
    const forceRefresh = req.query.refresh === '1';

    // Serve from cache if fresh
    if (!forceRefresh) {
      const cache = await loadCache();
      if (cache && Date.now() - cache.updatedAt < CACHE_TTL_MS) {
        return res.json({
          entries: cache.entries,
          updatedAt: cache.updatedAt,
          cached: true,
        });
      }
    }

    const registry = await loadRegistry();

    if (registry.wallets.length === 0) {
      return res.json({ entries: [], updatedAt: Date.now(), cached: false });
    }

    const entries = await buildLeaderboard(registry.wallets);
    await saveCache(entries);

    return res.json({ entries, updatedAt: Date.now(), cached: false });
  } catch (err) {
    console.error('leaderboard.get.error', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
