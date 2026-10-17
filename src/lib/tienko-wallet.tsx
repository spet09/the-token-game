/**
 * Tienko Wallet integration for The Token Game
 *
 * Wraps the browser-injected TienkoWallet SDK (loaded via
 * https://tienkowallet.io/tienko-wallet.js) in a React context so any
 * component can connect, read the live USGC balance, and trigger purchases.
 *
 * Error codes:
 *   4001 — user denied the request
 *   4030 — user not registered at tienkowallet.io/register
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

// ─── SDK type declarations ────────────────────────────────────────────────────

interface TienkoWalletSDK {
  connect(): Promise<{ address: string }>;
  disconnect(): Promise<void>;
  getBalance(): Promise<{ usgc: number; sol?: number }>;
  buyWithUSGC(
    treasuryAddress: string,
    amount: number,
    itemName: string,
  ): Promise<{ signature: string }>;
}

interface TienkoWalletConstructor {
  new (opts: { appName: string }): TienkoWalletSDK;
}

declare global {
  interface Window {
    TienkoWallet?: TienkoWalletConstructor;
  }
}

// ─── Error helpers ────────────────────────────────────────────────────────────

export interface TienkoError {
  code?: number;
  message?: string;
}

export function parseTienkoError(err: unknown): { message: string; needsRegister: boolean } {
  const e = err as TienkoError;
  if (e?.code === 4030) {
    return {
      message: 'You need to register a Tienko Wallet before connecting.',
      needsRegister: true,
    };
  }
  if (e?.code === 4001) {
    return { message: 'Request denied — you cancelled the wallet action.', needsRegister: false };
  }
  const msg = e?.message ?? String(err);
  if (/insufficient/i.test(msg)) {
    return { message: 'Insufficient USGC balance for this purchase.', needsRegister: false };
  }
  if (/network|timeout|fetch/i.test(msg)) {
    return { message: 'Network error — please check your connection and try again.', needsRegister: false };
  }
  return { message: msg || 'Something went wrong with the wallet. Please try again.', needsRegister: false };
}

// ─── Context types ────────────────────────────────────────────────────────────

export interface TienkoWalletContextValue {
  /** Whether the SDK script has loaded */
  sdkReady: boolean;
  /** Whether a wallet is currently connected */
  connected: boolean;
  /** Full wallet address */
  address: string | null;
  /** Shortened address for display */
  shortAddress: string | null;
  /** Live USGC balance, null = not yet fetched */
  usgcBalance: number | null;
  /** Whether a balance fetch is in flight */
  balanceLoading: boolean;
  /** Whether a connect call is in flight */
  connecting: boolean;
  /** Connect the Tienko Wallet */
  connect: () => Promise<void>;
  /** Disconnect the Tienko Wallet */
  disconnect: () => Promise<void>;
  /** Manually refresh the USGC balance */
  refreshBalance: () => Promise<void>;
  /**
   * Purchase an item with USGC.
   * Returns the transaction signature on success, or throws a TienkoError.
   */
  buyWithUSGC: (
    treasuryAddress: string,
    amount: number,
    itemName: string,
  ) => Promise<string>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const APP_NAME = 'The Token Game';

// ─── Context ──────────────────────────────────────────────────────────────────

const TienkoWalletContext = createContext<TienkoWalletContextValue>({
  sdkReady: false,
  connected: false,
  address: null,
  shortAddress: null,
  usgcBalance: null,
  balanceLoading: false,
  connecting: false,
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
  buyWithUSGC: async () => { throw new Error('Not connected'); },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shorten(addr: string): string {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function getSdk(): TienkoWalletSDK | null {
  if (typeof window === 'undefined' || !window.TienkoWallet) return null;
  return new window.TienkoWallet({ appName: APP_NAME });
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TienkoWalletProvider({ children }: { children: ReactNode }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [usgcBalance, setUsgcBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const sdkRef = useRef<TienkoWalletSDK | null>(null);
  const balanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect SDK load — it may arrive async after the script tag
  useEffect(() => {
    if (window.TienkoWallet) {
      setSdkReady(true);
      return;
    }
    const check = setInterval(() => {
      if (window.TienkoWallet) {
        setSdkReady(true);
        clearInterval(check);
      }
    }, 300);
    const timeout = setTimeout(() => clearInterval(check), 10_000);
    return () => {
      clearInterval(check);
      clearTimeout(timeout);
    };
  }, []);

  // Refresh USGC balance
  const refreshBalance = useCallback(async () => {
    if (!sdkRef.current) return;
    setBalanceLoading(true);
    try {
      const bal = await sdkRef.current.getBalance();
      setUsgcBalance(bal.usgc);
    } catch {
      // silently ignore balance refresh errors
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // Poll balance every 30 s while connected
  useEffect(() => {
    if (!address) {
      setUsgcBalance(null);
      if (balanceIntervalRef.current) clearInterval(balanceIntervalRef.current);
      return;
    }
    refreshBalance();
    balanceIntervalRef.current = setInterval(refreshBalance, 30_000);
    return () => {
      if (balanceIntervalRef.current) clearInterval(balanceIntervalRef.current);
    };
  }, [address, refreshBalance]);

  const connect = useCallback(async () => {
    const sdk = getSdk();
    if (!sdk) throw new Error('Tienko Wallet SDK not loaded');
    setConnecting(true);
    try {
      const wallet = await sdk.connect();
      sdkRef.current = sdk;
      setAddress(wallet.address);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (sdkRef.current) {
      try { await sdkRef.current.disconnect(); } catch { /* ignore */ }
    }
    sdkRef.current = null;
    setAddress(null);
    setUsgcBalance(null);
  }, []);

  const buyWithUSGC = useCallback(
    async (treasuryAddress: string, amount: number, itemName: string): Promise<string> => {
      if (!sdkRef.current) throw { code: undefined, message: 'Wallet not connected' };
      const result = await sdkRef.current.buyWithUSGC(treasuryAddress, amount, itemName);
      // Refresh balance after purchase
      await refreshBalance();
      return result.signature;
    },
    [refreshBalance],
  );

  return (
    <TienkoWalletContext.Provider
      value={{
        sdkReady,
        connected: !!address,
        address,
        shortAddress: address ? shorten(address) : null,
        usgcBalance,
        balanceLoading,
        connecting,
        connect,
        disconnect,
        refreshBalance,
        buyWithUSGC,
      }}
    >
      {children}
    </TienkoWalletContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTienkoWallet() {
  return useContext(TienkoWalletContext);
}
