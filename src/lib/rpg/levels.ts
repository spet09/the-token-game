/**
 * RPG Level System — shared between frontend and backend
 *
 * Level thresholds match the official Token Game leveling table:
 *   Level  1 ->   0 XP  (start)
 *   Level  5 ->   500 XP
 *   Level 10 -> 1,500 XP
 *   Level 20 -> 5,000 XP
 *   Level 30 -> 15,000 XP
 *   Level 50 -> 50,000 XP
 *   Level 75 -> 150,000 XP
 *   Level 100 -> 500,000 XP
 *
 * Intermediate levels are interpolated linearly between each milestone pair.
 */

export const MAX_LEVEL = 100;

// Official XP milestones: [level, cumulativeXP]
const XP_MILESTONES: [number, number][] = [
  [1,   0],
  [5,   500],
  [10,  1500],
  [20,  5000],
  [30,  15000],
  [50,  50000],
  [75,  150000],
  [100, 500000],
];

/** XP required to reach a given level (cumulative from level 1) */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level >= 100) return 500000;
  for (let i = 0; i < XP_MILESTONES.length - 1; i++) {
    const [l0, x0] = XP_MILESTONES[i];
    const [l1, x1] = XP_MILESTONES[i + 1];
    if (level >= l0 && level <= l1) {
      const t = (level - l0) / (l1 - l0);
      return Math.floor(x0 + t * (x1 - x0));
    }
  }
  return 500000;
}

/** XP needed to go from current level to next level */
export function xpToNextLevel(level: number): number {
  return xpForLevel(level + 1) - xpForLevel(level);
}

/** Compute level from total XP earned */
export function levelFromXp(totalXp: number): number {
  let level = 1;
  while (level < MAX_LEVEL && xpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

/** XP progress within current level (0 to xpToNextLevel) */
export function xpProgress(totalXp: number): { level: number; current: number; needed: number; pct: number } {
  const level = levelFromXp(totalXp);
  const base = xpForLevel(level);
  const needed = xpToNextLevel(level);
  const current = totalXp - base;
  return { level, current, needed, pct: Math.min(100, Math.floor((current / needed) * 100)) };
}

// ─── XP Awards by source ─────────────────────────────────────────────────────
export const XP_AWARDS: Record<string, number> = {
  trade:        25,
  stake:        50,
  challenge:    100,
  pack_starter:     50,
  pack_adventurer:  150,
  pack_hero:        350,
  pack_legend:      800,
  pack_mythic:      2000,
  daily_login:  10,
  journey_task: 75,
  whitelist:    200,
  first_coin:   150,
};

// ─── Abilities Catalog ───────────────────────────────────────────────────────
export interface Ability {
  id: string;
  name: string;
  description: string;
  icon: string;
  levelRequired: number;
  classRequired?: string;
  powerCost: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const ABILITIES_CATALOG: Ability[] = [
  // Level 1–5 (all classes)
  { id: 'coin_sense',      name: 'Coin Sense',       description: 'Reveals hidden coin backstories earlier.',          icon: '🔍', levelRequired: 1,  powerCost: 0, rarity: 'common' },
  { id: 'quick_trade',     name: 'Quick Trade',       description: '+5% XP on every trade.',                           icon: '⚡', levelRequired: 2,  powerCost: 1, rarity: 'common' },
  { id: 'lucky_pull',      name: 'Lucky Pull',        description: '+1 bonus card on any pack opening.',               icon: '🍀', levelRequired: 3,  powerCost: 1, rarity: 'common' },
  { id: 'stash_eye',       name: 'Stash Eye',         description: 'See Stash leaderboard top 10 at all times.',       icon: '👁️', levelRequired: 4,  powerCost: 0, rarity: 'common' },
  { id: 'daily_boost',     name: 'Daily Boost',       description: 'Double XP on daily login for 24h.',                icon: '☀️', levelRequired: 5,  powerCost: 2, rarity: 'uncommon' },
  // Level 6–15
  { id: 'market_read',     name: 'Market Read',       description: 'Unlock price trend indicators on coin pages.',     icon: '📈', levelRequired: 6,  powerCost: 2, rarity: 'uncommon' },
  { id: 'iron_hands',      name: 'Iron Hands',        description: 'Stash hold timer reduced by 12 hours.',            icon: '🛡️', levelRequired: 8,  powerCost: 3, rarity: 'uncommon', classRequired: 'warrior' },
  { id: 'arcane_lore',     name: 'Arcane Lore',       description: 'Unlock extended backstory lore on all coins.',     icon: '📖', levelRequired: 10, powerCost: 3, rarity: 'rare', classRequired: 'mage' },
  { id: 'merchant_eye',    name: "Merchant's Eye",    description: '10% coin discount on Value Packs.',                icon: '💰', levelRequired: 10, powerCost: 3, rarity: 'rare', classRequired: 'merchant' },
  { id: 'pathfinder',      name: 'Pathfinder',        description: 'Unlock hidden edition coins 24h early.',           icon: '🗺️', levelRequired: 12, powerCost: 4, rarity: 'rare', classRequired: 'explorer' },
  { id: 'curator_bond',    name: 'Curator Bond',      description: 'Curator AI gives extended responses.',             icon: '🤖', levelRequired: 15, powerCost: 4, rarity: 'rare', classRequired: 'collector' },
  // Level 16–30
  { id: 'double_xp',       name: 'Double XP',         description: 'All XP sources doubled for 1 hour.',              icon: '✨', levelRequired: 20, powerCost: 5, rarity: 'epic' },
  { id: 'shadow_trade',    name: 'Shadow Trade',      description: 'Trade without appearing on leaderboard.',          icon: '🌑', levelRequired: 25, powerCost: 6, rarity: 'epic' },
  { id: 'pack_mastery',    name: 'Pack Mastery',      description: 'Guaranteed rare+ card in every Hero+ pack.',       icon: '🎴', levelRequired: 30, powerCost: 6, rarity: 'epic' },
  // Level 31–50
  { id: 'nation_champion', name: 'Nation Champion',   description: 'Earn 2x XP for coins from your nation.',          icon: '🏆', levelRequired: 35, powerCost: 7, rarity: 'epic' },
  { id: 'time_warp',       name: 'Time Warp',         description: 'Reset daily XP bonus every 12h instead of 24h.',  icon: '⏰', levelRequired: 40, powerCost: 8, rarity: 'legendary' },
  { id: 'mythic_sight',    name: 'Mythic Sight',      description: 'See all upcoming seasonal coins before release.',  icon: '🔮', levelRequired: 50, powerCost: 10, rarity: 'legendary' },
  // Level 51–100
  { id: 'god_mode',        name: 'God Mode',          description: 'All abilities cost 0 power points for 30 min.',   icon: '⚔️', levelRequired: 75, powerCost: 15, rarity: 'legendary' },
  { id: 'omniscience',     name: 'Omniscience',       description: 'Full access to all Tienko platform features.',    icon: '🌌', levelRequired: 100, powerCost: 0, rarity: 'legendary' },
];

// ─── Pack Definitions ────────────────────────────────────────────────────────
export interface PackDefinition {
  tier: 'starter' | 'adventurer' | 'hero' | 'legend' | 'mythic';
  name: string;
  usdPrice: number;        // fiat price in USD
  usgcAmount: number;      // USGC coins included
  bonusCoins: number;      // bonus USGC on top
  xpAwarded: number;
  cardsAwarded: number;
  rareCards: number;       // guaranteed rare+ cards
  legendaryCards: number;  // guaranteed legendary cards
  guaranteedRarity: string;
  description: string;
  color: string;
  icon: string;
  levelRequired: number;
}

export const PACK_DEFINITIONS: PackDefinition[] = [
  {
    tier: 'starter',
    name: 'Starter Pack',
    usdPrice: 4.99,
    usgcAmount: 500,
    bonusCoins: 0,
    xpAwarded: 0,
    cardsAwarded: 1,
    rareCards: 0,
    legendaryCards: 0,
    guaranteedRarity: 'common',
    description: 'Perfect for new players. 500 USGC, 1 basic card. Your first step into the Tienko ecosystem.',
    color: '#6b7280',
    icon: '📦',
    levelRequired: 1,
  },
  {
    tier: 'adventurer',
    name: 'Adventurer Pack',
    usdPrice: 9.99,
    usgcAmount: 1200,
    bonusCoins: 200,
    xpAwarded: 100,
    cardsAwarded: 2,
    rareCards: 0,
    legendaryCards: 0,
    guaranteedRarity: 'uncommon',
    description: '1,200 USGC + 200 bonus, 2 cards, 100 XP. Unlock early progression and first upgrades.',
    color: '#10b981',
    icon: '🎒',
    levelRequired: 5,
  },
  {
    tier: 'hero',
    name: 'Hero Pack',
    usdPrice: 19.99,
    usgcAmount: 3000,
    bonusCoins: 600,
    xpAwarded: 300,
    cardsAwarded: 5,
    rareCards: 1,
    legendaryCards: 0,
    guaranteedRarity: 'rare',
    description: '3,000 USGC + 600 bonus, 5 cards, 300 XP, 1 Rare Card. For mid-level players pushing forward.',
    color: '#3b82f6',
    icon: '⚔️',
    levelRequired: 10,
  },
  {
    tier: 'legend',
    name: 'Legend Pack',
    usdPrice: 49.99,
    usgcAmount: 10000,
    bonusCoins: 0,
    xpAwarded: 800,
    cardsAwarded: 10,
    rareCards: 2,
    legendaryCards: 0,
    guaranteedRarity: 'epic',
    description: '10,000 USGC, 10 cards, 800 XP, 2 Rare Cards. Advanced players dominating the leaderboard.',
    color: '#8b5cf6',
    icon: '🏆',
    levelRequired: 20,
  },
  {
    tier: 'mythic',
    name: 'Mythic Pack',
    usdPrice: 99.99,
    usgcAmount: 25000,
    bonusCoins: 0,
    xpAwarded: 2000,
    cardsAwarded: 25,
    rareCards: 5,
    legendaryCards: 1,
    guaranteedRarity: 'legendary',
    description: '25,000 USGC, 25 cards, 2,000 XP, 5 Rare Cards + 1 Legendary Card. Top-tier players only.',
    color: '#f59e0b',
    icon: '🌌',
    levelRequired: 35,
  },
];

// ─── Platform Unlock Gates ────────────────────────────────────────────────────
export interface PlatformUnlock {
  level: number;
  xpRequired: number;
  platform: string;
  url: string;
  description: string;
  icon: string;
  color: string;
}

export const PLATFORM_UNLOCKS: PlatformUnlock[] = [
  {
    level: 1,
    xpRequired: 0,
    platform: 'thepeoplegame.io',
    url: 'https://thepeoplegame.io',
    description: 'Basic cards, starter character, full access from day one.',
    icon: '🌍',
    color: '#10b981',
  },
  {
    level: 10,
    xpRequired: 1500,
    platform: 'thetokengame.com',
    url: 'https://thetokengame.com',
    description: 'Nation selection and premium coin access unlocked.',
    icon: '🪙',
    color: '#3b82f6',
  },
  {
    level: 30,
    xpRequired: 15000,
    platform: 'tienko.io',
    url: 'https://tienko.io',
    description: 'Character class specialization and advanced features.',
    icon: '⚡',
    color: '#BF5FFF',
  },
  {
    level: 75,
    xpRequired: 150000,
    platform: 'tienko.ltd',
    url: 'https://tienko.ltd',
    description: 'Institutional features and elite access.',
    icon: '🏛️',
    color: '#f59e0b',
  },
];

// ─── Character Powers by Level ────────────────────────────────────────────────
export interface CharacterPower {
  level: number;
  power: string;
  effect: string;
  icon: string;
}

export const CHARACTER_POWERS: CharacterPower[] = [
  { level: 1,   power: 'Basic Trade',          effect: 'Can buy and sell basic coins.',                              icon: '🪙' },
  { level: 5,   power: 'Staking',              effect: 'Can stake coins for rewards. First value pack unlocked.',    icon: '📈' },
  { level: 10,  power: 'Crafting',             effect: 'Can create basic items. Access to thetokengame.com.',        icon: '🔨' },
  { level: 20,  power: 'Advanced Trade',       effect: 'Access to premium trading pairs and advanced upgrades.',     icon: '💹' },
  { level: 30,  power: 'Exploration',          effect: 'Access to special events, missions, and tienko.io.',         icon: '🗺️' },
  { level: 50,  power: 'Legendary Crafting',   effect: 'Can create legendary items. Legendary cards unlocked.',      icon: '⚔️' },
  { level: 75,  power: 'Institutional Access', effect: 'Access to tienko.ltd and premium institutional features.',   icon: '🏛️' },
  { level: 100, power: 'Mastery',              effect: 'Ultimate powers, special abilities, and The Stash rewards.',  icon: '🌌' },
];

// ─── Class Definitions ───────────────────────────────────────────────────────
export const CLASS_DEFINITIONS = {
  warrior: {
    name: 'Warrior',
    icon: '⚔️',
    description: 'Masters of the hold. Warriors earn bonus XP from staking and reduce Stash hold timers.',
    bonuses: ['Staking XP +20%', 'Stash hold -12h at level 8', 'Iron Hands ability'],
    color: '#ef4444',
  },
  mage: {
    name: 'Mage',
    icon: '🔮',
    description: 'Seekers of hidden knowledge. Mages unlock extended lore and see deeper coin backstories.',
    bonuses: ['Backstory lore unlocked', 'Challenge XP +20%', 'Arcane Lore ability'],
    color: '#8b5cf6',
  },
  merchant: {
    name: 'Merchant',
    icon: '💰',
    description: 'Deal-makers of the ecosystem. Merchants get pack discounts and trade bonuses.',
    bonuses: ['Pack cost -10%', 'Trade XP +15%', "Merchant's Eye ability"],
    color: '#f59e0b',
  },
  explorer: {
    name: 'Explorer',
    icon: '🗺️',
    description: 'First to discover new coins. Explorers get early access to seasonal and edition coins.',
    bonuses: ['Early coin access +24h', 'Discovery XP +25%', 'Pathfinder ability'],
    color: '#10b981',
  },
  collector: {
    name: 'Collector',
    icon: '🎴',
    description: 'Curators of the rarest cards. Collectors get enhanced Curator AI and inventory bonuses.',
    bonuses: ['Curator AI extended', 'Inventory +10 slots', 'Curator Bond ability'],
    color: '#06b6d4',
  },
} as const;

export type CharacterClass = keyof typeof CLASS_DEFINITIONS;
