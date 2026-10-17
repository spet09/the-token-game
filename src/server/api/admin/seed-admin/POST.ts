/**
 * POST /api/admin/seed-admin
 *
 * One-time endpoint to create the initial admin user via BetterAuth.
 * Protected by NEBULA_SECRET_KEY so only the site owner can call it.
 * Safe to call multiple times — returns 409 if the user already exists.
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';
import { getAuth } from '@/lib/auth/auth';

export default async function handler(req: Request, res: Response) {
  // Require the admin secret
  const secret = req.headers['x-admin-secret'];
  const expected = getSecret('NEBULA_SECRET_KEY');
  if (!expected || secret !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const auth = getAuth();
    const result = await auth.api.signUpEmail({
      body: { email, password, name: name ?? 'Admin' },
    });
    return res.status(201).json({ ok: true, userId: (result as { user?: { id: string } }).user?.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
      return res.status(409).json({ error: 'User already exists', detail: msg });
    }
    return res.status(500).json({ error: 'Failed to create user', detail: msg });
  }
}
