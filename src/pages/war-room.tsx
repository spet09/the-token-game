import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { Ticket, TrendingUp, Crown, Medal, Award, RefreshCw } from 'lucide-react';

// ─── Stash API types ──────────────────────────────────────────────────────────
interface Contributor {
  rank: number;
  wallet: string;
  sol: number;
  nation: string;
}
interface StashData {
  stashSol: number;
  milestoneNext: number;
  milestoneLabel: string;
  topContributors: Contributor[];
  updatedAt: string;
}
const RANK_ICONS = [Crown, Medal, Award];
const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

// Fallback while loading
const STASH_FALLBACK: StashData = {
  stashSol: 0,
  milestoneNext: 25_000,
  milestoneLabel: '25,000 SOL',
  topContributors: [],
  updatedAt: ''
};
// ─────────────────────────────────────────────────────────────────────────────

const NATIONS: {
  name: string;
  flag: string;
  slug: string;
}[] = [{
  name: 'USA',
  flag: '🇺🇸',
  slug: 'usa'
}, {
  name: 'UK',
  flag: '🇬🇧',
  slug: 'uk'
}, {
  name: 'India',
  flag: '🇮🇳',
  slug: 'india'
}, {
  name: 'Japan',
  flag: '🇯🇵',
  slug: 'japan'
}, {
  name: 'South Korea',
  flag: '🇰🇷',
  slug: 'south-korea'
}, {
  name: 'Brazil',
  flag: '🇧🇷',
  slug: 'brazil'
}, {
  name: 'Turkey',
  flag: '🇹🇷',
  slug: 'turkey'
}, {
  name: 'Australia',
  flag: '🇦🇺',
  slug: 'australia'
}, {
  name: 'Nigeria',
  flag: '🇳🇬',
  slug: 'nigeria'
}, {
  name: 'Russia',
  flag: '🇷🇺',
  slug: 'russia'
}, {
  name: 'China',
  flag: '🇨🇳',
  slug: 'china'
}, {
  name: 'Europe',
  flag: '🇪🇺',
  slug: 'europe'
}, {
  name: 'Africa',
  flag: '🌍',
  slug: 'africa'
}, {
  name: 'Middle East',
  flag: '🌙',
  slug: 'middle-east'
}, {
  name: 'Oceania',
  flag: '🌊',
  slug: 'oceania'
}, {
  name: 'North America',
  flag: '🍁',
  slug: 'north-america'
}, {
  name: 'Central America',
  flag: '🌺',
  slug: 'central-america'
}, {
  name: 'Arctic',
  flag: '❄️',
  slug: 'arctic'
}, {
  name: 'Antarctica',
  flag: '🐧',
  slug: 'antarctica'
}];
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    ref.current = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    });
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration]);
  return count;
}
export default function WarRoomPage() {
  const [stash, setStash] = useState<StashData>(STASH_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const fetchStash = async () => {
    try {
      const res = await fetch('/api/stash');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StashData = await res.json();
      setStash(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch stash data:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStash();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStash, 60_000);
    return () => clearInterval(interval);
  }, []);
  const solCount = useCountUp(stash.stashSol, 2400);
  const pct = Math.min(stash.stashSol / stash.milestoneNext * 100, 100);
  return <>
      <Helmet>
        <title>The War Room — The Token Game</title>
        <meta name="description" content="13 Nations. One Stash. The Token Game War Room." />
        <link rel="canonical" href="https://thetokengame.xyz/war-room" />
        <meta property="og:title" content="The War Room — The Token Game" />
        <meta property="og:description" content="13 Nations. One Stash. The Token Game War Room." />
        <meta property="og:url" content="https://thetokengame.xyz/war-room" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The War Room — The Token Game" />
        <meta name="twitter:description" content="13 Nations. One Stash. The Token Game War Room." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/war-room#webpage',
          name: 'The War Room — The Token Game',
          url: 'https://thetokengame.xyz/war-room',
          description: '13 Nations. One Stash. The Token Game War Room.',
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[40vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden" style={{
      background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1225 60%, #0a0e1a 100%)'
    }}>
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% 60%, rgba(212,175,55,0.08) 0%, transparent 70%)'
      }} />

        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{
        color: '#D4AF37'
      }}>
          The Token Game
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight" style={{
        fontFamily: 'var(--font-heading)',
        color: '#F5F0E0'
      }}>
          The War Room
        </h1>
        <p className="text-lg md:text-xl max-w-md" style={{
        color: '#8a9ab5'
      }}>
          13 Nations. One Stash. The Token Game.
        </p>
      </section>

      {/* Nation Cards */}
      <section className="py-16 px-4" style={{
      background: '#0a0e1a'
    }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-10" style={{
          fontFamily: 'var(--font-heading)',
          color: '#D4AF37'
        }}>
            Choose Your Nation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {NATIONS.map(nation => <Link key={nation.name} to={`/war-room/${nation.slug}`} className="flex flex-col items-center justify-center gap-3 rounded-xl py-6 px-3 transition-all duration-200" style={{
            background: 'rgba(212,175,55,0.04)',
            border: '1px solid rgba(212,175,55,0.15)',
            textDecoration: 'none'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.10)';
            (e.currentTarget as HTMLAnchorElement).style.border = '1px solid rgba(212,175,55,0.45)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 18px rgba(212,175,55,0.15)';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.04)';
            (e.currentTarget as HTMLAnchorElement).style.border = '1px solid rgba(212,175,55,0.15)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
          }}>
                <span className="text-4xl leading-none">{nation.flag}</span>
                <span className="text-sm font-semibold text-center" style={{
              color: '#c8d6e8'
            }}>
                  {nation.name}
                </span>
              </Link>)}
          </div>
        </div>
      </section>

      {/* ── The Stash ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{
      background: '#080b14'
    }}>
        <div className="max-w-2xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{
            color: '#D4AF37'
          }}>
              Prize Pool
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F0E0'
          }}>
              The Stash
            </h2>
            <p className="text-sm mt-2" style={{
            color: '#8a9ab5'
          }}>
              Total SOL locked in the War Room prize pool
            </p>
            {/* Last updated + refresh */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {lastRefresh && <span className="text-xs" style={{
              color: '#4a5568'
            }}>
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>}
              <button onClick={fetchStash} disabled={loading} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-opacity hover:opacity-70 disabled:opacity-30" style={{
              color: '#D4AF37',
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.2)'
            }}>
                <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* SOL counter card */}
          <div className="rounded-2xl p-8 relative overflow-hidden mb-6" style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.09), rgba(212,175,55,0.03))',
          border: '1px solid rgba(212,175,55,0.28)',
          boxShadow: '0 0 50px rgba(212,175,55,0.07)'
        }}>
            <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)'
          }} />

            {/* Big number */}
            <div className="text-center mb-8">
              {loading && stash.stashSol === 0 ? <div className="flex items-center justify-center h-24">
                  <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{
                borderColor: '#D4AF37',
                borderTopColor: 'transparent'
              }} />
                </div> : <>
                  <p className="text-7xl md:text-8xl font-bold tabular-nums leading-none" style={{
                fontFamily: 'var(--font-heading)',
                color: '#D4AF37',
                textShadow: '0 0 40px rgba(212,175,55,0.45)'
              }}>
                    {solCount.toLocaleString()}
                  </p>
                  <p className="text-base font-semibold mt-2" style={{
                color: '#8a9ab5'
              }}>SOL</p>
                </>}
            </div>

            {/* Milestone progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-1 font-semibold" style={{
                color: '#D4AF37'
              }}>
                  <TrendingUp size={12} />
                  Next milestone: {stash.milestoneLabel}
                </span>
                <span style={{
                color: '#8a9ab5'
              }}>
                  {Math.round(pct)}% there
                </span>
              </div>
              {/* Track */}
              <div className="rounded-full overflow-hidden h-3" style={{
              background: 'rgba(255,255,255,0.06)'
            }}>
                <div className="h-full rounded-full relative overflow-hidden" style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #b8860b, #D4AF37, #f0d060)',
                transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)'
              }}>
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0" style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                  animation: 'shimmer 2.4s infinite'
                }} />
                </div>
              </div>
              {/* Tick marks */}
              <div className="flex justify-between text-xs mt-1" style={{
              color: '#4a5568'
            }}>
                <span>0</span>
                <span>{(stash.milestoneNext / 2).toLocaleString()}</span>
                <span>{stash.milestoneNext.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Top 3 Contributors */}
          <div className="rounded-2xl overflow-hidden" style={{
          border: '1px solid rgba(212,175,55,0.15)'
        }}>
            {/* Header */}
            <div className="px-5 py-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{
            background: 'rgba(212,175,55,0.07)',
            color: '#D4AF37',
            borderBottom: '1px solid rgba(212,175,55,0.12)'
          }}>
              <Crown size={13} />
              Top Contributors
            </div>

            {loading && stash.topContributors.length === 0 ? <div className="px-5 py-8 flex items-center justify-center gap-2 text-xs" style={{
            color: '#4a5568'
          }}>
                <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" style={{
              borderColor: '#D4AF37',
              borderTopColor: 'transparent'
            }} />
                Loading contributors…
              </div> : stash.topContributors.length === 0 ? <div className="px-5 py-8 text-center text-xs" style={{
            color: '#4a5568'
          }}>
                No contributors yet — be the first!
              </div> : stash.topContributors.map((c, i) => {
            const IconComp = RANK_ICONS[i] ?? Award;
            return <div key={i} className="flex items-center gap-4 px-5 py-4 transition-colors" style={{
              borderTop: i > 0 ? '1px solid rgba(212,175,55,0.08)' : undefined,
              background: i === 0 ? 'rgba(212,175,55,0.04)' : 'transparent'
            }}>
                    {/* Rank icon */}
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      <IconComp size={20} style={{
                  color: RANK_COLORS[i]
                }} />
                    </div>

                    {/* Nation flag */}
                    <span className="text-xl leading-none flex-shrink-0">{c.nation}</span>

                    {/* Wallet */}
                    <span className="flex-1 font-mono text-xs truncate" style={{
                color: '#c8d6e8'
              }}>
                      {c.wallet}
                    </span>

                    {/* SOL amount */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold tabular-nums" style={{
                  color: RANK_COLORS[i]
                }}>
                        {c.sol.toLocaleString()}
                      </p>
                      <p className="text-xs" style={{
                  color: '#4a5568'
                }}>SOL</p>
                    </div>
                  </div>;
          })}

            {/* Footer note */}
            <div className="px-5 py-3 text-xs text-center" style={{
            borderTop: '1px solid rgba(212,175,55,0.08)',
            color: '#4a5568'
          }}>
              Rankings update every 60 seconds · connect your wallet to appear here
            </div>
          </div>

        </div>
      </section>

      {/* shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* CTA */}
      <section className="py-20 px-4 text-center" style={{
      background: '#0a0e1a'
    }}>
        <p className="text-sm mb-6" style={{
        color: '#8a9ab5'
      }}>
          One ticket. One shot. 19 nations.
        </p>
        <button className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-base font-bold transition-all duration-200" style={{
        background: 'linear-gradient(135deg, #D4AF37, #f0d060)',
        color: '#0a0e1a',
        boxShadow: '0 0 30px rgba(212,175,55,0.35)',
        fontFamily: 'var(--font-heading)'
      }} onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(212,175,55,0.55)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
      }} onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(212,175,55,0.35)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      }}>
          <Ticket size={20} />
          Get Your Golden Ticket
        </button>
      </section>
    </>;
}
