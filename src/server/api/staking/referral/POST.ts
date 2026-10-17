/**
 * POST /api/staking/referral
 * Track a referral when a new user stakes using a referral code.
 * Body: { referralCode: string, newStakerWallet: string, poolId: string, amountStaked: number }
 *
 * WIRE: Replace with DB insert once database schema is extended.
 */

import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const { referralCode, newStakerWallet, poolId, amountStaked } = req.body as {
    referralCode?: string;
    newStakerWallet?: string;
    poolId?: string;
    amountStaked?: number;
  };

  if (!referralCode || !newStakerWallet) {
    return res.status(400).json({ error: 'referralCode and newStakerWallet are required' });
  }

  // WIRE: DB insert
  // await db.insert(referrals).values({ referralCode, newStakerWallet, poolId, amountStaked, createdAt: new Date() });

  console.log(`[Referral] Code ${referralCode} used by ${newStakerWallet} staking ${amountStaked} in ${poolId}`);

  res.status(201).json({
    ok: true,
    message: 'Referral tracked',
    referralCode,
    newStakerWallet,
  });
}
