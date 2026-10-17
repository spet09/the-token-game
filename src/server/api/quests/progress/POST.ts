import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { questProgress, questStreaks, journeyProfiles } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { QUESTS } from '../../../../data/quests.js';

/**
 * POST /api/quests/progress
 * Mark a quest as completed or claimed for a wallet.
 *
 * Body: { wallet: string, questId: string, action: 'complete' | 'claim', requirementsMet?: boolean[] }
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { wallet, questId, action, requirementsMet } = req.body as {
      wallet: string;
      questId: string;
      action: 'complete' | 'claim';
      requirementsMet?: boolean[];
    };

    if (!wallet || !questId || !action) {
      return res.status(400).json({ error: 'wallet, questId, and action are required' });
    }

    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    // Fetch or create progress row
    const existing = await db
      .select()
      .from(questProgress)
      .where(and(eq(questProgress.walletAddress, wallet), eq(questProgress.questId, questId)))
      .limit(1);

    const now = new Date();

    if (action === 'complete') {
      const metArr = requirementsMet ?? quest.requirements.map(() => true);
      const allMet = metArr.every(Boolean);
      if (!allMet) {
        return res.status(400).json({ error: 'Not all requirements are met' });
      }

      const xpAwarded = quest.reward.type === 'xp' ? (quest.reward.amount ?? 0) : 0;

      if (existing.length === 0) {
        // Insert new row
        await db.insert(questProgress).values({
          walletAddress: wallet,
          questId,
          status: 'completed',
          requirementsMet: JSON.stringify(metArr),
          completedAt: now,
          xpAwarded,
          streakDay: 0,
        });
      } else if (existing[0].status === 'active') {
        await db
          .update(questProgress)
          .set({
            status: 'completed',
            requirementsMet: JSON.stringify(metArr),
            completedAt: now,
            xpAwarded,
          })
          .where(and(eq(questProgress.walletAddress, wallet), eq(questProgress.questId, questId)));
      } else {
        return res.status(409).json({ error: 'Quest already completed or claimed' });
      }

      // Update streak
      await upsertStreak(wallet, xpAwarded);

      // Award XP to journey profile if applicable
      if (xpAwarded > 0) {
        await awardJourneyXp(wallet, xpAwarded);
      }

      return res.json({ success: true, status: 'completed', xpAwarded });
    }

    if (action === 'claim') {
      if (existing.length === 0 || existing[0].status !== 'completed') {
        return res.status(400).json({ error: 'Quest must be completed before claiming' });
      }

      await db
        .update(questProgress)
        .set({ status: 'claimed', claimedAt: now })
        .where(and(eq(questProgress.walletAddress, wallet), eq(questProgress.questId, questId)));

      return res.json({ success: true, status: 'claimed' });
    }

    return res.status(400).json({ error: 'Invalid action — use complete or claim' });
  } catch (error) {
    console.error('[quest progress POST]', error);
    res.status(500).json({ error: 'Failed to update quest progress', message: String(error) });
  }
}

async function upsertStreak(wallet: string, xpAwarded: number) {
  try {
    const existing = await db
      .select()
      .from(questStreaks)
      .where(eq(questStreaks.walletAddress, wallet))
      .limit(1);

    const now = new Date();

    if (existing.length === 0) {
      await db.insert(questStreaks).values({
        walletAddress: wallet,
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedAt: now,
        totalCompleted: 1,
        totalXpEarned: xpAwarded,
      });
    } else {
      const last = existing[0];
      const lastDate = last.lastCompletedAt ? new Date(last.lastCompletedAt) : null;
      const daysSinceLast = lastDate
        ? Math.floor((now.getTime() - lastDate.getTime()) / 86_400_000)
        : 999;

      const newStreak = daysSinceLast <= 1 ? (last.currentStreak ?? 0) + 1 : 1;
      const newLongest = Math.max(last.longestStreak ?? 0, newStreak);

      await db
        .update(questStreaks)
        .set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCompletedAt: now,
          totalCompleted: (last.totalCompleted ?? 0) + 1,
          totalXpEarned: (last.totalXpEarned ?? 0) + xpAwarded,
        })
        .where(eq(questStreaks.walletAddress, wallet));
    }
  } catch (e) {
    // Non-fatal — streak update failure shouldn't block quest completion
    console.warn('[quest streak upsert]', e);
  }
}

async function awardJourneyXp(wallet: string, xp: number) {
  try {
    const existing = await db
      .select()
      .from(journeyProfiles)
      .where(eq(journeyProfiles.walletAddress, wallet))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(journeyProfiles)
        .set({ xpPoints: (existing[0].xpPoints ?? 0) + xp })
        .where(eq(journeyProfiles.walletAddress, wallet));
    }
  } catch (e) {
    console.warn('[quest xp award]', e);
  }
}
