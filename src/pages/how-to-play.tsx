import { how_to_play } from 'virtual:content';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ArrowRight, Wallet, Coins, Globe, Swords, Trophy, Zap, Star, Map, Flame, Shield, TrendingUp } from 'lucide-react';

// ── Onboarding Steps ──────────────────────────────────────────────────────────
const STEPS = [{
  number: '01',
  icon: <Wallet size={26} />,
  title: 'Get a Phantom Wallet',
  description: "Download the Phantom wallet for Chrome or mobile. Create a new wallet, save your seed phrase somewhere safe, and you're ready. Takes about 2 minutes.",
  cta: {
    label: 'Get Phantom',
    href: 'https://phantom.app',
    internal: false
  },
  accent: 'primary'
}, {
  number: '02',
  icon: <Coins size={26} />,
  title: 'Buy SOL & Get Your First Coin',
  description: 'Pick up some SOL from Coinbase or Binance, send it to your Phantom wallet, then head to the Coin Directory and grab your first Token Game coin. Most cost less than a coffee.',
  cta: {
    label: 'Browse Coins',
    href: '/coin-directory',
    internal: true
  },
  accent: 'secondary'
}, {
  number: '03',
  icon: <Globe size={26} />,
  title: 'Choose Your Zone',
  description: 'The world is divided into 16 editions — USA, Japan, Africa, Arctic, and more. Every coin you hold is a passport to that zone\'s exclusive challenges, quests, and leaderboards.',
  cta: {
    label: 'View World Map',
    href: '/world-map',
    internal: true
  },
  accent: 'accent'
}, {
  number: '04',
  icon: <Swords size={26} />,
  title: 'Pick Your Game Mode',
  description: 'The Nexus has five ways to play — Collect, Compete, Quest, Stake, and Discover. Jump into Edition Wars in the War Room, earn XP on your Journey, play daily Bingo, or stake your coins for rewards.',
  cta: {
    label: 'Enter War Room',
    href: '/war-room',
    internal: true
  },
  accent: 'primary'
}, {
  number: '05',
  icon: <Trophy size={26} />,
  title: 'Climb the Leaderboard',
  description: "Every coin you hold, every quest you complete, and every battle you win earns you points. Seasons reset monthly — so there's always a fresh shot at the top.",
  cta: {
    label: 'See Leaderboard',
    href: '/leaderboard',
    internal: true
  },
  accent: 'accent'
}];

// ── Five Game Pillars ─────────────────────────────────────────────────────────
const PILLARS = [{
  icon: <Coins size={22} />,
  label: 'Collect',
  description: 'Hold coins from multiple editions to build your collection score. Rare seasonal coins become artifacts in future seasons.',
  href: '/coin-directory'
}, {
  icon: <Swords size={22} />,
  label: 'Compete',
  description: 'Edition Wars pit zones against each other every week. Your coins fight for territory. Seasons reset. Legends are made.',
  href: '/war-room'
}, {
  icon: <Map size={22} />,
  label: 'Quest',
  description: 'Daily and weekly missions tied to the seasonal calendar. January coins unlock January quests. Halloween coins unlock October haunts.',
  href: '/journey'
}, {
  icon: <TrendingUp size={22} />,
  label: 'Stake & Earn',
  description: 'Lock your coins and ecosystem tokens to earn $TEN rewards. Higher rarity coins earn higher yield multipliers.',
  href: '/staking'
}, {
  icon: <Star size={22} />,
  label: 'Discover',
  description: 'Hidden coins, secret zones, and lore unlocks. The backstory system holds 1,393 entries — each one a piece of the world.',
  href: '/coin-directory'
}];

// ── Season Mechanic ───────────────────────────────────────────────────────────
const SEASON_BEATS = [{
  icon: <Coins size={16} />,
  text: 'New seasonal coins release'
}, {
  icon: <Map size={16} />,
  text: 'New quests unlock'
}, {
  icon: <Swords size={16} />,
  text: 'Edition War resets'
}, {
  icon: <Trophy size={16} />,
  text: 'Leaderboard season ends & begins'
}, {
  icon: <Flame size={16} />,
  text: 'Stash pool distributes rewards'
}];
export default function HowToPlayPage() {
  const title = 'How To Play — The Token Game';
  const description = 'The Token Game is a living crypto world with 16 editions, 5 game modes, and a seasonal calendar that never stops. Collect coins, compete in Edition Wars, complete quests, stake for rewards, and discover hidden lore.';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/how-to-play" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/how-to-play" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: title,
          description,
          url: 'https://thetokengame.xyz/how-to-play',
          step: STEPS.map((s, i) => ({
            '@type': 'HowToStep',
            name: s.title,
            position: i + 1
          }))
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-10" style={{
          background: 'radial-gradient(ellipse, hsl(var(--primary)), hsl(var(--accent)))'
        }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.55
        }}>
            <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/40 text-primary bg-primary/10 mb-6">
              Welcome to the Nexus
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-5 leading-tight" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              One world.<br />
              <span className="text-primary">Infinite ways to play.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              The Token Game is a living crypto world built around 16 global editions, seasonal coins, and five distinct game modes. Collect. Compete. Quest. Stake. Discover. Your coins are your passport.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Five Pillars ─────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/10">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Five ways to play
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every coin you hold opens a different door. Mix and match — or master them all.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {PILLARS.map((pillar, i) => <motion.div key={pillar.label} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.07
          }} whileHover={{
            y: -4
          }}>
                <Link to={pillar.href} className="block h-full">
                  <div className="h-full rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/30">
                      <span className="text-primary">{pillar.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold text-base mb-1">{pillar.label}</div>
                      <p className="text-muted-foreground text-xs leading-relaxed">{pillar.description}</p>
                    </div>
                    <div className="mt-auto pt-2">
                      <span className="text-xs font-semibold flex items-center gap-1 text-primary">
                        Enter <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── Step-by-Step Onboarding ───────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-3xl">
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
        }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Get started in 5 steps
            </h2>
            <p className="text-muted-foreground">
              From zero to active player in under 10 minutes.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-7 top-10 bottom-10 w-px hidden md:block" style={{
            background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.05))'
          }} />

            <div className="flex flex-col gap-6">
              {STEPS.map((step, i) => <motion.div key={step.number} initial={{
              opacity: 0,
              x: -24
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.45,
              delay: i * 0.08,
              ease: 'easeOut' as const
            }} className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative z-10 bg-primary/15 border-2 border-primary/40">
                    <span className="text-primary">{step.icon}</span>
                  </div>

                  <motion.div whileHover={{
                x: 4
              }} transition={{
                duration: 0.2
              }} className="flex-1 rounded-2xl border border-primary/15 bg-card/60 backdrop-blur-sm p-6">
                    <div className="text-xs font-semibold uppercase tracking-widest mb-1 text-primary">
                      Step {step.number}
                    </div>
                    <h2 className="text-xl font-bold mb-2">{step.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {step.cta && <div className="mt-4">
                        {step.cta.internal ? <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                            <Link to={step.cta.href}>
                              {step.cta.label}
                              <ArrowRight size={13} />
                            </Link>
                          </Button> : <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                            <a href={step.cta.href} target="_blank" rel="noopener noreferrer">
                              {step.cta.label}
                              <ArrowRight size={13} />
                            </a>
                          </Button>}
                      </div>}
                  </motion.div>
                </motion.div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Seasonal Heartbeat ────────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -24
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/40 text-accent bg-accent/10 mb-5">
                The seasonal calendar
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                The game never stops.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every month the world resets and evolves. New coins release, new quests unlock, and the Edition War begins again. Seasonal coins you hold today become rare artifacts in future seasons — the earlier you collect, the more valuable your archive.
              </p>
              <Button size="sm" variant="outline" className="gap-1.5 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/stash">
                  View Season Status
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 24
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Every month
              </div>
              <div className="flex flex-col gap-3">
                {SEASON_BEATS.map((beat, i) => <motion.div key={i} initial={{
                opacity: 0,
                x: 12
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.35,
                delay: 0.15 + i * 0.07
              }} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-accent/15 text-accent">
                      {beat.icon}
                    </div>
                    <span className="text-sm text-foreground/70">{beat.text}</span>
                  </motion.div>)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 16 Editions ──────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/10">
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
        }} className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              16 editions. 1,500+ coins.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each edition is a living zone with its own seasonal coins, cultural events, and battle history. Pick your allegiance — or collect them all.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto mb-8">
            {how_to_play.ZONES.map((zone, i) => <motion.span key={zone} initial={{
            opacity: 0,
            scale: 0.85
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.3,
            delay: i * 0.03
          }} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/25 text-primary bg-primary/7">
                {zone}
              </motion.span>)}
          </div>

          <Button variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
            <Link to="/world-map">
              <Globe size={15} />
              Explore the World Map
            </Link>
          </Button>
        </div>
      </section>

      {/* ── RPG Identity ─────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/10">
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
        }} className="rounded-2xl border border-secondary/25 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 md:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-secondary/15 border-2 border-secondary/40">
              <Shield size={26} className="text-secondary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Build your player identity
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
              Choose a character class, earn XP through quests and battles, unlock abilities, and climb the Journey stages. Your collection tier, war room rank, and backstory lore all feed into a single persistent identity — yours across every season.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90" style={{
              boxShadow: '0 0 24px hsl(var(--primary) / 0.35)'
            }} asChild>
                <Link to="/rpg">
                  <Zap size={15} />
                  Create Your Character
                </Link>
              </Button>
              <Button variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/journey">
                  View Journey Path
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Ready to enter the Nexus?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your first coin is your first key. The rest of the world opens from there.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90" style={{
              boxShadow: '0 0 30px hsl(var(--primary) / 0.4)'
            }} asChild>
                <Link to="/coin-directory">
                  Browse All Coins
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/world-map">
                  <Globe size={15} />
                  Explore the Map
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>;
}
