import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Crown, Zap, Flame, Star, Leaf, ChevronUp, ChevronDown,
  RefreshCw, Shield, Users, Timer, Target, TrendingUp, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/wallet';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SeasonEntry {
  rank: number;
  walletAddress: string;
  displayName: string;
  xp: number;
  questsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
  score: number;
  tier: string;
  tierLabel: string;
  tierColor: string;
  tierEmoji: string;
}

interface SeasonInfo {
  number: number;
  name: string;
  theme: string;
  prizePool: string;
  startMs: number;
  endMs: number;
  msRemaining: number;
  progress: number;
  active: boolean;
}

interface TierDef {
  id: string;
  label: string;
  minScore: number;
  color: string;
  emoji: string;
}

interface ApiResponse {
  season: SeasonInfo;
  entries: SeasonEntry[];
  total: number;
  tiers: TierDef[];
  myEntry: SeasonEntry | null;
  weights: { xp: number; quest: number; streak: number; badge: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE = 'https://thetokengame.xyz';

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(endMs: number) {
  const [remaining, setRemaining] = useState(Math.max(0, endMs - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setRemaining(Math.max(0, endMs - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endMs]);
  const totalSecs = Math.floor(remaining / 1000);
  const days  = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins  = Math.floor((totalSecs % 3600) / 60);
  const secs  = totalSecs % 60;
  return { days, hours, mins, secs, done: remaining === 0 };
}

// ─── Tier icon ────────────────────────────────────────────────────────────────
function TierIcon({ tier, size = 14 }: { tier: string; size?: number }) {
  const p = { size, strokeWidth: 2 };
  switch (tier) {
    case 'champion':  return <Crown {...p} />;
    case 'legend':    return <Zap {...p} />;
    case 'veteran':   return <Flame {...p} />;
    case 'contender': return <Star {...p} />;
    default:          return <Leaf {...p} />;
  }
}

// ─── Rank medal ───────────────────────────────────────────────────────────────
function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl leading-none">🥇</span>;
  if (rank === 2) return <span className="text-xl leading-none">🥈</span>;
  if (rank === 3) return <span className="text-xl leading-none">🥉</span>;
  return <span className="text-xs font-bold font-mono text-muted-foreground">#{rank}</span>;
}

// ─── Countdown unit ───────────────────────────────────────────────────────────
function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl md:text-3xl font-black font-mono tabular-nums w-14 md:w-16 text-center py-2 rounded-xl bg-primary/10 text-primary">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, maxScore, color }: { score: number; maxScore: number; color: string }) {
  const pct = maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0;
  return (
    <div className="h-1 rounded-full bg-white/10 overflow-hidden w-16">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

// ─── Entry row ────────────────────────────────────────────────────────────────
function EntryRow({
  entry, isMe, maxScore, expanded, onToggle,
}: {
  entry: SeasonEntry;
  isMe: boolean;
  maxScore: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = entry.tierColor;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border overflow-hidden cursor-pointer transition-colors"
      style={{
        borderColor: isMe ? `${color}60` : expanded ? `${color}30` : 'hsl(var(--border))',
        background: isMe ? `${color}08` : expanded ? `${color}05` : 'transparent',
      }}
      onClick={onToggle}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 flex items-center justify-center shrink-0">
          <RankMedal rank={entry.rank} />
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border"
          style={{ borderColor: `${color}40`, background: `${color}12` }}
        >
          {entry.tierEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm truncate" style={{ color: isMe ? color : undefined }}>
              {entry.displayName}
            </span>
            {isMe && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: `${color}20`, color }}>
                You
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: `${color}15`, color }}
            >
              <TierIcon tier={entry.tier} size={8} />
              {entry.tierLabel}
            </span>
            <ScoreBar score={entry.score} maxScore={maxScore} color={color} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold font-mono" style={{ color }}>
            {entry.score.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">pts</div>
        </div>
        <div className="text-muted-foreground shrink-0 ml-1">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </div>

      {/* Expanded breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-3 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t"
              style={{ borderColor: `${color}15` }}
            >
              <MiniStat label="XP"          value={entry.xp}               icon="⚡" color={color} />
              <MiniStat label="Quests"      value={entry.questsCompleted}  icon="🎯" color={color} />
              <MiniStat label="Best streak" value={entry.longestStreak}    icon="🔥" color={color} suffix="d" />
              <MiniStat label="Badges"      value={entry.totalBadges}      icon="🏅" color={color} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MiniStat({ label, value, icon, color, suffix }: {
  label: string; value: number; icon: string; color: string; suffix?: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5 flex items-center gap-2"
      style={{ background: `${color}08`, border: `1px solid ${color}12` }}
    >
      <span className="text-sm">{icon}</span>
      <div>
        <div className="text-xs font-bold font-mono" style={{ color }}>
          {value.toLocaleString()}{suffix ?? ''}
        </div>
        <div className="text-[10px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

// ─── My rank card ─────────────────────────────────────────────────────────────
function MyRankCard({ entry, total }: { entry: SeasonEntry; total: number }) {
  const color   = entry.tierColor;
  const pctile  = total > 1 ? Math.round(((total - entry.rank) / (total - 1)) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5"
      style={{ borderColor: `${color}40`, background: `${color}08` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
          style={{ background: `${color}20`, color }}>
          {entry.tierEmoji}
        </div>
        <div>
          <div className="text-xs font-bold" style={{ color }}>Your Season Rank</div>
          <div className="text-[10px] text-muted-foreground">{entry.tierLabel}</div>
        </div>
      </div>
      <div className="text-4xl font-black font-mono mb-1 text-primary">
        #{entry.rank}
      </div>
      <div className="text-xs text-muted-foreground mb-4">
        Top {100 - pctile}% of {total.toLocaleString()} players
      </div>
      <div className="space-y-2">
        {[
          { label: 'Season score', value: entry.score.toLocaleString() + ' pts' },
          { label: 'Total XP',     value: entry.xp.toLocaleString() },
          { label: 'Quests done',  value: String(entry.questsCompleted) },
          { label: 'Best streak',  value: `${entry.longestStreak} days` },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className="text-xs font-bold" style={{ color }}>{s.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 6px hsl(var(--primary))' }} />
      <span className="text-xs font-bold text-primary uppercase tracking-widest">{label}</span>
      <div className="h-px flex-1 bg-primary/15" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SeasonLeaderboardPage() {
  const title       = 'Season Leaderboard — The Token Game | Compete for Glory';
  const description = 'Compete in The Token Game Season 1. Earn XP, complete quests, build streaks, and climb the season rankings to win prizes.';
  const url         = `${SITE}/season-leaderboard`;
  const ogImage = `${SITE}/og-image.png`;

  const { connected, publicKey: walletAddr } = useWallet();

  const [data, setData]             = useState<ApiResponse | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy]         = useState<'score' | 'xp' | 'quests' | 'streak'>('score');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (walletAddr) params.set('wallet', walletAddr);
      const res  = await fetch(`/api/season-leaderboard?${params}`);
      const json = await res.json() as ApiResponse;
      setData(json);
    } catch {
      setError('Could not load the season leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [walletAddr]);

  useEffect(() => { load(); }, [load]);

  const countdown = useCountdown(data?.season.endMs ?? Date.now() + 86400000 * 83);

  const sorted = data ? [...data.entries].sort((a, b) => {
    if (sortBy === 'xp')     return b.xp - a.xp;
    if (sortBy === 'quests') return b.questsCompleted - a.questsCompleted;
    if (sortBy === 'streak') return b.longestStreak - a.longestStreak;
    return b.score - a.score;
  }) : [];

  const maxScore = sorted[0]?.score ?? 1;
  const top3     = sorted.slice(0, 3);
  const myEntry  = data?.myEntry ?? null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url,
          isPartOf: { '@id': `${SITE}/#website` },
          about: { '@id': `${SITE}/#organization` },
        })}</script>
      </Helmet>

      <h1 className="sr-only">{title}</h1>

      <div className="min-h-screen bg-background">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[200px] opacity-[0.07] bg-primary" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.05] bg-secondary" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">

          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 border border-primary/40 text-primary bg-primary/10">
              <Trophy size={11} />
              {data?.season.name ?? 'Season 1'} · {data?.season.theme ?? 'The Founding'}
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              Season Leaderboard
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-2">
              Earn XP, complete quests, and build streaks to climb the ranks.
            </p>
            {data?.season.prizePool && (
              <p className="text-sm font-bold text-accent">
                🏆 Prize pool: {data.season.prizePool}
              </p>
            )}
          </motion.div>

          {/* ── Countdown ── */}
          {data?.season && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-10"
            >
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">
                  <Timer size={12} />
                  {countdown.done ? 'Season ended' : 'Season ends in'}
                </div>

                {!countdown.done ? (
                  <div className="flex items-center justify-center gap-3">
                    <CountUnit value={countdown.days}  label="days" />
                    <span className="text-2xl font-black text-muted-foreground/30 mb-4">:</span>
                    <CountUnit value={countdown.hours} label="hrs" />
                    <span className="text-2xl font-black text-muted-foreground/30 mb-4">:</span>
                    <CountUnit value={countdown.mins}  label="min" />
                    <span className="text-2xl font-black text-muted-foreground/30 mb-4">:</span>
                    <CountUnit value={countdown.secs}  label="sec" />
                  </div>
                ) : (
                  <p className="text-lg font-bold text-muted-foreground">Season has ended. Final rankings locked.</p>
                )}

                {/* Progress bar */}
                <div className="mt-5 max-w-sm mx-auto">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.season.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' as const }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                    <span>Season start</span>
                    <span>{data.season.progress}% complete</span>
                    <span>Season end</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Main layout ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Leaderboard ── */}
            <div className="flex-1 min-w-0">

              {/* Podium */}
              {!loading && top3.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <SectionLabel label="Podium" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                      if (!entry) return <div key={podiumIdx} />;
                      const color = entry.tierColor;
                      const podiumMt = ['sm:mt-5', 'sm:mt-0', 'sm:mt-9'] as const;
                      const isMe = connected && walletAddr === entry.walletAddress;
                      return (
                        <motion.div
                          key={entry.walletAddress}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: podiumIdx * 0.08 }}
                          whileHover={{ scale: 1.02 }}
                          className={`rounded-2xl border flex flex-col items-center justify-end pb-5 pt-5 px-3 text-center cursor-pointer ${podiumMt[podiumIdx]}`}
                          style={{
                            borderColor: `${color}40`,
                            background: `${color}0C`,
                            boxShadow: `0 0 24px ${color}12`,
                            minHeight: podiumIdx === 1 ? '170px' : '140px',
                          }}
                          onClick={() => setExpandedId(expandedId === entry.walletAddress ? null : entry.walletAddress)}
                        >
                          <div className="text-2xl mb-1">{entry.tierEmoji}</div>
                          <div className="text-xs font-bold truncate w-full" style={{ color }}>
                            {entry.displayName}{isMe ? ' (You)' : ''}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{entry.tierLabel}</div>
                          <div className="text-lg font-black font-mono mt-2" style={{ color }}>
                            {entry.score.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-muted-foreground">pts</div>
                          <div className="mt-2"><RankMedal rank={entry.rank} /></div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              )}

              {/* Sort controls */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Sort:</span>
                {(['score', 'xp', 'quests', 'streak'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-xl border transition-all"
                    style={{
                      borderColor: sortBy === s ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      background: sortBy === s ? 'hsl(var(--primary)/0.15)' : 'transparent',
                      color: sortBy === s ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {s === 'score' ? 'Season pts' : s === 'xp' ? 'XP' : s === 'quests' ? 'Quests' : 'Streak'}
                  </button>
                ))}
                <button
                  onClick={load}
                  className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {/* Full list */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel label="All players" />
                  {data && (
                    <span className="text-xs text-muted-foreground shrink-0">{data.total} competing</span>
                  )}
                </div>

                {loading && !data && (
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
                    ))}
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-3">{error}</p>
                    <Button variant="outline" size="sm" onClick={load}>Try again</Button>
                  </div>
                )}

                {!loading && !error && sorted.length === 0 && (
                  <div className="text-center py-16">
                    <Trophy size={32} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No players yet. Complete quests to appear here.</p>
                  </div>
                )}

                {!error && sorted.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {sorted.map(entry => (
                      <EntryRow
                        key={entry.walletAddress}
                        entry={entry}
                        isMe={!!(connected && walletAddr === entry.walletAddress)}
                        maxScore={maxScore}
                        expanded={expandedId === entry.walletAddress}
                        onToggle={() => setExpandedId(expandedId === entry.walletAddress ? null : entry.walletAddress)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* ── Sidebar ── */}
            <div className="w-full lg:w-72 shrink-0 space-y-5">

              {/* My rank */}
              {connected && myEntry && (
                <MyRankCard entry={myEntry} total={data?.total ?? 1} />
              )}

              {/* Connect CTA */}
              {!connected && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
                  <Star size={22} className="mx-auto mb-3 text-primary" />
                  <p className="text-sm font-bold mb-1">Where do you rank?</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Connect your wallet to see your season score and position.
                  </p>
                  <Button
                    size="sm"
                    className="w-full font-semibold"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', color: 'white' }}
                    onClick={() => document.querySelector<HTMLButtonElement>('[data-wallet-connect]')?.click()}
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}

              {/* Score formula */}
              {data && (
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={14} className="text-primary" />
                    <p className="text-sm font-bold">How scores work</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Each XP point',     value: `×${data.weights.xp}`,       icon: '⚡' },
                      { label: 'Quest completed',   value: `+${data.weights.quest} pts`, icon: '🎯' },
                      { label: 'Streak day (best)', value: `+${data.weights.streak} pts`, icon: '🔥' },
                      { label: 'Badge earned',      value: `+${data.weights.badge} pts`, icon: '🏅' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{r.icon}</span>
                          {r.label}
                        </div>
                        <span className="text-xs font-bold text-primary">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier thresholds */}
              {data && (
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={14} className="text-primary" />
                    <p className="text-sm font-bold">Season tiers</p>
                  </div>
                  <div className="space-y-2">
                    {data.tiers.map(tier => (
                      <div key={tier.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <span>{tier.emoji}</span>
                          <span style={{ color: tier.color }}>{tier.label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {tier.minScore.toLocaleString()}+ pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="flex flex-col gap-2">
                {[
                  { href: '/quests',          icon: <Zap size={14} className="text-primary" />,    label: 'Earn quest XP' },
                  { href: '/journey',         icon: <Shield size={14} className="text-primary" />, label: 'View journey' },
                  { href: '/hall-of-legends', icon: <Trophy size={14} className="text-primary" />, label: 'Hall of Legends' },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {link.label}
                    </span>
                    <ChevronDown size={12} className="text-muted-foreground -rotate-90" />
                  </a>
                ))}
              </div>

              {/* Live stats */}
              {data && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Competing', value: String(data.total),                          icon: <Users size={12} /> },
                    { label: 'Top score', value: sorted[0]?.score.toLocaleString() ?? '—',    icon: <TrendingUp size={12} /> },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl border border-white/10 bg-card/40 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-primary mb-1">
                        {s.icon}
                        <span className="text-lg font-bold">{s.value}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
