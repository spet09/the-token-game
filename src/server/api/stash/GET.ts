import type { Request, Response } from 'express';

// ─── Live Stash Config ────────────────────────────────────────────────────────
// Update these values to reflect real data.
// STASH_SOL        → total SOL held in the stash wallet
// MILESTONE_NEXT   → next SOL milestone target
// MILESTONE_LABEL  → display label for the milestone
// TOP_CONTRIBUTORS → top 3 wallets by SOL contributed (truncated wallet addresses)
//
// Future: replace with on-chain RPC calls to read from a known stash wallet address.
// ─────────────────────────────────────────────────────────────────────────────

const STASH_SOL      = 13_000;
const MILESTONE_NEXT = 25_000;
const MILESTONE_LABEL = '25,000 SOL';

const TOP_CONTRIBUTORS = [
  { rank: 1, wallet: 'wagmi_ser_usa3',    sol: 420, nation: '🇺🇸' },
  { rank: 2, wallet: 'diamond_hands_jp2', sol: 310, nation: '🇯🇵' },
  { rank: 3, wallet: 'based_holder_au1',  sol: 275, nation: '🇦🇺' },
];

export default async function handler(_req: Request, res: Response) {
  try {
    res.json({
      stashSol: STASH_SOL,
      milestoneNext: MILESTONE_NEXT,
      milestoneLabel: MILESTONE_LABEL,
      topContributors: TOP_CONTRIBUTORS,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stash data', message: String(err) });
  }
}
