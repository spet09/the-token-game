/**
 * GET /api/staking/position?wallet=0x...
 * Returns a user's staking positions and pending rewards.
 *
 * WIRE: Replace stub with on-chain reads via viem/wagmi or Streamflow SDK.
 */

import type { Request, Response } from 'express';

export interface StakingPosition {
  poolId: string;
  tokenSymbol: string;
  amountStaked: number;
  lockDays: number;
  stakedAt: string;
  unlocksAt: string;
  pendingRewards: number;
  rewardToken: string;
  apy: number;
  valueUsd: number;
}

export default async function handler(req: Request, res: Response) {
  const { wallet } = req.query as { wallet?: string };

  if (!wallet) {
    return res.status(400).json({ error: 'wallet query param required' });
  }

  // WIRE: Replace with on-chain reads
  // const positions = await readContract({ address: STAKING_CONTRACT, abi, functionName: 'getPositions', args: [wallet] });

  // Stub: return empty for unknown wallets, sample data for demo
  const isDemo = wallet.toLowerCase().startsWith('0xdemo');
  const positions: StakingPosition[] = isDemo ? [
    {
      poolId: 'usgc',
      tokenSymbol: 'USGC',
      amountStaked: 5000,
      lockDays: 90,
      stakedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      unlocksAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      pendingRewards: 187.5,
      rewardToken: 'USGC',
      apy: 18.5,
      valueUsd: 5000,
    },
    {
      poolId: 'nyc',
      tokenSymbol: 'NYC',
      amountStaked: 2000,
      lockDays: 180,
      stakedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      unlocksAt: new Date(Date.now() + 135 * 86400000).toISOString(),
      pendingRewards: 144.0,
      rewardToken: 'NYC',
      apy: 24.0,
      valueUsd: 2000,
    },
  ] : [];

  const totalValueUsd = positions.reduce((s, p) => s + p.valueUsd, 0);
  const totalPendingRewards = positions.reduce((s, p) => s + p.pendingRewards, 0);

  res.json({
    wallet,
    positions,
    summary: {
      totalValueUsd,
      totalPendingRewards,
      positionCount: positions.length,
    },
  });
}
