import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  publicKey: { toString(): string } | null;
  isConnected: boolean;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
    solflare?: SolanaProvider;
    backpack?: { solana?: SolanaProvider };
    xnft?: { solana?: SolanaProvider };
  }
}

export type WalletType = 'phantom' | 'solflare' | 'backpack';

export interface DetectedWallet {
  type: WalletType;
  label: string;
  icon: string;
  installed: boolean;
  installUrl: string;
}

interface WalletContextValue {
  connected: boolean;
  publicKey: string | null;
  shortKey: string | null;
  connecting: boolean;
  walletType: WalletType | null;
  balance: number | null;       // SOL balance, null = not fetched yet
  balanceLoading: boolean;
  network: 'mainnet' | 'devnet' | 'unknown';
  connect: (type?: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  detectedWallets: DetectedWallet[];
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

const WALLET_DEFS: DetectedWallet[] = [
  {
    type: 'phantom',
    label: 'Phantom',
    icon: '👻',
    installed: false,
    installUrl: 'https://phantom.app/',
  },
  {
    type: 'solflare',
    label: 'Solflare',
    icon: '🔆',
    installed: false,
    installUrl: 'https://solflare.com/',
  },
  {
    type: 'backpack',
    label: 'Backpack',
    icon: '🎒',
    installed: false,
    installUrl: 'https://backpack.app/',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const WalletContext = createContext<WalletContextValue>({
  connected: false,
  publicKey: null,
  shortKey: null,
  connecting: false,
  walletType: null,
  balance: null,
  balanceLoading: false,
  network: 'unknown',
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
  detectedWallets: WALLET_DEFS,
  modalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getProvider(type: WalletType): SolanaProvider | null {
  if (typeof window === 'undefined') return null;
  switch (type) {
    case 'phantom':
      return window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null);
    case 'solflare':
      return window.solflare ?? null;
    case 'backpack':
      return window.backpack?.solana ?? window.xnft?.solana ?? null;
    default:
      return null;
  }
}

function detectWallets(): DetectedWallet[] {
  return WALLET_DEFS.map((w) => ({
    ...w,
    installed: !!getProvider(w.type),
  }));
}

function shorten(key: string): string {
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

async function fetchSolBalance(pubkey: string): Promise<number | null> {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [pubkey, { commitment: 'confirmed' }],
      }),
    });
    const json = await res.json() as { result?: { value?: number } };
    const lamports = json?.result?.value;
    if (typeof lamports === 'number') return lamports / 1e9;
    return null;
  } catch {
    return null;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [network] = useState<'mainnet' | 'devnet' | 'unknown'>('mainnet');
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>(WALLET_DEFS);
  const [modalOpen, setModalOpen] = useState(false);
  const balanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect installed wallets on mount (after extensions inject)
  useEffect(() => {
    const detect = () => setDetectedWallets(detectWallets());
    detect();
    // Re-detect after a short delay — some extensions inject async
    const t = setTimeout(detect, 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-reconnect trusted sessions
  useEffect(() => {
    const types: WalletType[] = ['phantom', 'solflare', 'backpack'];
    for (const type of types) {
      const p = getProvider(type);
      if (!p) continue;
      p.connect({ onlyIfTrusted: true })
        .then((res) => {
          setPublicKey(res.publicKey.toString());
          setWalletType(type);
        })
        .catch(() => {});

      const onConnect = (key: unknown) => {
        if (key && typeof (key as { toString(): string }).toString === 'function') {
          setPublicKey((key as { toString(): string }).toString());
          setWalletType(type);
        }
      };
      const onDisconnect = () => {
        setPublicKey(null);
        setWalletType(null);
        setBalance(null);
      };
      p.on('connect', onConnect);
      p.on('disconnect', onDisconnect);
      // Note: cleanup would need per-provider tracking; acceptable for this use case
    }
  }, []);

  // Fetch balance when connected
  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    setBalanceLoading(true);
    const bal = await fetchSolBalance(publicKey);
    setBalance(bal);
    setBalanceLoading(false);
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      if (balanceIntervalRef.current) clearInterval(balanceIntervalRef.current);
      return;
    }
    refreshBalance();
    // Refresh balance every 30s while connected
    balanceIntervalRef.current = setInterval(refreshBalance, 30_000);
    return () => {
      if (balanceIntervalRef.current) clearInterval(balanceIntervalRef.current);
    };
  }, [publicKey, refreshBalance]);

  const connect = useCallback(async (type?: WalletType) => {
    const targetType = type ?? 'phantom';
    const p = getProvider(targetType);
    if (!p) {
      // Not installed — open install page
      const def = WALLET_DEFS.find((w) => w.type === targetType);
      if (def) window.open(def.installUrl, '_blank');
      return;
    }
    try {
      setConnecting(true);
      const res = await p.connect();
      setPublicKey(res.publicKey.toString());
      setWalletType(targetType);
      setModalOpen(false);
    } catch {
      // user rejected
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!walletType) return;
    const p = getProvider(walletType);
    if (p) await p.disconnect();
    setPublicKey(null);
    setWalletType(null);
    setBalance(null);
  }, [walletType]);

  const openModal = useCallback(() => {
    setDetectedWallets(detectWallets());
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <WalletContext.Provider
      value={{
        connected: !!publicKey,
        publicKey,
        shortKey: publicKey ? shorten(publicKey) : null,
        connecting,
        walletType,
        balance,
        balanceLoading,
        network,
        connect,
        disconnect,
        refreshBalance,
        detectedWallets,
        modalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useWallet() {
  return useContext(WalletContext);
}
