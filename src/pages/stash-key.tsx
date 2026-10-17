import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ArrowRight, Trophy, Globe, Sparkles, Lock } from 'lucide-react';
const site = 'https://thetokengame.xyz';
const url = `${site}/stash-key`;
const title = 'The Stash Key — The Token Game';
const description = 'The Stash Key is the rarest coin in The Token Game. Earn it through Nation Challenges, leaderboard dominance, and seasonal events to unlock The Stash — the community prize pool.';
const HOW_TO_EARN = [{
  icon: <Globe size={24} />,
  title: 'Win the Nation Challenge',
  desc: 'Each week, nations compete in head-to-head challenges. The winning nation earns a Stash Key for their top contributor.',
  color: 'hsl(276 100% 69%)'
}, {
  icon: <Trophy size={24} />,
  title: 'Top the Global Leaderboard',
  desc: 'Hold the most coins across all editions and claim the #1 spot. The top wallet at the end of each season earns a Stash Key.',
  color: 'hsl(306 100% 69%)'
}, {
  icon: <Sparkles size={24} />,
  title: 'Seasonal Events',
  desc: 'Special limited-time events drop throughout the year. Complete the challenge, earn the key.',
  color: 'hsl(96 100% 69%)'
}];
export default function StashKeyPage() {
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
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
          '@id': `${url}#webpage`,
          name: title,
          url,
          description,
          isPartOf: {
            '@id': `${site}/#website`
          },
          about: {
            '@id': `${site}/#organization`
          }
        })}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[160px] opacity-10" style={{
          background: 'hsl(96 100% 69%)'
        }} />
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-8" style={{
          background: 'hsl(276 100% 69%)'
        }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-sk" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-sk)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Coin */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.7,
            ease: 'easeOut'
          }} className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-[60px] opacity-50 scale-110" style={{
                background: 'hsl(96 100% 69%)'
              }} />
                <motion.div animate={{
                rotate: 360
              }} transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'linear'
              }} className="absolute inset-[-16px] rounded-full border border-dashed opacity-25" style={{
                borderColor: 'hsl(96 100% 69%)'
              }} />
                <motion.div animate={{
                rotate: -360
              }} transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear'
              }} className="absolute inset-[-32px] rounded-full border opacity-15" style={{
                borderColor: 'hsl(276 100% 69%)'
              }} />
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4" style={{
                borderColor: 'hsl(96 100% 69% / 0.7)',
                boxShadow: '0 0 80px hsl(96 100% 69% / 0.4), inset 0 0 60px hsl(96 100% 69% / 0.1)'
              }}>
                  <img src="/airo-assets/images/pages/stash-key/coin-placeholder" alt="The Stash Key coin" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{
                background: 'hsl(96 100% 69%)',
                color: 'hsl(259 44% 7%)',
                boxShadow: '0 0 24px hsl(96 100% 69% / 0.6)'
              }}>
                  Ultra Rare
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.7,
            ease: 'easeOut',
            delay: 0.15
          }}>

              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-5" style={{
              borderColor: 'hsl(96 100% 69% / 0.4)',
              color: 'hsl(96 100% 69%)',
              background: 'hsl(96 100% 69% / 0.08)'
            }}>
                The Ultimate Prize
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                The Stash Key —{' '}
                <span style={{
                color: 'hsl(96 100% 69%)'
              }}>Unlock the Game.</span>
              </h1>

              <p className="text-foreground/60 text-lg leading-relaxed mb-8">
                The Stash Key is the ultimate prize in The Token Game. Earn it through challenges,
                win it through competition, and use it to unlock The Stash — the community's growing prize pool.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2 font-semibold" style={{
                background: 'hsl(96 100% 69%)',
                color: 'hsl(259 44% 7%)',
                boxShadow: '0 0 30px hsl(96 100% 69% / 0.4)'
              }} asChild>
                  <Link to="/war-room">
                    Enter the War Room
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                  <Link to="/leaderboard">
                    View Leaderboard
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW TO EARN ── */}
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
              Three Paths
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How to Earn the Stash Key</h2>
            <p className="text-foreground/50 text-base max-w-xl mx-auto">
              There are only three ways to get one. None of them are easy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {HOW_TO_EARN.map(({
            icon,
            title: t,
            desc,
            color
          }, i) => <motion.div key={t} initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: i * 0.12,
            ease: 'easeOut'
          }} className="rounded-2xl p-8 border" style={{
            background: `${color}08`,
            borderColor: `${color}25`
          }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{
              background: `${color}18`,
              border: `1px solid ${color}35`
            }}>
                  <span style={{
                color
              }}>{icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>{t}</h3>
                <p className="text-foreground/55 text-sm leading-relaxed">{desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ── THE STASH ── */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-10" style={{
          background: 'hsl(276 100% 69%)'
        }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="max-w-3xl mx-auto text-center">

            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{
            background: 'hsl(276 100% 69% / 0.12)',
            border: '1px solid hsl(276 100% 69% / 0.3)',
            boxShadow: '0 0 40px hsl(276 100% 69% / 0.15)'
          }}>
              <Lock size={36} style={{
              color: 'hsl(276 100% 69%)'
            }} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
            color: 'hsl(276 100% 69%)'
          }}>
              The Prize Pool
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              What Is The Stash?
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed mb-4">
              The Stash is the community's growing prize pool — funded by the game itself. Every coin sold, every challenge entered, every season played adds to it.
            </p>
            <p className="text-foreground/60 text-lg leading-relaxed mb-10">
              Only a Stash Key holder can unlock it. One key. One winner. One moment.
            </p>

            <Button size="lg" className="gap-2 font-semibold" style={{
            background: 'hsl(276 100% 69%)',
            color: 'white',
            boxShadow: '0 0 30px hsl(276 100% 69% / 0.4)'
          }} asChild>
              <Link to="/war-room">
                Enter the War Room
                <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>;
}
