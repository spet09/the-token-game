/**
 * GET /api/whitelist/status?wallet=<address>
 * Check the whitelist status of a wallet address.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { whitelist } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const wallet = req.query.wallet as string | undefined;

  if (!wallet) {
    return res.status(400).json({ error: 'wallet query param required' });
  }

  try {
    const entry = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.walletAddress, wallet.trim()))
      .limit(1);

    if (entry.length === 0) {
      return res.status(404).json({ registered: false });
    }

    return res.json({
      registered: true,
      status: entry[0].status,
      registeredAt: entry[0].registeredAt,
      updatedAt: entry[0].updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Status check failed', message: String(error) });
  }
}
