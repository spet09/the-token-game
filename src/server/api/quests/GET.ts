import type { Request, Response } from 'express';
import { QUESTS, TIER_ORDER } from '../../../data/quests';
import type { Quest, QuestWithProgress } from '../../../data/questTypes';

/**
 * GET /api/quests
 * Returns all quests, optionally filtered by edition/category/tier.
 * If ?wallet= is provided, merges mock progress (real progress would come from DB).
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { edition, category, tier, wallet } = req.query as Record<string, string>;

    let quests: Quest[] = [...QUESTS];

    if (edition)  quests = quests.filter((q) => q.edition === edition);
    if (category) quests = quests.filter((q) => q.category === category);
    if (tier)     quests = quests.filter((q) => q.tier === tier);

    // Sort: tier asc, then difficulty asc
    quests.sort((a, b) =>
      TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.difficulty - b.difficulty
    );

    // Attach stub progress (real implementation would query DB by wallet)
    const result: QuestWithProgress[] = quests.map((q) => ({
      ...q,
      progress: wallet
        ? {
            questId: q.id,
            walletAddress: wallet,
            status: 'active' as const,
            requirementsMet: q.requirements.map(() => false),
            completedAt: null,
            claimedAt: null,
          }
        : null,
      metCount: 0,
    }));

    res.json({ quests: result, total: result.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quests', message: String(error) });
  }
}
