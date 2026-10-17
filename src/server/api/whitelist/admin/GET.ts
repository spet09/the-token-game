/**
 * GET /api/whitelist/admin
 * Fetch all whitelist registrations (admin only).
 * Supports ?status=pending|approved|rejected filter.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { whitelist } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const statusFilter = req.query.status as string | undefined;

  try {
    let rows;
    if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
      rows = await db
        .select()
        .from(whitelist)
        .where(eq(whitelist.status, statusFilter as 'pending' | 'approved' | 'rejected'))
        .orderBy(whitelist.registeredAt);
    } else {
      rows = await db.select().from(whitelist).orderBy(whitelist.registeredAt);
    }

    const counts = {
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      rejected: rows.filter((r) => r.status === 'rejected').length,
    };

    return res.json({ entries: rows, counts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch whitelist', message: String(error) });
  }
}
