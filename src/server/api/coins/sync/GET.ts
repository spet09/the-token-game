/**
 * GET /api/coins/sync?accountKey=<email|wallet>
 *
 * Server-Sent Events stream for real-time balance updates.
 * Partner sites subscribe to this endpoint to receive instant balance
 * notifications when coins are credited from any platform.
 *
 * Auth: Bearer <TIENKO_API_SECRET>  OR  x-tienko-key: <TIENKO_API_SECRET>
 *
 * Events emitted:
 *   connected    — initial connection confirmation with current balance
 *   balance_update — fired whenever coins are credited to this account
 *   heartbeat    — every 30s to keep the connection alive
 *
 * Usage (partner site):
 *   const es = new EventSource(
 *     'https://thetokengame.xyz/api/coins/sync?accountKey=user@example.com',
 *     { headers: { 'x-tienko-key': TIENKO_API_SECRET } }
 *   );
 *   es.addEventListener('balance_update', (e) => {
 *     const { newBalance } = JSON.parse(e.data);
 *     updateUI(newBalance);
 *   });
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { coinBalances } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sseClients } from '../credit/POST.js';

export default async function handler(req: Request, res: Response) {
  const accountKey = ((req.query.accountKey as string | undefined) ?? '').trim().toLowerCase();

  if (!accountKey) {
    res.status(400).json({ error: 'accountKey query parameter is required' });
    return;
  }

  // ── Fetch current balance ─────────────────────────────────────────────────
  const [balance] = await db
    .select({ totalCoins: coinBalances.totalCoins })
    .from(coinBalances)
    .where(eq(coinBalances.walletAddress, accountKey))
    .limit(1);

  const currentBalance = balance?.totalCoins ?? 0;

  // ── Set SSE headers ───────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  // ── Send initial connection event ─────────────────────────────────────────
  const connectedPayload = JSON.stringify({
    type: 'connected',
    accountKey,
    currentBalance,
    ts: Date.now(),
  });
  res.write(`event: connected\ndata: ${connectedPayload}\n\n`);

  // ── Register this client ──────────────────────────────────────────────────
  const client = { accountKey, res };
  sseClients.push(client);

  // ── Heartbeat every 30s ───────────────────────────────────────────────────
  const heartbeat = setInterval(() => {
    try {
      res.write(`event: heartbeat\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`);
    } catch {
      clearInterval(heartbeat);
    }
  }, 30_000);

  // ── Cleanup on disconnect ─────────────────────────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    const idx = sseClients.indexOf(client);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
}
