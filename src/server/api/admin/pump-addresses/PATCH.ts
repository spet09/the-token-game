/**
 * PATCH /api/admin/pump-addresses
 *
 * Saves pump.fun mint addresses to persistent storage (/shared-storage/).
 * Auth: x-admin-secret header (NEBULA_SECRET_KEY)
 *
 * Body: { updates: Array<{ ticker: string; mintAddress: string }> }
 *
 * Overrides are stored in /shared-storage/public/assets/pump-overrides.json
 * and merged into GET responses at read time. This avoids any dependency on
 * source files that don't exist in the production container.
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const OVERRIDES_PATH = '/shared-storage/public/assets/pump-overrides.json';

function loadOverrides(): Record<string, string> {
  try {
    if (existsSync(OVERRIDES_PATH)) {
      return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
    }
  } catch {}
  return {};
}

function saveOverrides(data: Record<string, string>): void {
  mkdirSync(dirname(OVERRIDES_PATH), { recursive: true });
  writeFileSync(OVERRIDES_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export default async function handler(req: Request, res: Response) {
  const adminSecret = getSecret('ADMIN_SECRET') ?? getSecret('NEBULA_SECRET_KEY');
  const provided = req.headers['x-admin-secret'] ?? (req.headers['authorization'] as string | undefined)?.replace('Bearer ', '');
  if (!adminSecret || provided !== adminSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { updates } = req.body as { updates?: Array<{ ticker: string; mintAddress: string }> };
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400).json({ error: 'updates array required' });
    return;
  }

  // Validate all entries
  const SOLANA_ADDR = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  for (const u of updates) {
    if (!u.ticker || typeof u.ticker !== 'string') {
      res.status(400).json({ error: `Invalid ticker: ${u.ticker}` });
      return;
    }
    if (!u.mintAddress || !SOLANA_ADDR.test(u.mintAddress)) {
      res.status(400).json({ error: `Invalid mint address for ${u.ticker}: "${u.mintAddress}" — must be a valid Solana base58 address` });
      return;
    }
  }

  const overrides = loadOverrides();
  const applied: string[] = [];
  const skipped: string[] = [];

  for (const { ticker, mintAddress } of updates) {
    const existing = overrides[ticker];
    if (existing && (existing.includes('raydium.io') || existing.includes('/coin/'))) {
      skipped.push(`${ticker} (already has address)`);
    } else {
      overrides[ticker] = `https://raydium.io/swap/?inputMint=sol&outputMint=${mintAddress}`;
      applied.push(ticker);
    }
  }

  if (applied.length > 0) {
    saveOverrides(overrides);
  }

  res.json({
    applied,
    notFound: skipped,
    message: `Updated ${applied.length} coin(s). ${skipped.length} skipped.`,
  });
}
