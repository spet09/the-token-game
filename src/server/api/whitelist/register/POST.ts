/**
 * POST /api/whitelist/register
 * Register a wallet address for the global whitelist.
 * Returns 409 if already registered, 201 on success.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { whitelist } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { walletAddress } = req.body as { walletAddress?: string };

  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'walletAddress is required' });
  }

  const addr = walletAddress.trim();
  if (addr.length < 32 || addr.length > 64) {
    return res.status(400).json({ error: 'Invalid wallet address length' });
  }

  try {
    // Check for existing registration
    const existing = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.walletAddress, addr))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        error: 'Already registered',
        status: existing[0].status,
        registeredAt: existing[0].registeredAt,
      });
    }

    const result = await db.insert(whitelist).values({
      walletAddress: addr,
      status: 'pending',
    });

    const insertId = Number(result[0].insertId);
    const newEntry = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.id, insertId))
      .limit(1);

    return res.status(201).json({
      message: 'Wallet registered successfully',
      entry: newEntry[0],
    });
  } catch (error) {
    console.error('Whitelist register error:', error);
    return res.status(500).json({ error: 'Registration failed', message: String(error) });
  }
}
