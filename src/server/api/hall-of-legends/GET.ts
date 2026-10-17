import type { Request, Response } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  journeyProfiles,
  questStreaks,
  rpgCharacters,
  journeyBadges,
} from '../../db/schema.js';

// ─── Tier thresholds (XP-based) ──────────────────────────────────────────────
const TIERS = [
  { id: 'mythic',    label: 'Mythic',    minXp: 2000, color: '#FFB300', emoji: '👑' },
  { id: 'legendary', label: 'Legendary', minXp: 1000, color: '#BF5FFF', emoji: '⚡' },
  { id: 'epic',      label: 'Epic',      minXp: 500,  color: '#FF5FEF', emoji: '🔥' },
  { id: 'rare',      label: 'Rare',      minXp: 200,  color: '#5FFFFF', emoji: '💎' },
  { id: 'common',    label: 'Common',    minXp: 0,    color: '#9fff5f', emoji: '🌱' },
] as const;

function getTier(xp: number) {
  return TIERS.find(t => xp >= t.minXp) ?? TIERS[TIERS.length - 1];
}

function shortenWallet(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// Stage names for display
const STAGE_NAMES: Record<number, string> = {
  1: 'Novice',
  2: 'Trader',
  3: 'Analyst',
  4: 'Creator',
  5: 'Market Maker',
  6: 'Exchange Lord',
  7: 'Tokenomics Master',
};

export default async function handler(req: Request, res: Response) {
  try {
    const limit = Math.min(parseInt(String(req.query.limit ?? '50'), 10), 100);
    const tierFilter = req.query.tier as string | undefined;

    // Fetch top journey profiles ordered by XP
    const profiles = await db
      .select()
      .from(journeyProfiles)
      .orderBy(desc(journeyProfiles.xpPoints))
      .limit(200); // fetch more, filter after

    if (profiles.length === 0) {
      return res.json({ legends: [], total: 0, tiers: TIERS });
    }

    const wallets = profiles.map(p => p.walletAddress);
    void wallets; // used for future filtering

    // Parallel: fetch all streaks, RPG chars, badges — filter in JS
    const [streakRows, rpgRows, badgeRows] = await Promise.all([
      db.select().from(questStreaks).catch(() => [] as typeof questStreaks.$inferSelect[]),
      db.select().from(rpgCharacters).catch(() => [] as typeof rpgCharacters.$inferSelect[]),
      db.select().from(journeyBadges).catch(() => [] as typeof journeyBadges.$inferSelect[]),
    ]);

    // Index by wallet
    const streakMap = new Map(streakRows.map(r => [r.walletAddress, r]));
    const rpgMap    = new Map(rpgRows.map(r => [r.walletAddress, r]));
    const badgeMap  = new Map<string, string[]>();
    for (const b of badgeRows) {
      if (!badgeMap.has(b.walletAddress)) badgeMap.set(b.walletAddress, []);
      badgeMap.get(b.walletAddress)!.push(b.badgeId);
    }

    // Build legend entries
    const legends = profiles.map((p, idx) => {
      const xp      = p.xpPoints ?? 0;
      const tier    = getTier(xp);
      const streak  = streakMap.get(p.walletAddress);
      const rpg     = rpgMap.get(p.walletAddress);
      const badges  = badgeMap.get(p.walletAddress) ?? [];

      return {
        rank:          idx + 1,
        walletAddress: p.walletAddress,
        displayName:   p.displayName ?? shortenWallet(p.walletAddress),
        xp,
        tier:          tier.id,
        tierLabel:     tier.label,
        tierColor:     tier.color,
        tierEmoji:     tier.emoji,
        stage:         p.currentStage ?? 1,
        stageName:     STAGE_NAMES[p.currentStage ?? 1] ?? 'Novice',
        totalBadges:   p.totalBadges ?? 0,
        badges,
        // Quest stats
        questsCompleted: streak?.totalCompleted ?? 0,
        currentStreak:   streak?.currentStreak ?? 0,
        longestStreak:   streak?.longestStreak ?? 0,
        totalQuestXp:    streak?.totalXpEarned ?? 0,
        // RPG
        rpgClass:   rpg?.characterClass ?? null,
        rpgLevel:   rpg?.level ?? null,
        rpgName:    rpg?.displayName ?? null,
        // Computed score: XP + quest bonuses
        score: xp + (streak?.totalCompleted ?? 0) * 5 + (streak?.longestStreak ?? 0) * 10,
      };
    });

    // Re-sort by score
    legends.sort((a, b) => b.score - a.score);
    legends.forEach((l, i) => { l.rank = i + 1; });

    // Apply tier filter
    const filtered = tierFilter
      ? legends.filter(l => l.tier === tierFilter)
      : legends;

    return res.json({
      legends: filtered.slice(0, limit),
      total:   filtered.length,
      tiers:   TIERS,
    });
  } catch (err) {
    console.error('hall-of-legends error', err);
    return res.status(500).json({ error: 'Failed to load Hall of Legends', legends: [], total: 0, tiers: TIERS });
  }
}
