/**
 * useCoinBalance — fetches and caches the coin balance for the connected wallet
 * OR a provided email address.
 *
 * Account key priority:
 *   1. Connected wallet address (publicKey)
 *   2. Email address (passed explicitly, e.g. from Stripe success page)
 *
 * This means users can see their balance even without a connected wallet,
 * as long as they know the email they used at checkout.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@/lib/wallet';

export interface CoinBalanceData {
  accountKey: string;
  wallet: string | null;
  email: string | null;
  totalCoins: number;
  totalSpentUsd: string;
  hasLinkedWallet: boolean;
  purchases: CoinPurchase[];
  spends: CoinSpend[];
}

export interface CoinPurchase {
  id: number;
  bundleName: string;
  coinsAwarded: number;
  amountPaid: number;
  currency: string;
  status: string;
  deliveredAt: string | null;
  createdAt: string;
  accountEmail?: string | null;
}

export interface CoinSpend {
  id: number;
  walletAddress: string;
  coinsSpent: number;
  itemId: string;
  itemName: string;
  category: string;
  platform: string;
  createdAt: string;
}

interface UseCoinBalanceReturn {
  coins: number;
  totalSpentUsd: string;
  purchases: CoinPurchase[];
  spends: CoinSpend[];
  hasLinkedWallet: boolean;
  accountKey: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Module-level cache
const cache: { key: string | null; data: CoinBalanceData | null; ts: number } = {
  key: null,
  data: null,
  ts: 0,
};
const CACHE_TTL_MS = 30_000;

type Listener = (data: CoinBalanceData | null, loading: boolean) => void;
const listeners = new Set<Listener>();

function notify(data: CoinBalanceData | null, loading: boolean) {
  listeners.forEach((fn) => fn(data, loading));
}

async function fetchBalance(wallet?: string, email?: string): Promise<CoinBalanceData | null> {
  try {
    const params = new URLSearchParams();
    if (wallet) params.set('wallet', wallet);
    else if (email) params.set('email', email);
    else return null;

    const res = await fetch(`/api/wallet/balance?${params.toString()}`);
    if (!res.ok) return null;
    return (await res.json()) as CoinBalanceData;
  } catch {
    return null;
  }
}

export function useCoinBalance(emailOverride?: string): UseCoinBalanceReturn {
  const { publicKey } = useWallet();
  const [data, setData] = useState<CoinBalanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const listener: Listener = (d, l) => {
      if (!mountedRef.current) return;
      setData(d);
      setLoading(l);
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const load = useCallback(async (wallet?: string, email?: string, force = false) => {
    const cacheKey = wallet ?? email ?? '';
    if (!cacheKey) return;

    const now = Date.now();
    if (!force && cache.key === cacheKey && cache.data && now - cache.ts < CACHE_TTL_MS) {
      setData(cache.data);
      return;
    }
    setLoading(true);
    setError(null);
    notify(null, true);
    const result = await fetchBalance(wallet, email);
    cache.key = cacheKey;
    cache.data = result;
    cache.ts = Date.now();
    if (mountedRef.current) {
      setData(result);
      setLoading(false);
      if (!result) setError('Could not load balance');
    }
    notify(result, false);
  }, []);

  useEffect(() => {
    const wallet = publicKey ?? undefined;
    const email = emailOverride ?? undefined;
    if (!wallet && !email) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    load(wallet, email);
  }, [publicKey, emailOverride, load]);

  const refresh = useCallback(async () => {
    const wallet = publicKey ?? undefined;
    const email = emailOverride ?? undefined;
    if (!wallet && !email) return;
    await load(wallet, email, true);
  }, [publicKey, emailOverride, load]);

  return {
    coins: data?.totalCoins ?? 0,
    totalSpentUsd: data?.totalSpentUsd ?? '0.00',
    purchases: data?.purchases ?? [],
    spends: data?.spends ?? [],
    hasLinkedWallet: data?.hasLinkedWallet ?? false,
    accountKey: data?.accountKey ?? null,
    loading,
    error,
    refresh,
  };
}

export function invalidateCoinCache() {
  cache.key = null;
  cache.data = null;
  cache.ts = 0;
}
