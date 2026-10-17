// ─── Quest System — Types ─────────────────────────────────────────────────────

export type QuestTier = 'bronze' | 'silver' | 'gold' | 'legendary';
export type QuestCategory = 'collect' | 'stake' | 'compete' | 'social' | 'seasonal' | 'craft';
export type QuestStatus = 'locked' | 'active' | 'completed' | 'claimed';

export interface QuestRequirement {
  type: 'own_coin' | 'own_coins_count' | 'own_edition_coins' | 'own_all_edition' | 'stake_amount' | 'own_tier_coins';
  /** Coin slug(s) for own_coin / own_edition_coins */
  coins?: string[];
  /** Edition slug for own_edition_coins / own_all_edition */
  edition?: string;
  /** Numeric threshold */
  count?: number;
  /** Tier name for own_tier_coins */
  tier?: string;
  label: string;
}

export interface QuestReward {
  type: 'xp' | 'tkn' | 'hrtg' | 'gold_coin' | 'badge';
  amount?: number;
  label: string;
  icon: string;
}

export interface Quest {
  id: string;
  slug: string;
  title: string;
  description: string;
  lore: string;
  tier: QuestTier;
  category: QuestCategory;
  /** Edition this quest belongs to, or 'global' */
  edition: string;
  requirements: QuestRequirement[];
  reward: QuestReward;
  /** Season this quest is active in, or null for evergreen */
  season: number | null;
  /** Prerequisite quest IDs */
  prerequisites: string[];
  /** Estimated difficulty 1–5 */
  difficulty: number;
}

export interface QuestProgress {
  questId: string;
  walletAddress: string;
  status: QuestStatus;
  requirementsMet: boolean[];
  completedAt: string | null;
  claimedAt: string | null;
}

export interface QuestWithProgress extends Quest {
  progress: QuestProgress | null;
  /** How many requirements are currently met (0 if no wallet) */
  metCount: number;
}
