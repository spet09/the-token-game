import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ArrowRight, ExternalLink, Coffee, Coins, Trophy, Repeat, Flame, Star } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const DISTRIBUTION = [{
  label: 'Permanent Collection',
  pct: 11,
  coins: 12,
  color: 'hsl(276 100% 69%)',
  desc: 'Always available. Buy anytime.'
}, {
  label: 'Year One Seasonal',
  pct: 45,
  coins: 48,
  color: 'hsl(306 100% 69%)',
  desc: '12 monthly drops across Year One.'
}, {
  label: 'Year One Finale',
  pct: 3,
  coins: 3,
  color: 'hsl(96 100% 69%)',
  desc: 'End-of-year exclusive trio.'
}, {
  label: 'Year Two',
  pct: 41,
  coins: 45,
  color: 'hsl(45 100% 65%)',
  desc: '13 monthly groups in Year Two.'
}];
const TIERS = [{
  name: 'Sip Tester',
  rank: 'Bronze',
  required: 3,
  color: '#cd7f32',
  icon: <Coffee size={20} />,
  perks: ['Access to Bronze Discord role', 'Early seasonal coin alerts', 'Collector badge']
}, {
  name: 'Straw Rank',
  rank: 'Silver',
  required: 6,
  color: '#C0C0C0',
  icon: <Coins size={20} />,
  perks: ['Silver Discord role', 'Priority coin drop notifications', 'Exclusive Silver channel']
}, {
  name: 'Grande Gambler',
  rank: 'Gold',
  required: 12,
  color: '#FFD700',
  icon: <Trophy size={20} />,
  perks: ['Gold Discord role', 'Full Permanent Collection badge', 'Gold holder channel access']
}, {
  name: 'Venti Victim',
  rank: 'Platinum',
  required: 25,
  color: 'hsl(276 100% 69%)',
  icon: <Star size={20} />,
  perks: ['Platinum Discord role', 'Legendary collector status', 'Exclusive Platinum lounge', 'Early access to Year Two']
}];
const HOW_IT_WORKS = [{
  icon: <Coffee size={22} />,
  color: 'hsl(276 100% 69%)',
  title: 'Buy a coin',
  desc: 'Each coin costs roughly the price of a coffee — small, low-stakes, and easy to get into.'
}, {
  icon: <Coins size={22} />,
  color: 'hsl(306 100% 69%)',
  title: 'Hold to collect',
  desc: 'The more coins you hold, the higher your collector tier. Tiers unlock Discord roles and perks.'
}, {
  icon: <Repeat size={22} />,
  color: 'hsl(96 100% 69%)',
  title: 'Seasonal rotation',
  desc: 'New coins drop every month. Seasonal coins are time-limited — miss the window, miss the coin.'
}, {
  icon: <Flame size={22} />,
  color: 'hsl(45 100% 65%)',
  title: 'Exit anytime',
  desc: 'No lock-ups, no vesting. Sell whenever you want. The exit door is always open.'
}];

// ─── Donut chart (pure CSS) ───────────────────────────────────────────────────
function DonutChart() {
  let cumulative = 0;
  const segments = DISTRIBUTION.map(d => {
    const start = cumulative;
    cumulative += d.pct;
    return {
      ...d,
      start
    };
  });
  const r = 80;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const gap = 1.5;
  return <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto">
      {segments.map(seg => {
      const dashLen = seg.pct / 100 * circumference - gap;
      const offset = circumference - seg.start / 100 * circumference;
      return <circle key={seg.label} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={28} strokeDasharray={`${dashLen} ${circumference - dashLen}`} strokeDashoffset={offset} strokeLinecap="butt" style={{
        transition: 'stroke-dasharray 0.6s ease'
      }} />;
    })}
      {/* Centre text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="var(--font-heading)">108</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="hsl(255 20% 55%)" fontSize="10">total coins</text>
    </svg>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TokenomicsPage() {
  const title = 'Tokenomics — The Token Game';
  const description = 'How The Token Game works: 108 Solana meme coins, collector tiers from Bronze to Platinum, and a simple economy built around Raydium.';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/tokenomics" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/tokenomics" />
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
          url: 'https://thetokengame.xyz/tokenomics',
          isPartOf: {
            '@type': 'WebSite',
            name: 'The Token Game',
            url: 'https://thetokengame.xyz'
          }
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[130px] opacity-15" style={{
          background: 'hsl(276 100% 69%)'
        }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6" style={{
            borderColor: 'hsl(276 100% 69% / 0.4)',
            color: 'hsl(276 100% 69%)',
            background: 'hsl(276 100% 69% / 0.1)'
          }}>
              How The Economy Works
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Tokenomics
            </h1>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              108 coins. 2 years. One rule: easy in, easy out. No whitepapers. No promises. Just vibes and pixel art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-4">
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
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold" style={{
            fontFamily: 'var(--font-heading)'
          }}>The Simple Version</h2>
            <p className="text-foreground/50 mt-2 text-sm">No jargon. No roadmap promises. Just how it actually works.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((item, i) => <motion.div key={item.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: 'easeOut' as const
          }} className="rounded-2xl border border-white/10 bg-card/60 p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
              background: `${item.color}18`,
              color: item.color,
              border: `1px solid ${item.color}30`
            }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{
              fontFamily: 'var(--font-heading)'
            }}>{item.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── Coin Distribution ── */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-4">
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
        }} className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-4" style={{
            borderColor: 'hsl(306 100% 69% / 0.4)',
            color: 'hsl(306 100% 69%)',
            background: 'hsl(306 100% 69% / 0.1)'
          }}>
              Supply Breakdown
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{
            fontFamily: 'var(--font-heading)'
          }}>108 Coins, 4 Categories</h2>
            <p className="text-foreground/50 mt-2 text-sm max-w-md mx-auto">Every coin that will ever exist in The Token Game, broken down by category.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-4xl mx-auto">
            {/* Donut */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="w-full max-w-[260px] shrink-0">
              <DonutChart />
            </motion.div>

            {/* Legend */}
            <div className="flex-1 w-full flex flex-col gap-4">
              {DISTRIBUTION.map((d, i) => <motion.div key={d.label} initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.07,
              ease: 'easeOut' as const
            }} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{
                background: d.color
              }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{d.label}</span>
                      <span className="text-xs font-bold" style={{
                    color: d.color
                  }}>{d.coins} coins</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{
                    width: 0
                  }} whileInView={{
                    width: `${d.pct}%`
                  }} viewport={{
                    once: true
                  }} transition={{
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: 'easeOut' as const
                  }} className="h-full rounded-full" style={{
                    background: d.color
                  }} />
                    </div>
                    <p className="text-xs text-foreground/40 mt-1">{d.desc}</p>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Collector Tiers ── */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-4">
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
        }} className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-4" style={{
            borderColor: 'hsl(96 100% 69% / 0.4)',
            color: 'hsl(96 100% 69%)',
            background: 'hsl(96 100% 69% / 0.1)'
          }}>
              Collector Tiers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{
            fontFamily: 'var(--font-heading)'
          }}>Hold More, Rank Higher</h2>
            <p className="text-foreground/50 mt-2 text-sm max-w-md mx-auto">
              Your tier is determined by how many unique coins you hold. More coins = higher rank = better Discord perks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {TIERS.map((tier, i) => <motion.div key={tier.name} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: 'easeOut' as const
          }} whileHover={{
            y: -4,
            boxShadow: `0 0 28px ${tier.color}30`
          }} className="rounded-2xl border bg-card/60 p-6 flex flex-col gap-4 transition-shadow duration-200" style={{
            borderColor: `${tier.color}30`
          }}>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: `${tier.color}18`,
                color: tier.color,
                border: `1px solid ${tier.color}30`
              }}>
                    {tier.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
                background: `${tier.color}15`,
                color: tier.color
              }}>
                    {tier.rank}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{
                fontFamily: 'var(--font-heading)',
                color: tier.color
              }}>{tier.name}</h3>
                  <p className="text-xs text-foreground/40 mt-0.5">Hold {tier.required}+ coins</p>
                </div>
                <ul className="flex flex-col gap-1.5 mt-auto">
                  {tier.perks.map(perk => <li key={perk} className="flex items-start gap-2 text-xs text-foreground/60">
                      <span className="mt-0.5 shrink-0" style={{
                  color: tier.color
                }}>✓</span>
                      {perk}
                    </li>)}
                </ul>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── The Rules ── */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-2xl text-center">
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
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-4" style={{
            borderColor: 'hsl(45 100% 65% / 0.4)',
            color: 'hsl(45 100% 65%)',
            background: 'hsl(45 100% 65% / 0.1)'
          }}>
              The Fine Print
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{
            fontFamily: 'var(--font-heading)'
          }}>One Rule</h2>
            <div className="rounded-2xl border border-white/10 bg-card/60 p-8">
              <p className="text-2xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)',
              color: 'hsl(96 100% 69%)'
            }}>
                Easy in, easy out.
              </p>
              <p className="text-foreground/60 leading-relaxed text-sm">
                No vesting schedules. No lock-up periods. No promises of utility. You buy a coin because it's fun, cheap, and the pixel art is good. You sell whenever you want. The exit door is always open. ☕🚪
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Ready to start collecting?
            </h2>
            <p className="text-foreground/50 mb-8 text-sm">Browse all 108 coins or jump straight into the roadmap.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 font-semibold" style={{
              background: 'linear-gradient(135deg, hsl(276 100% 69%), hsl(306 100% 69%))',
              color: 'white',
              boxShadow: '0 0 24px hsl(276 100% 69% / 0.4)'
            }} asChild>
                <Link to="/coins">
                  View All Coins
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 font-semibold border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                <a href="https://discord.gg/FvwyWzbnj" target="_blank" rel="noopener noreferrer">
                  Join Discord
                  <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>;
}
