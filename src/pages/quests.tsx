import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ChevronRight, Lock, CheckCircle2, Circle, Zap, Trophy, Star, Coins, FlaskConical, Users, Swords, Leaf, Filter, X, Flame } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import { quests as _questsContent } from 'virtual:content';
const content = _questsContent as typeof _questsContent & {
  tierLabels: {
    bronze: string;
    silver: string;
    gold: string;
    legendary: string;
  };
};
// content is typed from the JSON shape — alias for clarity
const questsContent = content as unknown as {
  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    body: string;
  };
  stats: Array<{
    id: string;
    value: string;
    label: string;
  }>;
  filterLabel: string;
  emptyState: string;
  rewardSection: {
    headline: string;
    body: string;
  };
  rewardDisplay: Array<{
    id: string;
    icon: string;
    name: string;
    type: string;
    desc: string;
  }>;
  cta: {
    headline: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};
import { QUESTS, TIER_COLORS, CATEGORY_LABELS, CATEGORY_ICONS, TIER_ORDER } from '@/data/quests';
import type { Quest } from '@/data/questTypes';

// ─── Game-design constants (not brand palette tokens) ─────────────────────────
// These are reward-type identity colors, same pattern as zone colors.
const REWARD_TYPE_COLORS: Record<string, string> = {
  xp: '#FFD700',
  tkn: '#BF5FFF',
  hrtg: '#C0C0C0',
  gold_coin: '#FFD700',
  badge: '#FF5FEF'
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICON_COMPONENTS: Record<Quest['category'], React.ReactNode> = {
  collect: <Coins size={13} />,
  stake: <Trophy size={13} />,
  compete: <Swords size={13} />,
  social: <Users size={13} />,
  seasonal: <Leaf size={13} />,
  craft: <FlaskConical size={13} />
};
const REWARD_ICON: Record<string, React.ReactNode> = {
  xp: <Zap size={13} />,
  tkn: <Coins size={13} />,
  hrtg: <Star size={13} />,
  gold_coin: <Trophy size={13} />,
  badge: <Trophy size={13} />
};

// ─── Quest Card ───────────────────────────────────────────────────────────────
function QuestCard({
  quest,
  selected,
  onClick,
  status
}: {
  quest: Quest;
  selected: boolean;
  onClick: () => void;
  status?: 'active' | 'completed' | 'claimed';
}) {
  const tierColor = TIER_COLORS[quest.tier];
  const isDone = status === 'completed' || status === 'claimed';
  return <motion.button onClick={onClick} whileHover={{
    y: -2,
    scale: 1.01
  }} whileTap={{
    scale: 0.98
  }} className="w-full text-left rounded-2xl border p-4 flex flex-col gap-3 transition-all relative overflow-hidden" style={{
    borderColor: isDone ? `${tierColor}70` : selected ? `${tierColor}60` : `${tierColor}20`,
    background: isDone ? `${tierColor}12` : selected ? `${tierColor}10` : `${tierColor}04`,
    boxShadow: isDone ? `0 0 28px ${tierColor}22` : selected ? `0 0 24px ${tierColor}18` : 'none'
  }}>
      {/* Completion shimmer strip */}
      {isDone && <div className="absolute top-0 left-0 right-0 h-0.5" style={{
      background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)`
    }} />}

      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5 relative" style={{
        background: `${tierColor}18`,
        border: `1.5px solid ${tierColor}30`
      }}>
          {CATEGORY_ICONS[quest.category]}
          {isDone && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{
          background: tierColor
        }}>
              <CheckCircle2 size={10} className="text-black" />
            </div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-bold text-sm leading-tight">{quest.title}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
            background: `${tierColor}20`,
            color: tierColor,
            border: `1px solid ${tierColor}35`
          }}>
              {content.tierLabels[quest.tier]}
            </span>
            {status === 'claimed' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                Claimed
              </span>}
            {status === 'completed' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                Claim reward
              </span>}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {quest.description}
          </p>
        </div>
        <ChevronRight size={14} className="text-muted-foreground shrink-0 mt-1 transition-transform" style={{
        transform: selected ? 'rotate(90deg)' : 'none'
      }} />
      </div>

      {/* Footer row */}
      <div className="flex items-center gap-3 pt-1 border-t border-white/5">
        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
          {CATEGORY_ICON_COMPONENTS[quest.category]}
          <span>{CATEGORY_LABELS[quest.category]}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
          <Circle size={10} />
          <span>{quest.requirements.length} req{quest.requirements.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[11px] font-semibold" style={{
        color: isDone ? tierColor : tierColor
      }}>
          {isDone ? <CheckCircle2 size={11} /> : REWARD_ICON[quest.reward.type]}
          <span>{isDone ? 'Done' : quest.reward.label}</span>
        </div>
      </div>
    </motion.button>;
}

// ─── Quest Detail Panel ───────────────────────────────────────────────────────
function QuestDetail({
  quest,
  status,
  completedAt,
  onComplete,
  onClaim,
  actionLoading,
  walletConnected,
  onConnectWallet
}: {
  quest: Quest;
  status?: 'active' | 'completed' | 'claimed';
  completedAt?: string | null;
  onComplete: () => void;
  onClaim: () => void;
  actionLoading: boolean;
  walletConnected: boolean;
  onConnectWallet: () => void;
}) {
  const tierColor = TIER_COLORS[quest.tier];
  const difficultyStars = Array.from({
    length: 5
  }, (_, i) => i < quest.difficulty);
  return <AnimatePresence mode="wait">
      <motion.div key={quest.id} initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -10
    }} transition={{
      duration: 0.22
    }} className="rounded-2xl border p-6 flex flex-col gap-5 h-full" style={{
      borderColor: `${tierColor}30`,
      background: `${tierColor}06`
    }}>
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{
          background: `${tierColor}18`,
          border: `2px solid ${tierColor}35`
        }}>
            {CATEGORY_ICONS[quest.category]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-bold leading-tight">{quest.title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
              background: `${tierColor}20`,
              color: tierColor,
              border: `1px solid ${tierColor}35`
            }}>
                {content.tierLabels[quest.tier]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {difficultyStars.map((filled, i) => <Star key={i} size={11} style={{
              color: filled ? tierColor : 'hsl(var(--muted-foreground))'
            }} fill={filled ? tierColor : 'none'} />)}
              <span className="text-[10px] text-muted-foreground ml-1">Difficulty</span>
            </div>
          </div>
        </div>

        {/* Lore */}
        <div className="rounded-xl border p-3 text-xs text-muted-foreground italic leading-relaxed" style={{
        borderColor: `${tierColor}20`,
        background: `${tierColor}06`
      }}>
          "{quest.lore}"
        </div>

        {/* Requirements */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Requirements
          </div>
          <div className="flex flex-col gap-2">
            {quest.requirements.map((req, i) => <div key={i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                <Circle size={13} className="text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{req.label}</span>
              </div>)}
          </div>
        </div>

        {/* Reward */}
        <div className="rounded-xl border p-4 flex items-center gap-3" style={{
        borderColor: `${tierColor}30`,
        background: `${tierColor}08`
      }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{
          background: `${tierColor}18`,
          border: `1.5px solid ${tierColor}35`
        }}>
            {quest.reward.icon}
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-0.5">
              Reward
            </div>
            <div className="font-bold text-sm" style={{
            color: tierColor
          }}>
              {quest.reward.label}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {CATEGORY_ICON_COMPONENTS[quest.category]}
            <span>{CATEGORY_LABELS[quest.category]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Leaf size={11} />
            <span>{quest.season !== null ? `Season ${quest.season}` : 'Evergreen'}</span>
          </div>
          {quest.prerequisites.length > 0 && <div className="flex items-center gap-1">
              <Lock size={11} />
              <span>{quest.prerequisites.length} prerequisite{quest.prerequisites.length !== 1 ? 's' : ''}</span>
            </div>}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button size="sm" className="w-full gap-2 font-semibold text-primary-foreground" style={{
          background: tierColor,
          boxShadow: `0 0 20px ${tierColor}30`
        }} asChild>
            <Link to="/coins">
              <Coins size={13} />
              Browse coins
            </Link>
          </Button>
          {quest.category === 'craft' && <Button size="sm" variant="outline" className="w-full gap-2 border-white/15 hover:border-white/30" asChild>
              <Link to="/crafting">
                <FlaskConical size={13} />
                Go to crafting
              </Link>
            </Button>}
          {quest.category === 'stake' && <Button size="sm" variant="outline" className="w-full gap-2 border-white/15 hover:border-white/30" asChild>
              <Link to="/staking">
                <Trophy size={13} />
                Go to staking
              </Link>
            </Button>}
        </div>
      </motion.div>
    </AnimatePresence>;
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  color,
  onClick
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return <button onClick={onClick} className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all" style={active ? {
    background: color ? `${color}20` : 'hsl(var(--primary) / 0.15)',
    borderColor: color ? `${color}50` : 'hsl(var(--primary) / 0.5)',
    color: color ?? 'hsl(var(--primary))'
  } : {
    background: 'transparent',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--muted-foreground))'
  }}>
      {label}
    </button>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuestsPage() {
  const {
    connected,
    publicKey,
    openModal
  } = useWallet();
  const [selectedQuest, setSelectedQuest] = useState<Quest>(QUESTS[0]);
  const [activeCategory, setActiveCategory] = useState<Quest['category'] | 'all'>('all');
  const [activeTier, setActiveTier] = useState<Quest['tier'] | 'all'>('all');

  // Progress state: questId → status
  const [progressMap, setProgressMap] = useState<Map<string, {
    status: 'active' | 'completed' | 'claimed';
    completedAt: string | null;
  }>>(new Map());
  const [streak, setStreak] = useState<{
    current: number;
    longest: number;
    totalCompleted: number;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load progress from DB when wallet connects
  useEffect(() => {
    if (!publicKey) {
      setProgressMap(new Map());
      setStreak(null);
      return;
    }
    fetch(`/api/quests/progress?wallet=${publicKey}`).then(r => r.json()).then(data => {
      const map = new Map<string, {
        status: 'active' | 'completed' | 'claimed';
        completedAt: string | null;
      }>();
      (data.quests ?? []).forEach((q: {
        id: string;
        progress?: {
          status: 'active' | 'completed' | 'claimed';
          completedAt: string | null;
        } | null;
      }) => {
        if (q.progress && q.progress.status !== 'active') {
          map.set(q.id, {
            status: q.progress.status,
            completedAt: q.progress.completedAt
          });
        }
      });
      setProgressMap(map);
      if (data.streak) setStreak(data.streak);
    }).catch(() => {/* non-fatal */});
  }, [publicKey]);
  const handleComplete = useCallback(async () => {
    if (!publicKey || !selectedQuest) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/quests/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wallet: publicKey,
          questId: selectedQuest.id,
          action: 'complete'
        })
      });
      if (res.ok) {
        const now = new Date().toISOString();
        setProgressMap(prev => new Map(prev).set(selectedQuest.id, {
          status: 'completed',
          completedAt: now
        }));
        setStreak(prev => prev ? {
          ...prev,
          totalCompleted: prev.totalCompleted + 1,
          current: prev.current + 1
        } : {
          current: 1,
          longest: 1,
          totalCompleted: 1
        });
      }
    } finally {
      setActionLoading(false);
    }
  }, [publicKey, selectedQuest]);
  const handleClaim = useCallback(async () => {
    if (!publicKey || !selectedQuest) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/quests/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wallet: publicKey,
          questId: selectedQuest.id,
          action: 'claim'
        })
      });
      if (res.ok) {
        setProgressMap(prev => {
          const next = new Map(prev);
          const existing = next.get(selectedQuest.id);
          next.set(selectedQuest.id, {
            status: 'claimed',
            completedAt: existing?.completedAt ?? null
          });
          return next;
        });
      }
    } finally {
      setActionLoading(false);
    }
  }, [publicKey, selectedQuest]);
  const categories: Array<Quest['category']> = ['collect', 'seasonal', 'craft', 'stake', 'compete', 'social'];
  const tiers: Array<Quest['tier']> = ['bronze', 'silver', 'gold', 'legendary'];
  const filtered = useMemo(() => {
    let list = [...QUESTS];
    if (activeCategory !== 'all') list = list.filter(q => q.category === activeCategory);
    if (activeTier !== 'all') list = list.filter(q => q.tier === activeTier);
    list.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.difficulty - b.difficulty);
    return list;
  }, [activeCategory, activeTier]);
  const hasFilters = activeCategory !== 'all' || activeTier !== 'all';
  const selectedProgress = progressMap.get(selectedQuest.id);
  const title = 'Quests — The Token Game';
  const description = 'Complete quests tied to coin ownership, crafting, and staking. Earn XP, TKN, HRTG, and legendary badges in the Token Game Nexus.';
  const canonical = 'https://thetokengame.xyz/quests';
  const ogImage = 'https://thetokengame.xyz/og-image.png';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: title,
          url: canonical,
          description,
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/10 py-20">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[160px] opacity-10" style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
          }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/40 text-primary bg-primary/10">
                  {questsContent.hero.eyebrow}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                <span>{questsContent.hero.headline}</span>
                {' '}
                <span className="text-primary">{questsContent.hero.headlineAccent}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                {questsContent.hero.body}
              </p>
            </motion.div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
              {questsContent.stats.map((stat, i) => <motion.div key={stat.id} initial={{
              opacity: 0,
              y: 12
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: 0.2 + i * 0.07
            }} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>)}
            </div>

            {/* Wallet streak banner */}
            {connected && publicKey && streak && <motion.div initial={{
            opacity: 0,
            y: 8
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4,
            delay: 0.5
          }} className="max-w-3xl mx-auto mt-6 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Flame size={18} className="text-primary" />
                  <span className="font-bold text-sm text-primary">{streak.current} day streak</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {streak.totalCompleted} quest{streak.totalCompleted !== 1 ? 's' : ''} completed · longest streak: {streak.longest}
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {progressMap.size} / {QUESTS.length} tracked
                </div>
              </motion.div>}
            {connected && publicKey && !streak && progressMap.size === 0 && <motion.div initial={{
            opacity: 0,
            y: 8
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4,
            delay: 0.5
          }} className="max-w-3xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3 text-center text-xs text-muted-foreground">
                Wallet connected — start completing quests to build your streak
              </motion.div>}
          </div>
        </section>

        {/* ── Quest Browser ─────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="container mx-auto px-4">

            {/* Filters */}
            <motion.div initial={{
            opacity: 0,
            y: 12
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4
          }} className="mb-8">
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Filter size={14} />
                <span>{questsContent.filterLabel}</span>
                {hasFilters && <button onClick={() => {
                setActiveCategory('all');
                setActiveTier('all');
              }} className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline">
                    <X size={11} />
                    Clear filters
                  </button>}
              </div>

              {/* Category chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                <FilterChip label="All categories" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
                {categories.map(cat => <FilterChip key={cat} label={`${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]}`} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />)}
              </div>

              {/* Tier chips */}
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All tiers" active={activeTier === 'all'} onClick={() => setActiveTier('all')} />
                {tiers.map(t => <FilterChip key={t} label={content.tierLabels[t]} active={activeTier === t} color={TIER_COLORS[t]} onClick={() => setActiveTier(t)} />)}
              </div>

              {/* Result count */}
              <div className="mt-3 text-xs text-muted-foreground">
                {filtered.length} quest{filtered.length !== 1 ? 's' : ''}
                {hasFilters ? ' matching filters' : ' total'}
              </div>
            </motion.div>

            {/* Main grid: quest list + detail panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              {/* Quest list */}
              <div>
                {filtered.length === 0 ? <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-muted-foreground">
                    {questsContent.emptyState}
                  </div> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((quest, i) => <motion.div key={quest.id} initial={{
                  opacity: 0,
                  y: 12
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.3,
                  delay: i * 0.03
                }}>
                        <QuestCard quest={quest} selected={selectedQuest.id === quest.id} onClick={() => setSelectedQuest(quest)} status={progressMap.get(quest.id)?.status} />
                      </motion.div>)}
                  </div>}
              </div>

              {/* Detail panel */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <QuestDetail quest={selectedQuest} status={selectedProgress?.status} completedAt={selectedProgress?.completedAt} onComplete={handleComplete} onClaim={handleClaim} actionLoading={actionLoading} walletConnected={connected && !!publicKey} onConnectWallet={openModal} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Reward Types ─────────────────────────────────────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {questsContent.rewardSection.headline}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {questsContent.rewardSection.body}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {questsContent.rewardDisplay.map((reward, i) => {
              const c = REWARD_TYPE_COLORS[reward.type] ?? '#888';
              return <motion.div key={reward.name} initial={{
                opacity: 0,
                y: 16
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.4,
                delay: i * 0.07
              }} className="rounded-2xl border p-5 flex flex-col gap-3 text-center" style={{
                borderColor: `${c}25`,
                background: `${c}06`
              }}>
                    <div className="text-4xl">{reward.icon}</div>
                    <div className="font-bold text-sm" style={{
                  color: c
                }}>{reward.name}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{reward.desc}</p>
                  </motion.div>;
            })}
            </div>
          </div>
        </section>

        {/* ── Tier Guide ────────────────────────────────────────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Quest tiers
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Higher tiers demand more — and reward more. Work your way up.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.entries(TIER_COLORS) as Array<[Quest['tier'], string]>).map(([tier, color], i) => {
              const questsInTier = QUESTS.filter(q => q.tier === tier);
              return <motion.div key={tier} initial={{
                opacity: 0,
                y: 16
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.4,
                delay: i * 0.07
              }} className="rounded-2xl border p-5 flex flex-col gap-3" style={{
                borderColor: `${color}30`,
                background: `${color}07`
              }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: `${color}20`,
                    border: `1.5px solid ${color}40`
                  }}>
                        <CheckCircle2 size={14} style={{
                      color
                    }} />
                      </div>
                      <span className="font-bold text-sm" style={{
                    color
                  }}>
                        {content.tierLabels[tier]}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {questsInTier.length} quest{questsInTier.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({
                    length: TIER_ORDER[tier]
                  }, (_, j) => <div key={j} className="h-1.5 flex-1 rounded-full" style={{
                    background: color
                  }} />)}
                      {Array.from({
                    length: 4 - TIER_ORDER[tier]
                  }, (_, j) => <div key={j} className="h-1.5 flex-1 rounded-full bg-white/10" />)}
                    </div>
                  </motion.div>;
            })}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <div className="text-5xl mb-6">⚔️</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {questsContent.cta.headline}
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                {questsContent.cta.body}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2 font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90" style={{
                boxShadow: '0 0 40px hsl(var(--primary) / 0.4)'
              }} asChild>
                  <Link to="/coins">
                    <Coins size={15} />
                    {questsContent.cta.primaryLabel}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                  <Link to="/crafting">
                    <FlaskConical size={15} />
                    {questsContent.cta.secondaryLabel}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>;
}
