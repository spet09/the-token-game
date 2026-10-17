import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Star, Coffee, Coins, ExternalLink, Crown, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'None';

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  coins: number;
  permanent: number;
  seasonal: number;
  tier: Tier;
  tickers: string[];
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  updatedAt: number;
  cached: boolean;
}

interface WalletStats {
  coins: number;
  permanent: number;
  seasonal: number;
  tier: string;
  tickers: string[];
}

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { color: string; icon: React.ReactNode; min: number }> = {
  Platinum: { color: 'hsl(276 100% 69%)',  icon: <Crown size={13} />,  min: 25 },
  Gold:     { color: 'hsl(45 100% 65%)',   icon: <Trophy size={13} />, min: 12 },
  Silver:   { color: '#C0C0C0',            icon: <Medal size={13} />,  min: 6  },
  Bronze:   { color: '#cd7f32',            icon: <Coffee size={13} />, min: 3  },
  None:     { color: 'hsl(255 20% 40%)',   icon: <Coins size={13} />,  min: 0  },
};

const RANK_COLORS: Record<number, string> = {
  1: 'hsl(45 100% 65%)',
  2: '#C0C0C0',
  3: '#cd7f32',
};

const primaryColor = 'hsl(276 100% 69%)';
const accentColor  = 'hsl(96 100% 69%)';

// ─── Sub-components ───────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const color = RANK_COLORS[rank];
    const icons = [<Crown size={16} />, <Trophy size={16} />, <Medal size={16} />];
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${color}20`, color, border: `1px solid ${color}50` }}>
        {icons[rank - 1]}
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-foreground/40"
      style={{ background: 'hsl(255 20% 12%)', border: '1px solid hsl(255 20% 20%)' }}>
      {rank}
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG['None'];
  if (tier === 'None') return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      {cfg.icon}
      {tier}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[40px_1fr_80px_80px_100px] gap-4 px-5 py-4 items-center border-b border-white/5 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-white/10" />
      <div className="space-y-1.5">
        <div className="h-3 bg-white/10 rounded w-32" />
        <div className="h-2.5 bg-white/5 rounded w-24" />
      </div>
      <div className="h-3 bg-white/10 rounded ml-auto w-8" />
      <div className="h-3 bg-white/10 rounded ml-auto w-6 hidden sm:block" />
      <div className="h-5 bg-white/10 rounded ml-auto w-16" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const title = 'Leaderboard — The Token Game';
  const description = 'Live on-chain rankings for The Token Game. Connect your Solana wallet to see how many coins you hold, your collector tier, and where you rank.';

  const { connected, publicKey: address } = useWallet();

  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAgo, setUpdatedAgo] = useState('');

  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletRank, setWalletRank] = useState<number | null>(null);

  // ── Fetch leaderboard ──────────────────────────────────────────────────────
  const fetchLeaderboard = useCallback(async (force = false) => {
    try {
      force ? setRefreshing(true) : setLoading(true);
      setError(null);
      const url = force ? '/api/leaderboard?refresh=1' : '/api/leaderboard';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load leaderboard');
      const json = await res.json() as LeaderboardResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  // ── Update "X minutes ago" label ───────────────────────────────────────────
  useEffect(() => {
    if (!data) return;
    const update = () => {
      const secs = Math.floor((Date.now() - data.updatedAt) / 1000);
      if (secs < 60) setUpdatedAgo(`${secs}s ago`);
      else if (secs < 3600) setUpdatedAgo(`${Math.floor(secs / 60)}m ago`);
      else setUpdatedAgo(`${Math.floor(secs / 3600)}h ago`);
    };
    update();
    const t = setInterval(update, 15_000);
    return () => clearInterval(t);
  }, [data]);

  // ── Fetch connected wallet stats ───────────────────────────────────────────
  useEffect(() => {
    if (!connected || !address) { setWalletStats(null); setWalletRank(null); return; }

    const fetchWallet = async () => {
      setWalletLoading(true);
      try {
        // Register wallet so it appears in future leaderboard builds
        await fetch('/api/leaderboard/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        const res = await fetch(`/api/leaderboard/wallet/${address}`);
        if (!res.ok) throw new Error('Failed to fetch wallet');
        const stats = await res.json() as WalletStats;
        setWalletStats(stats);

        // Find rank in current leaderboard
        if (data) {
          const entry = data.entries.find((e) =>
            e.address === `${address.slice(0, 4)}...${address.slice(-4)}`
          );
          setWalletRank(entry?.rank ?? null);
        }
      } catch {
        // non-fatal
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWallet();
  }, [connected, address, data]);

  const entries = data?.entries ?? [];
  const top3 = entries.slice(0, 3);

  // Pad top3 to always have 3 slots for podium rendering
  const podium = [
    top3[1] ?? null, // 2nd (left)
    top3[0] ?? null, // 1st (centre)
    top3[2] ?? null, // 3rd (right)
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/leaderboard" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/leaderboard" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url: 'https://thetokengame.xyz/leaderboard',
          isPartOf: { '@type': 'WebSite', name: 'The Token Game', url: 'https://thetokengame.xyz' },
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-15"
            style={{ background: primaryColor }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6"
              style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}10` }}>
              Live On-Chain Rankings
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Leaderboard
            </h1>
            <p className="text-foreground/50 text-lg max-w-md mx-auto">
              Who's holding the most coins? Rankings update live from the Solana blockchain.
            </p>
          </motion.div>

          {/* Top 3 podium */}
          {!loading && entries.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-end justify-center gap-4 mt-14 max-w-lg mx-auto"
            >
              {/* 2nd */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xl font-bold truncate max-w-full px-1" style={{ color: '#C0C0C0', fontFamily: 'var(--font-heading)' }}>
                  {podium[0]?.displayName ?? '—'}
                </div>
                <div className="text-xs text-foreground/40">{podium[0]?.coins ?? 0} coins</div>
                <div className="w-full rounded-t-xl flex items-center justify-center text-3xl font-black"
                  style={{ background: 'hsl(255 20% 14%)', border: '1px solid #C0C0C030', color: '#C0C0C0', height: '80px', fontFamily: 'var(--font-heading)' }}>
                  2
                </div>
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <Crown size={22} style={{ color: 'hsl(45 100% 65%)' }} />
                <div className="text-xl font-bold truncate max-w-full px-1" style={{ color: 'hsl(45 100% 65%)', fontFamily: 'var(--font-heading)' }}>
                  {podium[1]?.displayName ?? '—'}
                </div>
                <div className="text-xs text-foreground/40">{podium[1]?.coins ?? 0} coins</div>
                <div className="w-full rounded-t-xl flex items-center justify-center text-3xl font-black"
                  style={{ background: 'hsl(45 100% 65% / 0.12)', border: '1px solid hsl(45 100% 65% / 0.3)', color: 'hsl(45 100% 65%)', height: '110px', fontFamily: 'var(--font-heading)' }}>
                  1
                </div>
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xl font-bold truncate max-w-full px-1" style={{ color: '#cd7f32', fontFamily: 'var(--font-heading)' }}>
                  {podium[2]?.displayName ?? '—'}
                </div>
                <div className="text-xs text-foreground/40">{podium[2]?.coins ?? 0} coins</div>
                <div className="w-full rounded-t-xl flex items-center justify-center text-3xl font-black"
                  style={{ background: 'hsl(255 20% 14%)', border: '1px solid #cd7f3230', color: '#cd7f32', height: '65px', fontFamily: 'var(--font-heading)' }}>
                  3
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading podium placeholder */}
          {loading && (
            <div className="flex items-end justify-center gap-4 mt-14 max-w-lg mx-auto animate-pulse">
              {[80, 110, 65].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-xl bg-white/5" style={{ height: h }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Full Rankings + Sidebar ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Rankings table */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Rankings</h2>
                <div className="flex items-center gap-3">
                  {data && (
                    <span className="text-xs text-foreground/30">
                      Updated {updatedAgo}
                    </span>
                  )}
                  <button
                    onClick={() => fetchLeaderboard(true)}
                    disabled={refreshing || loading}
                    className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground/70 transition-colors disabled:opacity-30"
                    title="Refresh rankings"
                  >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex items-center gap-3 mb-4">
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-400">Failed to load rankings</p>
                    <p className="text-xs text-foreground/40 mt-0.5">{error}</p>
                  </div>
                  <button onClick={() => fetchLeaderboard()} className="ml-auto text-xs text-foreground/50 hover:text-foreground/80 underline">
                    Retry
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[40px_1fr_80px_80px_100px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/30 border-b border-white/10 bg-white/[0.02]">
                  <div>#</div>
                  <div>Collector</div>
                  <div className="text-right">Coins</div>
                  <div className="text-right hidden sm:block">Perm</div>
                  <div className="text-right">Tier</div>
                </div>

                {/* Loading skeletons */}
                {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

                {/* Empty state */}
                {!loading && !error && entries.length === 0 && (
                  <div className="py-16 text-center">
                    <Coins size={32} className="mx-auto mb-3 text-foreground/20" />
                    <p className="text-sm font-semibold text-foreground/40">No collectors yet</p>
                    <p className="text-xs text-foreground/25 mt-1">Connect your wallet to be first on the board.</p>
                  </div>
                )}

                {/* Live entries */}
                {!loading && entries.map((c, i) => {
                  const tier = TIER_CONFIG[c.tier] ?? TIER_CONFIG['None'];
                  const isMe = connected && address &&
                    c.address === `${address.slice(0, 4)}...${address.slice(-4)}`;
                  return (
                    <motion.div
                      key={c.address + c.rank}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.03, ease: 'easeOut' as const }}
                      className="grid grid-cols-[40px_1fr_80px_80px_100px] gap-4 px-5 py-4 items-center border-b border-white/5 last:border-0 transition-colors"
                      style={isMe ? { background: `${primaryColor}08` } : undefined}
                    >
                      <RankBadge rank={c.rank} />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                          {c.displayName}
                          {isMe && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                              style={{ background: `${primaryColor}20`, color: primaryColor }}>
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-foreground/30 font-mono">{c.address}</div>
                      </div>
                      <div className="text-right font-bold text-sm" style={{ color: tier.color }}>{c.coins}</div>
                      <div className="text-right text-sm text-foreground/50 hidden sm:block">{c.permanent}</div>
                      <div className="flex justify-end">
                        <TierBadge tier={c.tier} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tier legend */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Platinum', 'Gold', 'Silver', 'Bronze'] as const).map((name) => {
                  const cfg = TIER_CONFIG[name];
                  return (
                    <div key={name} className="rounded-xl border border-white/10 bg-card/40 p-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${cfg.color}15`, color: cfg.color }}>
                        {cfg.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: cfg.color }}>{name}</div>
                        <div className="text-xs text-foreground/30">{cfg.min}+ coins</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 shrink-0 space-y-6">

              {/* Connected wallet stats */}
              {connected && address && (
                <div className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: `${primaryColor}30`, background: `${primaryColor}08` }}>
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                    <p className="text-sm font-bold">Your Stats</p>
                    {walletLoading && <Loader2 size={14} className="animate-spin text-foreground/40" />}
                  </div>
                  {walletStats ? (
                    <div className="px-5 py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/50">Total Coins</span>
                        <span className="font-bold text-sm" style={{ color: primaryColor }}>{walletStats.coins}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/50">Permanent</span>
                        <span className="font-semibold text-sm">{walletStats.permanent}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/50">Seasonal</span>
                        <span className="font-semibold text-sm">{walletStats.seasonal}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/50">Tier</span>
                        <TierBadge tier={walletStats.tier} />
                      </div>
                      {walletRank && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground/50">Rank</span>
                          <span className="font-bold text-sm" style={{ color: 'hsl(45 100% 65%)' }}>#{walletRank}</span>
                        </div>
                      )}
                      {walletStats.coins === 0 && (
                        <p className="text-xs text-foreground/30 pt-1">
                          No Token Game coins detected. <a href="/coins" className="underline" style={{ color: accentColor }}>Buy your first coin →</a>
                        </p>
                      )}
                    </div>
                  ) : walletLoading ? (
                    <div className="px-5 py-6 space-y-2 animate-pulse">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex justify-between">
                          <div className="h-3 bg-white/10 rounded w-20" />
                          <div className="h-3 bg-white/10 rounded w-10" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-4 text-xs text-foreground/30">Could not load wallet data.</div>
                  )}
                </div>
              )}

              {/* Connect wallet CTA (when not connected) */}
              {!connected && (
                <div className="rounded-2xl border border-white/10 bg-card/60 p-5 text-center">
                  <Star size={24} className="mx-auto mb-3" style={{ color: primaryColor }} />
                  <p className="text-sm font-semibold mb-1">Where do you rank?</p>
                  <p className="text-xs text-foreground/40 mb-4">
                    Connect your wallet to see your live coin count, tier, and position on the board.
                  </p>
                  <Button
                    size="sm"
                    className="w-full font-semibold gap-2"
                    style={{ background: `linear-gradient(135deg, hsl(276 100% 69%), hsl(306 100% 69%))`, color: 'white' }}
                    onClick={() => {
                      const btn = document.querySelector<HTMLButtonElement>('[data-wallet-connect]');
                      btn?.click();
                    }}
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}

              {/* Season leaderboard CTA */}
              <div className="rounded-2xl border overflow-hidden"
                style={{ borderColor: `${accentColor}30`, background: `${accentColor}08` }}>
                <div className="px-5 py-4">
                  <p className="text-sm font-bold mb-1" style={{ color: accentColor }}>🏆 Season 1 is live</p>
                  <p className="text-xs text-foreground/50 mb-3">
                    Earn XP, complete quests, and build streaks to compete for the prize pool.
                  </p>
                  <a
                    href="/season-leaderboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: `${accentColor}20`, color: accentColor }}
                  >
                    View Season Leaderboard →
                  </a>
                </div>
              </div>

              {/* How rankings work */}
              <div className="rounded-2xl border border-white/10 bg-card/40 p-5">
                <p className="text-sm font-bold mb-3">How rankings work</p>
                <ul className="space-y-2 text-xs text-foreground/50">
                  <li className="flex gap-2"><span style={{ color: accentColor }}>→</span> Connect your wallet to appear on the board</li>
                  <li className="flex gap-2"><span style={{ color: accentColor }}>→</span> Rankings are based on live on-chain token balances</li>
                  <li className="flex gap-2"><span style={{ color: accentColor }}>→</span> Only Token Game coins count toward your rank</li>
                  <li className="flex gap-2"><span style={{ color: accentColor }}>→</span> Leaderboard refreshes every 5 minutes</li>
                </ul>
              </div>

              {/* Raydium link */}
              <div className="text-center">
                <a
                  href="https://raydium.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  View all coins on Raydium
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
