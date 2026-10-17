/**
 * Coin Delivery Service
 *
 * Credits purchased coins to an account after a successful Stripe checkout.
 * Every delivery attempt is logged to webhook_events for monitoring.
 * Failures raise a delivery_alert and trigger an operator email.
 *
 * Account key priority:
 *   1. Stripe customer_details.email  — always present after checkout
 *   2. session.metadata.walletAddress — present if user had wallet connected
 *   3. Fallback to session ID (should never happen in practice)
 *
 * This means coins are ALWAYS credited, even without a connected wallet.
 * Users can later link their wallet and withdraw coins via /api/wallet/withdraw.
 */
import Stripe from 'stripe';
import { db } from '../db/client.js';
import { coinPurchases, coinBalances } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import {
  logWebhookEvent,
  markDelivered,
  markFailed,
  markSkipped,
} from './webhook-monitor.js';

// ─── Bundle Map ───────────────────────────────────────────────────────────────
const BUNDLE_MAP: Record<string, { id: string; name: string; coins: number }> = {
  'price_1TxOm2DrRYQXHqfPmBpb8rs9': { id: 'starter',   name: 'Starter Pack',   coins: 500   },
  'price_1TxOm3DrRYQXHqfPhWVXhz18': { id: 'explorer',  name: 'Explorer Pack',  coins: 1400  },
  'price_1TxOm3DrRYQXHqfPjZpcPfPu': { id: 'collector', name: 'Collector Pack', coins: 3600  },
  'price_1TxOm4DrRYQXHqfPY7OZna3i': { id: 'champion',  name: 'Champion Pack',  coins: 10000 },
  'price_1TxOm5DrRYQXHqfPqtbfDb32': { id: 'legend',    name: 'Legend Pack',    coins: 26000 },
};

export async function deliverCoins(
  session: Stripe.Checkout.Session,
  stripeEventId = `evt_manual_${session.id}`,
): Promise<void> {
  const sessionId = session.id;
  const startMs = Date.now();

  // ── Log the incoming event ─────────────────────────────────────────────────
  const email = session.customer_details?.email ?? null;
  const walletFromMeta = session.metadata?.walletAddress ?? null;
  const accountKey = email ?? walletFromMeta ?? `session_${sessionId}`;
  const walletAddress = walletFromMeta ?? accountKey;
  const amountPaid = session.amount_total ?? 0;

  const eventLogId = await logWebhookEvent({
    stripeEventId,
    eventType:  'checkout.session.completed',
    sessionId,
    accountKey,
    amountPaid,
    rawPayload: JSON.stringify(session).slice(0, 65535),
  });

  // ── Idempotency check — skip if already processed ──────────────────────────
  const existing = await db
    .select({ id: coinPurchases.id, status: coinPurchases.status })
    .from(coinPurchases)
    .where(eq(coinPurchases.stripeSessionId, sessionId))
    .limit(1);

  if (existing.length > 0 && existing[0].status === 'delivered') {
    console.log(`coin-delivery: already delivered for session=${sessionId}`);
    await markSkipped(eventLogId);
    return;
  }

  console.log(`coin-delivery: accountKey=${accountKey} wallet=${walletAddress ?? 'none'} session=${sessionId}`);

  // ── Determine bundle ───────────────────────────────────────────────────────
  const lineItems = session.line_items?.data ?? [];
  let bundleInfo: { id: string; name: string; coins: number } | null = null;
  let totalCoins = 0;

  for (const item of lineItems) {
    const priceId = typeof item.price === 'string' ? item.price : item.price?.id;
    if (priceId && BUNDLE_MAP[priceId]) {
      const bundle = BUNDLE_MAP[priceId];
      const qty = item.quantity ?? 1;
      totalCoins += bundle.coins * qty;
      bundleInfo = bundle;
    }
  }

  // Fallback: infer from amount if line items not expanded
  if (!bundleInfo) {
    if (amountPaid <= 499)        bundleInfo = BUNDLE_MAP['price_1TxOm2DrRYQXHqfPmBpb8rs9'];
    else if (amountPaid <= 999)   bundleInfo = BUNDLE_MAP['price_1TxOm3DrRYQXHqfPhWVXhz18'];
    else if (amountPaid <= 2000)  bundleInfo = BUNDLE_MAP['price_1TxOm3DrRYQXHqfPjZpcPfPu'];
    else if (amountPaid <= 5000)  bundleInfo = BUNDLE_MAP['price_1TxOm4DrRYQXHqfPY7OZna3i'];
    else                          bundleInfo = BUNDLE_MAP['price_1TxOm5DrRYQXHqfPqtbfDb32'];
    totalCoins = bundleInfo?.coins ?? 0;
  }

  if (!bundleInfo || totalCoins === 0) {
    const reason = `Could not determine bundle for session=${sessionId} amount=${amountPaid}`;
    console.error(`coin-delivery: ❌ ${reason}`);
    await recordPurchase(sessionId, session, accountKey, walletAddress, email, 'unknown', 'Unknown Bundle', 0, 'failed', reason);
    await markFailed(eventLogId, stripeEventId, reason, { sessionId, accountKey, coinsAwarded: 0, amountPaid });
    return;
  }

  try {
    // Record purchase (upsert)
    if (existing.length === 0) {
      await recordPurchase(sessionId, session, accountKey, walletAddress, email, bundleInfo.id, bundleInfo.name, totalCoins, 'pending');
    }

    // Credit coins to account balance (keyed by accountKey = email or wallet)
    await db
      .insert(coinBalances)
      .values({
        walletAddress: accountKey,
        linkedWallet:  walletFromMeta ?? null,
        totalCoins,
        totalSpentUsd: String((amountPaid / 100).toFixed(2)),
      })
      .onDuplicateKeyUpdate({
        set: {
          totalCoins:    sql`total_coins + ${totalCoins}`,
          totalSpentUsd: sql`total_spent_usd + ${(amountPaid / 100).toFixed(2)}`,
          ...(walletFromMeta ? { linkedWallet: walletFromMeta } : {}),
          updatedAt: sql`NOW()`,
        },
      });

    // Mark purchase as delivered
    await db
      .update(coinPurchases)
      .set({ status: 'delivered', deliveredAt: new Date(), updatedAt: new Date() })
      .where(eq(coinPurchases.stripeSessionId, sessionId));

    const durationMs = Date.now() - startMs;
    console.log(`coin-delivery: ✅ delivered ${totalCoins} coins to account=${accountKey} session=${sessionId} (${durationMs}ms)`);

    await markDelivered(eventLogId, totalCoins, durationMs);

  } catch (err) {
    const reason = String(err).slice(0, 512);
    console.error(`coin-delivery: ❌ failed to deliver coins for session=${sessionId}`, err);

    await db
      .update(coinPurchases)
      .set({ status: 'failed', failureReason: reason, updatedAt: new Date() })
      .where(eq(coinPurchases.stripeSessionId, sessionId))
      .catch(() => {});

    await markFailed(eventLogId, stripeEventId, reason, {
      sessionId,
      accountKey,
      coinsAwarded: totalCoins,
      amountPaid,
    });
  }
}

async function recordPurchase(
  sessionId: string,
  session: Stripe.Checkout.Session,
  accountKey: string,
  walletAddress: string,
  accountEmail: string | null,
  bundleId: string,
  bundleName: string,
  coinsAwarded: number,
  status: 'pending' | 'delivered' | 'failed',
  failureReason?: string,
) {
  await db.insert(coinPurchases).values({
    stripeSessionId: sessionId,
    stripePaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
    accountEmail:    accountEmail ?? undefined,
    walletAddress:   accountKey,
    bundleId,
    bundleName,
    coinsAwarded,
    amountPaid:      session.amount_total ?? 0,
    currency:        session.currency ?? 'usd',
    status,
    failureReason,
    deliveredAt:     status === 'delivered' ? new Date() : undefined,
  }).onDuplicateKeyUpdate({ set: { status, updatedAt: new Date() } });
}
