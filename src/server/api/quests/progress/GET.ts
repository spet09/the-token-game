import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { questProgress, questStreaks } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { QUESTS } from '../../../../data/quests.js';
import type { QuestWithProgress } from '../../../../data/questTypes.js';

/**
 * GET /api/quests/progress?wallet=<address>
 * Returns all quests with real DB progress for a given wallet,
 * plus streak stats.
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { wallet } = req.query as { wallet?: string };
    if (!wallet) return res.status(400).json({ error: 'wallet query param required' });

    // Fetch all progress rows for this wallet
    const rows = await db
      .select()
      .from(questProgress)
      .where(eq(questProgress.walletAddress, wallet));

    // Build a map questId → progress row
    const progressMap = new Map(rows.map((r) => [r.questId, r]));

    // Fetch streak info
    const streakRows = await db
      .select()
      .from(questStreaks)
      .where(eq(questStreaks.walletAddress, wallet))
      .limit(1);

    const streak = streakRows[0] ?? {
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      totalXpEarned: 0,
      lastCompletedAt: null,
    };

    // Merge quest definitions with DB progress
    const result: QuestWithProgress[] = QUESTS.map((q) => {
      const row = progressMap.get(q.id);
      if (!row) {
        return {
          ...q,
          progress: {
            questId: q.id,
            walletAddress: wallet,
            status: 'active' as const,
            requirementsMet: q.requirements.map(() => false),
            completedAt: null,
            claimedAt: null,
          },
          metCount: 0,
        };
      }

      let requirementsMet: boolean[] = q.requirements.map(() => false);
      try {
        if (row.requirementsMet) {
          requirementsMet = JSON.parse(row.requirementsMet);
        }
      } catch {
        // keep defaults
      }

      // completed/claimed rows have all requirements met
      if (row.status === 'completed' || row.status === 'claimed') {
        requirementsMet = q.requirements.map(() => true);
      }

      return {
        ...q,
        progress: {
          questId: q.id,
          walletAddress: wallet,
          status: row.status as 'active' | 'completed' | 'claimed',
          requirementsMet,
          completedAt: row.completedAt ? row.completedAt.toISOString() : null,
          claimedAt: row.claimedAt ? row.claimedAt.toISOString() : null,
        },
        metCount: requirementsMet.filter(Boolean).length,
      };
    });

    const completed = result.filter((q) => q.progress?.status === 'completed').length;
    const claimed   = result.filter((q) => q.progress?.status === 'claimed').length;
    const active    = result.filter((q) => q.progress?.status === 'active').length;

    res.json({
      quests: result,
      stats: {
        total: result.length,
        active,
        completed,
        claimed,
        totalXpEarned: streak.totalXpEarned ?? 0,
      },
      streak: {
        current: streak.currentStreak ?? 0,
        longest: streak.longestStreak ?? 0,
        totalCompleted: streak.totalCompleted ?? 0,
        lastCompletedAt: streak.lastCompletedAt
          ? (streak.lastCompletedAt as Date).toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error('[quest progress GET]', error);
    res.status(500).json({ error: 'Failed to fetch progress', message: String(error) });
  }
}
