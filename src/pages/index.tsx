import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ArrowRight, BookOpen, Compass, Star, ExternalLink } from 'lucide-react';
import { COINS } from '@/data/coins';
import NewsletterSignup from '@/components/NewsletterSignup';
import { home } from 'virtual:content';

// ─── Grid Background ──────────────────────────────────────────────────────────
function GridBackground() {
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{
      background: 'hsl(276 100% 69%)'
    }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-15" style={{
      background: 'hsl(306 100% 69%)'
    }} />
    </div>;
}

// Generate a deterministic color from ticker string
function tickerColor(ticker: string): string {
  const colors = ['hsl(276 100% 69%)', 'hsl(306 100% 69%)', 'hsl(96 100% 69%)', 'hsl(200 100% 65%)', 'hsl(45 100% 65%)', 'hsl(340 100% 65%)'];
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ─── Collector Tiers ──────────────────────────────────────────────────────────
const TIERS = [{
  coins: '3',
  name: 'Sip Tester',
  rank: 'Bronze',
  emoji: '🥉',
  color: '#cd7f32'
}, {
  coins: '6',
  name: 'Straw Rank',
  rank: 'Silver',
  emoji: '🥈',
  color: '#c0c0c0'
}, {
  coins: '12',
  name: 'Grande Gambler',
  rank: 'Gold',
  emoji: '🥇',
  color: '#ffd700'
}, {
  coins: '25+',
  name: 'Venti Victim',
  rank: 'Platinum',
  emoji: '💎',
  color: '#e5e4e2'
}];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const title = 'The Token Game — A world of coins. A calendar of stories.';
  const description = '1,080 collectibles across 10 regional editions. Discover a new coin every day. No financial value — pure lore, culture, and collection.';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [{
            '@type': 'WebSite',
            '@id': 'https://thetokengame.xyz/#website',
            name: 'The Token Game',
            url: 'https://thetokengame.xyz',
            description,
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://thetokengame.xyz/coins',
              'query-input': 'required name=search_term_string'
            }
          }, {
            '@type': 'Organization',
            '@id': 'https://thetokengame.xyz/#organization',
            name: 'The Token Game',
            url: 'https://thetokengame.xyz',
            logo: 'https://thetokengame.xyz/og-image.png',
            sameAs: ['https://twitter.com/thetokengame']
          }, {
            '@type': 'SoftwareApplication',
            '@id': 'https://thetokengame.xyz/#app',
            name: 'The Token Game',
            applicationCategory: 'GameApplication',
            operatingSystem: 'Web',
            url: 'https://thetokengame.xyz',
            description,
            featureList: ['1,080 collectible coins across 10 regional editions', 'Global, Australia, China, USA, Europe, Africa, Russia, India, Japan, South America', 'Daily coin discovery calendar', '1,582 coin backstories with origin and lore', 'Crafting, Quests, and XP journey system', 'War Room with 19 competing nations', 'The Curator — an ancient AI narrator', 'Stash Key collection progression']
          }, {
            '@type': 'WebPage',
            '@id': 'https://thetokengame.xyz/#webpage',
            url: 'https://thetokengame.xyz',
            name: title,
            isPartOf: {
              '@id': 'https://thetokengame.xyz/#website'
            },
            about: {
              '@id': 'https://thetokengame.xyz/#organization'
            },
            datePublished: '2025-01-01',
            dateModified: '2026-08-10'
          }]
        })}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        <GridBackground />
        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
            
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-8" style={{
            borderColor: 'hsl(276 100% 69% / 0.4)',
            color: 'hsl(276 100% 69%)',
            background: 'hsl(276 100% 69% / 0.1)'
          }}>
              {home.hero.badge}
            </span>
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1,
          ease: 'easeOut'
        }} className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto" style={{
          fontFamily: 'var(--font-heading)'
        }}>
            <span>{home.hero.headline1}</span>{' '}
            <span style={{
            color: 'hsl(276 100% 69%)'
          }}><span>{home.hero.headline2}</span></span>{' '}
            <span style={{
            color: 'hsl(96 100% 69%)'
          }}><span>{home.hero.headline3}</span></span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2,
          ease: 'easeOut'
        }} className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            {home.hero.subheading}
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3,
          ease: 'easeOut'
        }} className="flex flex-wrap gap-4 justify-center">
            
            <Button size="lg" className="gap-2 font-semibold text-base px-8" style={{
            background: 'hsl(var(--primary))',
            color: 'white',
            boxShadow: '0 0 30px hsl(276 100% 69% / 0.5)'
          }} asChild>
              <Link to="/coins">
                <span>{home.hero.ctaPrimary}</span>
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 font-semibold text-base px-8 border-white/20 text-foreground/80 hover:border-primary/50 hover:text-primary" asChild>
              <Link to="/curator">
                <span>{home.hero.ctaSecondary}</span>
              </Link>
            </Button>
          </motion.div>

          {/* Newsletter signup */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.45,
          ease: 'easeOut'
        }} className="mt-10">
            
            <NewsletterSignup variant="hero" />
          </motion.div>
        </div>

        {/* Floating coin emojis */}
        {['☕', '🧋', '🪙', '💜', '🚀'].map((emoji, i) => <motion.div key={i} className="absolute text-2xl select-none pointer-events-none hidden md:block" style={{
        left: `${10 + i * 20}%`,
        top: `${20 + i % 2 * 40}%`,
        opacity: 0.15
      }} animate={{
        y: [-10, 10, -10]
      }} transition={{
        duration: 4 + i,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.7
      }}>
          
            {emoji}
          </motion.div>)}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto px-4">
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
        }} className="text-center mb-16">
            
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(96 100% 69%)'
          }}>
              <span>{home.howItWorks.eyebrow}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-bold"><span>{home.howItWorks.heading}</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {home.howItWorks.steps.map((s, i) => {
            const colors = ['hsl(276 100% 69%)', 'hsl(306 100% 69%)', 'hsl(96 100% 69%)'];
            const icons = [<Compass size={28} key="c" />, <BookOpen size={28} key="b" />, <Star size={28} key="s" />];
            const color = colors[i % colors.length];
            const icon = icons[i % icons.length];
            const delay = i * 0.15;
            return <motion.div key={s.id} initial={{
              opacity: 0,
              y: 40
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay,
              ease: 'easeOut'
            }} className="flex flex-col items-center text-center">
                
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative" style={{
                background: `${color}20`,
                border: `1px solid ${color}40`
              }}>
                
                    <span style={{
                  color
                }}>{icon}</span>
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                  background: color,
                  color: 'hsl(259 44% 7%)'
                }}>
                    
                      <span>{s.step.replace('0', '')}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3"><span>{s.title}</span></h3>
                  <p className="text-foreground/60 text-sm leading-relaxed max-w-xs"><span>{s.desc}</span></p>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      {/* ── SEASONAL SPOTLIGHT ── */}
      <section className="py-16 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-[100px] opacity-10" style={{
          background: 'hsl(306 100% 69%)'
        }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
        }} className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-3xl mx-auto">
            
            {/* Icon */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.85
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="shrink-0 relative">
              
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{
              background: 'hsl(306 100% 69%)',
              transform: 'scale(1.3)'
            }} />
              <div className="relative w-32 h-32 rounded-full overflow-hidden" style={{
              border: '3px solid hsl(306 100% 69% / 0.6)',
              boxShadow: '0 0 32px hsl(306 100% 69% / 0.4)'
            }}>
                
                <img src="/airo-assets/images/pages/home/reso-resolution-ruined" alt="$RESO Resolution Ruined" className="w-full h-full object-cover" />
              </div>
              {/* Live badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap" style={{
              background: 'hsl(96 100% 69%)',
              color: 'hsl(259 44% 7%)'
            }}>
                
                🟢 Live Now
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.15
          }} className="text-center md:text-left">
              
              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-3" style={{
              borderColor: 'hsl(306 100% 69% / 0.4)',
              color: 'hsl(306 100% 69%)',
              background: 'hsl(306 100% 69% / 0.1)'
            }}>
                <span>{home.spotlight.eyebrow}</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-1" style={{
              fontFamily: 'var(--font-heading)',
              color: 'hsl(306 100% 69%)'
            }}>
                $RESO
              </h2>
              <p className="text-lg font-semibold text-foreground/80 mb-3">Resolution Ruined</p>
              <p className="text-foreground/50 text-sm leading-relaxed mb-5 max-w-md">
                New year, same you. The resolution lasted 48 hours. The losses last forever.
              </p>
              <a href="https://raydium.io" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 font-semibold opacity-40 cursor-not-allowed pointer-events-none" style={{
                background: 'hsl(306 100% 69%)',
                color: 'hsl(259 44% 7%)'
              }}>
                <span>{home.spotlight.undiscoveredLabel}</span>
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── COIN GRID ── */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, hsl(276 100% 69% / 0.1) 0%, transparent 70%)'
      }} />
        
        <div className="container mx-auto px-4 relative z-10">
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
        }} className="text-center mb-12">
            
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(276 100% 69%)'
          }}>
              <span>{home.permanentCoins.eyebrow}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-3"><span>{home.permanentCoins.heading}</span></h2>
            <p className="text-foreground/50 text-base max-w-xl mx-auto">
              <span>{home.permanentCoins.subheading}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {COINS.filter(c => c.permanent).map((coin, i) => {
            const color = tickerColor(coin.ticker);
            return <motion.div key={coin.ticker} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.05,
              ease: 'easeOut'
            }} whileHover={{
              y: -4,
              boxShadow: `0 0 28px ${color}35, 0 0 0 1px ${color}35`
            }} className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm p-5 flex flex-col items-center gap-4 text-center transition-shadow duration-200">
                  
                  {/* Coin icon */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden relative" style={{
                background: `${color}18`,
                border: `2px solid ${color}55`
              }}>
                    {/* Always render img so canvas Replace can target it */}
                    <img src={coin.image || "/placeholder.jpg"} alt={coin.name} className="w-full h-full object-cover absolute inset-0" style={{
                  opacity: coin.image ? 1 : 0
                }} loading="lazy" />
                    {!coin.image && <span style={{
                  color,
                  fontFamily: 'var(--font-heading)'
                }}>
                        {coin.ticker.replace('$', '').slice(0, 4)}
                      </span>}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="font-bold text-base" style={{
                  color,
                  fontFamily: 'var(--font-heading)'
                }}>
                      {coin.ticker}
                    </div>
                    <div className="text-xs text-foreground/50 mt-0.5 leading-snug">
                      {coin.name}
                    </div>
                  </div>
                  {/* Discover button — links to coin detail when available */}
                  {coin.buyUrl && coin.buyUrl !== '#' ? <a href={coin.buyUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button size="sm" className="w-full gap-1.5 text-xs font-semibold" style={{
                  background: color,
                  color: 'hsl(259 44% 7%)'
                }}>
                        <span>{home.permanentCoins.discoverLabel}</span>
                        <ExternalLink size={11} />
                      </Button>
                    </a> : <div className="w-full flex items-center justify-center text-xs font-semibold py-1.5 px-2 rounded-md opacity-30 border" style={{
                borderColor: color,
                color
              }}>
                      <span>{home.permanentCoins.undiscoveredLabel}</span>
                    </div>}
                </motion.div>;
          })}
          </div>

          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }} className="text-center mt-10">
            
            <Button variant="outline" size="lg" className="border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary gap-2" asChild>
              
              <Link to="/coins">
                <span>{home.permanentCoins.viewAllCta}</span>
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── THE STASH KEY ── */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] opacity-10" style={{
          background: 'hsl(96 100% 69%)'
        }} />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-8" style={{
          background: 'hsl(276 100% 69%)'
        }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Coin image */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.85
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            ease: 'easeOut'
          }} className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full blur-[40px] opacity-40 scale-110" style={{
                background: 'hsl(96 100% 69%)'
              }} />
                {/* Rotating ring */}
                <motion.div animate={{
                rotate: 360
              }} transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }} className="absolute inset-[-12px] rounded-full border border-dashed opacity-30" style={{
                borderColor: 'hsl(96 100% 69%)'
              }} />
                {/* Coin */}
                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4" style={{
                borderColor: 'hsl(96 100% 69% / 0.6)',
                boxShadow: '0 0 60px hsl(96 100% 69% / 0.3), inset 0 0 40px hsl(96 100% 69% / 0.1)'
              }}>
                  <img src="/airo-assets/images/pages/stash-key/coin-placeholder" alt="The Stash Key coin" className="w-full h-full object-cover" loading="lazy" />
                </div>
                {/* Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{
                background: 'hsl(96 100% 69%)',
                color: 'hsl(259 44% 7%)',
                boxShadow: '0 0 20px hsl(96 100% 69% / 0.5)'
              }}>
                  Ultra Rare
                </div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.1
          }} className="order-1 lg:order-2">

              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-5" style={{
              borderColor: 'hsl(96 100% 69% / 0.4)',
              color: 'hsl(96 100% 69%)',
              background: 'hsl(96 100% 69% / 0.08)'
            }}>
                The Ultimate Prize
              </span>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                The Stash Key —{' '}
                <span style={{
                color: 'hsl(96 100% 69%)'
              }}>Unlock the Game.</span>
              </h2>

              <p className="text-foreground/60 text-base leading-relaxed mb-8">
                The Stash Key is the ultimate prize in The Token Game. Earn it through challenges,
                win it through competition, and use it to unlock The Stash — the community's growing prize pool.
              </p>

              {/* How to earn */}
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
                color: 'hsl(276 100% 69%)'
              }}>
                  How to Earn It
                </p>
                <ul className="space-y-3">
                  {['Win the weekly Nation Challenge.', 'Top the global leaderboard.', 'Earn it through seasonal events.'].map((item, i) => <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{
                    background: 'hsl(96 100% 69% / 0.15)',
                    color: 'hsl(96 100% 69%)',
                    border: '1px solid hsl(96 100% 69% / 0.3)'
                  }}>
                        {i + 1}
                      </span>
                      <span className="text-foreground/70 text-sm leading-relaxed">{item}</span>
                    </li>)}
                </ul>
              </div>

              <Button size="lg" className="gap-2 font-semibold" style={{
              background: 'hsl(96 100% 69%)',
              color: 'hsl(259 44% 7%)',
              boxShadow: '0 0 30px hsl(96 100% 69% / 0.4)'
            }} asChild>
                <Link to="/stash-key">
                  Learn More About The Stash
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE PLAYER'S JOURNEY ── */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full blur-[160px] opacity-8" style={{
          background: 'hsl(276 100% 69%)'
        }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
        }} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(276 100% 69%)'
          }}>
              <span>{home.journey.eyebrow}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              <span>{home.journey.heading}</span>
            </h2>
            <p className="text-foreground/50 text-base max-w-xl mx-auto">
              <span>{home.journey.subheading}</span>
            </p>
          </motion.div>

          {/* Journey table */}
          <div className="max-w-4xl mx-auto">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 pb-4 text-xs font-semibold uppercase tracking-widest text-foreground/30">
              <span>Stage</span>
              <span>Action Required</span>
              <span>Key Earned</span>
              <span>What Unlocks</span>
            </div>

            <div className="flex flex-col gap-3">
            {home.journey.stages.map((row, i) => {
              const keyColors = ['#cd7f32', '#c0c0c0', '#ffd700', 'hsl(96 100% 69%)'];
              const stageBgs = ['rgba(205,127,50,0.08)', 'rgba(192,192,192,0.08)', 'rgba(255,215,0,0.08)', 'hsl(96 100% 69% / 0.08)'];
              const stageBorders = ['rgba(205,127,50,0.2)', 'rgba(192,192,192,0.2)', 'rgba(255,215,0,0.2)', 'hsl(96 100% 69% / 0.25)'];
              const keyColor = keyColors[i % keyColors.length];
              const stageBg = stageBgs[i % stageBgs.length];
              const stageBorder = stageBorders[i % stageBorders.length];
              return <motion.div key={row.id} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.45,
                delay: i * 0.09,
                ease: 'easeOut'
              }} whileHover={{
                x: 4
              }} className="rounded-2xl border px-6 py-5 transition-all duration-200" style={{
                background: stageBg,
                borderColor: stageBorder
              }}>
                    {/* Mobile layout */}
                    <div className="md:hidden flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                      background: `${keyColor}20`,
                      color: keyColor
                    }}>
                          <span>Stage </span><span>{row.stage}</span>
                        </span>
                        <span className="font-bold text-sm" style={{
                      color: keyColor
                    }}><span>{row.key}</span></span>
                      </div>
                      <p className="text-foreground/60 text-sm"><span>{row.action}</span></p>
                      <p className="text-foreground/40 text-xs"><span>{row.unlocks}</span></p>
                    </div>
                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{
                      background: `${keyColor}18`,
                      color: keyColor,
                      border: `1px solid ${keyColor}35`
                    }}>
                          <span>{row.stage}</span>
                        </span>
                      </div>
                      <p className="text-foreground/65 text-sm leading-snug"><span>{row.action}</span></p>
                      <p className="font-bold text-sm" style={{
                    color: keyColor
                  }}><span>{row.key}</span></p>
                      <p className="text-foreground/45 text-sm leading-snug"><span>{row.unlocks}</span></p>
                    </div>
                  </motion.div>;
            })}
            </div>

            {/* CTA */}
            <motion.div initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="mt-8 text-center">
              <Button variant="outline" className="gap-2 border-white/15 text-foreground/60 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/curator">
                  Ask The Curator
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COLLECTOR TIERS ── */}
      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto px-4">
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
        }} className="text-center mb-12">
            
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(306 100% 69%)'
          }}>
              <span>{home.collectorTiers.eyebrow}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-3"><span>{home.collectorTiers.heading}</span></h2>
            <p className="text-foreground/50 text-base max-w-xl mx-auto">
              <span>{home.collectorTiers.subheading}</span>
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Table header */}
            <div className="grid grid-cols-3 gap-4 px-6 pb-3 text-xs font-semibold uppercase tracking-widest text-foreground/30">
              <span>Coins Held</span>
              <span>Tier Name</span>
              <span>Rank</span>
            </div>

            <div className="flex flex-col gap-3">
              {TIERS.map((tier, i) => <motion.div key={tier.rank} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.1,
              ease: 'easeOut'
            }} whileHover={{
              x: 4
            }} className="grid grid-cols-3 gap-4 items-center rounded-2xl border border-white/10 bg-card/60 px-6 py-5 transition-all duration-200" style={{
              borderColor: `${tier.color}30`
            }}>
                
                  <div className="text-2xl font-bold" style={{
                color: tier.color,
                fontFamily: 'var(--font-heading)'
              }}>
                    {tier.coins}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{tier.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tier.emoji}</span>
                    <span className="text-sm font-semibold" style={{
                  color: tier.color
                }}>
                      {tier.rank}
                    </span>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, hsl(276 100% 69% / 0.08) 0%, hsl(306 100% 69% / 0.06) 100%)'
      }} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
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
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span>{home.bottomCta.heading}</span>
            </h2>
            <p className="text-foreground/50 text-lg mb-8 max-w-lg mx-auto">
              <span>{home.bottomCta.subheading}</span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 font-semibold px-8" style={{
              background: 'linear-gradient(135deg, hsl(276 100% 69%), hsl(306 100% 69%))',
              color: 'white',
              boxShadow: '0 0 30px hsl(276 100% 69% / 0.4)'
            }} asChild>
                <Link to="/coins"><span>{home.bottomCta.ctaPrimary}</span></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                <Link to="/curator">
                  <span>{home.bottomCta.ctaSecondary}</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NON-FINANCIAL DISCLAIMER ── */}
      <section className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-foreground/25 max-w-2xl mx-auto leading-relaxed">
            <span>{home.disclaimer}</span>
          </p>
        </div>
      </section>
    </>;
}
