/**
 * POST /api/admin/webhook-retry
 *
 * Manually retry a failed coin delivery for a specific Stripe session.
 * Fetches the session from Stripe and re-runs deliverCoins().
 *
 * Auth: x-admin-secret: <ADMIN_SECRET>
 *
 * Body:
 *   sessionId   string  — Stripe checkout session ID (cs_...)
 *   alertId     number  — optional; marks the delivery_alert as resolved on success
 *
 * Response 200:
 *   { success: true, sessionId, coinsDelivered, accountKey, message }
 *
 * Response 400: validation error
 * Response 401: bad/missing admin secret
 * Response 500: Stripe fetch or delivery error
 */
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { getSecret } from '#airo/secrets';
import { db } from '../../../db/client.js';
import { deliveryAlerts, coinPurchases } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { deliverCoins } from '../../../services/coin-delivery.js';

export default async function handler(req: Request, res: Response) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const adminSecret = getSecret('ADMIN_SECRET') ?? getSecret('NEBULA_SECRET_KEY');
  const provided = req.headers['x-admin-secret'] ?? req.headers['authorization']?.replace('Bearer ', '');
  if (!adminSecret || provided !== adminSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { sessionId, alertId } = req.body as { sessionId?: string; alertId?: number };

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    res.status(400).json({ error: 'sessionId (cs_...) is required' });
    return;
  }

  // ── Reset purchase status so delivery runs again ───────────────────────────
  await db
    .update(coinPurchases)
    .set({ status: 'pending', failureReason: null, updatedAt: new Date() })
    .where(eq(coinPurchases.stripeSessionId, sessionId))
    .catch(() => {});

  // ── Fetch session from Stripe ──────────────────────────────────────────────
  const stripeKey = getSecret('STRIPE_SECRET_KEY');
  if (!stripeKey) {
    res.status(503).json({ error: 'STRIPE_SECRET_KEY not configured' });
    return;
  }

  let session: Stripe.Checkout.Session;
  try {
    const stripe = new Stripe(stripeKey as string);
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  } catch (err) {
    console.error('webhook-retry: failed to fetch Stripe session', err);
    res.status(500).json({ error: `Failed to fetch Stripe session: ${String(err)}` });
    return;
  }

  // ── Re-run delivery ────────────────────────────────────────────────────────
  try {
    await deliverCoins(session, `retry_${sessionId}_${Date.now()}`);
  } catch (err) {
    res.status(500).json({ error: `Delivery failed: ${String(err)}` });
    return;
  }

  // ── Verify delivery succeeded ──────────────────────────────────────────────
  const [purchase] = await db
    .select({ status: coinPurchases.status, coinsAwarded: coinPurchases.coinsAwarded, walletAddress: coinPurchases.walletAddress })
    .from(coinPurchases)
    .where(eq(coinPurchases.stripeSessionId, sessionId))
    .limit(1);

  if (!purchase || purchase.status !== 'delivered') {
    res.status(500).json({ error: 'Delivery re-ran but status is not delivered', purchase });
    return;
  }

  // ── Resolve the alert if provided ─────────────────────────────────────────
  if (alertId) {
    await db
      .update(deliveryAlerts)
      .set({ resolvedAt: new Date(), resolvedBy: 'admin' })
      .where(eq(deliveryAlerts.id, alertId))
      .catch(() => {});
  }

  console.log(`webhook-retry: ✅ manual retry succeeded for session=${sessionId} coins=${purchase.coinsAwarded} account=${purchase.walletAddress}`);

  res.json({
    success:        true,
    sessionId,
    coinsDelivered: purchase.coinsAwarded,
    accountKey:     purchase.walletAddress,
    message:        `Successfully delivered ${purchase.coinsAwarded} coins to ${purchase.walletAddress}`,
  });
}
