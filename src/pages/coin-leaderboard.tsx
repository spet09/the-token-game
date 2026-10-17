import { useState, useEffect, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Medal, Star, TrendingUp, ExternalLink, RefreshCw,
  Loader2, AlertCircle, Zap, Clock, BarChart3, ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoinLeaderboardEntry {
  rank:         number;
  ticker:       string;
  name:         string;
  image:        string | null;
  buyUrl:       string;
  mintAddress:  string | null;
  txCount:      number;
  status:       'live' | 'pending';
  permanent:    boolean;
  lastActivity: number | null;
}

interface LeaderboardResponse {
  entries:   CoinLeaderboardEntry[];
  updatedAt: number;
  cached:    boolean;
  stale?:    boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(ts: number | null): string {
  if (!ts) return '—';
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatTx(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function shortMint(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`;
}

// ─── Rank badge ───────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-9 h-9 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center shrink-0">
      <Trophy className="w-4 h-4 text-yellow-400" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-9 h-9 rounded-full bg-slate-400/20 border border-slate-400/40 flex items-center justify-center shrink-0">
      <Medal className="w-4 h-4 text-slate-300" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-9 h-9 rounded-full bg-orange-600/20 border border-orange-600/40 flex items-center justify-center shrink-0">
      <Star className="w-4 h-4 text-orange-400" />
    </div>
  );
  return (
    <div className="w-9 h-9 rounded-full bg-muted/50 border border-border flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-muted-foreground">{rank}</span>
    </div>
  );
}

// ─── Activity bar ─────────────────────────────────────────────────────────────

function ActivityBar({ txCount, maxTx }: { txCount: number; maxTx: number }) {
  const pct = maxTx > 0 ? Math.max(2, Math.round((txCount / maxTx) * 100)) : 0;
  return (
    <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden w-full">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
      />
    </div>
  );
}

// ─── Coin row ─────────────────────────────────────────────────────────────────

function CoinRow({
  entry, maxTx, index, expanded, onToggle,
}: {
  entry: CoinLeaderboardEntry;
  maxTx: number;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isTop3 = entry.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.5), ease: 'easeOut' as const }}
      className={`rounded-2xl border bg-card/60 backdrop-blur-sm overflow-hidden ${
        isTop3 ? 'border-primary/20' : 'border-border/50'
      } ${entry.status === 'pending' ? 'opacity-60' : ''}`}
    >
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors text-left"
      >
        <RankBadge rank={entry.rank} />

        {/* Coin image */}
        {entry.image ? (
          <img
            src={entry.image}
            alt={entry.name}
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border text-[10px] font-bold text-muted-foreground">
            {entry.ticker.replace('$', '').slice(0, 3)}
          </div>
        )}

        {/* Name + ticker */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-primary text-sm">{entry.ticker}</span>
            {entry.permanent && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Flagship</span>
            )}
            {entry.status === 'pending' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Pending</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{entry.name}</div>
        </div>

        {/* Activity bar + tx count */}
        <div className="hidden sm:flex flex-col gap-1 w-32 shrink-0">
          <ActivityBar txCount={entry.txCount} maxTx={maxTx} />
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" />
              {formatTx(entry.txCount)} txs
            </span>
            {entry.lastActivity && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(entry.lastActivity)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile tx count */}
        <div className="sm:hidden text-right shrink-0">
          <div className="text-sm font-bold text-foreground">{formatTx(entry.txCount)}</div>
          <div className="text-[10px] text-muted-foreground">txs</div>
        </div>

        {/* Expand toggle */}
        <div className="text-muted-foreground shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-3">
              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="rounded-xl bg-background/60 border border-border/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground mb-0.5">On-chain txs</div>
                  <div className="text-sm font-bold text-foreground">{entry.txCount.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-background/60 border border-border/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground mb-0.5">Last activity</div>
                  <div className="text-sm font-bold text-foreground">{timeAgo(entry.lastActivity)}</div>
                </div>
                <div className="rounded-xl bg-background/60 border border-border/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground mb-0.5">Type</div>
                  <div className="text-sm font-bold text-foreground">{entry.permanent ? 'Flagship' : 'Seasonal'}</div>
                </div>
              </div>

              {/* Mint address */}
              {entry.mintAddress && (
                <div className="rounded-xl bg-background/60 border border-border/50 px-3 py-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Mint address</div>
                    <div className="font-mono text-xs text-muted-foreground">{shortMint(entry.mintAddress)}</div>
                  </div>
                  <a
                    href={entry.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
                  >
                    Raydium <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoinLeaderboardPage() {
  const [data, setData]         = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showPending, setShowPending] = useState(false);

  const fetchData = useCallback(async (force = false) => {
    setLoading(true);
    setError('');
    try {
      const url = force ? '/api/coins/leaderboard?refresh=1' : '/api/coins/leaderboard';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: LeaderboardResponse = await res.json();
      setData(json);
    } catch (e) {
      setError('Could not load leaderboard. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const liveEntries    = data?.entries.filter(e => e.status === 'live')    ?? [];
  const pendingEntries = data?.entries.filter(e => e.status === 'pending') ?? [];
  const maxTx          = liveEntries[0]?.txCount ?? 1;

  const site = 'https://thetokengame.xyz';
  const url  = `${site}/coin-leaderboard`;

  return (
    <>
      <Helmet>
        <title>Coin Leaderboard — The Token Game</title>
        <meta name="description" content="Live on-chain trading activity rankings for all Token Game coins. See which coins are most actively traded on Raydium by transaction count." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Coin Leaderboard — The Token Game" />
        <meta property="og:description" content="Live on-chain trading activity rankings for all Token Game coins." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          name: 'Coin Leaderboard — The Token Game',
          url,
          description: 'Live on-chain trading activity rankings for all Token Game coins.',
          isPartOf: { '@id': `${site}/#website` },
          about: { '@id': `${site}/#organization` },
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background text-foreground">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 py-14 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-card/60 border border-border rounded-full px-3 py-1.5 mb-4">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                Ranked by on-chain transaction count
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Coin Leaderboard</h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Which Token Game coins are getting the most action on Raydium? Ranked live by on-chain trading activity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats bar */}
        {data && (
          <div className="border-b border-border/50 bg-card/30">
            <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-6 text-sm">
                <span className="text-muted-foreground">
                  <span className="text-foreground font-semibold">{liveEntries.length}</span> live coins
                </span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {liveEntries.reduce((s, e) => s + e.txCount, 0).toLocaleString()}
                  </span> total txs
                </span>
                {data.cached && (
                  <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Cached · {timeAgo(Math.floor(data.updatedAt / 1000))}
                  </span>
                )}
              </div>
              <button
                onClick={() => fetchData(true)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

          {/* Loading */}
          {loading && !data && (
            <div className="flex flex-col items-center gap-4 py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Fetching on-chain data from Solana…</p>
              <p className="text-xs opacity-60">Querying {13} live coins — takes ~10 seconds</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Live leaderboard */}
          {liveEntries.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Live coins — ranked by trading activity
                </h2>
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">{liveEntries.length}</span>
              </div>

              {liveEntries.map((entry, i) => (
                <CoinRow
                  key={entry.ticker}
                  entry={entry}
                  maxTx={maxTx}
                  index={i}
                  expanded={expanded === entry.ticker}
                  onToggle={() => setExpanded(expanded === entry.ticker ? null : entry.ticker)}
                />
              ))}
            </div>
          )}

          {/* Pending section — collapsible */}
          {pendingEntries.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowPending(v => !v)}
                className="flex items-center gap-3 w-full group"
              >
                <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending launch
                </h2>
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">{pendingEntries.length}</span>
                {showPending
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {showPending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' as const }}
                    className="overflow-hidden space-y-2"
                  >
                    {pendingEntries.map((entry, i) => (
                      <CoinRow
                        key={entry.ticker}
                        entry={entry}
                        maxTx={maxTx}
                        index={i}
                        expanded={expanded === entry.ticker}
                        onToggle={() => setExpanded(expanded === entry.ticker ? null : entry.ticker)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && liveEntries.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No live coins found yet.</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground space-y-1">
          <p>Rankings based on on-chain transaction count via Solana RPC — a public proxy for trading activity.</p>
          <p>Data refreshes every 10 minutes. Coins with more transactions have been traded more on Raydium.</p>
        </div>
      </main>
    </>
  );
}
