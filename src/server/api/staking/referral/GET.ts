/**
 * GET /api/staking/referral?wallet=0x...
 * Returns a user's referral code, stats, and the top referral leaderboard.
 */

import type { Request, Response } from 'express';
import crypto from 'crypto';

function generateReferralCode(wallet: string): string {
  return 'TG-' + crypto.createHash('sha256').update(wallet.toLowerCase()).digest('hex').slice(0, 8).toUpperCase();
}

// STUB leaderboard — WIRE: replace with DB query
const LEADERBOARD = [
  { rank: 1, wallet: '0xAb12...3F4e', code: 'TG-A1B2C3D4', referrals: 47, earned: 2350, tier: 'Diamond' },
  { rank: 2, wallet: '0x9c3D...8aB1', code: 'TG-9C3D8AB1', referrals: 38, earned: 1900, tier: 'Platinum' },
  { rank: 3, wallet: '0x5E7f...2c90', code: 'TG-5E7F2C90', referrals: 31, earned: 1550, tier: 'Gold' },
  { rank: 4, wallet: '0x1A4b...7d3E', code: 'TG-1A4B7D3E', referrals: 24, earned: 1200, tier: 'Gold' },
  { rank: 5, wallet: '0x8F2c...4e1A', code: 'TG-8F2C4E1A', referrals: 19, earned: 950,  tier: 'Silver' },
  { rank: 6, wallet: '0x3D9a...6b2F', code: 'TG-3D9A6B2F', referrals: 15, earned: 750,  tier: 'Silver' },
  { rank: 7, wallet: '0x7B1e...9c4D', code: 'TG-7B1E9C4D', referrals: 12, earned: 600,  tier: 'Bronze' },
  { rank: 8, wallet: '0x2C8f...5a7B', code: 'TG-2C8F5A7B', referrals: 9,  earned: 450,  tier: 'Bronze' },
  { rank: 9, wallet: '0x6A3d...1e8C', code: 'TG-6A3D1E8C', referrals: 7,  earned: 350,  tier: 'Bronze' },
  { rank: 10, wallet: '0x4E5b...3f2A', code: 'TG-4E5B3F2A', referrals: 5, earned: 250,  tier: 'Bronze' },
];

export default async function handler(req: Request, res: Response) {
  const { wallet } = req.query as { wallet?: string };

  if (!wallet) {
    // Return just leaderboard + tier info when no wallet provided
    return res.json({
      leaderboard: LEADERBOARD,
      tiers: REFERRAL_TIERS,
    });
  }

  const code = generateReferralCode(wallet);

  // WIRE: query DB for actual referral stats
  const stats = {
    code,
    referrals: 0,
    pendingRewards: 0,
    totalEarned: 0,
    tier: 'Bronze' as string,
    nextTierAt: 5,
    referralLink: `https://thetokengame.xyz/staking?ref=${code}`,
  };

  res.json({
    stats,
    leaderboard: LEADERBOARD,
    tiers: REFERRAL_TIERS,
  });
}

export const REFERRAL_TIERS = [
  { name: 'Bronze',   minReferrals: 1,  rewardPct: 5,  color: '#cd7f32', perks: ['5% of referee staking rewards', 'Bronze badge'] },
  { name: 'Silver',   minReferrals: 10, rewardPct: 7,  color: '#C0C0C0', perks: ['7% of referee staking rewards', 'Silver badge', 'Priority support'] },
  { name: 'Gold',     minReferrals: 25, rewardPct: 10, color: '#FFD700', perks: ['10% of referee staking rewards', 'Gold badge', 'Exclusive pool access'] },
  { name: 'Platinum', minReferrals: 50, rewardPct: 12, color: '#E5E4E2', perks: ['12% of referee staking rewards', 'Platinum badge', 'Early pool access', 'Monthly bonus'] },
  { name: 'Diamond',  minReferrals: 100, rewardPct: 15, color: '#b9f2ff', perks: ['15% of referee staking rewards', 'Diamond badge', 'All pool access', 'Quarterly airdrop', 'Direct team access'] },
];
