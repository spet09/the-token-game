/**
 * POST /api/coins/credit
 *
 * Authenticated cross-platform coin credit endpoint.
 * Called by partner Tienko sites when a user purchases coins on their platform.
 *
 * Auth: Bearer <TIENKO_API_SECRET>  OR  x-tienko-key: <TIENKO_API_SECRET>
 *
 * Body:
 *   accountKey   string  — email address or wallet address (the account identity)
 *   coins        number  — coins to credit (positive integer)
 *   platform     string  — calling site, e.g. "tienko.io"
 *   reason       string  — human-readable reason, e.g. "Stripe purchase #abc"
 *   idempotencyKey string — optional; prevents double-credit on retry
 *
 * Response 200:
 *   { success: true, accountKey, newBalance, coinsAdded, platform }
 *
 * Response 400: validation error
 * Response 401: bad/missing API key
 * Response 409: idempotency key already used
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances, coinPurchases } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const {
    accountKey,
    coins,
    platform = 'unknown',
    reason = 'Cross-platform credit',
    idempotencyKey,
  } = req.body as {
    accountKey?: string;
    coins?: number;
    platform?: string;
    reason?: string;
    idempotencyKey?: string;
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!accountKey || typeof accountKey !== 'string' || !accountKey.trim()) {
    res.status(400).json({ error: 'accountKey is required (email or wallet address)' });
    return;
  }
  const coinsInt = Math.floor(Number(coins));
  if (!coins || isNaN(coinsInt) || coinsInt <= 0) {
    res.status(400).json({ error: 'coins must be a positive integer' });
    return;
  }

  const key = accountKey.trim().toLowerCase();
  const callingPlatform = (req as Request & { tienkoPlatform?: string }).tienkoPlatform ?? platform;

  // ── Idempotency check ───────────────────────────────────────────────────────
  if (idempotencyKey) {
    const existing = await db
      .select({ id: coinPurchases.id, status: coinPurchases.status })
      .from(coinPurchases)
      .where(eq(coinPurchases.stripeSessionId, `idem_${idempotencyKey}`))
      .limit(1);

    if (existing.length > 0 && existing[0].status === 'delivered') {
      const [balance] = await db
        .select({ totalCoins: coinBalances.totalCoins })
        .from(coinBalances)
        .where(eq(coinBalances.walletAddress, key))
        .limit(1);

      res.status(409).json({
        error: 'Idempotency key already used',
        idempotencyKey,
        currentBalance: balance?.totalCoins ?? 0,
      });
      return;
    }
  }

  try {
    // ── Credit coins ──────────────────────────────────────────────────────────
    await db
      .insert(coinBalances)
      .values({
        walletAddress: key,
        totalCoins: coinsInt,
        totalSpentUsd: '0',
      })
      .onDuplicateKeyUpdate({
        set: {
          totalCoins: sql`total_coins + ${coinsInt}`,
          updatedAt: sql`NOW()`,
        },
      });

    // ── Record the credit as a purchase entry ─────────────────────────────────
    const sessionId = idempotencyKey ? `idem_${idempotencyKey}` : `xplat_${Date.now()}_${key.slice(0, 8)}`;
    await db
      .insert(coinPurchases)
      .values({
        stripeSessionId: sessionId,
        accountEmail: key.includes('@') ? key : undefined,
        walletAddress: key,
        bundleId: 'cross-platform',
        bundleName: `${callingPlatform} — ${reason}`,
        coinsAwarded: coinsInt,
        amountPaid: 0,
        currency: 'usd',
        status: 'delivered',
        deliveredAt: new Date(),
      })
      .onDuplicateKeyUpdate({ set: { status: 'delivered' } });

    // ── Fetch updated balance ─────────────────────────────────────────────────
    const [updated] = await db
      .select({ totalCoins: coinBalances.totalCoins })
      .from(coinBalances)
      .where(eq(coinBalances.walletAddress, key))
      .limit(1);

    const newBalance = updated?.totalCoins ?? coinsInt;

    console.log(`coins.credit: ✅ +${coinsInt} coins → ${key} from ${callingPlatform} (balance=${newBalance})`);

    // ── Broadcast to SSE subscribers ──────────────────────────────────────────
    broadcastBalanceUpdate(key, newBalance);

    res.json({
      success: true,
      accountKey: key,
      coinsAdded: coinsInt,
      newBalance,
      platform: callingPlatform,
      reason,
    });
  } catch (err) {
    console.error('coins.credit: error', err);
    res.status(500).json({ error: 'Failed to credit coins' });
  }
}

// ── SSE broadcast (imported by the SSE handler) ───────────────────────────────
type SseClient = { accountKey: string; res: Response };
export const sseClients: SseClient[] = [];

export function broadcastBalanceUpdate(accountKey: string, newBalance: number) {
  const payload = JSON.stringify({ type: 'balance_update', accountKey, newBalance, ts: Date.now() });
  for (const client of sseClients) {
    if (client.accountKey === accountKey) {
      try {
        client.res.write(`data: ${payload}\n\n`);
      } catch {
        // client disconnected — will be cleaned up on close
      }
    }
  }
}
