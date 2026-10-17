/**
 * POST /api/leaderboard/register
 * Body: { address: string, displayName?: string }
 *
 * Adds a wallet to the leaderboard registry so it gets included in rankings.
 * Called automatically when a user connects their wallet on the site.
 */

import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const REGISTRY_PATH = '/private/leaderboard-wallets.json';

interface Registry {
  wallets: Array<{ address: string; displayName?: string; registeredAt: number }>;
}

async function loadRegistry(): Promise<Registry> {
  try {
    const raw = await fs.readFile(REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw) as Registry;
  } catch {
    return { wallets: [] };
  }
}

export default async function handler(req: Request, res: Response) {
  const { address, displayName } = req.body as { address?: string; displayName?: string };

  if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const registry = await loadRegistry();

    // Upsert — update displayName if already registered
    const existing = registry.wallets.find((w) => w.address === address);
    if (existing) {
      if (displayName) existing.displayName = displayName;
    } else {
      registry.wallets.push({ address, displayName, registeredAt: Date.now() });
    }

    await fs.mkdir(path.dirname(REGISTRY_PATH), { recursive: true });
    await fs.writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2));

    res.json({ ok: true, registered: !existing });
  } catch (err) {
    console.error('leaderboard.register.error', err);
    res.status(500).json({ error: 'Failed to register wallet' });
  }
}
