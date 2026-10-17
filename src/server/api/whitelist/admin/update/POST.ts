/**
 * POST /api/whitelist/admin/update
 * Approve or reject a wallet registration.
 * Body: { walletAddress: string, status: 'approved' | 'rejected', notes?: string }
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { whitelist } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { walletAddress, status, notes } = req.body as {
    walletAddress?: string;
    status?: string;
    notes?: string;
  };

  if (!walletAddress || !status) {
    return res.status(400).json({ error: 'walletAddress and status are required' });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }

  try {
    const existing = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.walletAddress, walletAddress.trim()))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Wallet not found in whitelist' });
    }

    await db
      .update(whitelist)
      .set({
        status: status as 'approved' | 'rejected',
        notes: notes ?? null,
      })
      .where(eq(whitelist.walletAddress, walletAddress.trim()));

    return res.json({ message: `Wallet ${status}`, walletAddress });
  } catch (error) {
    return res.status(500).json({ error: 'Update failed', message: String(error) });
  }
}
