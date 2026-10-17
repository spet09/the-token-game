import { rwa } from 'virtual:content';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Globe, TrendingUp, Shield, Coins, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Link } from "react-router";
// ── Commodity icon components (SVG inline for pixel-perfect earth tones) ──
function CoffeeBeanIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="14" rx="10" ry="7" fill="#6B3A2A" opacity="0.9" />
      <path d="M14 7 Q18 14 14 21" stroke="#3D1F12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>;
}
function CornIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="15" rx="5" ry="9" fill="#D4A017" opacity="0.9" />
      <rect x="12" y="5" width="4" height="3" rx="1" fill="#5A8A3C" />
      <circle cx="12" cy="11" r="1.2" fill="#B8860B" />
      <circle cx="16" cy="11" r="1.2" fill="#B8860B" />
      <circle cx="12" cy="14" r="1.2" fill="#B8860B" />
      <circle cx="16" cy="14" r="1.2" fill="#B8860B" />
      <circle cx="12" cy="17" r="1.2" fill="#B8860B" />
      <circle cx="16" cy="17" r="1.2" fill="#B8860B" />
      <circle cx="14" cy="20" r="1.2" fill="#B8860B" />
    </svg>;
}
function WheatIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <line x1="14" y1="24" x2="14" y2="6" stroke="#C8A84B" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="14" cy="8" rx="3" ry="4" fill="#D4A017" opacity="0.9" />
      <ellipse cx="10" cy="12" rx="2.5" ry="3.5" fill="#C8A84B" opacity="0.85" transform="rotate(-20 10 12)" />
      <ellipse cx="18" cy="12" rx="2.5" ry="3.5" fill="#C8A84B" opacity="0.85" transform="rotate(20 18 12)" />
      <ellipse cx="11" cy="17" rx="2" ry="3" fill="#B8960A" opacity="0.8" transform="rotate(-15 11 17)" />
      <ellipse cx="17" cy="17" rx="2" ry="3" fill="#B8960A" opacity="0.8" transform="rotate(15 17 17)" />
    </svg>;
}
function WineIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M10 5 h8 l-2 8 a4 4 0 0 1-4 0 z" fill="#7B2D8B" opacity="0.9" />
      <rect x="13" y="13" width="2" height="6" fill="#7B2D8B" opacity="0.8" />
      <rect x="10" y="19" width="8" height="1.5" rx="0.75" fill="#5A1F6B" />
    </svg>;
}
function CocoaIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="15" rx="7" ry="9" fill="#5C3317" opacity="0.9" />
      <ellipse cx="14" cy="15" rx="4" ry="6" fill="#3D1F0D" opacity="0.6" />
      <line x1="14" y1="6" x2="14" y2="3" stroke="#5A8A3C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="3" x2="17" y2="1" stroke="#5A8A3C" strokeWidth="1.2" strokeLinecap="round" />
    </svg>;
}
function OilIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="9" y="12" width="10" height="12" rx="2" fill="#2A2A2A" opacity="0.9" />
      <rect x="12" y="8" width="4" height="5" rx="1" fill="#3A3A3A" />
      <rect x="13" y="5" width="2" height="4" rx="1" fill="#555" />
      <rect x="10" y="17" width="8" height="2" rx="1" fill="#1A1A1A" opacity="0.5" />
    </svg>;
}
function RiceIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="10" cy="10" rx="2" ry="4" fill="#E8DCC8" opacity="0.9" transform="rotate(-20 10 10)" />
      <ellipse cx="14" cy="8" rx="2" ry="4" fill="#E8DCC8" opacity="0.9" />
      <ellipse cx="18" cy="10" rx="2" ry="4" fill="#E8DCC8" opacity="0.9" transform="rotate(20 18 10)" />
      <ellipse cx="12" cy="16" rx="2" ry="4" fill="#D4C4A8" opacity="0.85" transform="rotate(-10 12 16)" />
      <ellipse cx="16" cy="16" rx="2" ry="4" fill="#D4C4A8" opacity="0.85" transform="rotate(10 16 16)" />
    </svg>;
}
function TeaIcon({
  size = 28
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M8 14 h12 l-2 8 H10 z" fill="#4A7C3F" opacity="0.9" />
      <path d="M20 16 q4 0 4 3 q0 3-4 3" stroke="#4A7C3F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="11" y="22" width="6" height="1.5" rx="0.75" fill="#3A6030" />
      <path d="M12 12 q1-3 2-5 q1 3 2 5" stroke="#5A8A3C" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>;
}
const RWA_REGIONSMeta = [{
  icon: CoffeeBeanIcon
}, {
  icon: CornIcon
}, {
  icon: WheatIcon
}, {
  icon: WineIcon
}, {
  icon: CocoaIcon
}, {
  icon: OilIcon
}, {
  icon: RiceIcon
}, {
  icon: TeaIcon
}, {
  icon: TeaIcon
}];
const STATSMeta = [{
  icon: Globe,
  value: '10',
  label: 'Regions'
}, {
  icon: Coins,
  value: '960+',
  label: 'Seasonal Coins'
}, {
  icon: TrendingUp,
  value: '9',
  label: 'Edition Launches'
}, {
  icon: Shield,
  value: '100%',
  label: 'On-Chain'
}];
export default function RwaPage() {
  const site = 'https://thetokengame.xyz';
  const url = `${site}/rwa`;
  const title = 'The Token Game — Real-World Assets';
  const description = 'The Token Game is evolving into a global micro-economy. Every region will soon be backed by a tangible, real-world commodity — bridging digital gaming with the physical world.';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
      </Helmet>
      <main className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-24 pb-20 px-4">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10" style={{
            background: 'radial-gradient(circle, #BF5FFF, transparent 70%)'
          }} />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full" style={{
            background: 'radial-gradient(circle, #D4A01722, transparent 70%)'
          }} />
            <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#BF5FFF 1px, transparent 1px), linear-gradient(90deg, #BF5FFF 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: 'easeOut' as const
          }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <MapPin size={13} />
                Real-World Assets
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
                The Token Game —{' '}
                <span style={{
                background: 'linear-gradient(135deg, #D4A017, #F5C842)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                  Real-World Assets
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto leading-relaxed mb-10">
                The Token Game is evolving into a global micro-economy. Soon, every region in the game will be backed by a tangible, real-world asset — creating a bridge between the digital world of gaming and the physical world of commodities.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/coins" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105" style={{
                background: 'linear-gradient(135deg, #BF5FFF, #ff5fef)',
                boxShadow: '0 0 30px #BF5FFF44'
              }}>
                  Browse All Coins
                  <ArrowRight size={16} />
                </Link>
                <Link to="/roadmap" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-white/20 text-foreground/70 hover:text-foreground hover:border-white/40 transition-all">
                  See the Roadmap
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y border-white/10 bg-white/[0.02] py-10 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATSMeta.map((stat, i) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 16
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: 'easeOut' as const
            }} className="text-center">
                  <stat.icon size={20} className="mx-auto mb-2 text-primary opacity-70" />
                  <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-foreground/50">{stat.label}</div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* ── What is RWA ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            ease: 'easeOut' as const
          }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Digital Gaming Meets{' '}
                <span style={{
                background: 'linear-gradient(135deg, #D4A017, #F5C842)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                  Physical Commodities
                </span>
              </h2>
              <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
                Below are the regions and the real-world assets we are exploring to tokenise. Each commodity was chosen for its deep cultural and economic connection to its region.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
              icon: Globe,
              title: 'Rooted in Reality',
              body: 'Every regional coin will be anchored to a commodity that defines that region\'s economy and culture — coffee in South America, wheat in Australia, rice in Asia.'
            }, {
              icon: TrendingUp,
              title: 'Real Value, On-Chain',
              body: 'By linking digital coins to physical commodities, The Token Game creates a micro-economy with genuine real-world backing — not just speculation.'
            }, {
              icon: Shield,
              title: 'Coming Soon',
              body: 'The RWA layer is in active development. Each region\'s asset backing will roll out progressively as the ecosystem matures.'
            }].map((card, i) => <motion.div key={card.title} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: 'easeOut' as const
            }} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/30 transition-colors">
                  <card.icon size={22} className="text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{card.body}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* ── Region & Asset Grid ── */}
        <section className="py-4 pb-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            ease: 'easeOut' as const
          }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">9 Regions. 9 Assets.</h2>
              <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
                Each region is paired with the commodity that defines its land, its people, and its place in the global economy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rwa.RWA_REGIONS.map((region, i) => {
              const Icon = RWA_REGIONSMeta[i].icon;
              return <motion.div key={region.name} initial={{
                opacity: 0,
                y: 24
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: 'easeOut' as const
              }}>
                    <div className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{region.flag}</span>
                          <div>
                            <div className="font-bold text-lg leading-tight">{region.name}</div>
                            <Link to={region.href} className="text-xs text-foreground/40 hover:text-primary transition-colors">
                              View edition →
                            </Link>
                          </div>
                        </div>
                        {/* Commodity icon */}
                        <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{
                      background: `${region.iconBg}CC`,
                      border: `1px solid ${region.accent}30`
                    }}>
                          <Icon size={26} />
                        </div>
                      </div>

                      {/* Commodity badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{
                      background: `${region.accent}18`,
                      color: region.accent,
                      border: `1px solid ${region.accent}35`
                    }}>
                          {region.commodity}
                        </div>
                        <div className="inline-flex items-center gap-1 text-xs text-foreground/40 border border-white/10 px-2 py-1 rounded-full">
                          <Clock size={10} />
                          Coming Soon
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-foreground/55 text-sm leading-relaxed flex-1">
                        {region.commodityDetail}
                      </p>
                    </div>
                  </motion.div>;
            })}
            </div>
          </div>
        </section>

        {/* ── Community Note ── */}
        <section className="py-16 px-4 border-t border-white/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            ease: 'easeOut' as const
          }} className="rounded-2xl border p-8 md:p-10 text-center" style={{
            background: 'linear-gradient(135deg, #D4A01710, #BF5FFF08)',
            borderColor: '#D4A01730'
          }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{
              background: '#D4A01720',
              color: '#D4A017',
              border: '1px solid #D4A01740'
            }}>
                A Note for the Community
              </div>
              <blockquote className="text-xl md:text-2xl font-semibold text-foreground/85 leading-relaxed mb-6 italic">
                "The Token Game is going global — literally. We are building a bridge between digital gaming and the real world. Each of our regional coins will soon be backed by a tangible, real-world asset. This is the next step in building our micro-economy."
              </blockquote>
              <p className="text-foreground/50 text-base">
                Explore the regions above and see what's coming. The future of The Token Game is rooted in the real world.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Link to="/coins" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105" style={{
                background: 'linear-gradient(135deg, #BF5FFF, #ff5fef)',
                boxShadow: '0 0 30px #BF5FFF44'
              }}>
                  View All Coins
                  <ArrowRight size={16} />
                </Link>
                <a href="https://discord.gg/FvwyWzbnj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold border border-white/20 text-foreground/70 hover:text-foreground hover:border-white/40 transition-all">
                  Join the Community
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>;
}
