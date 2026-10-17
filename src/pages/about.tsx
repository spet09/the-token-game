import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from "react-router";
import { motion } from 'motion/react';
import { ArrowRight, Coins, Globe, Layers, Sparkles, Trophy, BookOpen, Calendar, Swords, TrendingUp } from 'lucide-react';
import { about } from 'virtual:content';
const site = 'https://thetokengame.xyz';
const url = `${site}/about`;
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [{
    '@type': 'AboutPage',
    '@id': `${url}#webpage`,
    name: about.seo.title,
    url,
    description: about.seo.description,
    isPartOf: {
      '@id': `${site}/#website`
    },
    about: {
      '@id': `${site}/#organization`
    }
  }, {
    '@type': 'SoftwareApplication',
    '@id': `${site}/#app`,
    name: 'The Token Game',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    url: site,
    description: about.seo.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to play — connect a Solana wallet to start'
    },
    featureList: ['212 seasonal meme coins on Solana', '16 global cultural editions', '8-coin crafting economy', 'XP journey system with 7 stages', '30 quests across 6 categories', 'USGC, NYC and TIEN staking pools', '1,582 coin backstories', 'War Room with 19 competing nations', 'Seasonal calendar with 130+ coin windows'],
    sameAs: ['https://twitter.com/thetokengame', 'https://discord.gg/thetokengame']
  }]
};
const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  '🗺️': <Globe className="w-5 h-5" />,
  '⚗️': <Layers className="w-5 h-5" />,
  '⚔️': <Swords className="w-5 h-5" />,
  '📅': <Calendar className="w-5 h-5" />,
  '🎯': <Sparkles className="w-5 h-5" />,
  '💎': <TrendingUp className="w-5 h-5" />,
  '📚': <BookOpen className="w-5 h-5" />,
  '🏆': <Trophy className="w-5 h-5" />
};
export default function AboutPage() {
  return <>
      <Helmet>
        <title>{about.seo.title}</title>
        <meta name="description" content={about.seo.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={about.seo.title} />
        <meta property="og:description" content={about.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={about.seo.title} />
        <meta name="twitter:description" content={about.seo.description} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20" style={{
            background: 'radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)'
          }} />
          </div>

          <div className="container mx-auto max-w-4xl px-4 text-center relative">
            <motion.p initial={{
            opacity: 0,
            y: 12
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4
          }} className="text-sm font-semibold tracking-wide mb-4" style={{
            color: 'hsl(var(--primary))'
          }}>
              {about.hero.eyebrow}
            </motion.p>

            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
              {about.hero.headline}
            </motion.h1>

            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {about.hero.subheadline}
            </motion.p>

            {/* Stats strip */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
              {about.stats.map(stat => <div key={stat.id} className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>)}
            </motion.div>
          </div>
        </section>

        {/* ── What is The Token Game ── */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8">
                {about.mission.heading}
              </h2>
              <div className="space-y-5">
                {about.mission.body.map(p => <p key={p.id} className="text-lg text-muted-foreground leading-relaxed">
                    {p.text}
                  </p>)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 8-Coin Economy ── */}
        <section className="py-20 border-t border-border bg-card/30">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <Coins className="w-6 h-6" style={{
                color: 'hsl(var(--primary))'
              }} />
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  {about.coinEconomy.heading}
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">{about.coinEconomy.subheading}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {about.coinEconomy.tiers.map((tier, i) => <motion.div key={tier.id} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.06
            }} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-black text-sm" style={{
                background: tier.color + '22',
                color: tier.color,
                border: `1px solid ${tier.color}44`
              }}>
                    {tier.symbol.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-foreground">{tier.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                    background: tier.color + '22',
                    color: tier.color
                  }}>
                        {tier.tier}
                      </span>
                      {'craftRate' in tier && tier.craftRate && <span className="text-xs text-muted-foreground font-mono">{tier.craftRate}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </motion.div>)}
            </div>

            <motion.div initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.4
          }} className="mt-6 text-center">
              <Link to="/crafting" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{
              color: 'hsl(var(--primary))'
            }}>
                Open the crafting calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── 16 Editions ── */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-6 h-6" style={{
                color: 'hsl(var(--accent))'
              }} />
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  {about.editions.heading}
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">{about.editions.subheading}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {about.editions.list.map((ed, i) => <motion.div key={ed.id} initial={{
              opacity: 0,
              scale: 0.95
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.3,
              delay: i * 0.04
            }} className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                  <div className="text-2xl mb-2">{ed.flag}</div>
                  <div className="font-bold text-foreground text-sm">{ed.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{ed.theme}</div>
                  <div className="text-xs font-semibold mt-2" style={{
                color: 'hsl(var(--primary))'
              }}>
                    {ed.coins} coins
                  </div>
                </motion.div>)}
            </div>

            <motion.div initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.5
          }} className="mt-6 text-center">
              <Link to="/coins" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{
              color: 'hsl(var(--accent))'
            }}>
                Browse all 212 coins <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Platform Systems ── */}
        <section className="py-20 border-t border-border bg-card/30">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
                {about.systems.heading}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {about.systems.items.map((sys, i) => <motion.div key={sys.id} initial={{
              opacity: 0,
              x: i % 2 === 0 ? -20 : 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.07
            }} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{
                background: 'hsl(var(--primary) / 0.15)',
                color: 'hsl(var(--primary))'
              }}>
                    {SYSTEM_ICONS[sys.icon] ?? <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-foreground mb-1">{sys.name}</div>
                    <p className="text-sm text-muted-foreground">{sys.description}</p>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* ── Tienko Ecosystem ── */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
                {about.tienko.heading}
              </h2>
              <p className="text-lg font-semibold mb-8" style={{
              color: 'hsl(var(--primary))'
            }}>
                {about.tienko.subheading}
              </p>
              <div className="space-y-5">
                {about.tienko.body.map(p => <p key={p.id} className="text-lg text-muted-foreground leading-relaxed">
                    {p.text}
                  </p>)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                {about.cta.heading}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">{about.cta.subheading}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/coins" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-foreground transition-opacity hover:opacity-90" style={{
                background: 'hsl(var(--primary))'
              }}>
                  <span>{about.cta.primaryLabel}</span> <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/calendar" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold border border-border text-foreground hover:bg-card transition-colors">
                  <span>{about.cta.secondaryLabel}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>;
}
