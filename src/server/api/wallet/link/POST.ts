/**
 * POST /api/wallet/link
 *
 * Links a Solana wallet address to an email-based account.
 * Called when a user connects their wallet after purchasing with email only.
 *
 * Body: { email, walletAddress }
 *
 * This allows the balance page to show the account when looking up by wallet,
 * and enables withdrawals.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { email, walletAddress } = req.body as {
    email: string;
    walletAddress: string;
  };

  if (!email || !walletAddress) {
    res.status(400).json({ error: 'email and walletAddress are required' });
    return;
  }

  const emailKey = email.trim().toLowerCase();
  const wallet = walletAddress.trim();

  try {
    // Find the account by email
    const [account] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, emailKey))
      .limit(1);

    if (!account) {
      res.status(404).json({ error: 'No account found for this email. Purchase coins first.' });
      return;
    }

    // Update the linked wallet
    await db
      .update(coinBalances)
      .set({ linkedWallet: wallet })
      .where(eq(coinBalances.walletAddress, emailKey));

    console.log(`wallet.link: linked wallet=${wallet} to email=${emailKey}`);

    res.json({
      success: true,
      accountKey: emailKey,
      linkedWallet: wallet,
      totalCoins: account.totalCoins,
    });
  } catch (err) {
    console.error('wallet.link: error', err);
    res.status(500).json({ error: 'Failed to link wallet' });
  }
}
