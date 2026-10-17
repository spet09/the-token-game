/**
 * Webhook Monitor Service
 *
 * Provides structured logging, failure detection, and email alerting
 * for the Stripe coin-delivery webhook pipeline.
 *
 * Usage in coin-delivery.ts:
 *   import { logWebhookEvent, markDelivered, markFailed } from './webhook-monitor.js';
 *
 *   const eventLogId = await logWebhookEvent({ stripeEventId, eventType, sessionId, ... });
 *   await markDelivered(eventLogId, coinsAwarded, durationMs);
 *   // or
 *   await markFailed(eventLogId, reason, coinsAwarded, amountPaid);
 */
import { db } from '../db/client.js';
import { webhookEvents, deliveryAlerts } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendAlertEmail } from './alert-email.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WebhookEventInit {
  stripeEventId: string;
  eventType: string;
  sessionId?: string | null;
  accountKey?: string | null;
  coinsAwarded?: number | null;
  amountPaid?: number | null;
  rawPayload?: string | null;
}

// ── Log a received event ──────────────────────────────────────────────────────

export async function logWebhookEvent(init: WebhookEventInit): Promise<number> {
  try {
    const result = await db.insert(webhookEvents).values({
      stripeEventId: init.stripeEventId,
      eventType:     init.eventType,
      sessionId:     init.sessionId ?? null,
      accountKey:    init.accountKey ?? null,
      coinsAwarded:  init.coinsAwarded ?? null,
      amountPaid:    init.amountPaid ?? null,
      status:        'processing',
      rawPayload:    init.rawPayload ? init.rawPayload.slice(0, 65535) : null,
      receivedAt:    new Date(),
    }).onDuplicateKeyUpdate({
      // If we've seen this event before (retry), bump retryCount
      set: {
        retryCount: db.$count(webhookEvents, eq(webhookEvents.stripeEventId, init.stripeEventId)),
        lastRetriedAt: new Date(),
        status: 'processing',
      },
    });

    // MySQL insertId
    const insertId = (result as unknown as { insertId: number }).insertId;
    return insertId;
  } catch (err) {
    console.error('webhook-monitor: failed to log event', err);
    return 0;
  }
}

// ── Mark delivered ────────────────────────────────────────────────────────────

export async function markDelivered(
  eventLogId: number,
  coinsAwarded: number,
  durationMs: number,
): Promise<void> {
  if (!eventLogId) return;
  try {
    await db.update(webhookEvents)
      .set({
        status:      'delivered',
        coinsAwarded,
        processedMs: durationMs,
        processedAt: new Date(),
      })
      .where(eq(webhookEvents.id, eventLogId));
  } catch (err) {
    console.error('webhook-monitor: failed to mark delivered', err);
  }
}

// ── Mark skipped (idempotency / already delivered) ────────────────────────────

export async function markSkipped(eventLogId: number): Promise<void> {
  if (!eventLogId) return;
  try {
    await db.update(webhookEvents)
      .set({ status: 'skipped', processedAt: new Date() })
      .where(eq(webhookEvents.id, eventLogId));
  } catch (err) {
    console.error('webhook-monitor: failed to mark skipped', err);
  }
}

// ── Mark failed + raise alert ─────────────────────────────────────────────────

export async function markFailed(
  eventLogId: number,
  stripeEventId: string,
  reason: string,
  opts: {
    sessionId?: string | null;
    accountKey?: string | null;
    coinsAwarded?: number | null;
    amountPaid?: number | null;
  } = {},
): Promise<void> {
  const failureReason = reason.slice(0, 512);

  // Update the event log row
  if (eventLogId) {
    try {
      await db.update(webhookEvents)
        .set({
          status:        'failed',
          failureReason,
          processedAt:   new Date(),
        })
        .where(eq(webhookEvents.id, eventLogId));
    } catch (err) {
      console.error('webhook-monitor: failed to mark event as failed', err);
    }
  }

  // Create a delivery alert
  let alertId = 0;
  try {
    const alertResult = await db.insert(deliveryAlerts).values({
      webhookEventId: eventLogId,
      stripeEventId,
      sessionId:      opts.sessionId ?? null,
      accountKey:     opts.accountKey ?? null,
      coinsAwarded:   opts.coinsAwarded ?? null,
      amountPaid:     opts.amountPaid ?? null,
      failureReason,
      severity:       'critical',
      alertSent:      false,
      createdAt:      new Date(),
    });
    alertId = (alertResult as unknown as { insertId: number }).insertId;
  } catch (err) {
    console.error('webhook-monitor: failed to create delivery alert', err);
  }

  // Send email alert (fire-and-forget — don't block the webhook response)
  sendAlertEmail({
    stripeEventId,
    sessionId:    opts.sessionId ?? null,
    accountKey:   opts.accountKey ?? null,
    coinsAwarded: opts.coinsAwarded ?? null,
    amountPaid:   opts.amountPaid ?? null,
    failureReason,
    alertId,
  }).then(() => {
    // Mark alert as sent
    if (alertId) {
      db.update(deliveryAlerts)
        .set({ alertSent: true, alertSentAt: new Date() })
        .where(eq(deliveryAlerts.id, alertId))
        .catch(() => {});
    }
  }).catch((err) => {
    console.error('webhook-monitor: failed to send alert email', err);
  });
}
