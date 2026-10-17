import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ArrowRight, Globe, Coins, Swords, Map, TrendingUp, Star, Zap, Shield, Users, Lock, ExternalLink, ChevronRight } from 'lucide-react';
import { ZONES, EDITION_ZONES, SPECIAL_COIN_TYPES, COMMUNITY_HUBS, INTEROP_RULES } from '@/data/oasis';
import { oasis } from 'virtual:content';

// ─── Grid Background ──────────────────────────────────────────────────────────
function OasisGrid() {
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="oasis-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#oasis-grid)" />
      </svg>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10" style={{
      background: 'hsl(var(--primary))'
    }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-8" style={{
      background: 'hsl(var(--accent))'
    }} />
    </div>;
}

// Zone accent colors — derived from the zone's identity, not the brand palette
const ZONE_COLORS: Record<string, string> = {
  'token-game': 'hsl(var(--primary))',
  'gold-token-game': 'hsl(var(--accent))',
  'people-game': 'hsl(var(--secondary))'
};
const RARITY_COLORS: Record<string, string> = {
  artifact: 'hsl(var(--accent))',
  legendary: 'hsl(var(--primary))',
  rare: 'hsl(200 100% 65%)',
  uncommon: 'hsl(var(--accent))',
  common: 'hsl(var(--secondary))'
};
export default function OasisPage() {
  const title = 'The Nexus — The Token Game Universe';
  const description = 'Enter the Nexus: a massive interconnected gaming universe with 16 zones, a unified USGC economy, player-owned assets, and five ways to play. The Token Game, Gold Token Game, and The People Game — one world.';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/oasis" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/oasis" />
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
          '@id': 'https://thetokengame.xyz/oasis#webpage',
          name: title,
          url: 'https://thetokengame.xyz/oasis',
          description,
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 py-28">
        <OasisGrid />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <motion.div animate={{
            rotate: [0, 5, -5, 0]
          }} transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut' as const
          }} className="inline-block text-5xl mb-6">
              🌐
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/40 text-primary bg-primary/10">
                {oasis.hero.badge}
              </span>
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/40 text-accent bg-accent/10">
                {oasis.hero.badgeCurrency}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              <span>{oasis.hero.headline}</span><br />
              <span className="text-primary">{oasis.hero.headlineAccent}</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              {oasis.hero.body}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90" style={{
              boxShadow: '0 0 40px hsl(var(--primary) / 0.4)'
            }} asChild>
                <Link to="/how-to-play">
                  <Zap size={16} />
                  Enter the Nexus
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/world-map">
                  <Globe size={15} />
                  View World Map
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Economy Banner ───────────────────────────────────────────────────── */}
      <section className="py-6 border-b border-white/10 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Coins size={15} className="text-primary" />
              <span className="text-muted-foreground">{oasis.economy.primaryCurrencyLabel}</span>
              <span className="font-bold text-primary">{oasis.economy.primaryCurrencyValue}</span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-accent" />
              <span className="text-muted-foreground">{oasis.economy.utilityLabel}</span>
              <span className="font-bold text-accent">{oasis.economy.utilityValue}</span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-secondary" />
              <span className="text-muted-foreground">{oasis.economy.walletLabel}</span>
              <span className="font-bold text-secondary">{oasis.economy.walletValue}</span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-muted-foreground" />
              <span className="text-muted-foreground">{oasis.economy.networkLabel}</span>
              <span className="font-bold">{oasis.economy.networkValue}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Worlds ─────────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
        }} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/8 mb-4">
              {oasis.worlds.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              {oasis.worlds.headline}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {oasis.worlds.body}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ZONES.map((zone, i) => {
            void (ZONE_COLORS[zone.id] || 'hsl(var(--primary))');
            return <motion.div key={zone.id} initial={{
              opacity: 0,
              y: 24
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: i * 0.1
            }} whileHover={{
              y: -6
            }} className="relative">
                  <div className="h-full rounded-2xl border border-white/10 bg-card/40 p-7 flex flex-col gap-4 hover:border-primary/20 transition-colors">
                    {zone.status === 'coming-soon' && <div className="absolute top-4 right-4">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full border border-white/20 text-muted-foreground bg-white/5">
                          Coming Soon
                        </span>
                      </div>}
                    {zone.status === 'live' && <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border border-accent/30 text-accent bg-accent/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Live
                        </span>
                      </div>}

                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-primary/10 border border-primary/20">
                      {zone.id === 'token-game' ? '🎮' : zone.id === 'gold-token-game' ? '🏆' : '👥'}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-1">{zone.name}</h3>
                      <p className="text-xs font-semibold mb-3 text-primary">
                        {zone.tagline}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {zone.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {zone.features.map(f => <span key={f} className="text-xs px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/8">
                          {f}
                        </span>)}
                    </div>

                    {zone.coinCount && <div className="text-xs text-muted-foreground mt-1">
                        <Coins size={11} className="inline mr-1" />
                        {zone.coinCount.toLocaleString()} coins
                      </div>}

                    <div className="mt-auto pt-2">
                      {zone.status === 'live' ? <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/20 hover:border-primary/50 hover:text-primary w-full" asChild>
                          <Link to={zone.href}>
                            Enter Zone
                            <ArrowRight size={12} />
                          </Link>
                        </Button> : <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/10 text-muted-foreground w-full cursor-not-allowed" disabled>
                          <Lock size={12} />
                          Coming Soon
                        </Button>}
                    </div>
                  </div>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      {/* ── 16 Edition Zones ─────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
              {oasis.editions.headline}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {oasis.editions.body}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 max-w-6xl mx-auto mb-8">
            {EDITION_ZONES.map((zone, i) => <motion.div key={zone.slug} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.3,
            delay: i * 0.025
          }} whileHover={{
            y: -3,
            scale: 1.03
          }}>
                <Link to={`/${zone.slug}`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5 transition-all text-center">
                  <span className="text-2xl">{zone.flag}</span>
                  <span className="text-xs font-semibold leading-tight">{zone.name}</span>
                  <span className="text-[10px] text-muted-foreground">{zone.coinCount} coins</span>
                </Link>
              </motion.div>)}
          </div>

          <div className="text-center">
            <Button variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
              <Link to="/world-map">
                <Globe size={14} />
                Open World Map
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Special Coin Types ───────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
        }} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/30 text-accent bg-accent/8 mb-4">
              {oasis.specialCoins.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              {oasis.specialCoins.headline}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {oasis.specialCoins.body}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {SPECIAL_COIN_TYPES.map((coin, i) => {
            const color = RARITY_COLORS[coin.rarity] || 'hsl(var(--primary))';
            return <motion.div key={coin.id} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.08
            }} className="rounded-2xl border border-white/10 bg-card/40 p-6 flex flex-col gap-3 relative hover:border-primary/20 transition-colors">
                  {coin.comingSoon && <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                        Coming Soon
                      </span>
                    </div>}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-primary/10 border border-primary/20">
                      {coin.icon}
                    </div>
                    <div>
                      <div className="font-bold">{coin.name}</div>
                      <div className="text-xs font-semibold capitalize" style={{
                    color
                  }}>
                        {coin.rarity}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {coin.description}
                  </p>
                  <div className="pt-2 border-t border-white/8">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/60">Earned by: </span>
                      {coin.earnedBy}
                    </div>
                  </div>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      {/* ── Five Game Pillars ─────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
        }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              {oasis.pillars.headline}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {oasis.pillars.body}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[{
            icon: <Coins size={20} />,
            label: 'Collect',
            desc: 'Hold coins from multiple editions. Build your collection score. Seasonal coins become rare artifacts.',
            href: '/coin-directory'
          }, {
            icon: <Swords size={20} />,
            label: 'Compete',
            desc: 'Edition Wars. Weekly battles. Territory control. Seasonal resets. Legends are made here.',
            href: '/war-room'
          }, {
            icon: <Map size={20} />,
            label: 'Quest',
            desc: 'Daily and weekly missions tied to the seasonal calendar. XP, badges, and journey stages.',
            href: '/journey'
          }, {
            icon: <TrendingUp size={20} />,
            label: 'Stake',
            desc: 'Lock USGC, NYC, and TIEN for yield. Higher rarity coins earn higher multipliers.',
            href: '/staking'
          }, {
            icon: <Star size={20} />,
            label: 'Discover',
            desc: 'Hidden coins, secret zones, 1,393 backstory entries. The lore engine of the world.',
            href: '/coin-directory'
          }].map((pillar, i) => <motion.div key={pillar.label} initial={{
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
                  <div className="h-full rounded-2xl border border-primary/15 bg-primary/5 p-5 flex flex-col gap-3 hover:border-primary/35 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/25">
                      <span className="text-primary">{pillar.icon}</span>
                    </div>
                    <div className="font-bold">{pillar.label}</div>
                    <p className="text-muted-foreground text-xs leading-relaxed flex-1">{pillar.desc}</p>
                    <span className="text-xs font-semibold flex items-center gap-1 text-primary">
                      Enter <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── Interoperability ─────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              {oasis.interop.headline}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {oasis.interop.body}
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {INTEROP_RULES.map((rule, i) => <motion.div key={i} initial={{
            opacity: 0,
            x: -16
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.08
          }} className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-card/30">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/15 border border-primary/25">
                  <ChevronRight size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {rule.asset}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {rule.from} → {rule.to}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">{rule.rule}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── Community Hubs ───────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
              {oasis.community.headline}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {oasis.community.body}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {COMMUNITY_HUBS.map((hub, i) => <motion.div key={hub.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.1
          }} whileHover={{
            y: -4
          }}>
                <div className="h-full rounded-2xl border border-white/10 bg-card/40 p-6 flex flex-col gap-3 relative hover:border-primary/20 transition-colors">
                  {hub.status === 'coming-soon' && <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                        Coming Soon
                      </span>
                    </div>}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Users size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{hub.name}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{hub.description}</p>
                  </div>
                  <div className="mt-auto pt-2">
                    {hub.status === 'live' ? <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/20 hover:border-primary/50 hover:text-primary w-full" asChild>
                        <a href={hub.href} target="_blank" rel="noopener noreferrer">
                          Join
                          <ExternalLink size={11} />
                        </a>
                      </Button> : <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/10 text-muted-foreground w-full cursor-not-allowed" disabled>
                        <Lock size={11} />
                        Coming Soon
                      </Button>}
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── Player Identity ───────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
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
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-secondary/30 text-secondary bg-secondary/8 mb-5">
                {oasis.identity.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {oasis.identity.headline}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {oasis.identity.body}
              </p>
              <div className="flex flex-col gap-3">
                {oasis.identity.features.map(item => <div key={item.id} className="flex items-center gap-2.5 text-sm text-foreground/70">
                    <span className="text-primary"><Shield size={14} /></span>
                    {item.text}
                  </div>)}
              </div>
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
          }} className="flex flex-col gap-3">
              {oasis.identity.links.map((item, i) => <motion.div key={item.id} initial={{
              opacity: 0,
              x: 16
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.35,
              delay: 0.15 + i * 0.07
            }} whileHover={{
              x: 4
            }}>
                  <Link to={item.href as string} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-card/30 hover:border-primary/25 hover:bg-primary/5 transition-all">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-white/5 border border-white/10 shrink-0">
                      <span>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm"><span>{item.label}</span></div>
                      <div className="text-xs text-muted-foreground"><span>{item.desc}</span></div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                  </Link>
                </motion.div>)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[180px] opacity-8" style={{
          background: 'hsl(var(--primary))'
        }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <div className="text-5xl mb-6">🌐</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              {oasis.cta.headline}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              {oasis.cta.body}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 font-semibold px-10 bg-primary text-primary-foreground hover:bg-primary/90" style={{
              boxShadow: '0 0 40px hsl(var(--primary) / 0.45)'
            }} asChild>
                <Link to="/how-to-play">
                  <Zap size={16} />
                  <span>{oasis.cta.primaryLabel}</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/coin-directory">
                  <Coins size={15} />
                  <span>{oasis.cta.secondaryLabel}</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>;
}
