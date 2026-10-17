/**
 * Wagmi + viem configuration for The Token Game dApp.
 * Supports Solana-style wallet connect via browser extension (Phantom, Backpack)
 * and EVM wallets (MetaMask, Coinbase) for future cross-chain support.
 *
 * Smart contract addresses — fill these in once deployed:
 *   TGGameGenerator : TODO
 *   TGCardGenerator : TODO
 *   TGAuction       : TODO
 *   TGRewards       : TODO
 */

import { createConfig, http } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

// ── Chain config ──────────────────────────────────────────────────────────────

// ── Chain config ──────────────────────────────────────────────────────────────
export const SUPPORTED_CHAINS = [base, mainnet] as const;

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected({ target: 'metaMask' }),
    coinbaseWallet({ appName: 'The Token Game' }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

// ── Contract stubs ────────────────────────────────────────────────────────────
// Replace with real addresses + ABIs once deployed.
export const CONTRACTS = {
  TGGameGenerator: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    abi: [] as const,
  },
  TGCardGenerator: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    abi: [] as const,
  },
  TGAuction: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    abi: [] as const,
  },
  TGRewards: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    abi: [] as const,
  },
} as const;

// ── Rarity tiers ─────────────────────────────────────────────────────────────
export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITY_CONFIG: Record<RarityTier, {
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
  multiplier: number;
  probability: number;
}> = {
  common:    { label: 'Common',    color: '#9ca3af', bgClass: 'bg-gray-500/20',    borderClass: 'border-gray-500/40',    multiplier: 1,   probability: 0.50 },
  uncommon:  { label: 'Uncommon',  color: '#22c55e', bgClass: 'bg-green-500/20',   borderClass: 'border-green-500/40',   multiplier: 2,   probability: 0.25 },
  rare:      { label: 'Rare',      color: '#3b82f6', bgClass: 'bg-blue-500/20',    borderClass: 'border-blue-500/40',    multiplier: 5,   probability: 0.15 },
  epic:      { label: 'Epic',      color: '#a855f7', bgClass: 'bg-purple-500/20',  borderClass: 'border-purple-500/40',  multiplier: 10,  probability: 0.08 },
  legendary: { label: 'Legendary', color: '#f59e0b', bgClass: 'bg-amber-500/20',   borderClass: 'border-amber-500/40',   multiplier: 25,  probability: 0.02 },
};

/** Deterministically assign a rarity tier from a coin ticker string. */
export function getRarity(ticker: string): RarityTier {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = (hash * 31 + ticker.charCodeAt(i)) >>> 0;
  }
  const n = (hash % 100) / 100;
  if (n < 0.50) return 'common';
  if (n < 0.75) return 'uncommon';
  if (n < 0.90) return 'rare';
  if (n < 0.98) return 'epic';
  return 'legendary';
}
