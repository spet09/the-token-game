import { Link } from "react-router";
import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Trophy, Target, Users, ChevronRight, Shield, CheckCircle2, Circle, Flag } from 'lucide-react';
import type { Nation } from '@/data/nations';

// Mock leaderboard data — replace with live on-chain data when available
function mockLeaderboard(seed: string) {
  const names = ['sol_degen', 'moon_wallet', 'pump_lord', 'rug_survivor', 'diamond_hands', 'paper_hands', 'chad_stacker', 'ngmi_anon', 'wagmi_ser', 'based_holder'];
  return names.map((name, i) => ({
    rank: i + 1,
    wallet: name + '_' + seed.slice(0, 3) + i,
    coins: Math.max(1, 12 - i + Math.floor(seed.charCodeAt(0) % 4)),
    xp: Math.floor(1000 - i * 80 + seed.charCodeAt(0))
  }));
}
function parseFlagPoints(reward: string): number {
  const match = reward.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
function storageKey(slug: string) {
  return `ttg_missions_${slug}`;
}
function loadCompleted(slug: string): boolean[] {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (raw) return JSON.parse(raw) as boolean[];
  } catch {}
  return [];
}
function saveCompleted(slug: string, completed: boolean[]) {
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify(completed));
  } catch {}
}
interface Props {
  nation: Nation;
}
export default function NationPage({
  nation
}: Props) {
  const leaderboard = mockLeaderboard(nation.slug);
  const site = 'https://thetokengame.xyz';
  const canonicalUrl = `${site}/war-room/${nation.slug}`;
  const [completed, setCompleted] = useState<boolean[]>(() => {
    const saved = loadCompleted(nation.slug);
    return nation.missions.map((_, i) => saved[i] ?? false);
  });
  useEffect(() => {
    saveCompleted(nation.slug, completed);
  }, [completed, nation.slug]);
  const totalPoints = nation.missions.reduce((sum, m, i) => sum + (completed[i] ? parseFlagPoints(m.reward) : 0), 0);
  const totalPossible = nation.missions.reduce((sum, m) => sum + parseFlagPoints(m.reward), 0);
  const allDone = completed.every(Boolean);
  function toggleMission(i: number) {
    setCompleted(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }
  return <>
      <Helmet>
        <title>{nation.name} — War Room — The Token Game</title>
        <meta name="description" content={`Join the ${nation.name} nation in The Token Game War Room. Complete missions, climb the leaderboard, and claim your stake.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${nation.name} — War Room — The Token Game`} />
        <meta property="og:description" content={`Join the ${nation.name} nation. 13 Nations. One Stash.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`https://thetokengame.xyz/og-image.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`https://thetokengame.xyz/og-image.svg`} />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden" style={{
      background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1225 60%, #0a0e1a 100%)'
    }}>
        <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 70%)'
      }} />
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-xs mb-8" style={{
        color: '#8a9ab5'
      }}>
          <Link to="/war-room" className="hover:text-yellow-400 transition-colors">War Room</Link>
          <ChevronRight size={12} />
          <span style={{
          color: '#D4AF37'
        }}>{nation.name}</span>
        </div>

        <div className="text-7xl mb-4 leading-none">{nation.flag}</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
        fontFamily: 'var(--font-heading)',
        color: '#F5F0E0'
      }}>
          {nation.name}
        </h1>
        <p className="text-base max-w-xl mx-auto leading-relaxed" style={{
        color: '#8a9ab5'
      }}>
          {nation.backstory}
        </p>
      </section>

      {/* Current Challenges */}
      <section className="py-16 px-4" style={{
      background: '#080b14'
    }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Target size={20} style={{
              color: '#D4AF37'
            }} />
              <h2 className="text-2xl font-bold" style={{
              fontFamily: 'var(--font-heading)',
              color: '#D4AF37'
            }}>
                Current Challenges
              </h2>
            </div>
            {/* Flag Points tally */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold" style={{
            background: allDone ? 'rgba(159,255,95,0.12)' : 'rgba(212,175,55,0.08)',
            border: `1px solid ${allDone ? 'rgba(159,255,95,0.35)' : 'rgba(212,175,55,0.25)'}`,
            color: allDone ? '#9fff5f' : '#D4AF37'
          }}>
              <Flag size={14} />
              <span>{totalPoints} / {totalPossible} Flag Points</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8 rounded-full overflow-hidden h-2" style={{
          background: 'rgba(255,255,255,0.06)'
        }}>
            <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${totalPossible > 0 ? totalPoints / totalPossible * 100 : 0}%`,
            background: allDone ? 'linear-gradient(90deg, #9fff5f, #5fff9f)' : 'linear-gradient(90deg, #D4AF37, #f0d060)'
          }} />
          </div>

          <div className="flex flex-col gap-4">
            {nation.missions.map((mission, i) => <div key={i} className="rounded-xl p-5 flex items-start gap-4 transition-all duration-200" style={{
            background: completed[i] ? 'rgba(159,255,95,0.05)' : 'rgba(212,175,55,0.04)',
            border: `1px solid ${completed[i] ? 'rgba(159,255,95,0.25)' : 'rgba(212,175,55,0.15)'}`
          }}>
                {/* Number badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200" style={{
              background: completed[i] ? 'rgba(159,255,95,0.15)' : 'rgba(212,175,55,0.15)',
              color: completed[i] ? '#9fff5f' : '#D4AF37'
            }}>
                  {completed[i] ? <CheckCircle2 size={16} /> : <span>{i + 1}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-semibold text-base transition-colors duration-200" style={{
                  color: completed[i] ? '#9fff5f' : '#F5F0E0'
                }}>
                      {mission.title}
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1" style={{
                  background: completed[i] ? 'rgba(159,255,95,0.15)' : 'rgba(212,175,55,0.1)',
                  color: completed[i] ? '#9fff5f' : '#D4AF37'
                }}>
                      <Flag size={10} />
                      {mission.reward}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{
                color: '#8a9ab5'
              }}>
                    {mission.description}
                  </p>

                  {/* Complete button */}
                  <button onClick={() => toggleMission(i)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200" style={completed[i] ? {
                background: 'rgba(159,255,95,0.1)',
                border: '1px solid rgba(159,255,95,0.3)',
                color: '#9fff5f'
              } : {
                background: 'linear-gradient(135deg, #D4AF37, #f0d060)',
                border: '1px solid transparent',
                color: '#0a0e1a',
                boxShadow: '0 0 12px rgba(212,175,55,0.2)'
              }} onMouseEnter={e => {
                if (!completed[i]) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(212,175,55,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = completed[i] ? 'none' : '0 0 12px rgba(212,175,55,0.2)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}>
                    {completed[i] ? <><CheckCircle2 size={13} /> Completed — undo</> : <><Circle size={13} /> Mark Complete</>}
                  </button>
                </div>
              </div>)}
          </div>

          {/* All done banner */}
          {allDone && <div className="mt-6 rounded-xl p-4 text-center text-sm font-semibold" style={{
          background: 'rgba(159,255,95,0.08)',
          border: '1px solid rgba(159,255,95,0.3)',
          color: '#9fff5f'
        }}>
              All challenges complete — {totalPoints} Flag Points earned for {nation.name}!
            </div>}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4" style={{
      background: '#0a0e1a'
    }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={20} style={{
            color: '#D4AF37'
          }} />
            <h2 className="text-2xl font-bold" style={{
            fontFamily: 'var(--font-heading)',
            color: '#D4AF37'
          }}>
              Top Players — {nation.name}
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{
          border: '1px solid rgba(212,175,55,0.15)'
        }}>
            {/* Header row */}
            <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{
            background: 'rgba(212,175,55,0.08)',
            color: '#8a9ab5'
          }}>
              <span className="col-span-1">#</span>
              <span className="col-span-6">Wallet</span>
              <span className="col-span-3 text-center">Coins</span>
              <span className="col-span-2 text-right">XP</span>
            </div>
            {leaderboard.map((entry, i) => <div key={i} className="grid grid-cols-12 px-4 py-3 items-center text-sm transition-colors" style={{
            borderTop: '1px solid rgba(212,175,55,0.08)',
            background: i < 3 ? 'rgba(212,175,55,0.03)' : 'transparent'
          }}>
                <span className="col-span-1 font-bold" style={{
              color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#8a9ab5'
            }}>
                  {entry.rank}
                </span>
                <span className="col-span-6 font-mono text-xs truncate" style={{
              color: '#c8d6e8'
            }}>
                  {entry.wallet}
                </span>
                <span className="col-span-3 text-center" style={{
              color: '#9fff5f'
            }}>
                  {entry.coins}
                </span>
                <span className="col-span-2 text-right font-semibold" style={{
              color: '#D4AF37'
            }}>
                  {entry.xp.toLocaleString()}
                </span>
              </div>)}
          </div>
          <p className="text-xs text-center mt-3" style={{
          color: '#8a9ab5'
        }}>
            Live leaderboard coming soon — connect your wallet to claim your spot.
          </p>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 px-4 text-center" style={{
      background: '#080b14'
    }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users size={18} style={{
          color: '#8a9ab5'
        }} />
          <p className="text-sm" style={{
          color: '#8a9ab5'
        }}>
            Represent {nation.name} in the War Room
          </p>
        </div>
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
          <Shield size={18} />
          Join {nation.name}
        </button>
        <div className="mt-6">
          <Link to="/war-room" className="text-sm transition-colors hover:text-yellow-400" style={{
          color: '#8a9ab5'
        }}>
            ← Back to War Room
          </Link>
        </div>
      </section>
    </>;
}
