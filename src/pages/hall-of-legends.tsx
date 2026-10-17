import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Trophy, Zap, Flame, Star, Crown, Leaf, ChevronUp, ChevronDown, RefreshCw, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Legend {
  rank: number;
  walletAddress: string;
  displayName: string;
  xp: number;
  tier: string;
  tierLabel: string;
  tierColor: string;
  tierEmoji: string;
  stage: number;
  stageName: string;
  totalBadges: number;
  badges: string[];
  questsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalQuestXp: number;
  rpgClass: string | null;
  rpgLevel: number | null;
  rpgName: string | null;
  score: number;
}

interface TierDef {
  id: string;
  label: string;
  minXp: number;
  color: string;
  emoji: string;
}

interface ApiResponse {
  legends: Legend[];
  total: number;
  tiers: TierDef[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE = 'https://thetokengame.xyz';
const title = 'Hall of Legends — The Token Game | Top Wallet Showcases';
const description = 'The greatest collectors, questers, and players in The Token Game universe. Ranked by XP, quests, and streaks.';
const url = `${SITE}/hall-of-legends`;
const ogImage = `${SITE}/og-image.png`;

const RPG_CLASS_LABELS: Record<string, string> = {
  warrior:   'Warrior',
  mage:      'Mage',
  merchant:  'Merchant',
  explorer:  'Explorer',
  collector: 'Collector',
};

const RPG_CLASS_ICONS: Record<string, string> = {
  warrior:   '⚔️',
  mage:      '🔮',
  merchant:  '💰',
  explorer:  '🗺️',
  collector: '🏆',
};

// ─── Tier icon ────────────────────────────────────────────────────────────────
function TierIcon({ tier, size = 14 }: { tier: string; size?: number }) {
  const props = { size, strokeWidth: 2 };
  switch (tier) {
    case 'mythic':    return <Crown {...props} />;
    case 'legendary': return <Zap {...props} />;
    case 'epic':      return <Flame {...props} />;
    case 'rare':      return <Star {...props} />;
    default:          return <Leaf {...props} />;
  }
}

// ─── Rank medal ───────────────────────────────────────────────────────────────
function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="text-sm font-bold font-mono text-muted-foreground w-8 text-center">
      #{rank}
    </span>
  );
}

// ─── Legend card ──────────────────────────────────────────────────────────────
function LegendCard({ legend, expanded, onToggle }: {
  legend: Legend;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = legend.tierColor;
  const isTop3 = legend.rank <= 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border overflow-hidden cursor-pointer"
      style={{
        borderColor: expanded ? `${color}50` : `${color}20`,
        background: expanded ? `${color}08` : `${color}04`,
        boxShadow: isTop3 ? `0 0 24px ${color}18` : undefined,
      }}
      onClick={onToggle}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-4">
        {/* Rank */}
        <div className="w-10 flex items-center justify-center shrink-0">
          <RankMedal rank={legend.rank} />
        </div>

        {/* Avatar / tier badge */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2"
          style={{ borderColor: `${color}60`, background: `${color}15` }}
        >
          {legend.tierEmoji}
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm truncate" style={{ color }}>
              {legend.displayName}
            </span>
            {legend.rpgName && legend.rpgName !== legend.displayName && (
              <span className="text-[10px] text-muted-foreground truncate hidden sm:block">
                {legend.rpgClass ? RPG_CLASS_ICONS[legend.rpgClass] : ''} {legend.rpgName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: `${color}20`, color }}
            >
              <TierIcon tier={legend.tier} size={9} />
              {legend.tierLabel}
            </span>
            <span className="text-[10px] text-muted-foreground">{legend.stageName}</span>
          </div>
        </div>

        {/* XP */}
        <div className="text-right shrink-0">
          <div className="text-base font-bold font-mono" style={{ color }}>
            {legend.xp.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">XP</div>
        </div>

        {/* Expand toggle */}
        <div className="text-muted-foreground shrink-0 ml-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t"
              style={{ borderColor: `${color}20` }}
            >
              <StatBox label="Quests done"  value={legend.questsCompleted} color={color} icon="🎯" />
              <StatBox label="Best streak"  value={legend.longestStreak}   color={color} icon="🔥" suffix="days" />
              <StatBox label="Quest XP"     value={legend.totalQuestXp}    color={color} icon="⚡" />
              <StatBox label="Badges"       value={legend.totalBadges}     color={color} icon="🏅" />

              {legend.rpgClass && (
                <div
                  className="col-span-2 sm:col-span-4 rounded-xl p-3 flex items-center gap-3"
                  style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                >
                  <span className="text-xl">{RPG_CLASS_ICONS[legend.rpgClass] ?? '⚔️'}</span>
                  <div>
                    <div className="text-xs font-bold" style={{ color }}>
                      {legend.rpgName ?? legend.displayName}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {RPG_CLASS_LABELS[legend.rpgClass] ?? legend.rpgClass} · Level {legend.rpgLevel ?? 1}
                    </div>
                  </div>
                </div>
              )}

              {legend.badges.length > 0 && (
                <div className="col-span-2 sm:col-span-4 flex flex-wrap gap-1.5">
                  {legend.badges.map(b => (
                    <span
                      key={b}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatBox({ label, value, color, icon, suffix }: {
  label: string; value: number; color: string; icon: string; suffix?: string;
}) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-1"
      style={{ background: `${color}08`, border: `1px solid ${color}15` }}
    >
      <div className="text-base">{icon}</div>
      <div className="text-lg font-bold font-mono" style={{ color }}>
        {value.toLocaleString()}{suffix ? ` ${suffix}` : ''}
      </div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

// ─── Tier filter chip ─────────────────────────────────────────────────────────
function TierChip({ tier, active, onClick }: { tier: TierDef; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all"
      style={{
        borderColor: active ? tier.color : 'hsl(var(--border))',
        background: active ? `${tier.color}20` : 'transparent',
        color: active ? tier.color : 'hsl(var(--muted-foreground))',
      }}
    >
      <span>{tier.emoji}</span>
      {tier.label}
    </button>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ tierFilter, onClear }: { tierFilter: string | null; onClear: () => void }) {
  return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">🏆</div>
      <p className="text-muted-foreground text-lg mb-2">
        {tierFilter ? `No ${tierFilter} legends yet` : 'No legends yet'}
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        Complete quests, earn XP, and climb the ranks to appear here.
      </p>
      {tierFilter && (
        <Button variant="outline" size="sm" onClick={onClear} className="border-white/15">
          Show all tiers
        </Button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HallOfLegendsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'xp' | 'quests' | 'streak'>('score');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (tierFilter) params.set('tier', tierFilter);
      const res = await fetch(`/api/hall-of-legends?${params}`);
      const json: ApiResponse = await res.json();
      setData(json);
    } catch {
      setError('Could not load the Hall of Legends.');
    } finally {
      setLoading(false);
    }
  }, [tierFilter]);

  useEffect(() => { load(); }, [load]);

  // Client-side sort
  const sorted = data ? [...data.legends].sort((a, b) => {
    if (sortBy === 'xp')     return b.xp - a.xp;
    if (sortBy === 'quests') return b.questsCompleted - a.questsCompleted;
    if (sortBy === 'streak') return b.longestStreak - a.longestStreak;
    return b.score - a.score;
  }) : [];

  const top3 = sorted.slice(0, 3);
  const rest  = sorted.slice(3);
  void rest; // used implicitly via sorted

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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[200px] opacity-10 bg-primary" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">

          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="text-6xl mb-4">🏆</div>
            <div className="inline-block text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-4 border border-primary/40 text-primary bg-primary/10">
              Hall of Legends
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              The Greatest Players
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Ranked by XP, quest completions, and streaks. Earn your place.
            </p>

            {data && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-8 mt-10"
              >
                {[
                  { label: 'Legends ranked', value: String(data.total),                          icon: <Users size={14} /> },
                  { label: 'Tiers',           value: String(data.tiers.length),                   icon: <Trophy size={14} /> },
                  { label: 'Top XP',          value: sorted[0]?.xp.toLocaleString() ?? '—',       icon: <Zap size={14} /> },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                      {s.icon}
                      <span className="text-2xl font-bold">{s.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* ── Controls ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8 flex flex-col gap-4"
          >
            {data && (
              <div className="flex flex-wrap gap-2 items-center">
                <TierChip
                  tier={{ id: '', label: 'All tiers', minXp: 0, color: 'hsl(var(--primary))', emoji: '🌐' }}
                  active={tierFilter === null}
                  onClick={() => setTierFilter(null)}
                />
                {data.tiers.map(t => (
                  <TierChip key={t.id} tier={t} active={tierFilter === t.id} onClick={() => setTierFilter(t.id)} />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Sort by:</span>
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
                  {s === 'score' ? 'Overall' : s === 'xp' ? 'XP' : s === 'quests' ? 'Quests' : 'Streak'}
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
          </motion.div>

          {/* ── Loading skeletons ── */}
          {loading && !data && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={load} className="border-white/15">
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && data && sorted.length === 0 && (
            <EmptyState tierFilter={tierFilter} onClear={() => setTierFilter(null)} />
          )}

          {!error && sorted.length > 0 && (
            <div className="flex flex-col gap-10">

              {/* ── Podium (top 3) ── */}
              {top3.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 8px hsl(var(--primary))' }} />
                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Podium</h2>
                    <div className="h-px flex-1 bg-primary/20" />
                  </div>

                  {/* 2nd | 1st | 3rd */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[top3[1], top3[0], top3[2]].map((legend, podiumIdx) => {
                      if (!legend) return <div key={podiumIdx} />;
                      const podiumHeights = ['sm:mt-4', 'sm:mt-0', 'sm:mt-8'] as const;
                      const color = legend.tierColor;
                      return (
                        <motion.div
                          key={legend.walletAddress}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: podiumIdx * 0.1 }}
                          className={`rounded-2xl border flex flex-col items-center justify-end pb-5 pt-6 px-4 text-center cursor-pointer transition-all hover:scale-[1.02] ${podiumHeights[podiumIdx]}`}
                          style={{
                            borderColor: `${color}40`,
                            background: `${color}10`,
                            boxShadow: `0 0 30px ${color}15`,
                            minHeight: podiumIdx === 1 ? '180px' : '150px',
                          }}
                          onClick={() => setExpandedId(expandedId === legend.walletAddress ? null : legend.walletAddress)}
                        >
                          <div className="text-3xl mb-2">{legend.tierEmoji}</div>
                          <div className="text-xs font-bold truncate w-full" style={{ color }}>
                            {legend.displayName}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{legend.stageName}</div>
                          <div className="text-xl font-bold font-mono mt-2" style={{ color }}>
                            {legend.xp.toLocaleString()} XP
                          </div>
                          <div className="mt-3">
                            <RankMedal rank={legend.rank} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Full leaderboard ── */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 8px hsl(var(--primary))' }} />
                  <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
                    {tierFilter
                      ? `${tierFilter.charAt(0).toUpperCase() + tierFilter.slice(1)} tier`
                      : 'All legends'}
                  </h2>
                  <div className="h-px flex-1 bg-primary/20" />
                  <span className="text-xs text-muted-foreground shrink-0">{sorted.length} players</span>
                </div>

                <div className="flex flex-col gap-2">
                  {sorted.map(legend => (
                    <LegendCard
                      key={legend.walletAddress}
                      legend={legend}
                      expanded={expandedId === legend.walletAddress}
                      onToggle={() => setExpandedId(expandedId === legend.walletAddress ? null : legend.walletAddress)}
                    />
                  ))}
                </div>
              </section>

              {/* ── Tier breakdown ── */}
              {!tierFilter && data && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 8px hsl(var(--primary))' }} />
                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Tier breakdown</h2>
                    <div className="h-px flex-1 bg-primary/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.tiers.map(tier => {
                      const count = sorted.filter(l => l.tier === tier.id).length;
                      return (
                        <motion.button
                          key={tier.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setTierFilter(tier.id)}
                          className="rounded-2xl border p-5 text-left transition-all"
                          style={{
                            borderColor: `${tier.color}30`,
                            background: `${tier.color}08`,
                          }}
                        >
                          <div className="text-3xl mb-2">{tier.emoji}</div>
                          <div className="font-bold text-sm mb-0.5" style={{ color: tier.color }}>
                            {tier.label}
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {tier.minXp.toLocaleString()}+ XP required
                          </div>
                          <div className="text-2xl font-bold font-mono" style={{ color: tier.color }}>
                            {count}
                          </div>
                          <div className="text-[10px] text-muted-foreground">players</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-20 pb-8"
          >
            <p className="text-muted-foreground/50 text-sm mb-4">
              Complete quests, earn XP, and build your streak to climb the ranks.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/quests"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Zap size={14} /> Start questing
              </a>
              <a
                href="/journey"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
              >
                <Shield size={14} /> View journey
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
