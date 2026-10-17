/**
 * POST /api/wallet/withdraw
 *
 * Moves coins from an account balance to a linked Solana wallet.
 * The wallet must be connected (passed in the request) — this is the ONLY
 * step that requires a wallet connection.
 *
 * Body: { accountKey, toWallet, coins }
 *   accountKey — email or wallet address used at purchase time
 *   toWallet   — Solana wallet address to link and withdraw to
 *   coins      — number of coins to withdraw (must be ≤ balance)
 *
 * On success:
 *   - Links toWallet to the account (updates linkedWallet)
 *   - Deducts coins from account balance
 *   - Records a withdrawal entry
 *   - Returns new balance
 *
 * Note: "Withdrawal" here is an in-app record. Actual on-chain token transfer
 * is handled separately by the cross-platform sync system (future).
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances, coinWithdrawals } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { accountKey, toWallet, coins } = req.body as {
    accountKey: string;
    toWallet: string;
    coins: number;
  };

  if (!accountKey || !toWallet || !coins || coins <= 0) {
    res.status(400).json({ error: 'accountKey, toWallet, and coins (>0) are required' });
    return;
  }

  const coinsToWithdraw = Math.floor(coins);

  try {
    // Fetch current balance
    const [balance] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, accountKey.trim()))
      .limit(1);

    if (!balance) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    if (balance.totalCoins < coinsToWithdraw) {
      res.status(402).json({
        error: 'Insufficient balance',
        available: balance.totalCoins,
        requested: coinsToWithdraw,
      });
      return;
    }

    // Deduct coins and link wallet atomically
    await db
      .update(coinBalances)
      .set({
        totalCoins: sql`total_coins - ${coinsToWithdraw}`,
        linkedWallet: toWallet.trim(),
        updatedAt: sql`NOW()`,
      })
      .where(eq(coinBalances.walletAddress, accountKey.trim()));

    // Record withdrawal
    await db.insert(coinWithdrawals).values({
      accountKey: accountKey.trim(),
      toWallet: toWallet.trim(),
      coinsWithdrawn: coinsToWithdraw,
      status: 'completed',
      note: 'User-initiated withdrawal to connected wallet',
    });

    // Return updated balance
    const [updated] = await db
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, accountKey.trim()))
      .limit(1);

    console.log(`wallet.withdraw: ✅ withdrew ${coinsToWithdraw} coins from ${accountKey} to ${toWallet}`);

    res.json({
      success: true,
      accountKey: accountKey.trim(),
      toWallet: toWallet.trim(),
      coinsWithdrawn: coinsToWithdraw,
      newBalance: updated?.totalCoins ?? 0,
    });
  } catch (err) {
    console.error('wallet.withdraw: error', err);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
}
