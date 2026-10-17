/**
 * /stash — The Stash public page
 *
 * Shows:
 *  - Current Stash balance (SOL from transaction fees)
 *  - Active season countdown
 *  - How to earn (3-step explainer)
 *  - Wallet eligibility checker (7-day hold)
 *  - Season leaderboard
 */

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useWallet } from '@/lib/wallet';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StashData {
  stashSol: number;
  milestoneNext: number;
  milestoneLabel: string;
  topContributors: { rank: number; wallet: string; sol: number; nation: string }[];
}

interface SeasonData {
  season: {
    id: number;
    seasonNumber: number;
    label: string;
    startsAt: string;
    endsAt: string;
    status: string;
    totalSol: number;
  };
  countdown: {
    daysRemaining: number;
    hoursRemaining: number;
    minutesRemaining: number;
    progressPct: number;
  };
  stats: {
    eligibleHolders: number;
    totalFeesSol: number;
  };
}

interface EligibilityData {
  eligible: boolean;
  reason: string;
  holdDaysRequired: number;
  eligibleCoinCount?: number;
  totalCoinCount?: number;
  holdings?: {
    coinId: string;
    daysHeld: number;
    isEligible: boolean;
    daysUntilEligible: number;
  }[];
  activeSeason: string | null;
}

interface LeaderboardEntry {
  rank: number;
  wallet: string;
  walletShort: string;
  eligibleCoins: number;
  totalCoins: number;
}

// ─── Countdown display ────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-4xl font-black text-white tabular-nums w-16 text-center">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-white/30 text-xs uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StashPage() {
  const { publicKey, connected, connect } = useWallet();

  const [stash, setStash] = useState<StashData | null>(null);
  const [season, setSeason] = useState<SeasonData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Live countdown state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch stash balance + season on mount
  useEffect(() => {
    fetch('/api/stash').then((r) => r.json()).then(setStash).catch(() => {});
    fetch('/api/stash/season').then((r) => r.json()).then(setSeason).catch(() => {});
    fetch('/api/stash/leaderboard').then((r) => r.json()).then((d) => setLeaderboard(d.leaderboard ?? [])).catch(() => {});
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (!season) return;
    const endsAt = new Date(season.season.endsAt).getTime();

    function tick() {
      const now = Date.now();
      const ms = Math.max(0, endsAt - now);
      setCountdown({
        days: Math.floor(ms / (1000 * 60 * 60 * 24)),
        hours: Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((ms % (1000 * 60)) / 1000),
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [season]);

  // Check eligibility when wallet connects
  const checkEligibility = useCallback(async (wallet: string) => {
    setCheckingEligibility(true);
    try {
      const res = await fetch(`/api/stash/eligibility?wallet=${encodeURIComponent(wallet)}`);
      const data = await res.json();
      setEligibility(data);
    } catch {
      // ignore
    } finally {
      setCheckingEligibility(false);
    }
  }, []);

  useEffect(() => {
    if (connected && publicKey) checkEligibility(publicKey);
  }, [connected, publicKey, checkEligibility]);

  // Progress bar for milestone
  const milestoneProgress = stash
    ? Math.min(100, (stash.stashSol / stash.milestoneNext) * 100)
    : 0;

  // Season progress
  const seasonProgress = season?.countdown.progressPct ?? 0;

  return (
    <>
      <Helmet>
        <title>The Stash — The Token Game</title>
        <meta
          name="description"
          content="The Stash is The Token Game's self-funding prize pool, fed by 1% transaction fees on tienko.exchange. Hold any coin for 7 days to earn your share."
        />
        <link rel="canonical" href="https://thetokengame.xyz/stash" />
        <meta property="og:title" content="The Stash — The Token Game" />
        <meta property="og:description" content="The Token Game's self-funding prize pool. Hold any coin for 7 days to earn your share." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/stash" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Stash — The Token Game" />
        <meta name="twitter:description" content="The Token Game's self-funding prize pool. Hold any coin for 7 days to earn your share." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/stash#webpage',
          name: 'The Stash — The Token Game',
          url: 'https://thetokengame.xyz/stash',
          description: "The Token Game's self-funding prize pool, fed by 1% transaction fees.",
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a1a] text-white">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(159,255,95,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(159,255,95,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#9fff5f]/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9fff5f]/10 border border-[#9fff5f]/30 text-[#9fff5f] text-xs font-semibold mb-6 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9fff5f] animate-pulse" />
              Live Prize Pool
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-none tracking-tight">
              The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9fff5f] to-[#5fffbf]">
                Stash
              </span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
              Funded by a{' '}
              <span className="text-[#9fff5f] font-semibold">1% fee</span> on every trade at{' '}
              <span className="text-white/80">tienko.exchange</span>. Hold any coin for{' '}
              <span className="text-[#9fff5f] font-semibold">7 days</span> to earn your share.
            </p>

            {/* Big balance display */}
            <div className="inline-block">
              <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#9fff5f] to-[#5fffbf] tabular-nums leading-none">
                {stash ? stash.stashSol.toLocaleString() : '—'}
              </div>
              <div className="text-white/30 text-sm uppercase tracking-widest mt-2">SOL in The Stash</div>
            </div>

            {/* Milestone progress */}
            {stash && (
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Current</span>
                  <span>Next milestone: {stash.milestoneLabel}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#9fff5f] to-[#5fffbf] transition-all duration-1000"
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
                <div className="text-right text-xs text-white/30 mt-1">
                  {milestoneProgress.toFixed(1)}% to milestone
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

          {/* ── Season Countdown ─────────────────────────────────────────── */}
          <section>
            <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#9fff5f] animate-pulse" />
                  <span className="font-bold text-white/80">
                    {season?.season.label ?? 'Active Season'}
                  </span>
                </div>
                <span className="text-xs text-white/30 uppercase tracking-wider">
                  Season ends in
                </span>
              </div>

              <div className="p-6 md:p-8">
                {/* Countdown units */}
                <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
                  <CountdownUnit value={countdown.days} label="Days" />
                  <div className="text-white/20 text-3xl font-black pb-4">:</div>
                  <CountdownUnit value={countdown.hours} label="Hours" />
                  <div className="text-white/20 text-3xl font-black pb-4">:</div>
                  <CountdownUnit value={countdown.minutes} label="Mins" />
                  <div className="text-white/20 text-3xl font-black pb-4">:</div>
                  <CountdownUnit value={countdown.seconds} label="Secs" />
                </div>

                {/* Season progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-white/30 mb-2">
                    <span>Season start</span>
                    <span>{seasonProgress}% elapsed</span>
                    <span>Distribution</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#BF5FFF] to-[#9fff5f] transition-all duration-1000"
                      style={{ width: `${seasonProgress}%` }}
                    />
                  </div>
                </div>

                {/* Season stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-black/30 border border-white/10 p-4 text-center">
                    <div className="text-2xl font-black text-[#9fff5f]">
                      {season?.stats.eligibleHolders ?? 0}
                    </div>
                    <div className="text-white/40 text-xs mt-1">Eligible Holders</div>
                  </div>
                  <div className="rounded-xl bg-black/30 border border-white/10 p-4 text-center">
                    <div className="text-2xl font-black text-[#9fff5f]">
                      {season?.stats.totalFeesSol.toLocaleString() ?? '0'}
                    </div>
                    <div className="text-white/40 text-xs mt-1">SOL Collected This Season</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── How to Earn ──────────────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-black text-white mb-5">How to Earn from The Stash</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  icon: '💸',
                  title: 'Fees Collected',
                  desc: '1% of every trade on tienko.exchange flows directly into The Stash wallet.',
                  color: '#BF5FFF',
                },
                {
                  step: '02',
                  icon: '🪙',
                  title: 'Buy Any Coin',
                  desc: 'Purchase any Token Game coin. Your 7-day holding clock starts immediately.',
                  color: '#ff5fef',
                },
                {
                  step: '03',
                  icon: '⏳',
                  title: 'Hold 7 Days',
                  desc: 'Keep the coin in your wallet for at least 7 days to become eligible.',
                  color: '#9fff5f',
                },
                {
                  step: '04',
                  icon: '🏆',
                  title: 'Claim at Season End',
                  desc: 'At the end of each season, eligible holders claim their proportional share.',
                  color: '#5fffbf',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-white/10 bg-white/3 p-5 relative overflow-hidden"
                >
                  <div
                    className="text-5xl font-black opacity-[0.08] absolute top-2 right-3 leading-none"
                    style={{ color: item.color }}
                  >
                    {item.step}
                  </div>
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: item.color }}
                  >
                    Step {item.step}
                  </div>
                  <div className="font-bold text-white text-sm mb-2">{item.title}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Economy comparison table */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/3 overflow-hidden">
              <div className="border-b border-white/10 px-5 py-3">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">
                  New Economy vs Old
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-white/30 text-xs">
                      <th className="text-left px-5 py-3">Element</th>
                      <th className="text-left px-5 py-3 text-red-400/60">Old System</th>
                      <th className="text-left px-5 py-3 text-[#9fff5f]">New System</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Coin Minting', 'Open to anyone', 'Whitelist-only for first hour'],
                      ['The Stash', 'Funded from minting', 'Funded from transaction fees'],
                      ['Rewards', 'Based on early buying', 'Based on holding period'],
                      ['Snipers', 'Free to attack', 'Locked out during whitelist window'],
                    ].map(([element, old, newVal]) => (
                      <tr key={element} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-5 py-3 font-semibold text-white/80">{element}</td>
                        <td className="px-5 py-3 text-red-400/70 text-xs">{old}</td>
                        <td className="px-5 py-3 text-[#9fff5f] text-xs">{newVal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Eligibility Checker ──────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-black text-white mb-5">Check Your Eligibility</h2>
            <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#9fff5f] animate-pulse" />
                <span className="text-sm font-semibold text-white/80">Wallet Eligibility</span>
              </div>

              <div className="p-6 md:p-8">
                {!connected && (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-4">🔐</div>
                    <p className="text-white/50 mb-6 text-sm">
                      Connect your wallet to check if you're eligible for The Stash this season.
                    </p>
                    <button
                      onClick={() => connect()}
                      className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#9fff5f] to-[#5fffbf] text-black hover:opacity-90 transition-opacity"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}

                {connected && checkingEligibility && (
                  <div className="text-center py-6">
                    <div className="w-8 h-8 border-2 border-[#9fff5f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Checking eligibility…</p>
                  </div>
                )}

                {connected && !checkingEligibility && eligibility && (
                  <div>
                    {/* Wallet display */}
                    <div className="rounded-xl bg-black/30 border border-white/10 p-4 mb-6">
                      <div className="text-xs text-white/30 mb-1 uppercase tracking-wider">Connected Wallet</div>
                      <div className="font-mono text-sm text-white/70 break-all">{publicKey}</div>
                    </div>

                    {/* Eligibility result */}
                    <div
                      className={`rounded-xl border p-5 mb-6 ${
                        eligibility.eligible
                          ? 'bg-[#9fff5f]/10 border-[#9fff5f]/30'
                          : 'bg-yellow-400/10 border-yellow-400/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{eligibility.eligible ? '✅' : '⏳'}</span>
                        <div>
                          <div
                            className={`font-bold text-lg ${
                              eligibility.eligible ? 'text-[#9fff5f]' : 'text-yellow-400'
                            }`}
                          >
                            {eligibility.eligible ? 'Eligible for The Stash!' : 'Not Yet Eligible'}
                          </div>
                          <div className="text-white/40 text-xs">
                            {eligibility.activeSeason ?? 'Current Season'}
                          </div>
                        </div>
                      </div>

                      {eligibility.eligible ? (
                        <p className="text-white/60 text-sm">
                          You hold{' '}
                          <span className="text-[#9fff5f] font-semibold">
                            {eligibility.eligibleCoinCount} eligible coin
                            {eligibility.eligibleCoinCount !== 1 ? 's' : ''}
                          </span>{' '}
                          (held 7+ days). You'll receive a proportional share of The Stash at season end.
                        </p>
                      ) : eligibility.reason === 'no_holdings' ? (
                        <p className="text-white/60 text-sm">
                          No coin holdings found. Buy any Token Game coin to start your 7-day clock.
                        </p>
                      ) : (
                        <p className="text-white/60 text-sm">
                          You hold{' '}
                          <span className="text-yellow-400 font-semibold">
                            {eligibility.totalCoinCount} coin
                            {eligibility.totalCoinCount !== 1 ? 's' : ''}
                          </span>
                          , but none have reached the 7-day threshold yet. Keep holding!
                        </p>
                      )}
                    </div>

                    {/* Holdings breakdown */}
                    {eligibility.holdings && eligibility.holdings.length > 0 && (
                      <div>
                        <div className="text-xs text-white/30 uppercase tracking-wider mb-3">
                          Your Holdings
                        </div>
                        <div className="space-y-2">
                          {eligibility.holdings.map((h) => (
                            <div
                              key={h.coinId}
                              className="flex items-center justify-between rounded-lg bg-black/20 border border-white/5 px-4 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    h.isEligible ? 'bg-[#9fff5f]' : 'bg-yellow-400'
                                  }`}
                                />
                                <span className="font-mono text-sm text-white/80">${h.coinId.toUpperCase()}</span>
                              </div>
                              <div className="text-right">
                                {h.isEligible ? (
                                  <span className="text-[#9fff5f] text-xs font-semibold">
                                    ✓ Eligible ({h.daysHeld}d held)
                                  </span>
                                ) : (
                                  <span className="text-yellow-400/70 text-xs">
                                    {h.daysHeld}d held — {h.daysUntilEligible}d to go
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Leaderboard ──────────────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-black text-white mb-5">Top Holders This Season</h2>
            <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
              {leaderboard.length === 0 ? (
                <div className="text-center py-16 text-white/20">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-sm">No eligible holders yet — be the first!</p>
                  <p className="text-xs mt-2 text-white/15">
                    Hold any coin for 7 days to appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/30 text-xs uppercase tracking-wider">
                        <th className="text-left px-5 py-3">Rank</th>
                        <th className="text-left px-5 py-3">Wallet</th>
                        <th className="text-right px-5 py-3">Eligible Coins</th>
                        <th className="text-right px-5 py-3">Total Coins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => (
                        <tr
                          key={entry.wallet}
                          className="border-b border-white/5 hover:bg-white/3 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <span
                              className={`font-black text-lg ${
                                entry.rank === 1
                                  ? 'text-yellow-400'
                                  : entry.rank === 2
                                  ? 'text-white/60'
                                  : entry.rank === 3
                                  ? 'text-amber-600'
                                  : 'text-white/30'
                              }`}
                            >
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-sm text-white/70">
                            {entry.walletShort}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-[#9fff5f] font-bold">{entry.eligibleCoins}</span>
                          </td>
                          <td className="px-5 py-4 text-right text-white/40">
                            {entry.totalCoins}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-black text-white mb-5">Questions</h2>
            <div className="space-y-3">
              {[
                {
                  q: 'Where does The Stash come from?',
                  a: '1% of every trade executed on tienko.exchange is automatically routed to The Stash wallet. The more trading activity, the bigger the prize pool.',
                },
                {
                  q: 'How is my share calculated?',
                  a: 'Your share is proportional to the number of eligible coins you hold vs the total eligible coins across all wallets. More coins held longer = bigger share.',
                },
                {
                  q: 'What counts as "holding" a coin?',
                  a: 'The coin must remain in your registered wallet for at least 7 consecutive days. Selling and rebuying resets the clock.',
                },
                {
                  q: 'When can I claim?',
                  a: 'At the end of each season (monthly). A claim window opens and eligible wallets can collect their share. Unclaimed rewards roll into the next season.',
                },
                {
                  q: 'Do I need to be whitelisted?',
                  a: 'Whitelist is only required for the first hour of a new coin launch. Holding rewards are open to all wallets that meet the 7-day threshold.',
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-white/10 bg-white/3 p-5"
                >
                  <div className="font-semibold text-white/90 mb-2 flex items-start gap-2">
                    <span className="text-[#9fff5f] mt-0.5">▸</span>
                    {item.q}
                  </div>
                  <div className="text-white/50 text-sm leading-relaxed pl-5">{item.a}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
