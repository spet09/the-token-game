/**
 * GET /api/admin/webhook-monitor
 *
 * Delivery health dashboard for the Stripe coin-delivery pipeline.
 * Returns summary stats, recent events, and all unresolved alerts.
 *
 * Auth: x-admin-secret: <ADMIN_SECRET>
 *
 * Query params:
 *   limit   number  — max events to return (default 50, max 200)
 *   status  string  — filter by status: received|processing|delivered|failed|skipped|all (default: all)
 *   hours   number  — look-back window in hours (default 24, max 168)
 *
 * Response:
 *   {
 *     summary: { total, delivered, failed, skipped, successRate, avgProcessingMs },
 *     alerts:  [ unresolved delivery_alerts ],
 *     events:  [ recent webhook_events ],
 *     generatedAt: ISO string
 *   }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { webhookEvents, deliveryAlerts } from '../../../db/schema.js';
import { eq, desc, gte, and, isNull, sql } from 'drizzle-orm';
import { getSecret } from '#airo/secrets';

export default async function handler(req: Request, res: Response) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const adminSecret = getSecret('ADMIN_SECRET') ?? getSecret('NEBULA_SECRET_KEY');
  const provided = req.headers['x-admin-secret'] ?? req.headers['authorization']?.replace('Bearer ', '');
  if (!adminSecret || provided !== adminSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const limit  = Math.min(parseInt((req.query.limit  as string) ?? '50',  10), 200);
  const hours  = Math.min(parseInt((req.query.hours  as string) ?? '24',  10), 168);
  const status = (req.query.status as string | undefined) ?? 'all';

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  try {
    // ── Summary stats ─────────────────────────────────────────────────────────
    const [stats] = await db
      .select({
        total:     sql<number>`COUNT(*)`,
        delivered: sql<number>`SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)`,
        failed:    sql<number>`SUM(CASE WHEN status = 'failed'    THEN 1 ELSE 0 END)`,
        skipped:   sql<number>`SUM(CASE WHEN status = 'skipped'   THEN 1 ELSE 0 END)`,
        avgMs:     sql<number>`AVG(CASE WHEN processed_ms IS NOT NULL THEN processed_ms END)`,
      })
      .from(webhookEvents)
      .where(gte(webhookEvents.receivedAt, since));

    const total     = Number(stats?.total     ?? 0);
    const delivered = Number(stats?.delivered ?? 0);
    const failed    = Number(stats?.failed    ?? 0);
    const skipped   = Number(stats?.skipped   ?? 0);
    const avgMs     = stats?.avgMs != null ? Math.round(Number(stats.avgMs)) : null;
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 100;

    // ── Unresolved alerts ─────────────────────────────────────────────────────
    const alerts = await db
      .select()
      .from(deliveryAlerts)
      .where(isNull(deliveryAlerts.resolvedAt))
      .orderBy(desc(deliveryAlerts.createdAt))
      .limit(50);

    // ── Recent events ─────────────────────────────────────────────────────────
    const conditions = [gte(webhookEvents.receivedAt, since)];
    if (status !== 'all') {
      conditions.push(eq(webhookEvents.status, status as 'received' | 'processing' | 'delivered' | 'failed' | 'skipped'));
    }

    const events = await db
      .select({
        id:            webhookEvents.id,
        stripeEventId: webhookEvents.stripeEventId,
        eventType:     webhookEvents.eventType,
        sessionId:     webhookEvents.sessionId,
        accountKey:    webhookEvents.accountKey,
        coinsAwarded:  webhookEvents.coinsAwarded,
        amountPaid:    webhookEvents.amountPaid,
        status:        webhookEvents.status,
        failureReason: webhookEvents.failureReason,
        retryCount:    webhookEvents.retryCount,
        processedMs:   webhookEvents.processedMs,
        receivedAt:    webhookEvents.receivedAt,
        processedAt:   webhookEvents.processedAt,
        // Omit rawPayload from list view — too large
      })
      .from(webhookEvents)
      .where(and(...conditions))
      .orderBy(desc(webhookEvents.receivedAt))
      .limit(limit);

    res.json({
      summary: {
        windowHours: hours,
        total,
        delivered,
        failed,
        skipped,
        successRate,
        avgProcessingMs: avgMs,
        unresolvedAlerts: alerts.length,
      },
      alerts,
      events,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('webhook-monitor: GET error', err);
    res.status(500).json({ error: 'Failed to fetch monitoring data' });
  }
}
