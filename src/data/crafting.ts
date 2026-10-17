// ─── Tienko Coin Crafting System ─────────────────────────────────────────────
// Revised 8-coin economy (streamlined from original 9-coin system).
// HRTG removed — merged into GOLD and OASIS.
// Conversion rates: 100 TKN = 1 GOLD · 1,000 GOLD = 1 OASIS · 10 OASIS = 1 USGC

export type CoinTier = 1 | 2 | 3 | 4 | 5;
export type CoinCategory = 'craftable' | 'special' | 'xp';

export interface CraftRecipe {
  /** Input coin ticker */
  from: string;
  /** Amount of input coin required */
  amount: number;
  /** Output coin ticker */
  to: string;
  /** Output quantity (always 1 unless noted) */
  output: number;
}

export interface CraftableCoin {
  ticker: string;
  name: string;
  tier: CoinTier;
  category: CoinCategory;
  color: string;           // primary hex for UI
  glowColor: string;       // glow/shadow hex
  description: string;
  usedFor: string;
  recipes: CraftRecipe[];  // all valid ways to craft this coin
  /** TKN equivalent — how many base tokens this coin is worth */
  tknValue: number;
  iconSlot: string;        // media slot path
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface SpecialCoin {
  ticker: string;
  name: string;
  category: 'special' | 'xp';
  color: string;
  glowColor: string;
  description: string;
  howToEarn: string;
  tradeable: boolean;
  iconSlot: string;
  rarity: 'rare' | 'epic' | 'legendary' | 'artifact';
}

// ─── Craftable Tiers ──────────────────────────────────────────────────────────
// Hierarchy: TKN (T1) → GOLD (T2) → OASIS (T3) → USGC (T4)
// Rates:     100 TKN = 1 GOLD · 1,000 GOLD = 1 OASIS · 10 OASIS = 1 USGC

export const CRAFTABLE_COINS: CraftableCoin[] = [
  // ── Tier 1 — Base ──────────────────────────────────────────────────────────
  {
    ticker: 'TKN',
    name: 'Token Fragment',
    tier: 1,
    category: 'craftable',
    color: '#A8B5C8',
    glowColor: '#C8D8F0',
    description:
      'The base unit of the Tienko economy. Every crafting journey starts here. Token Fragments are earned through daily logins, mini-games, and quests. They cannot be purchased directly.',
    usedFor: 'Consumables, entry fees, base crafting ingredient for all higher-tier coins.',
    recipes: [], // base currency — earned, not crafted
    tknValue: 1,
    iconSlot: 'crafting/tkn',
    rarity: 'common',
  },

  // ── Tier 2 — Mid ───────────────────────────────────────────────────────────
  {
    ticker: 'GOLD',
    name: 'Gold Ingot',
    tier: 2,
    category: 'craftable',
    color: '#FFD700',
    glowColor: '#FFF176',
    description:
      'Forged from 100 Token Fragments, Gold Ingots are the workhorse of the mid-tier economy. Used to craft equipment, upgrade zone holdings, and trade in the open market.',
    usedFor: 'Equipment, mid-tier items, zone upgrades, open market trading, RPG gear.',
    recipes: [
      { from: 'TKN', amount: 100, to: 'GOLD', output: 1 },
    ],
    tknValue: 100,
    iconSlot: 'crafting/gold',
    rarity: 'uncommon',
  },

  // ── Tier 3 — High ──────────────────────────────────────────────────────────
  {
    ticker: 'OASIS',
    name: 'OASIS Token',
    tier: 3,
    category: 'craftable',
    color: '#BF5FFF',
    glowColor: '#E040FB',
    description:
      'The universal pass currency of the Oasis. Forged from 1,000 Gold Ingots, OASIS Tokens grant access to zone unlocks, cosmetics, premium quests, and cross-world events.',
    usedFor: 'Zone unlocks, cosmetics, events, premium quests, cross-world access.',
    recipes: [
      { from: 'GOLD', amount: 1000, to: 'OASIS', output: 1 },
    ],
    tknValue: 100000,
    iconSlot: 'crafting/oasis-token',
    rarity: 'rare',
  },

  // ── Tier 4 — Top ───────────────────────────────────────────────────────────
  {
    ticker: 'USGC',
    name: 'Universal Sol Gaming Coin',
    tier: 4,
    category: 'craftable',
    color: '#FFB300',
    glowColor: '#FFE57F',
    description:
      'The apex of the crafting hierarchy. USGC is the primary currency of the entire Oasis — accepted across all zones, all worlds, and all platforms. Staking USGC earns the highest yields in the ecosystem.',
    usedFor: 'Staking, exchange, store of value, cross-platform settlement, premium tier access, LP pools.',
    recipes: [
      { from: 'OASIS', amount: 10, to: 'USGC', output: 1 },
    ],
    tknValue: 1000000,
    iconSlot: 'crafting/usgc',
    rarity: 'legendary',
  },
];

// ─── Special Coins (not craftable) ───────────────────────────────────────────

export const SPECIAL_COINS: SpecialCoin[] = [
  {
    ticker: 'ARTFCT',
    name: 'Artifact Coin',
    category: 'special',
    color: '#FF6D00',
    glowColor: '#FFAB40',
    description:
      'Ultra-rare coins awarded for legendary achievements. Each Artifact Coin is unique, permanently recorded on-chain, and grants permanent status in the Oasis. They cannot be crafted, bought, or transferred — only earned.',
    howToEarn:
      'Legendary achievements, first-season completions, tournament victories, and hidden world events.',
    tradeable: false,
    iconSlot: 'crafting/artfct',
    rarity: 'artifact',
  },
  {
    ticker: 'NTN',
    name: 'Nation Token',
    category: 'special',
    color: '#00BCD4',
    glowColor: '#80DEEA',
    description:
      'Nation Tokens are tied to specific edition zones. Each zone has its own NTN variant — holding one signals allegiance and grants zone-specific bonuses in Edition Wars, seasonal quests, and faction governance.',
    howToEarn:
      'Completing zone-specific quest chains, War Room victories, and seasonal faction events.',
    tradeable: true,
    iconSlot: 'crafting/ntn',
    rarity: 'rare',
  },
  {
    ticker: 'CUR8',
    name: "Curator's Coin",
    category: 'special',
    color: '#9C27B0',
    glowColor: '#CE93D8',
    description:
      "The Curator's Coin is awarded by The Curator — the mysterious keeper of the coin archives. Holding one grants access to hidden backstory entries, secret coin lore, and The Curator's private collection.",
    howToEarn:
      "Completing The Curator's challenges, discovering hidden coins, and unlocking all backstory entries for an edition.",
    tradeable: false,
    iconSlot: 'crafting/cur8',
    rarity: 'epic',
  },
];

// ─── XP Coin (non-tradeable, gameplay-only) ───────────────────────────────────

export const XP_COIN: SpecialCoin = {
  ticker: 'XP',
  name: 'XP Coin',
  category: 'xp',
  color: '#4CAF50',
  glowColor: '#A5D6A7',
  description:
    'XP Coins are the lifeblood of player progression. Non-tradeable and non-transferable — earned through every action in the Oasis. XP accumulates to unlock journey stages, RPG abilities, and seasonal rewards.',
  howToEarn:
    'Daily quests, bingo wins, leaderboard placements, check-ins, War Room participation, and seasonal events.',
  tradeable: false,
  iconSlot: 'crafting/xp',
  rarity: 'rare',
};

// ─── Conversion Rate Table ────────────────────────────────────────────────────
// Canonical exchange rates expressed in TKN (base unit = 1)
// 100 TKN = 1 GOLD · 1,000 GOLD = 1 OASIS · 10 OASIS = 1 USGC

export const CONVERSION_RATES: Record<string, number> = {
  TKN:   1,
  GOLD:  100,
  OASIS: 100_000,
  USGC:  1_000_000,
};

// ─── All valid craft paths (flattened for UI) ─────────────────────────────────

export const ALL_RECIPES: CraftRecipe[] = CRAFTABLE_COINS.flatMap(c => c.recipes);

// ─── Helper: convert any amount of one coin to another ───────────────────────

export function convertCoins(
  fromTicker: string,
  amount: number,
  toTicker: string,
): { result: number; remainder: number } {
  const fromRate = CONVERSION_RATES[fromTicker];
  const toRate   = CONVERSION_RATES[toTicker];
  if (!fromRate || !toRate) return { result: 0, remainder: amount };
  const totalTkn  = amount * fromRate;
  const result    = Math.floor(totalTkn / toRate);
  const remainder = totalTkn % toRate;
  return { result, remainder };
}

// ─── Tier metadata ────────────────────────────────────────────────────────────

export const TIER_LABELS: Record<number, string> = {
  1: 'Base',
  2: 'Mid',
  3: 'High',
  4: 'Top',
};

export const TIER_COLORS: Record<number, string> = {
  1: '#A8B5C8',
  2: '#FFD700',
  3: '#BF5FFF',
  4: '#FFB300',
};
