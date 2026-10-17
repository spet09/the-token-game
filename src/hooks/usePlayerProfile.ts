/**
 * usePlayerProfile
 *
 * Fetches and caches the unified player profile from GET /api/player/profile.
 * Automatically re-fetches when the connected wallet changes.
 * Exposes `refresh()` for manual invalidation (e.g. after XP award or purchase).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@/lib/wallet';

export interface XpProgress {
  level: number;
  current: number;
  needed: number;
  pct: number;
}

export interface PlayerProfile {
  wallet: string;
  hasCharacter: boolean;
  // Identity
  displayName: string | null;
  characterClass: string | null;
  avatarSeed: string | null;
  nation: string | null;
  // Level & XP
  level: number;
  totalXpEarned: number;
  xp: number;
  xpToNextLevel: number;
  progress: XpProgress;
  powerPoints: number;
  // Economy
  coins: number;
  totalSpentUsd: string;
  estimatedUsd: string;
  // Composite
  powerLevel: number;
  rank: number;
  // Inventory
  cardCount: number;
  abilityCount: number;
}

interface UsePlayerProfileReturn {
  profile: PlayerProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// ─── Module-level cache (shared across all hook instances) ────────────────────
const cache: { wallet: string | null; data: PlayerProfile | null; ts: number } = {
  wallet: null,
  data: null,
  ts: 0,
};
const CACHE_TTL_MS = 30_000;

type Listener = (data: PlayerProfile | null, loading: boolean) => void;
const listeners = new Set<Listener>();

function notify(data: PlayerProfile | null, loading: boolean) {
  listeners.forEach((fn) => fn(data, loading));
}

async function fetchProfile(wallet: string): Promise<PlayerProfile | null> {
  try {
    const res = await fetch(`/api/player/profile?wallet=${encodeURIComponent(wallet)}`);
    if (!res.ok) return null;
    return (await res.json()) as PlayerProfile;
  } catch {
    return null;
  }
}

export function usePlayerProfile(): UsePlayerProfileReturn {
  const { publicKey } = useWallet();
  const [data, setData] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Subscribe to shared updates
  useEffect(() => {
    const listener: Listener = (d, l) => {
      if (!mountedRef.current) return;
      setData(d);
      setLoading(l);
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const load = useCallback(async (wallet: string, force = false) => {
    const now = Date.now();
    if (!force && cache.wallet === wallet && cache.data && now - cache.ts < CACHE_TTL_MS) {
      setData(cache.data);
      return;
    }
    setLoading(true);
    setError(null);
    notify(null, true);
    const result = await fetchProfile(wallet);
    cache.wallet = wallet;
    cache.data = result;
    cache.ts = Date.now();
    if (mountedRef.current) {
      setData(result);
      setLoading(false);
      if (!result) setError('Could not load profile');
    }
    notify(result, false);
  }, []);

  useEffect(() => {
    if (!publicKey) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    load(publicKey);
  }, [publicKey, load]);

  const refresh = useCallback(async () => {
    if (!publicKey) return;
    await load(publicKey, true);
  }, [publicKey, load]);

  return { profile: data, loading, error, refresh };
}

/** Invalidate the profile cache from outside the hook */
export function invalidateProfileCache() {
  cache.wallet = null;
  cache.data = null;
  cache.ts = 0;
}
