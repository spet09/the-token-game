/**
 * /staking/referral — Tienko Staking Referral Program
 *
 * Shows:
 *  - User's referral code + link (wallet-connected)
 *  - Tier system (Bronze → Diamond)
 *  - Leaderboard
 *  - How it works
 */

import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Link } from "react-router";
import { Users, Copy, Check, Trophy, Wallet, TrendingUp, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/components/ui/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferralTier {
  name: string;
  minReferrals: number;
  rewardPct: number;
  color: string;
  perks: string[];
}
interface ReferralStats {
  code: string;
  referrals: number;
  pendingRewards: number;
  totalEarned: number;
  tier: string;
  nextTierAt: number;
  referralLink: string;
}
interface LeaderboardEntry {
  rank: number;
  wallet: string;
  code: string;
  referrals: number;
  earned: number;
  tier: string;
}

// ─── Tier Card ────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  current
}: {
  tier: ReferralTier;
  current: boolean;
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 16
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all ${current ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/30' : 'border-border/20 bg-card'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{
          backgroundColor: tier.color
        }} />
          <span className="font-black text-foreground">{tier.name}</span>
          {current && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Current</Badge>}
        </div>
        <span className="text-2xl font-black" style={{
        color: tier.color
      }}>{tier.rewardPct}%</span>
      </div>

      <div className="text-xs text-muted-foreground">
        {tier.minReferrals === 1 ? 'First referral' : `${tier.minReferrals}+ referrals`}
      </div>

      <ul className="flex flex-col gap-1.5">
        {tier.perks.map(perk => <li key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check size={11} className="text-accent flex-shrink-0" />
            <span>{perk}</span>
          </li>)}
      </ul>
    </motion.div>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StakingReferralPage() {
  const {
    publicKey,
    connected,
    openModal
  } = useWallet();
  const {
    toast
  } = useToast();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [tiers, setTiers] = useState<ReferralTier[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const url = publicKey ? `/api/staking/referral?wallet=${publicKey}` : '/api/staking/referral';
    setLoading(true);
    fetch(url).then(r => r.json()).then(data => {
      if (data.stats) setStats(data.stats);
      setTiers(data.tiers ?? []);
      setLeaderboard(data.leaderboard ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [publicKey]);
  function copyLink() {
    const link = stats?.referralLink ?? `https://thetokengame.xyz/staking?ref=${stats?.code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard.'
      });
      setTimeout(() => setCopied(false), 2000);
    });
  }
  const nextTier = tiers[tiers.findIndex(t => t.name === stats?.tier) + 1];
  const progressToNext = stats && nextTier ? Math.min(100, Math.round(stats.referrals / nextTier.minReferrals * 100)) : 100;
  const tierColors: Record<string, string> = {
    Bronze: '#cd7f32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Platinum: '#E5E4E2',
    Diamond: '#b9f2ff'
  };
  return <>
      <Helmet>
        <title>Referral Program — Staking | The Token Game</title>
        <meta name="description" content="Earn up to 15% of your referrals' staking rewards in the Tienko ecosystem. Climb from Bronze to Diamond tier and unlock exclusive perks." />
        <link rel="canonical" href="https://thetokengame.xyz/staking/referral" />
        <meta property="og:title" content="Referral Program — Staking | The Token Game" />
        <meta property="og:description" content="Earn up to 15% of your referrals' staking rewards. Climb from Bronze to Diamond tier." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/staking/referral" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Referral Program — Staking | The Token Game" />
        <meta name="twitter:description" content="Earn up to 15% of your referrals' staking rewards. Climb from Bronze to Diamond tier." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/staking/referral#webpage',
          name: 'Referral Program — Staking | The Token Game',
          url: 'https://thetokengame.xyz/staking/referral',
          description: "Earn up to 15% of your referrals' staking rewards in the Tienko ecosystem.",
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border/20 bg-gradient-to-b from-accent/10 via-background to-background py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }}>
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 px-4 py-1">
                <Users size={12} className="mr-1" /> Referral Program
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                Grow your network.<br />
                <span className="text-accent">Earn forever.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Refer stakers and earn a percentage of their staking rewards — permanently. The more you refer, the higher your tier and the bigger your cut.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col gap-12">

          {/* Referral code panel */}
          <section>
            <h2 className="text-xl font-black text-foreground mb-4">Your Referral Link</h2>
            {!connected ? <div className="rounded-2xl border border-border/20 bg-card p-10 text-center">
                <Wallet size={36} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Connect your wallet to get your unique referral code.</p>
                <Button onClick={openModal} className="bg-primary text-primary-foreground font-bold">
                  Connect Wallet
                </Button>
              </div> : loading ? <div className="rounded-2xl border border-border/20 bg-card p-10 text-center text-muted-foreground">
                Loading your referral data…
              </div> : stats ? <div className="rounded-2xl border border-border/20 bg-card p-6 flex flex-col gap-5">
                {/* Code + link */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Your referral code</label>
                    <div className="flex items-center gap-2 rounded-xl border border-border/20 bg-background/50 px-4 py-3">
                      <span className="font-mono font-bold text-foreground text-lg tracking-widest">{stats.code}</span>
                    </div>
                  </div>
                  <div className="flex-[2]">
                    <label className="text-xs text-muted-foreground mb-1 block">Referral link</label>
                    <div className="flex gap-2">
                      <Input readOnly value={stats.referralLink} className="font-mono text-sm bg-background/50 border-border/20" />
                      <Button onClick={copyLink} variant="outline" className="flex-shrink-0">
                        {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{
                label: 'Referrals',
                value: stats.referrals.toString(),
                color: 'text-foreground'
              }, {
                label: 'Pending rewards',
                value: `${stats.pendingRewards.toFixed(4)}`,
                color: 'text-accent'
              }, {
                label: 'Total earned',
                value: `${stats.totalEarned.toFixed(2)}`,
                color: 'text-foreground'
              }, {
                label: 'Current tier',
                value: stats.tier,
                color: ''
              }].map(item => <div key={item.label} className="rounded-xl bg-background/40 border border-border/20 p-3 text-center">
                      <div className={`text-xl font-black ${item.color || ''}`} style={item.label === 'Current tier' ? {
                  color: tierColors[stats.tier]
                } : {}}>
                        {item.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>)}
                </div>

                {/* Progress to next tier */}
                {nextTier && <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{stats.referrals} referrals</span>
                      <span>{nextTier.name} at {nextTier.minReferrals}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{
                  width: 0
                }} animate={{
                  width: `${progressToNext}%`
                }} transition={{
                  duration: 1,
                  ease: 'easeOut' as const
                }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextTier.minReferrals - stats.referrals} more referrals to reach <span style={{
                  color: tierColors[nextTier.name]
                }}>{nextTier.name}</span> ({nextTier.rewardPct}% rewards)
                    </p>
                  </div>}

                <Button variant="outline" className="w-full" disabled>
                  <Gift size={14} className="mr-2" /> Claim Referral Rewards
                  <span className="ml-2 text-xs text-muted-foreground">(on-chain — coming soon)</span>
                </Button>
              </div> : null}
          </section>

          {/* Tier system */}
          <section>
            <h2 className="text-xl font-black text-foreground mb-2">Reward Tiers</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Your tier determines what percentage of your referrals' staking rewards you earn — permanently, for as long as they stake.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {tiers.map(tier => <TierCard key={tier.name} tier={tier} current={stats?.tier === tier.name} />)}
            </div>
          </section>

          {/* How it works */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-black text-foreground mb-6">How it works</h2>
              <ol className="flex flex-col gap-5">
                {[{
                n: '1',
                title: 'Get your link',
                desc: 'Connect your wallet to generate a unique referral code and shareable link.'
              }, {
                n: '2',
                title: 'Share it',
                desc: 'Send your link to friends, post it on social, or embed it on your site.'
              }, {
                n: '3',
                title: 'They stake',
                desc: 'When someone uses your link and stakes tokens, they\'re permanently linked to your referral code.'
              }, {
                n: '4',
                title: 'You earn',
                desc: 'You receive a percentage of their staking rewards every time rewards are distributed — forever.'
              }, {
                n: '5',
                title: 'Climb tiers',
                desc: 'More referrals = higher tier = bigger percentage. Diamond tier earns 15% of all referee rewards.'
              }].map(step => <li key={step.n} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-black text-sm flex items-center justify-center">
                      {step.n}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{step.title}</div>
                      <div className="text-sm text-muted-foreground">{step.desc}</div>
                    </div>
                  </li>)}
              </ol>
            </div>

            {/* Leaderboard */}
            <div>
              <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" /> Top Referrers
              </h2>
              <div className="rounded-2xl border border-border/20 bg-card overflow-hidden">
                {leaderboard.slice(0, 10).map((entry, i) => <div key={entry.rank} className={`flex items-center gap-3 px-4 py-3 border-b border-border/10 last:border-b-0 ${i === 0 ? 'bg-yellow-500/5' : ''}`}>
                    <div className={`w-6 text-center font-black text-sm ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs text-muted-foreground truncate">{entry.wallet}</div>
                      <div className="text-xs" style={{
                    color: tierColors[entry.tier] ?? '#fff'
                  }}>{entry.tier}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">{entry.referrals} refs</div>
                      <div className="text-xs text-accent">{entry.earned} earned</div>
                    </div>
                  </div>)}
              </div>
            </div>
          </section>

          {/* Back to staking */}
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/staking">
                <TrendingUp size={14} className="mr-2" /> Back to Staking Pools <ChevronRight size={14} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>;
}
