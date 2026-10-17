/**
 * /staking — Tienko Ecosystem Staking Dashboard
 *
 * Network: Solana Mainnet
 *
 * Protocols:
 *  - Streamflow (primary, live pool wired)
 *  - Jito       (TODO stub)
 *  - Marinade   (TODO stub)
 *
 * Streamflow pool:
 *   Pool address:  Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5
 *   Token mint:    7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5
 *   UI link:       https://app.streamflow.finance/staking/solana/mainnet/Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5/7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5
 */

import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Link } from "react-router";
import { TrendingUp, Coins, Users, Zap, ArrowRight, Clock, Gift, Shield, ChevronDown, ChevronUp, ExternalLink, Wallet, RefreshCw, Star, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/lib/wallet';
import TienkoWalletButton from '@/components/TienkoWalletButton';
import { useTienkoWallet } from '@/lib/tienko-wallet';

// ─── Constants ────────────────────────────────────────────────────────────────

const STREAMFLOW_BASE = 'https://app.streamflow.finance/staking/solana/mainnet';

/**
 * Protocol configuration — add a new entry here to support a new protocol.
 * Each entry needs: id, name, logo, url, status, and optionally pools[].
 */
const PROTOCOLS = [{
  id: 'streamflow',
  name: 'Streamflow',
  tagline: 'Token streaming & staking on Solana',
  docsUrl: 'https://docs.streamflow.finance/',
  status: 'live' as const,
  pools: [{
    id: 'streamflow-main',
    poolAddress: 'Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5',
    tokenMint: '7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5',
    // Full Streamflow UI link for this pool
    stakeUrl: `${STREAMFLOW_BASE}/Chue18q1vDXqrCUQmsrSmVDTSzhDky3be3uEEuAoQQV5/7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5`,
    label: 'Primary Pool',
    // TODO: fetch live APY/TVL from Streamflow API once available
    apy: 18.5,
    tvl: null as number | null,
    // null = not yet fetched
    minStake: 100,
    lockPeriods: [{
      days: 30,
      apyMultiplier: 1.0
    }, {
      days: 90,
      apyMultiplier: 1.25
    }, {
      days: 180,
      apyMultiplier: 1.5
    }, {
      days: 365,
      apyMultiplier: 2.0
    }]
  }]
}, {
  id: 'jito',
  name: 'Jito',
  tagline: 'MEV-boosted liquid staking on Solana',
  docsUrl: 'https://www.jito.network/',
  status: 'coming_soon' as const,
  pools: []
  // TODO: Integrate Jito SDK or API here
  // import { JitoStakingClient } from '@jito-foundation/staking-sdk';
  // const client = new JitoStakingClient({ rpcUrl: SOLANA_RPC_URL });
  // const pool = await client.getStakePool(JITO_POOL_ADDRESS);
}, {
  id: 'marinade',
  name: 'Marinade Finance',
  tagline: 'Liquid staking with mSOL on Solana',
  docsUrl: 'https://marinade.finance/',
  status: 'coming_soon' as const,
  pools: []
  // TODO: Integrate Marinade SDK or API here
  // import { MarinadeClient } from '@marinade.finance/marinade-ts-sdk';
  // const marinade = new MarinadeClient({ connection, wallet });
  // const state = await marinade.getMarinadeState();
}] as const;
type Protocol = typeof PROTOCOLS[number];

// ─── Types ────────────────────────────────────────────────────────────────────

interface PoolSummary {
  totalTvl: number;
  totalStakers: number;
  avgApy: number;
  lastUpdated: string;
}
interface StakingPosition {
  poolId: string;
  tokenSymbol: string;
  amountStaked: number;
  lockDays: number;
  stakedAt: string;
  unlocksAt: string;
  pendingRewards: number;
  rewardToken: string;
  apy: number;
  valueUsd: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
function fmtUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}
function daysUntil(dateStr: string) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}
function lockLabel(days: number) {
  if (days >= 365) return '1 Year';
  if (days >= 180) return '6 Months';
  if (days >= 90) return '3 Months';
  return '30 Days';
}

// ─── Streamflow Pool Card ─────────────────────────────────────────────────────

function StreamflowPoolCard({
  pool
}: {
  pool: typeof PROTOCOLS[0]['pools'][0];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
  }} className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-600/5 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-black text-foreground">{pool.label}</span>
            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">Live on Solana</Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]" title={pool.poolAddress}>
            {pool.poolAddress.slice(0, 8)}…{pool.poolAddress.slice(-6)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-foreground">{pool.apy}%</div>
          <div className="text-xs text-muted-foreground">APY</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 text-sm">
        <div className="flex-1 rounded-lg bg-background/40 p-2 text-center">
          <div className="font-bold text-foreground">{pool.apy}%</div>
          <div className="text-xs text-muted-foreground">Base APY</div>
        </div>
        <div className="flex-1 rounded-lg bg-background/40 p-2 text-center">
          <div className="font-bold text-foreground">{pool.minStake}</div>
          <div className="text-xs text-muted-foreground">Min stake</div>
        </div>
        <div className="flex-1 rounded-lg bg-background/40 p-2 text-center">
          <div className="font-bold text-foreground">{pool.tvl !== null ? fmtUsd(pool.tvl) : '—'}</div>
          <div className="text-xs text-muted-foreground">TVL</div>
        </div>
      </div>

      {/* Lock periods */}
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span>Lock period multipliers</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && <div className="grid grid-cols-2 gap-2">
          {pool.lockPeriods.map(lp => <div key={lp.days} className="rounded-lg border border-border/20 bg-background/30 p-2 text-center">
              <div className="text-xs font-bold text-foreground">{lockLabel(lp.days)}</div>
              <div className="text-xs text-accent">{fmt(pool.apy * lp.apyMultiplier, 1)}% APY</div>
              <div className="text-xs text-muted-foreground">{lp.apyMultiplier}x</div>
            </div>)}
        </div>}

      {/* Tooltip helper */}
      <div className="relative">
        <button onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Info size={12} /> How does staking work here?
        </button>
        {showTooltip && <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-border/30 bg-card p-3 text-xs text-muted-foreground shadow-xl z-10">
            Click <strong className="text-foreground">"Stake Now"</strong> to manage your stake on Streamflow's secure platform. Your tokens are locked in a Solana smart contract — Streamflow handles custody, rewards, and unlocking.
          </div>}
      </div>

      {/* CTA */}
      <a href={pool.stakeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground font-bold py-2.5 px-4 hover:bg-primary/90 transition-colors">
        Stake Now on Streamflow <ExternalLink size={14} />
      </a>

      <p className="text-xs text-center text-muted-foreground">
        Staking is managed on Streamflow's secure platform
      </p>
    </motion.div>;
}

// ─── Protocol Section ─────────────────────────────────────────────────────────

function ProtocolSection({
  protocol
}: {
  protocol: Protocol;
}) {
  const isLive = protocol.status === 'live';
  return <div className={`rounded-2xl border p-6 ${isLive ? 'border-primary/20 bg-card' : 'border-border/10 bg-card/40 opacity-70'}`}>
      {/* Protocol header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isLive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {protocol.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-foreground">{protocol.name}</span>
              <Badge className={isLive ? 'bg-accent/20 text-accent border-accent/30 text-xs' : 'bg-muted text-muted-foreground border-border/20 text-xs'}>
                {isLive ? 'Live' : 'Coming Soon'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{protocol.tagline}</p>
          </div>
        </div>
        <a href={protocol.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
          Docs <ExternalLink size={10} />
        </a>
      </div>

      {/* Live pools */}
      {isLive && protocol.pools.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocol.pools.map(pool => <StreamflowPoolCard key={pool.id} pool={pool} />)}
        </div>}

      {/* Coming soon stub */}
      {!isLive && <div className="rounded-xl border border-dashed border-border/20 bg-background/20 p-6 text-center">
          <Clock size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {protocol.name} integration coming soon.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {/* TODO: Integrate {protocol.name} SDK or API here */}
            Pool configuration will appear here once deployed.
          </p>
        </div>}
    </div>;
}

// ─── Position Card ────────────────────────────────────────────────────────────

function PositionCard({
  pos
}: {
  pos: StakingPosition;
}) {
  const daysLeft = daysUntil(pos.unlocksAt);
  const totalDays = pos.lockDays;
  const elapsed = totalDays - daysLeft;
  const progress = Math.min(100, Math.round(elapsed / totalDays * 100));
  return <div className="rounded-xl border border-border/20 bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-foreground">{pos.tokenSymbol}</span>
          <span className="ml-2 text-sm text-muted-foreground">{lockLabel(pos.lockDays)} lock</span>
        </div>
        <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
          {pos.apy}% APY
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Staked</div>
          <div className="font-bold text-foreground">{fmt(pos.amountStaked, 0)}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Rewards</div>
          <div className="font-bold text-accent">+{fmt(pos.pendingRewards, 2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Unlocks in</div>
          <div className="font-bold text-foreground">{daysLeft}d</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Lock progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 16
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} className="rounded-2xl border border-border/20 bg-card p-5 flex items-center gap-4">
      <div className="rounded-xl bg-primary/15 p-3 text-primary">{icon}</div>
      <div>
        <div className="text-2xl font-black text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {sub && <div className="text-xs text-accent mt-0.5">{sub}</div>}
      </div>
    </motion.div>;
}

// ─── Stash Tracker ────────────────────────────────────────────────────────────

function StashTracker() {
  const [stash, setStash] = useState<{
    stashSol: number;
    milestoneNext: number;
    milestoneLabel: string;
  } | null>(null);
  useEffect(() => {
    fetch('/api/stash').then(r => r.json()).then(setStash).catch(() => {});
  }, []);
  const sol = stash?.stashSol ?? 0;
  const next = stash?.milestoneNext ?? 100;
  const pct = Math.min(100, Math.round(sol / next * 100));
  return <div className="rounded-2xl border border-border/20 bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Gift size={18} className="text-primary" />
        <h3 className="font-bold text-foreground">The Stash</h3>
        <span className="text-xs text-muted-foreground ml-auto">Fee pool → staker payouts</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl bg-primary/10 p-3 text-center">
          <div className="text-2xl font-black text-foreground">{fmt(sol, 2)}</div>
          <div className="text-xs text-muted-foreground">SOL accumulated</div>
        </div>
        <div className="rounded-xl bg-accent/10 p-3 text-center">
          <div className="text-2xl font-black text-accent">{pct}%</div>
          <div className="text-xs text-muted-foreground">to next milestone</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{fmt(sol, 2)} SOL</span>
          <span>{stash?.milestoneLabel ?? 'Next payout'}: {fmt(next, 0)} SOL</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Transaction fees from The Token Game ecosystem flow into The Stash. When milestones are hit, stakers receive proportional payouts based on their staked balance.
      </p>

      <Link to="/stash" className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline">
        View full Stash details <ArrowRight size={12} />
      </Link>
    </div>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StakingPage() {
  const {
    publicKey,
    connected,
    openModal
  } = useWallet();
  const {
    connected: tienkoConnected,
    usgcBalance,
    balanceLoading,
    refreshBalance: refreshUsgc,
  } = useTienkoWallet();
  const [summary, setSummary] = useState<PoolSummary | null>(null);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(false);
  useEffect(() => {
    setLoadingPools(true);
    fetch('/api/staking/pools').then(r => r.json()).then(data => {
      setSummary(data.summary);
    }).catch(() => {}).finally(() => setLoadingPools(false));
  }, []);
  useEffect(() => {
    if (!publicKey) return;
    setLoadingPositions(true);
    fetch(`/api/staking/position?wallet=${publicKey}`).then(r => r.json()).then(data => setPositions(data.positions ?? [])).catch(() => {}).finally(() => setLoadingPositions(false));
  }, [publicKey]);
  const totalPending = positions.reduce((s, p) => s + p.pendingRewards, 0);
  const totalValueUsd = positions.reduce((s, p) => s + p.valueUsd, 0);
  return <>
      <Helmet>
        <title>Staking — The Token Game | Solana Network</title>
        <meta name="description" content="Stake tokens in the Tienko ecosystem on Solana. Earn rewards via Streamflow staking pools. Jito and Marinade Finance integrations coming soon." />
        <link rel="canonical" href="https://thetokengame.xyz/staking" />
        <meta property="og:title" content="Staking — The Token Game" />
        <meta property="og:description" content="Stake tokens on Solana via Streamflow. Earn up to 45% APY with flexible lock periods." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/staking" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Staking — The Token Game" />
        <meta name="twitter:description" content="Stake tokens on Solana via Streamflow. Earn up to 45% APY with flexible lock periods." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/staking#webpage',
          name: 'Staking — The Token Game',
          url: 'https://thetokengame.xyz/staking',
          description: 'Stake tokens in the Tienko ecosystem on Solana. Earn rewards via Streamflow staking pools.',
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-border/20 bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24">
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => <motion.div key={i} className="absolute rounded-full bg-primary/5" style={{
            width: 200 + i * 80,
            height: 200 + i * 80,
            left: `${10 + i * 15}%`,
            top: `${5 + i % 3 * 20}%`
          }} animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }} transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.7
          }} />)}
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              {/* Network badge */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block mr-1.5 animate-pulse" />
                  Solana Network — Mainnet
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
                Stake. Earn. <span className="text-primary">Compound.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Put your tokens to work on <span className="text-foreground font-semibold">Solana</span>. Earn rewards via Streamflow staking pools — with Jito and Marinade Finance coming soon.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <a href={PROTOCOLS[0].pools[0].stakeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground font-bold px-8 py-3 hover:bg-primary/90 transition-colors">
                  Stake Now on Streamflow <ExternalLink size={16} />
                </a>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/staking/referral">
                    <Users size={16} className="mr-2" /> Referral Program
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/invest">
                    <TrendingUp size={16} className="mr-2" /> Why Invest?
                  </Link>
                </Button>
              </div>

              {/* Tienko Wallet USGC balance panel */}
              <div className="mt-8 flex justify-center">
                {tienkoConnected ? (
                  <div className="inline-flex items-center gap-4 rounded-xl border border-accent/30 bg-accent/8 px-5 py-3">
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">Tienko Wallet — USGC Balance</p>
                      <p className="text-xl font-black text-accent">
                        {balanceLoading ? '…' : usgcBalance !== null ? usgcBalance.toLocaleString() : '—'}
                        <span className="text-sm font-semibold ml-1 text-muted-foreground">USGC</span>
                      </p>
                    </div>
                    <button
                      onClick={refreshUsgc}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Refresh USGC balance"
                    >
                      <RefreshCw size={14} className={balanceLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">Connect Tienko Wallet to see your USGC balance</p>
                    <TienkoWalletButton size="default" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Summary stats ── */}
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<TrendingUp size={20} />} label="Total Value Locked" value={summary ? fmtUsd(summary.totalTvl) : '—'} sub="Across all pools" />
            <StatCard icon={<Users size={20} />} label="Active Stakers" value={summary ? summary.totalStakers.toLocaleString() : '—'} />
            <StatCard icon={<Zap size={20} />} label="Average APY" value={summary ? `${summary.avgApy}%` : '—'} sub="Across active pools" />
            <StatCard icon={<Shield size={20} />} label="Network" value="Solana" sub="Mainnet · Streamflow secured" />
          </div>
        </section>

        {/* ── Main content ── */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <Tabs defaultValue="protocols">
            <TabsList className="mb-6 bg-card border border-border/20">
              <TabsTrigger value="protocols">Staking Protocols</TabsTrigger>
              <TabsTrigger value="positions">
                My Positions
                {positions.length > 0 && <span className="ml-1.5 rounded-full bg-primary/20 text-primary text-xs px-1.5">{positions.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="stash">The Stash</TabsTrigger>
            </TabsList>

            {/* ── Protocols tab ── */}
            <TabsContent value="protocols">
              {loadingPools ? <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                  <RefreshCw size={16} className="animate-spin" /> Loading pools…
                </div> : <div className="flex flex-col gap-6">
                  {PROTOCOLS.map(protocol => <ProtocolSection key={protocol.id} protocol={protocol} />)}
                </div>}

              {/* Info banner */}
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
                <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">How staking works:</strong> Click <em>Stake Now</em> to manage your stake directly on Streamflow's secure platform. All transactions happen on <strong className="text-foreground">Solana mainnet</strong>. Streamflow handles custody, reward distribution, and unlocking — your tokens never leave the on-chain smart contract.
                </div>
              </div>
            </TabsContent>

            {/* ── Positions tab ── */}
            <TabsContent value="positions">
              {!connected ? <div className="rounded-2xl border border-border/20 bg-card p-12 text-center">
                  <Wallet size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-bold text-foreground mb-2">Connect your wallet</h3>
                  <p className="text-muted-foreground mb-2">Connect to view your staking positions and pending rewards.</p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Positions staked via Streamflow will appear here once on-chain reads are wired.
                  </p>
                  <Button onClick={openModal} className="bg-primary text-primary-foreground font-bold">
                    Connect Wallet
                  </Button>
                </div> : loadingPositions ? <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                  <RefreshCw size={16} className="animate-spin" /> Loading positions…
                </div> : positions.length === 0 ? <div className="rounded-2xl border border-border/20 bg-card p-12 text-center">
                  <Coins size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-bold text-foreground mb-2">No active positions</h3>
                  <p className="text-muted-foreground mb-4">Stake tokens via Streamflow to start earning.</p>
                  <a href={PROTOCOLS[0].pools[0].stakeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground font-bold px-6 py-2.5 hover:bg-primary/90 transition-colors">
                    Stake on Streamflow <ExternalLink size={14} />
                  </a>
                </div> : <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                    <div className="rounded-xl bg-card border border-border/20 p-4 text-center">
                      <div className="text-2xl font-black text-foreground">{fmtUsd(totalValueUsd)}</div>
                      <div className="text-xs text-muted-foreground">Total staked value</div>
                    </div>
                    <div className="rounded-xl bg-card border border-border/20 p-4 text-center">
                      <div className="text-2xl font-black text-accent">{fmt(totalPending, 4)}</div>
                      <div className="text-xs text-muted-foreground">Pending rewards</div>
                    </div>
                    <div className="rounded-xl bg-card border border-border/20 p-4 text-center col-span-2 md:col-span-1">
                      <div className="text-2xl font-black text-foreground">{positions.length}</div>
                      <div className="text-xs text-muted-foreground">Active positions</div>
                    </div>
                  </div>

                  {positions.map((pos, i) => <PositionCard key={i} pos={pos} />)}

                  <div className="rounded-xl border border-border/20 bg-card/50 p-4 flex gap-3 mt-2">
                    <AlertCircle size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      To claim rewards or unstake, visit your position directly on{' '}
                      <a href={PROTOCOLS[0].pools[0].stakeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Streamflow <ExternalLink size={10} className="inline" />
                      </a>
                    </p>
                  </div>
                </div>}
            </TabsContent>

            {/* ── Stash tab ── */}
            <TabsContent value="stash">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StashTracker />

                <div className="rounded-2xl border border-border/20 bg-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-primary" />
                    <h3 className="font-bold text-foreground">How Stash Payouts Work</h3>
                  </div>
                  <ol className="flex flex-col gap-4">
                    {[{
                    step: '1',
                    title: 'Fees accumulate',
                    desc: 'Every transaction in The Token Game ecosystem contributes a small fee to The Stash.'
                  }, {
                    step: '2',
                    title: 'Milestone hit',
                    desc: 'When The Stash reaches a milestone (e.g. 100 SOL), a payout event is triggered.'
                  }, {
                    step: '3',
                    title: 'Stakers earn',
                    desc: 'Stakers receive proportional payouts based on their staked balance at snapshot time.'
                  }, {
                    step: '4',
                    title: 'Compound or withdraw',
                    desc: 'Claim rewards to your wallet or auto-compound back into your staking position.'
                  }].map(item => <li key={item.step} className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                          {item.step}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </li>)}
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ── Referral CTA ── */}
        <section className="border-t border-border/20 bg-gradient-to-r from-primary/10 via-background to-accent/10 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Star size={32} className="mx-auto mb-3 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
              Earn more by referring stakers
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Get up to <span className="text-accent font-bold">15% of your referrals' staking rewards</span> — forever. Climb from Bronze to Diamond tier as your network grows.
            </p>
            <Button size="lg" asChild className="bg-primary text-primary-foreground font-bold px-8">
              <Link to="/staking/referral">
                <Users size={16} className="mr-2" /> Join the Referral Program <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

      </main>
    </>;
}
