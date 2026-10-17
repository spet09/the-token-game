/**
 * GET /api/season-leaderboard
 *
 * Returns season competition rankings built from DB data:
 *   - Journey XP (journey_profiles)
 *   - Quest completions + streaks (quest_streaks)
 *   - Badge count (journey_profiles.totalBadges)
 *
 * Season score formula:
 *   score = xp + (questsCompleted × 5) + (longestStreak × 10) + (totalBadges × 20)
 *
 * Query params:
 *   ?limit=50       — max entries (default 50, max 200)
 *   ?wallet=<addr>  — include caller's own rank even if outside top N
 *   ?season=<n>     — reserved for future multi-season support (ignored for now)
 */

import type { Request, Response } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  journeyProfiles,
  questStreaks,
} from '../../db/schema.js';

// ─── Season definition ────────────────────────────────────────────────────────
// Season 1: Aug 1 – Oct 31 2026 (UTC)
const CURRENT_SEASON = {
  number:    1,
  name:      'Season 1',
  startMs:   Date.UTC(2026, 7, 1),   // Aug 1 2026
  endMs:     Date.UTC(2026, 10, 1),  // Nov 1 2026
  theme:     'The Founding',
  prizePool: '10,000 TKN',
};

// ─── Score weights ────────────────────────────────────────────────────────────
const W_XP       = 1;
const W_QUEST    = 5;
const W_STREAK   = 10;
const W_BADGE    = 20;

function calcScore(xp: number, quests: number, streak: number, badges: number): number {
  return xp * W_XP + quests * W_QUEST + streak * W_STREAK + badges * W_BADGE;
}

// ─── Tier thresholds (score-based for season) ─────────────────────────────────
const SEASON_TIERS = [
  { id: 'champion',  label: 'Champion',  minScore: 5000, color: '#FFB300', emoji: '👑' },
  { id: 'legend',    label: 'Legend',    minScore: 2000, color: '#BF5FFF', emoji: '⚡' },
  { id: 'veteran',   label: 'Veteran',   minScore: 800,  color: '#FF5FEF', emoji: '🔥' },
  { id: 'contender', label: 'Contender', minScore: 200,  color: '#5FFFFF', emoji: '💎' },
  { id: 'rookie',    label: 'Rookie',    minScore: 0,    color: '#9fff5f', emoji: '🌱' },
] as const;

function getSeasonTier(score: number) {
  return SEASON_TIERS.find(t => score >= t.minScore) ?? SEASON_TIERS[SEASON_TIERS.length - 1];
}

function shortenWallet(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default async function handler(req: Request, res: Response) {
  try {
    const limit      = Math.min(parseInt(String(req.query.limit ?? '50'), 10), 200);
    const walletAddr = req.query.wallet as string | undefined;

    // Fetch all journey profiles ordered by XP (fast primary sort)
    const [profiles, streakRows] = await Promise.all([
      db.select().from(journeyProfiles).orderBy(desc(journeyProfiles.xpPoints)).limit(500),
      db.select().from(questStreaks).catch(() => [] as typeof questStreaks.$inferSelect[]),
    ]);

    const streakMap = new Map(streakRows.map(r => [r.walletAddress, r]));

    // Build ranked entries
    const entries = profiles.map(p => {
      const streak = streakMap.get(p.walletAddress);
      const xp     = p.xpPoints ?? 0;
      const quests = streak?.totalCompleted ?? 0;
      const best   = streak?.longestStreak ?? 0;
      const badges = p.totalBadges ?? 0;
      const score  = calcScore(xp, quests, best, badges);
      const tier   = getSeasonTier(score);

      return {
        walletAddress: p.walletAddress,
        displayName:   p.displayName ?? shortenWallet(p.walletAddress),
        xp,
        questsCompleted: quests,
        currentStreak:   streak?.currentStreak ?? 0,
        longestStreak:   best,
        totalBadges:     badges,
        totalQuestXp:    streak?.totalXpEarned ?? 0,
        score,
        tier:      tier.id,
        tierLabel: tier.label,
        tierColor: tier.color,
        tierEmoji: tier.emoji,
        rank:      0, // assigned below
      };
    });

    // Sort by score descending, break ties by XP
    entries.sort((a, b) => b.score - a.score || b.xp - a.xp);
    entries.forEach((e, i) => { e.rank = i + 1; });

    // Find caller's own entry if wallet provided
    let myEntry: typeof entries[0] | null = null;
    if (walletAddr) {
      myEntry = entries.find(e => e.walletAddress === walletAddr) ?? null;
    }

    // Season timing
    const now         = Date.now();
    const msRemaining = Math.max(0, CURRENT_SEASON.endMs - now);
    const msTotal     = CURRENT_SEASON.endMs - CURRENT_SEASON.startMs;
    const progress    = Math.min(100, Math.round(((now - CURRENT_SEASON.startMs) / msTotal) * 100));

    return res.json({
      season: {
        ...CURRENT_SEASON,
        msRemaining,
        progress,
        active: now >= CURRENT_SEASON.startMs && now < CURRENT_SEASON.endMs,
      },
      entries:    entries.slice(0, limit),
      total:      entries.length,
      tiers:      SEASON_TIERS,
      myEntry,
      weights: { xp: W_XP, quest: W_QUEST, streak: W_STREAK, badge: W_BADGE },
    });
  } catch (err) {
    console.error('season-leaderboard error', err);
    return res.status(500).json({
      error: 'Failed to load season leaderboard',
      entries: [],
      total: 0,
    });
  }
}
