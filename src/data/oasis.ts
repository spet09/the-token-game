// ─── The Token Game Nexus — Universe Data ────────────────────────────────────
// Central data file for the Nexus game universe.
// All zones, special coin types, economy constants, and interop rules live here.

// ─── Crafting system re-export ────────────────────────────────────────────────
// The crafting hierarchy is the canonical source of coin tier data.
// Import from here so oasis.ts consumers get a single import path.
export {
  CRAFTABLE_COINS,
  SPECIAL_COINS as CRAFTING_SPECIAL_COINS,
  XP_COIN,
  CONVERSION_RATES,
  TIER_LABELS,
  TIER_COLORS,
  convertCoins,
} from './crafting';

// ─── Economy ──────────────────────────────────────────────────────────────────
export const OASIS_ECONOMY = {
  primaryCurrency: 'USGC',
  primaryCurrencyName: 'US Gold Coin',
  primaryCurrencyMint: '7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5',
  utilityToken: '$TEN',
  utilityTokenName: 'TIENKO',
  utilityTokenMint: '6mKmxj4MMozaM54Jeruawduy2rTT8YaNoAhr1aMSFray',
  secondaryToken: 'NYC',
  secondaryTokenName: 'New Yen Coin',
  walletSystem: 'Tienko Wallet',
  network: 'Solana Mainnet',
  // Crafting hierarchy summary (sourced from crafting.ts)
  craftingTiers: 5,
  baseCurrency: 'TKN',
  apexCurrency: 'USGC',
  tknPerUsgc: 100_000,
};

// ─── Special Coin Types ───────────────────────────────────────────────────────
// These are the meta-coin categories that exist across all zones.
// Actual tickers/images to be added as they are minted.
export type SpecialCoinType = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'artifact';
  color: string;
  icon: string;
  earnedBy: string;
  comingSoon?: boolean;
};

export const SPECIAL_COIN_TYPES: SpecialCoinType[] = [
  {
    id: 'artifact',
    name: 'Artifact Coins',
    description: 'Ultra-rare coins awarded for legendary achievements. Each one is unique and permanently recorded on-chain. Holding an Artifact Coin grants permanent status in the Nexus.',
    rarity: 'artifact',
    color: 'hsl(45 100% 65%)',
    icon: '🏺',
    earnedBy: 'Legendary achievements, first-season completions, tournament victories',
    comingSoon: true,
  },
  {
    id: 'key',
    name: 'Keys',
    description: 'Keys unlock hidden zones, secret quests, and exclusive content. Each Key is tied to a specific zone or event. Some Keys are time-limited — miss the window and they\'re gone forever.',
    rarity: 'rare',
    color: 'hsl(276 100% 69%)',
    icon: '🗝️',
    earnedBy: 'Completing zone challenges, seasonal events, War Room victories',
    comingSoon: true,
  },
  {
    id: 'score',
    name: 'Score Coins',
    description: 'Score Coins are earned through gameplay — quests, bingo wins, leaderboard placements. They accumulate each season and convert to USGC at season end.',
    rarity: 'common',
    color: 'hsl(96 100% 69%)',
    icon: '⭐',
    earnedBy: 'Daily quests, bingo wins, leaderboard placements, check-ins',
    comingSoon: true,
  },
  {
    id: 'oasis-token',
    name: 'Nexus Tokens',
    description: 'The universal pass currency of the Nexus. Nexus Tokens are earned by participating across multiple zones and can be spent on any zone\'s exclusive content.',
    rarity: 'uncommon',
    color: 'hsl(200 100% 65%)',
    icon: '🌐',
    earnedBy: 'Cross-zone participation, multi-edition collection bonuses',
    comingSoon: true,
  },
  {
    id: 'usgc',
    name: 'USGC',
    description: 'US Gold Coin — the primary currency of the entire Nexus. Earned through staking, trading, and seasonal rewards. Spendable across all zones and platforms.',
    rarity: 'uncommon',
    color: 'hsl(45 100% 65%)',
    icon: '🪙',
    earnedBy: 'Staking, seasonal rewards, trading, referrals',
    comingSoon: false,
  },
];

// ─── Game Zones ───────────────────────────────────────────────────────────────
export type Zone = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  status: 'live' | 'coming-soon';
  href: string;
  features: string[];
  coinCount?: number;
  platform?: string;
};

export const ZONES: Zone[] = [
  // ── The Token Game (this site) ──────────────────────────────────────────────
  {
    id: 'token-game',
    name: 'The Token Game',
    tagline: '16 editions. 1,500+ coins. One universe.',
    description: 'The original zone. Collect seasonal coins from 16 global editions, compete in Edition Wars, complete quests, and stake for rewards. The heartbeat of the Nexus.',
    color: 'hsl(276 100% 69%)',
    status: 'live',
    href: '/',
    features: ['16 Editions', '1,500+ Coins', 'Edition Wars', 'Seasonal Quests', 'Staking'],
    coinCount: 1536,
    platform: 'thetokengame.xyz',
  },
  {
    id: 'gold-token-game',
    name: 'Gold Token Game',
    tagline: 'Premium zone. Higher stakes. Rarer rewards.',
    description: 'The premium tier of the Nexus. Gold Token Game features exclusive high-value coins, artifact-level collectibles, and tournament play with USGC prize pools.',
    color: 'hsl(45 100% 65%)',
    status: 'coming-soon',
    href: '#',
    features: ['Artifact Coins', 'USGC Tournaments', 'Premium Editions', 'NFT-backed Items'],
    platform: 'goldtokengame.xyz',
  },
  {
    id: 'people-game',
    name: 'The People Game',
    tagline: 'Community-driven. Player-owned. Unstoppable.',
    description: 'The social zone of the Nexus. The People Game is built around community governance, player-created content, and collective decision-making powered by USGC voting.',
    color: 'hsl(306 100% 69%)',
    status: 'coming-soon',
    href: '#',
    features: ['Community Governance', 'Player-Created Content', 'USGC Voting', 'Social Quests'],
    platform: 'thepeoplegame.xyz',
  },
];

// ─── Edition Zones (within The Token Game) ───────────────────────────────────
export const EDITION_ZONES = [
  { name: 'USA',           slug: 'usa',           flag: '🇺🇸', coinCount: 96, status: 'live' as const },
  { name: 'Europe',        slug: 'europe',        flag: '🇪🇺', coinCount: 96, status: 'live' as const },
  { name: 'Japan',         slug: 'japan',         flag: '🇯🇵', coinCount: 96, status: 'live' as const },
  { name: 'China',         slug: 'china',         flag: '🇨🇳', coinCount: 96, status: 'live' as const },
  { name: 'India',         slug: 'india',         flag: '🇮🇳', coinCount: 96, status: 'live' as const },
  { name: 'Russia',        slug: 'russia',        flag: '🇷🇺', coinCount: 96, status: 'live' as const },
  { name: 'Africa',        slug: 'africa',        flag: '🌍',  coinCount: 96, status: 'live' as const },
  { name: 'South America', slug: 'southamerica',  flag: '🌎',  coinCount: 96, status: 'live' as const },
  { name: 'Australia',     slug: 'australia',     flag: '🇦🇺', coinCount: 96, status: 'live' as const },
  { name: 'Middle East',   slug: 'middleeast',    flag: '🕌',  coinCount: 96, status: 'live' as const },
  { name: 'North America', slug: 'northamerica',  flag: '🍁',  coinCount: 96, status: 'live' as const },
  { name: 'Central America', slug: 'centralamerica', flag: '🌺', coinCount: 96, status: 'live' as const },
  { name: 'Oceania',       slug: 'oceania',       flag: '🏝️', coinCount: 96, status: 'live' as const },
  { name: 'Arctic',        slug: 'arctic',        flag: '🧊',  coinCount: 96, status: 'live' as const },
  { name: 'Antarctica',    slug: 'antarctica',    flag: '🐧',  coinCount: 96, status: 'live' as const },
  { name: 'Global',        slug: 'global',        flag: '🌐',  coinCount: 212, status: 'live' as const },
];

// ─── Community Hubs ───────────────────────────────────────────────────────────
export const COMMUNITY_HUBS = [
  {
    id: 'grid-node',
    name: 'Grid Node',
    description: 'The central social layer of the Nexus. Connect with other players, form alliances, share strategies, and coordinate Edition War campaigns.',
    href: '#',
    status: 'coming-soon' as const,
    color: 'hsl(200 100% 65%)',
  },
  {
    id: 'solchat',
    name: 'Solchat.me',
    description: 'Real-time Solana-native chat. Wallet-verified identities, token-gated channels, and direct messaging between Nexus players.',
    href: 'https://solchat.me',
    status: 'coming-soon' as const,
    color: 'hsl(96 100% 69%)',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'The Token Game community Discord. Announcements, edition channels, trading talk, and direct access to the team.',
    href: 'https://discord.gg/FvwyWzbnj',
    status: 'live' as const,
    color: 'hsl(235 86% 65%)',
  },
];

// ─── Interoperability Rules ───────────────────────────────────────────────────
// How assets move between zones
export const INTEROP_RULES = [
  {
    from: 'Any Zone',
    to: 'Any Zone',
    asset: 'USGC',
    rule: 'USGC is universally accepted across all zones with no conversion fee.',
  },
  {
    from: 'The Token Game',
    to: 'Gold Token Game',
    asset: 'Seasonal Coins',
    rule: 'Seasonal coins from Year 1 can be presented as credentials in Gold Token Game for bonus multipliers.',
  },
  {
    from: 'Any Zone',
    to: 'Any Zone',
    asset: 'Keys',
    rule: 'Keys are zone-specific but tradeable between players via the Tienko Wallet.',
  },
  {
    from: 'Any Zone',
    to: 'Any Zone',
    asset: 'Score Coins',
    rule: 'Score Coins accumulate per season and convert to USGC at season end at the prevailing rate.',
  },
];
