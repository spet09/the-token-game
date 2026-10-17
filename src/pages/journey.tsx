import { useState, useEffect, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Map, Trophy, ExternalLink, ChevronRight } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import JourneyPathway from '@/components/journey/JourneyPathway';
import JourneyLeaderboard from '@/components/journey/JourneyLeaderboard';
import BadgeCelebration from '@/components/journey/BadgeCelebration';
import LevelUpOverlay from '@/components/journey/LevelUpOverlay';
import AnimatedXPBar from '@/components/journey/AnimatedXPBar';
import { JOURNEY_STAGES, xpToNextStage } from '@/components/journey/journeyData';

interface JourneyProfile {
  id: number;
  walletAddress: string;
  displayName: string | null;
  currentStage: number;
  xpPoints: number;
  totalBadges: number;
}

interface JourneyBadge {
  id: number;
  badgeId: string;
  badgeName: string;
  stage: number;
  earnedAt: string;
}

export default function JourneyPage() {
  const { connected, publicKey, openModal } = useWallet();
  const [profile, setProfile] = useState<JourneyProfile | null>(null);
  const [badges, setBadges] = useState<JourneyBadge[]>([]);
  const [activeTab, setActiveTab] = useState<'pathway' | 'leaderboard'>('pathway');
  const [celebrationBadge, setCelebrationBadge] = useState<string | null>(null);

  // Level-up detection
  const prevStageRef = useRef<number | null>(null);
  const [levelUpStage, setLevelUpStage] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;
    fetch(`/api/journey/profile?wallet=${publicKey}`)
      .then(r => r.json())
      .then(d => {
        setProfile(d.profile);
        setBadges(d.badges ?? []);
      })
      .catch(() => {});
  }, [publicKey]);

  // Poll for XP/stage changes every 30s while the page is open
  useEffect(() => {
    if (!publicKey) return;
    const interval = setInterval(() => {
      fetch(`/api/journey/profile?wallet=${publicKey}`)
        .then(r => r.json())
        .then(d => {
          if (d.profile) setProfile(d.profile);
          if (d.badges) setBadges(d.badges);
        })
        .catch(() => {});
    }, 30_000);
    return () => clearInterval(interval);
  }, [publicKey]);

  // Detect stage increase → fire level-up overlay
  useEffect(() => {
    if (!profile) return;
    const newStage = profile.currentStage;
    if (prevStageRef.current !== null && newStage > prevStageRef.current) {
      setLevelUpStage(newStage);
    }
    prevStageRef.current = newStage;
  }, [profile?.currentStage]);

  // Auto-award Novice badge on first visit
  useEffect(() => {
    if (!publicKey || badges.length > 0) return;
    fetch('/api/journey/badge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: publicKey, badgeId: 'novice' }),
    }).then(r => r.json()).then(d => {
      if (d.awarded) {
        setCelebrationBadge('novice');
        fetch(`/api/journey/profile?wallet=${publicKey}`)
          .then(r => r.json())
          .then(d2 => { setProfile(d2.profile); setBadges(d2.badges ?? []); });
      }
    });
  }, [publicKey, badges.length]);

  const earnedBadgeIds = badges.map(b => b.badgeId);
  const currentStage = profile?.currentStage ?? 1;
  const xpPoints = profile?.xpPoints ?? 0;
  const { pct, needed } = xpToNextStage(xpPoints, currentStage);
  const currentStageDef = JOURNEY_STAGES.find(s => s.stage === currentStage);
  const nextStageDef = JOURNEY_STAGES.find(s => s.stage === currentStage + 1);

  return (
    <>
      <Helmet>
        <title>Your Journey — The Token Game</title>
        <meta name="description" content="Track your progression through the Tienko ecosystem — from Novice to Tokenomics Graduate across 7 platforms." />
        <link rel="canonical" href="https://thetokengame.xyz/journey" />
        <meta property="og:title" content="Your Journey — The Token Game" />
        <meta property="og:description" content="Track your progression through the Tienko ecosystem — from Novice to Tokenomics Graduate across 7 platforms." />
        <meta property="og:url" content="https://thetokengame.xyz/journey" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
      </Helmet>

      <BadgeCelebration badgeId={celebrationBadge} onClose={() => setCelebrationBadge(null)} />
      <LevelUpOverlay
        show={levelUpStage !== null}
        newStage={levelUpStage ?? 1}
        onClose={() => setLevelUpStage(null)}
      />

      <main className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d1f 100%)' }}>

        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-4">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #BF5FFF, transparent)' }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
                style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}>
                <Map className="w-4 h-4" />
                Tienko Ecosystem Journey
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                From Novice to{' '}
                <span style={{ background: 'linear-gradient(135deg, #FFD700, #BF5FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Graduate
                </span>
              </h1>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">
                Progress through 7 stages across the Tienko ecosystem. Earn badges, unlock platforms, and build your on-chain reputation.
              </p>
            </motion.div>

            {/* Stats row */}
            {connected && profile ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              >
                {[
                  { label: 'Current Stage', value: `${currentStage} / 7`, icon: currentStageDef?.icon ?? '🎮', color: currentStageDef?.color ?? '#BF5FFF' },
                  { label: 'XP Points', value: xpPoints.toLocaleString(), icon: '⚡', color: '#FFD700' },
                  { label: 'Badges Earned', value: `${profile.totalBadges} / 7`, icon: '🏅', color: '#10B981' },
                  { label: 'Next Stage', value: nextStageDef?.title ?? 'Complete!', icon: nextStageDef?.icon ?? '🎓', color: nextStageDef?.color ?? '#FFD700' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="p-4 rounded-2xl border text-center"
                    style={{ background: `${stat.color}0d`, borderColor: `${stat.color}33` }}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            ) : connected ? (
              <div className="flex justify-center mb-12">
                <div className="h-24 w-full max-w-2xl rounded-2xl bg-white/5 animate-pulse" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12"
              >
                <button
                  onClick={openModal}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #BF5FFF, #ff5fef)',
                    color: 'white',
                    boxShadow: '0 0 40px rgba(191,95,255,0.4)',
                  }}
                >
                  <span>🔐</span>
                  Connect Wallet to Start Your Journey
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-white/30 text-sm mt-3">Your progress is stored on-chain and follows you across all Tienko platforms</p>
              </motion.div>
            )}

            {/* XP Progress bar */}
            {connected && profile && nextStageDef && (
              <AnimatedXPBar
                xpPoints={xpPoints}
                pct={pct}
                needed={needed}
                currentStageDef={currentStageDef}
                nextStageDef={nextStageDef}
              />
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="container mx-auto max-w-5xl px-4 pb-4">
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit mx-auto mb-8">
            {(['pathway', 'leaderboard'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                  activeTab === tab ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {tab === 'pathway' ? '🗺️ Pathway' : '🏆 Leaderboard'}
              </button>
            ))}
          </div>
        </section>

        {/* Pathway tab */}
        {activeTab === 'pathway' && (
          <section className="container mx-auto max-w-5xl px-4 pb-16">
            <JourneyPathway
              currentStage={currentStage}
              xpPoints={xpPoints}
              earnedBadgeIds={earnedBadgeIds}
            />

            {/* Stage cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              {JOURNEY_STAGES.map((stage, idx) => {
                const earned = earnedBadgeIds.includes(stage.badgeId);
                const isActive = stage.stage === currentStage;
                const isLocked = stage.stage > currentStage;

                return (
                  <motion.div
                    key={stage.badgeId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      earned ? 'border-yellow-400/30' : isActive ? 'border-purple-400/30' : 'border-white/5 opacity-60'
                    }`}
                    style={{
                      background: earned
                        ? `radial-gradient(circle at 30% 30%, ${stage.color}15, rgba(255,255,255,0.02))`
                        : isActive
                        ? 'radial-gradient(circle at 30% 30%, rgba(191,95,255,0.1), rgba(255,255,255,0.02))'
                        : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: `${stage.color}22`, border: `1px solid ${stage.color}44` }}
                      >
                        {stage.icon}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white/30">Stage {stage.stage}</span>
                        {earned && (
                          <div className="text-xs font-bold text-yellow-400 mt-0.5">✓ Earned</div>
                        )}
                        {isActive && !earned && (
                          <div className="text-xs font-bold text-purple-400 mt-0.5">Active</div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-black text-white text-lg mb-1">{stage.title}</h3>
                    <p className="text-xs font-semibold mb-2" style={{ color: stage.accentColor }}>{stage.badgeName}</p>
                    <p className="text-sm text-white/50 mb-4 leading-relaxed">{stage.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">{stage.site}</span>
                      {!isLocked && (
                        <a
                          href={stage.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                          style={{ color: stage.accentColor }}
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Leaderboard tab */}
        {activeTab === 'leaderboard' && (
          <section className="container mx-auto max-w-2xl px-4 pb-16">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-black text-white">Global Journey Leaderboard</h2>
            </div>
            <JourneyLeaderboard currentWallet={publicKey ?? undefined} />
          </section>
        )}
      </main>
    </>
  );
}
