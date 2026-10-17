/**
 * /invest — Tienko Ecosystem Investment & Value Proposition Page
 *
 * Explains the ecosystem's value proposition for investors:
 *  - What the Tienko ecosystem is
 *  - USGC, NYC, TIEN token roles
 *  - Revenue streams & tokenomics
 *  - Staking yields
 *  - Roadmap milestones
 *  - CTA to stake / whitelist
 */

import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Link } from "react-router";
import { TrendingUp, Shield, Coins, Globe, Zap, Users, ArrowRight, CheckCircle, BarChart3, Lock, Star, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOKENS = [{
  symbol: 'USGC',
  name: 'US Gold Coin',
  color: '#FFD700',
  gradient: 'from-yellow-500/20 to-yellow-600/5',
  border: 'border-yellow-500/30',
  role: 'Store of Value',
  desc: 'The flagship asset of the Tienko ecosystem. USGC is backed by real-world gold commodity exposure and serves as the primary reserve currency across all Tienko platforms.',
  features: ['Gold-backed value proposition', 'Primary staking asset', 'Cross-platform utility', 'Deflationary burn mechanism'],
  apy: '18.5%'
}, {
  symbol: 'NYC',
  name: 'New Yen Coin',
  color: '#F59E0B',
  gradient: 'from-amber-500/20 to-amber-600/5',
  border: 'border-amber-500/30',
  role: 'Yield Token',
  desc: 'NYC is the yield-bearing token of the ecosystem. Stakers earn NYC as rewards across all Tienko platforms, creating a flywheel of demand as the ecosystem grows.',
  features: ['Staking reward token', 'Governance rights', 'Fee sharing', 'Liquidity incentives'],
  apy: '24.0%'
}, {
  symbol: 'TIEN',
  name: 'Tienko',
  color: '#BF5FFF',
  gradient: 'from-primary/20 to-primary/5',
  border: 'border-primary/30',
  role: 'Ecosystem Token',
  desc: 'TIEN is the native utility token powering the entire Tienko ecosystem — from The Token Game to tienko.io and tienko.ltd. Holders access premium features and governance.',
  features: ['Platform access gating', 'Premium feature unlocks', 'DAO governance', 'Revenue share'],
  apy: '32.0%'
}];
const REVENUE_STREAMS = [{
  icon: <Coins size={20} />,
  title: 'Transaction Fees',
  desc: 'Every trade, transfer, and in-game purchase generates fees that flow into The Stash and staker rewards.'
}, {
  icon: <Globe size={20} />,
  title: 'Platform Subscriptions',
  desc: 'Tiered access to tienko.io (L30) and tienko.ltd (L75) generates recurring subscription revenue.'
}, {
  icon: <BarChart3 size={20} />,
  title: 'Staking Protocol Fees',
  desc: 'A small protocol fee on all staking positions funds ongoing development and ecosystem growth.'
}, {
  icon: <Star size={20} />,
  title: 'NFT & Bingo dApp',
  desc: 'The Token Game Bingo dApp, auctions, and NFT minting generate direct revenue distributed to stakers.'
}, {
  icon: <Users size={20} />,
  title: 'Referral Network',
  desc: 'The referral program drives organic growth, with protocol fees on referred staking positions.'
}, {
  icon: <Zap size={20} />,
  title: 'RWA Integration',
  desc: 'Real-world asset tokenization on the Tienko platform generates licensing and integration fees.'
}];
const MILESTONES = [{
  phase: 'Phase 1',
  label: 'Foundation',
  status: 'complete',
  items: ['Token launches on Raydium', '16 edition coin collections', 'The Stash fee pool', 'Bingo dApp v1']
}, {
  phase: 'Phase 2',
  label: 'Staking',
  status: 'active',
  items: ['Streamflow staking pools', 'USGC & NYC pools live', 'Referral program', 'Staking dashboard']
}, {
  phase: 'Phase 3',
  label: 'Expansion',
  status: 'upcoming',
  items: ['tienko.io platform launch', 'DAO governance', 'LP pools (USGC/NYC)', 'Cross-chain bridge']
}, {
  phase: 'Phase 4',
  label: 'Ecosystem',
  status: 'upcoming',
  items: ['tienko.ltd investment platform', 'RWA tokenization', 'Institutional staking', 'Global expansion']
}];
const WHY_INVEST = [{
  icon: <Shield size={20} />,
  title: 'Real Utility',
  desc: 'Tokens power actual platforms with real users — not speculative promises.'
}, {
  icon: <TrendingUp size={20} />,
  title: 'Multiple Revenue Streams',
  desc: 'Six distinct revenue sources create resilient, compounding yield for stakers.'
}, {
  icon: <Lock size={20} />,
  title: 'Streamflow Security',
  desc: 'All staking is secured by Streamflow\'s battle-tested smart contract infrastructure.'
}, {
  icon: <Users size={20} />,
  title: 'Growing Community',
  desc: 'The Token Game has an active, engaged community across 16 global editions.'
}, {
  icon: <Coins size={20} />,
  title: 'Deflationary Mechanics',
  desc: 'Token burns and fee sinks create long-term deflationary pressure on supply.'
}, {
  icon: <Globe size={20} />,
  title: 'Cross-Platform Sync',
  desc: 'The tienko-sdk.js enables partner sites to sync coins and rewards seamlessly.'
}];

// ─── Components ───────────────────────────────────────────────────────────────

function TokenCard({
  token
}: {
  token: typeof TOKENS[0];
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.4
  }} className={`rounded-2xl border ${token.border} bg-gradient-to-br ${token.gradient} p-6 flex flex-col gap-4`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-black text-foreground">{token.symbol}</span>
            <Badge variant="outline" className="text-xs" style={{
            borderColor: token.color + '50',
            color: token.color
          }}>
              {token.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{token.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-foreground">{token.apy}</div>
          <div className="text-xs text-muted-foreground">Staking APY</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{token.desc}</p>

      <ul className="flex flex-col gap-1.5">
        {token.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle size={12} style={{
          color: token.color
        }} className="flex-shrink-0" />
            <span>{f}</span>
          </li>)}
      </ul>

      <Button asChild className="w-full font-bold" style={{
      backgroundColor: token.color + '20',
      color: token.color,
      borderColor: token.color + '40'
    }} variant="outline">
        <Link to="/staking">
          Stake {token.symbol} <ArrowRight size={14} className="ml-2" />
        </Link>
      </Button>
    </motion.div>;
}
function MilestoneCard({
  m
}: {
  m: typeof MILESTONES[0];
}) {
  const statusStyles = {
    complete: 'bg-accent/20 text-accent border-accent/30',
    active: 'bg-primary/20 text-primary border-primary/30',
    upcoming: 'bg-muted text-muted-foreground border-border/30'
  };
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} viewport={{
    once: true
  }} className={`rounded-2xl border p-5 ${m.status === 'active' ? 'border-primary/40 bg-primary/5' : 'border-border/20 bg-card'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-muted-foreground">{m.phase}</span>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[m.status as keyof typeof statusStyles]}`}>
          {m.status === 'active' ? 'In Progress' : m.status}
        </span>
      </div>
      <h3 className="font-black text-foreground mb-3">{m.label}</h3>
      <ul className="flex flex-col gap-1.5">
        {m.items.map(item => <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronRight size={12} className={m.status === 'complete' ? 'text-accent' : m.status === 'active' ? 'text-primary' : 'text-muted-foreground'} />
            {item}
          </li>)}
      </ul>
    </motion.div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvestPage() {
  return <>
      <Helmet>
        <title>Invest in the Tienko Ecosystem — The Token Game</title>
        <meta name="description" content="Discover the Tienko ecosystem investment thesis. USGC, NYC, and TIEN tokens offer up to 45% APY staking yields backed by real platform revenue across The Token Game, tienko.io, and tienko.ltd." />
        <link rel="canonical" href="https://thetokengame.xyz/invest" />
        <meta property="og:title" content="Invest in the Tienko Ecosystem" />
        <meta property="og:description" content="Up to 45% APY. Real utility. Six revenue streams. Discover why USGC, NYC, and TIEN are built differently." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:url" content="https://thetokengame.xyz/invest" />
      </Helmet>

      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/20 bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-28">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => <motion.div key={i} className="absolute rounded-full" style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            left: `${-10 + i * 25}%`,
            top: `${-20 + i * 10}%`,
            background: `radial-gradient(circle, hsl(276 100% 69% / 0.06) 0%, transparent 70%)`
          }} animate={{
            scale: [1, 1.05, 1]
          }} transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 1.2
          }} />)}
          </div>

          <div className="relative mx-auto max-w-5xl px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <Badge className="mb-5 bg-primary/20 text-primary border-primary/30 px-5 py-1.5 text-sm">
                <TrendingUp size={13} className="mr-1.5" /> Tienko Ecosystem
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-foreground mb-5 leading-tight">
                Built for<br />
                <span className="text-primary">real returns.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                The Tienko ecosystem isn't another speculative token. It's a multi-platform economy with real users, real revenue, and staking yields up to <span className="text-accent font-bold">45% APY</span>.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button size="lg" asChild className="bg-primary text-primary-foreground font-bold px-8 text-base">
                  <Link to="/staking">
                    Start Staking <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/whitelist">
                    <Shield size={16} className="mr-2" /> Join Whitelist
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/tokenomics">
                    <BarChart3 size={16} className="mr-2" /> Tokenomics
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key metrics */}
        <section className="border-b border-border/20 bg-card/50 py-10">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[{
              value: '$5.08M',
              label: 'Total Value Locked'
            }, {
              value: '45%',
              label: 'Max Staking APY'
            }, {
              value: '3,847',
              label: 'Active Stakers'
            }, {
              value: '16',
              label: 'Global Editions'
            }].map(stat => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 10
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }}>
                  <div className="text-3xl md:text-4xl font-black text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Why invest */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">Why the Tienko ecosystem?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Six reasons this is built differently from the rest of the market.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_INVEST.map((item, i) => <motion.div key={item.title} initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.07
          }} className="rounded-2xl border border-border/20 bg-card p-5 flex gap-4">
                <div className="flex-shrink-0 rounded-xl bg-primary/15 p-3 text-primary h-fit">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>)}
          </div>
        </section>

        {/* Token breakdown */}
        <section className="border-t border-border/20 bg-card/30 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">The Token Trio</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Three tokens. Three roles. One interconnected economy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOKENS.map(token => <TokenCard key={token.symbol} token={token} />)}
            </div>
          </div>
        </section>

        {/* Revenue streams */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">Six revenue streams</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Staking yields are backed by real platform revenue — not just token inflation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVENUE_STREAMS.map((stream, i) => <motion.div key={stream.title} initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.07
          }} className="rounded-2xl border border-border/20 bg-card p-5 flex gap-4">
                <div className="flex-shrink-0 rounded-xl bg-accent/15 p-3 text-accent h-fit">{stream.icon}</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground">{stream.desc}</p>
                </div>
              </motion.div>)}
          </div>
        </section>

        {/* Roadmap */}
        <section className="border-t border-border/20 bg-card/30 py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">Roadmap</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">A clear path from today's foundation to full ecosystem maturity.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MILESTONES.map(m => <MilestoneCard key={m.phase} m={m} />)}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" asChild>
                <Link to="/roadmap">
                  Full roadmap <ExternalLink size={13} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/20 bg-gradient-to-r from-primary/10 via-background to-accent/10 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                Ready to put your tokens to work?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Stake USGC, NYC, or TIEN today. Earn passive rewards from real platform revenue. Refer others and earn a cut of their yields — forever.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button size="lg" asChild className="bg-primary text-primary-foreground font-bold px-8">
                  <Link to="/staking">
                    Start Staking <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/staking/referral">
                    <Users size={16} className="mr-2" /> Referral Program
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/rwa">
                    <Globe size={16} className="mr-2" /> RWA Assets
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>;
}
