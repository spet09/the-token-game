/**
 * GET /api/staking/pools
 * Returns staking pool data for USGC, NYC, and other tokens.
 *
 * Network: Solana Mainnet
 *
 * Streamflow pool (confirmed):
 *   Pool address:  Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5
 *   Token mint:    7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5
 *   UI:            https://app.streamflow.finance/staking/solana/mainnet/Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5/7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5
 *
 * TODO: Replace stub APY/TVL with live Streamflow API calls:
 *   import { StreamClient } from '@streamflow/stream';
 *   const client = new StreamClient({ solanaRpcUrl: SOLANA_RPC_URL, cluster: 'mainnet' });
 *   const pool = await client.getStream('Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5');
 *
 * NYC pool address:  FNx49kVWFGd5MyyGyNN7QKZoufUcdF1eSqv6CXMZNqou (unconfirmed — wire once confirmed)
 */

import type { Request, Response } from 'express';

export interface StakingPool {
  id: string;
  token: string;
  tokenSymbol: string;
  network: 'solana';                    // All pools are on Solana mainnet
  tokenMint: string;                    // Solana SPL token mint address
  apy: number;                          // Annual percentage yield (%)
  apyBase: number;                      // Base APY before bonuses
  apyBoost: number;                     // Boost from referrals / lock duration
  tvl: number;                          // Total value locked (USD)
  totalStaked: number;                  // Total tokens staked
  minStake: number;                     // Minimum stake amount
  lockPeriods: { days: number; apyMultiplier: number }[];
  rewardToken: string;
  streamflowPoolAddress: string | null; // Solana mainnet Streamflow pool address
  streamflowStakeUrl: string | null;    // Direct link to Streamflow staking UI
  status: 'active' | 'paused' | 'coming_soon';
}

// ─── Streamflow base URL ──────────────────────────────────────────────────────
const SF_BASE = 'https://app.streamflow.finance/staking/solana/mainnet';

// ─── Pool config ──────────────────────────────────────────────────────────────
// STUB DATA — replace APY/TVL with Streamflow SDK calls (see file header)
const POOLS: StakingPool[] = [
  {
    id: 'usgc',
    token: 'US Gold Coin',
    tokenSymbol: 'USGC',
    network: 'solana',
    tokenMint: '7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5', // confirmed
    apy: 18.5,
    apyBase: 12.0,
    apyBoost: 6.5,
    tvl: 2_450_000,
    totalStaked: 12_500_000,
    minStake: 100,
    lockPeriods: [
      { days: 30,  apyMultiplier: 1.0 },
      { days: 90,  apyMultiplier: 1.25 },
      { days: 180, apyMultiplier: 1.5 },
      { days: 365, apyMultiplier: 2.0 },
    ],
    rewardToken: 'USGC',
    streamflowPoolAddress: 'Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5', // confirmed
    streamflowStakeUrl: `${SF_BASE}/Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5/7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5`,
    status: 'active',
  },
  {
    id: 'nyc',
    token: 'New Yen Coin',
    tokenSymbol: 'NYC',
    network: 'solana',
    tokenMint: 'FNx49kVWFGd5MyyGyNN7QKZoufUcdF1eSqv6CXMZNqou', // unconfirmed — update once confirmed
    apy: 24.0,
    apyBase: 16.0,
    apyBoost: 8.0,
    tvl: 1_180_000,
    totalStaked: 8_200_000,
    minStake: 50,
    lockPeriods: [
      { days: 30,  apyMultiplier: 1.0 },
      { days: 90,  apyMultiplier: 1.3 },
      { days: 180, apyMultiplier: 1.6 },
      { days: 365, apyMultiplier: 2.2 },
    ],
    rewardToken: 'NYC',
    streamflowPoolAddress: null, // TODO: wire NYC pool address once confirmed
    streamflowStakeUrl: null,    // TODO: wire once NYC pool address confirmed
    status: 'active',
  },
  {
    id: 'tienko',
    token: 'Tienko',
    tokenSymbol: 'TIEN',
    network: 'solana',
    tokenMint: '', // TODO: wire TIEN token mint address
    apy: 32.0,
    apyBase: 20.0,
    apyBoost: 12.0,
    tvl: 890_000,
    totalStaked: 4_500_000,
    minStake: 25,
    lockPeriods: [
      { days: 30,  apyMultiplier: 1.0 },
      { days: 90,  apyMultiplier: 1.4 },
      { days: 180, apyMultiplier: 1.8 },
      { days: 365, apyMultiplier: 2.5 },
    ],
    rewardToken: 'TIEN',
    streamflowPoolAddress: null, // TODO: wire TIEN pool address
    streamflowStakeUrl: null,
    status: 'active',
  },
  {
    id: 'lp-usgc-nyc',
    token: 'USGC/NYC LP',
    tokenSymbol: 'USGC-NYC',
    network: 'solana',
    tokenMint: '', // TODO: wire LP token mint
    apy: 45.0,
    apyBase: 30.0,
    apyBoost: 15.0,
    tvl: 560_000,
    totalStaked: 1_200_000,
    minStake: 10,
    lockPeriods: [
      { days: 30,  apyMultiplier: 1.0 },
      { days: 90,  apyMultiplier: 1.5 },
      { days: 180, apyMultiplier: 2.0 },
      { days: 365, apyMultiplier: 3.0 },
    ],
    rewardToken: 'USGC',
    streamflowPoolAddress: null,
    streamflowStakeUrl: null,
    status: 'coming_soon',
  },
];

export default async function handler(_req: Request, res: Response) {
  try {
    // TODO: Replace stub APY/TVL with live Streamflow SDK calls:
    // import { StreamClient } from '@streamflow/stream';
    // const client = new StreamClient({ solanaRpcUrl: process.env.SOLANA_RPC_URL, cluster: 'mainnet' });
    // const pool = await client.getStream('Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5');
    // Then map pool.depositedAmount, pool.withdrawnAmount → TVL; pool.rewardRate → APY

    const activePools = POOLS.filter(p => p.status === 'active');
    const totalTvl = POOLS.reduce((sum, p) => sum + p.tvl, 0);
    const totalStakers = 3_847; // TODO: query from DB or on-chain

    res.json({
      pools: POOLS,
      network: 'solana-mainnet',
      summary: {
        totalTvl,
        totalStakers,
        avgApy: Math.round(activePools.reduce((s, p) => s + p.apy, 0) / activePools.length * 10) / 10,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staking pools', message: String(err) });
  }
}
