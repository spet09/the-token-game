import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { Wallet, Shield, Map, Trophy, Star, Zap, Users, Globe, MessageSquare, Send, Twitter, Grid3x3, ExternalLink, Lock, ChevronRight, Crown, Swords, TrendingUp, Coins } from 'lucide-react';
import { community } from 'virtual:content';
import { EDITIONS, type Edition } from '@/data/editions';

// ─── Icon map for player identity features ────────────────────────────────────
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  wallet: <Wallet size={18} />,
  shield: <Shield size={18} />,
  map: <Map size={18} />,
  trophy: <Trophy size={18} />,
  star: <Star size={18} />,
  zap: <Zap size={18} />
};

// ─── Social channel icon map ──────────────────────────────────────────────────
const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  discord: <Users size={22} />,
  grid: <Grid3x3 size={22} />,
  message: <MessageSquare size={22} />,
  twitter: <Twitter size={22} />,
  send: <Send size={22} />
};

// Platform brand accent colors (not game palette — these are external platform identities)
const CHANNEL_ACCENT: Record<string, string> = {
  discord: '#5865F2',
  grid: '#BF5FFF',
  message: '#00BCD4',
  twitter: '#1DA1F2',
  send: '#26A5E4'
};

// ─── Zone Hub Card ────────────────────────────────────────────────────────────
function ZoneHubCard({
  edition,
  selected,
  onClick
}: {
  edition: Edition;
  selected: boolean;
  onClick: () => void;
}) {
  const c = edition.zoneColor;
  return <motion.button onClick={onClick} whileHover={{
    y: -3,
    scale: 1.02
  }} whileTap={{
    scale: 0.97
  }} className="w-full text-left rounded-2xl border p-4 flex flex-col gap-2 transition-all" style={{
    borderColor: selected ? `${c}65` : `${c}22`,
    background: selected ? `linear-gradient(135deg, ${c}16, ${c}07)` : `${c}05`,
    boxShadow: selected ? `0 0 20px ${c}20` : 'none'
  }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{edition.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight">{edition.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{edition.coins} coins</div>
        </div>
        <ChevronRight size={14} className="text-muted-foreground shrink-0 transition-transform" style={{
        transform: selected ? 'rotate(90deg)' : 'none'
      }} />
      </div>
    </motion.button>;
}

// ─── Zone Hub Detail Panel ────────────────────────────────────────────────────
function ZoneHubDetail({
  edition
}: {
  edition: Edition;
}) {
  const c = edition.zoneColor;
  return <AnimatePresence mode="wait">
      <motion.div key={edition.href} initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -10
    }} transition={{
      duration: 0.25
    }} className="rounded-2xl border p-6 flex flex-col gap-5 h-full" style={{
      borderColor: `${c}30`,
      background: `${c}07`
    }}>
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0" style={{
          background: `${c}18`,
          border: `2px solid ${c}35`
        }}>
            {edition.flag}
          </div>
          <div>
            <h3 className="text-xl font-bold">{edition.label} Zone</h3>
            <div className="text-sm text-muted-foreground mt-0.5">
              {edition.coins} seasonal coins · Edition zone
            </div>
          </div>
        </div>

        {/* Zone stats */}
        <div className="grid grid-cols-3 gap-3">
          {[{
          label: 'Coins',
          value: edition.coins.toLocaleString(),
          icon: <Coins size={13} />
        }, {
          label: 'Season',
          value: '1',
          icon: <Star size={13} />
        }, {
          label: 'Status',
          value: 'Live',
          icon: <Zap size={13} />
        }].map(stat => <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                {stat.icon}
                <span className="text-[10px] font-semibold">{stat.label}</span>
              </div>
              <div className="font-bold text-sm" style={{
            color: c
          }}>{stat.value}</div>
            </div>)}
        </div>

        {/* Zone features */}
        <div className="flex flex-col gap-2">
          {[{
          icon: <Swords size={13} />,
          text: 'War Room territory battles'
        }, {
          icon: <Trophy size={13} />,
          text: 'Zone leaderboard rankings'
        }, {
          icon: <Crown size={13} />,
          text: 'Seasonal zone champion title'
        }, {
          icon: <TrendingUp size={13} />,
          text: 'Zone-specific staking bonuses'
        }].map((item, i) => <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span style={{
            color: c
          }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>)}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button size="sm" className="w-full gap-2 font-semibold text-primary-foreground" style={{
          background: c,
          boxShadow: `0 0 20px ${c}35`
        }} asChild>
            <Link to={edition.href}>
              <Globe size={13} />
              Enter {edition.label} Zone
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="w-full gap-2 border-white/15 hover:border-white/30" asChild>
            <Link to="/war-room">
              <Swords size={13} />
              War Room
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [selectedZone, setSelectedZone] = useState<Edition>(EDITIONS[0]);
  const title = 'Community Hub — The Token Game';
  const description = 'Find your zone, build your identity, and connect with players across all 16 edition zones. The Token Game community hub.';
  const canonical = 'https://thetokengame.xyz/community';
  const ogImage = 'https://thetokengame.xyz/og-image.png';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: title,
          url: canonical,
          description,
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/10 py-20">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full blur-[160px] opacity-8" style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
          }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/40 text-primary bg-primary/10">
                  {community.hero.eyebrow}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {community.hero.headline}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                {community.hero.body}
              </p>
            </motion.div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
              {community.stats.map((stat, i) => <motion.div key={stat.id} initial={{
              opacity: 0,
              y: 12
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: 0.2 + i * 0.07
            }} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* ── Zone Community Hubs ───────────────────────────────────────────── */}
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
                {community.zoneHubs.headline}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {community.zoneHubs.body}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 max-w-6xl mx-auto">
              {/* Zone selector grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {EDITIONS.map(edition => <ZoneHubCard key={edition.href} edition={edition} selected={selectedZone.href === edition.href} onClick={() => setSelectedZone(edition)} />)}
              </div>

              {/* Detail panel */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ZoneHubDetail edition={selectedZone} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Player Identity ───────────────────────────────────────────────── */}
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
                {community.playerIdentity.headline}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {community.playerIdentity.body}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
              {community.playerIdentity.features.map((feature, i) => <motion.div key={feature.id} initial={{
              opacity: 0,
              y: 16
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.06
            }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'hsl(var(--primary) / 0.15)',
                color: 'hsl(var(--primary))'
              }}>
                    {FEATURE_ICONS[feature.icon] ?? <Star size={18} />}
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">{feature.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>)}
            </div>

            <motion.div initial={{
            opacity: 0,
            y: 12
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4
          }} className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" className="gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/rpg/create-character">
                  <Shield size={15} />
                  Create character
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/journey">
                  <Map size={15} />
                  View journey
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/coin-leaderboard">
                  <Trophy size={15} />
                  Leaderboard
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Social Channels ───────────────────────────────────────────────── */}
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
                {community.socialHubs.headline}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {community.socialHubs.body}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {community.socialHubs.channels.map(channel => {
              const accent = CHANNEL_ACCENT[channel.icon] ?? '#888';
              const isLive = channel.status === 'live';
              return <motion.div key={channel.id} initial={{
                opacity: 0,
                y: 16
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.4
              }} className="rounded-2xl border p-5 flex flex-col gap-4" style={{
                borderColor: `${accent}25`,
                background: `${accent}06`
              }}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: `${accent}18`,
                    border: `1.5px solid ${accent}35`,
                    color: accent
                  }}>
                        {CHANNEL_ICONS[channel.icon] ?? <Globe size={22} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm">{channel.name}</span>
                          {isLive ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/30 text-accent bg-accent/10">
                              Live
                            </span> : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5 flex items-center gap-1">
                              <Lock size={8} />
                              <span>Soon</span>
                            </span>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{channel.description}</p>
                      </div>
                    </div>
                    {isLive ? <Button size="sm" className="w-full gap-2 font-semibold text-primary-foreground" style={{
                  background: accent,
                  boxShadow: `0 0 16px ${accent}30`
                }} asChild>
                        <a href={channel.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={12} />
                          {channel.cta}
                        </a>
                      </Button> : <Button size="sm" variant="outline" className="w-full gap-2 border-white/15 text-muted-foreground cursor-not-allowed" disabled>
                        <Lock size={12} />
                        {channel.cta}
                      </Button>}
                  </motion.div>;
            })}
            </div>
          </div>
        </section>

        {/* ── Hall of Legends ───────────────────────────────────────────────── */}
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
          }}>
              <div className="rounded-2xl border p-10 text-center" style={{
              borderColor: 'hsl(var(--primary) / 0.3)',
              background: 'hsl(var(--primary) / 0.05)'
            }}>
                <div className="text-5xl mb-5">🏆</div>
                <h2 className="text-3xl font-bold mb-3" style={{
                fontFamily: 'var(--font-heading)'
              }}>
                  {community.hallOfLegends.headline}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {community.hallOfLegends.body}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {[{
                  rank: '🥇',
                  label: 'Zone Champion',
                  hint: 'Season 1'
                }, {
                  rank: '🥈',
                  label: 'Top Collector',
                  hint: 'Season 1'
                }, {
                  rank: '🥉',
                  label: 'Artifact Holder',
                  hint: 'Season 1'
                }].map(slot => <div key={slot.rank} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center gap-2">
                      <span className="text-3xl">{slot.rank}</span>
                      <div className="text-sm font-semibold">{slot.label}</div>
                      <div className="text-xs text-muted-foreground">{slot.hint}</div>
                      <div className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground">
                        TBA
                      </div>
                    </div>)}
                </div>

                <Link to="/hall-of-legends" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                  <Star size={14} />
                  View Hall of Legends
                  <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
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
              <div className="text-5xl mb-6">🌐</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {community.cta.headline}
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                {community.cta.body}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2 font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90" style={{
                boxShadow: '0 0 40px hsl(var(--primary) / 0.4)'
              }} asChild>
                  <Link to="/coins">
                    <Globe size={15} />
                    {community.cta.primaryLabel}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                  <Link to="/how-to-play">
                    <Zap size={15} />
                    {community.cta.secondaryLabel}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>;
}
