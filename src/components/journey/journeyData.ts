export interface JourneyStage {
  stage: number;
  badgeId: string;
  badgeName: string;
  title: string;
  site: string;
  siteUrl: string;
  description: string;
  color: string;
  accentColor: string;
  icon: string;
  xpRequired: number;
  tasks: { key: string; label: string; xp: number }[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    stage: 1,
    badgeId: 'novice',
    badgeName: 'Novice Badge',
    title: 'Novice',
    site: 'thetokengame.com',
    siteUrl: 'https://thetokengame.com',
    description: 'Enter the game. Connect your wallet, explore the coin universe, and earn your first badge.',
    color: '#6B7280',
    accentColor: '#9CA3AF',
    icon: '🎮',
    xpRequired: 0,
    tasks: [
      { key: 'connected_wallet', label: 'Connect your wallet', xp: 20 },
      { key: 'viewed_edition', label: 'Browse an edition', xp: 5 },
      { key: 'visited_world_map', label: 'Visit the World Map', xp: 10 },
    ],
  },
  {
    stage: 2,
    badgeId: 'trader',
    badgeName: 'Trader Badge',
    title: 'Trader',
    site: 'thetokengame.xyz',
    siteUrl: 'https://thetokengame.xyz',
    description: 'Join the community. Register for the whitelist, engage in the Global Command Center, and hold your first coin.',
    color: '#BF5FFF',
    accentColor: '#D08FFF',
    icon: '💎',
    xpRequired: 35,
    tasks: [
      { key: 'registered_whitelist', label: 'Register for whitelist', xp: 25 },
      { key: 'visited_stash', label: 'Visit The Stash', xp: 10 },
      { key: 'joined_discord', label: 'Join Discord', xp: 15 },
    ],
  },
  {
    stage: 3,
    badgeId: 'analyst',
    badgeName: 'Analyst Badge',
    title: 'Analyst',
    site: 'thegoldtokengame.com',
    siteUrl: 'https://thegoldtokengame.com',
    description: 'Unlock premium challenges. Hold coins for 7 days, earn Stash eligibility, and prove your conviction.',
    color: '#F59E0B',
    accentColor: '#FCD34D',
    icon: '📊',
    xpRequired: 85,
    tasks: [
      { key: 'held_coin_7days', label: 'Hold a coin for 7 days', xp: 50 },
      { key: 'earned_whitelist_approval', label: 'Get whitelist approved', xp: 40 },
    ],
  },
  {
    stage: 4,
    badgeId: 'creator',
    badgeName: 'Creator Badge',
    title: 'Creator',
    site: 'tienko.io',
    siteUrl: 'https://tienko.io',
    description: 'Enter the ecosystem hub. Contribute to the community, build your reputation, and shape the Tienko universe.',
    color: '#10B981',
    accentColor: '#34D399',
    icon: '🌐',
    xpRequired: 175,
    tasks: [
      { key: 'visited_tienko_io', label: 'Visit tienko.io', xp: 10 },
      { key: 'created_profile', label: 'Complete your profile', xp: 30 },
    ],
  },
  {
    stage: 5,
    badgeId: 'market',
    badgeName: 'Market Badge',
    title: 'Market Maker',
    site: 'tienko.market',
    siteUrl: 'https://tienko.market',
    description: 'Access the marketplace. List coins, discover rare tokens, and participate in the Tienko economy.',
    color: '#3B82F6',
    accentColor: '#60A5FA',
    icon: '🏪',
    xpRequired: 215,
    tasks: [
      { key: 'visited_tienko_market', label: 'Visit tienko.market', xp: 10 },
      { key: 'listed_coin', label: 'List your first coin', xp: 50 },
    ],
  },
  {
    stage: 6,
    badgeId: 'exchange',
    badgeName: 'Exchange Badge',
    title: 'Exchange Pro',
    site: 'tienko.exchange',
    siteUrl: 'https://tienko.exchange',
    description: 'Master advanced trading. Use analytics, execute strategies, and dominate the leaderboard.',
    color: '#EF4444',
    accentColor: '#F87171',
    icon: '📈',
    xpRequired: 275,
    tasks: [
      { key: 'visited_tienko_exchange', label: 'Visit tienko.exchange', xp: 10 },
      { key: 'executed_trade', label: 'Execute your first trade', xp: 75 },
    ],
  },
  {
    stage: 7,
    badgeId: 'tokenomics',
    badgeName: 'Tokenomics Degree',
    title: 'Tokenomics Graduate',
    site: 'tienko.ltd',
    siteUrl: 'https://tienko.ltd',
    description: 'Reach the pinnacle. Complete the Tokenomics curriculum and earn your institutional credential.',
    color: '#FFD700',
    accentColor: '#FFF176',
    icon: '🎓',
    xpRequired: 360,
    tasks: [
      { key: 'visited_tienko_ltd', label: 'Visit tienko.ltd', xp: 10 },
      { key: 'completed_curriculum', label: 'Complete the curriculum', xp: 150 },
    ],
  },
];

export function getStageForXp(xp: number): number {
  for (let i = JOURNEY_STAGES.length - 1; i >= 0; i--) {
    if (xp >= JOURNEY_STAGES[i].xpRequired) return JOURNEY_STAGES[i].stage;
  }
  return 1;
}

export function xpToNextStage(currentXp: number, currentStage: number): { needed: number; total: number; pct: number } {
  const next = JOURNEY_STAGES.find(s => s.stage === currentStage + 1);
  if (!next) return { needed: 0, total: 0, pct: 100 };
  const current = JOURNEY_STAGES.find(s => s.stage === currentStage);
  const base = current?.xpRequired ?? 0;
  const needed = next.xpRequired - currentXp;
  const total = next.xpRequired - base;
  const pct = Math.min(100, Math.round(((currentXp - base) / total) * 100));
  return { needed: Math.max(0, needed), total, pct };
}
