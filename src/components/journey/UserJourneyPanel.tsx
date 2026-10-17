import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { JOURNEY_STAGES, xpToNextStage } from './journeyData';
import JourneyPathway from './JourneyPathway';
import BadgeCelebration from './BadgeCelebration';

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

interface JourneyTask {
  walletAddress: string;
  taskKey: string;
  stage: number;
}

interface UserJourneyPanelProps {
  open: boolean;
  onClose: () => void;
  walletAddress?: string;
}

export default function UserJourneyPanel({ open, onClose, walletAddress }: UserJourneyPanelProps) {
  const [profile, setProfile] = useState<JourneyProfile | null>(null);
  const [badges, setBadges] = useState<JourneyBadge[]>([]);
  const [progress, setProgress] = useState<JourneyTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'journey' | 'badges' | 'tasks'>('journey');

  const loadProfile = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/journey/profile?wallet=${walletAddress}`);
      const d = await r.json();
      setProfile(d.profile);
      setBadges(d.badges ?? []);
      setProgress(d.progress ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (open && walletAddress) loadProfile();
  }, [open, walletAddress, loadProfile]);

  // Auto-award Novice badge on first open
  useEffect(() => {
    if (!open || !walletAddress || badges.length > 0) return;
    const awardNovice = async () => {
      const r = await fetch('/api/journey/badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddress, badgeId: 'novice' }),
      });
      const d = await r.json();
      if (d.awarded) {
        setCelebrationBadge('novice');
        await loadProfile();
      }
    };
    awardNovice();
  }, [open, walletAddress, badges.length, loadProfile]);

  const earnedBadgeIds = badges.map(b => b.badgeId);
  const currentStage = profile?.currentStage ?? 1;
  const xpPoints = profile?.xpPoints ?? 0;
  const { pct, needed } = xpToNextStage(xpPoints, currentStage);
  const currentStageDef = JOURNEY_STAGES.find(s => s.stage === currentStage);
  const nextStageDef = JOURNEY_STAGES.find(s => s.stage === currentStage + 1);

  return (
    <>
      <BadgeCelebration badgeId={celebrationBadge} onClose={() => setCelebrationBadge(null)} />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #0d0d1f 0%, #0a0a1a 100%)', borderLeft: '1px solid rgba(191,95,255,0.2)' }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
                style={{ background: 'rgba(13,13,31,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                <div>
                  <h2 className="text-lg font-black text-white">Your Journey</h2>
                  <p className="text-xs text-white/40">Tienko Ecosystem Progression</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {!walletAddress ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="text-5xl mb-4">🔐</div>
                  <p className="text-white/60 text-sm">Connect your wallet to track your journey across the Tienko ecosystem.</p>
                </div>
              ) : loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* XP + Stage summary */}
                  <div className="rounded-2xl p-5 border"
                    style={{
                      background: `radial-gradient(circle at 30% 50%, ${currentStageDef?.color ?? '#BF5FFF'}15, transparent 70%), rgba(255,255,255,0.02)`,
                      borderColor: `${currentStageDef?.color ?? '#BF5FFF'}33`,
                    }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{currentStageDef?.icon}</div>
                      <div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Current Stage</p>
                        <h3 className="text-xl font-black text-white">{currentStageDef?.title}</h3>
                        <p className="text-xs" style={{ color: currentStageDef?.accentColor }}>{currentStageDef?.site}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-2xl font-black text-white">{xpPoints.toLocaleString()}</p>
                        <p className="text-xs text-white/40">XP Points</p>
                      </div>
                    </div>

                    {/* Progress to next stage */}
                    {nextStageDef && (
                      <div>
                        <div className="flex justify-between text-xs text-white/40 mb-1.5">
                          <span>Progress to {nextStageDef.title}</span>
                          <span>{needed} XP needed</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${currentStageDef?.color}, ${nextStageDef.color})` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span style={{ color: currentStageDef?.color }}>{currentStageDef?.title}</span>
                          <span style={{ color: nextStageDef.color }}>{nextStageDef.title}</span>
                        </div>
                      </div>
                    )}

                    {currentStage === 7 && (
                      <div className="text-center py-2">
                        <span className="text-yellow-400 font-bold text-sm">🎓 Journey Complete — Tokenomics Graduate</span>
                      </div>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 p-1 rounded-xl bg-white/5">
                    {(['journey', 'badges', 'tasks'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                          activeTab === tab ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab: Journey */}
                  {activeTab === 'journey' && (
                    <div>
                      <JourneyPathway
                        currentStage={currentStage}
                        xpPoints={xpPoints}
                        earnedBadgeIds={earnedBadgeIds}
                        compact
                      />
                    </div>
                  )}

                  {/* Tab: Badges */}
                  {activeTab === 'badges' && (
                    <div className="space-y-3">
                      {JOURNEY_STAGES.map(stage => {
                        const earned = earnedBadgeIds.includes(stage.badgeId);
                        const badge = badges.find(b => b.badgeId === stage.badgeId);
                        return (
                          <div
                            key={stage.badgeId}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                              earned ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-white/5 opacity-50'
                            }`}
                          >
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ background: `${stage.color}22`, border: `1px solid ${stage.color}44` }}
                            >
                              {stage.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-white text-sm">{stage.badgeName}</p>
                              <p className="text-xs text-white/40">{stage.site}</p>
                              {badge && (
                                <p className="text-xs text-yellow-400/60 mt-0.5">
                                  Earned {new Date(badge.earnedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {earned ? (
                              <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                            ) : (
                              <div className="text-xs text-white/20 flex-shrink-0">Stage {stage.stage}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tab: Tasks */}
                  {activeTab === 'tasks' && (
                    <div className="space-y-4">
                      {JOURNEY_STAGES.filter(s => s.stage <= currentStage + 1).map(stage => {
                        return (
                          <div key={stage.badgeId}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-base">{stage.icon}</span>
                              <span className="text-sm font-bold text-white/60">Stage {stage.stage} — {stage.title}</span>
                            </div>
                            <div className="space-y-2 pl-6">
                              {stage.tasks.map(task => {
                                const done = progress.some(p => p.taskKey === task.key);
                                return (
                                  <div key={task.key} className={`flex items-center gap-3 text-sm ${done ? 'text-white' : 'text-white/40'}`}>
                                    {done
                                      ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                      : <Circle className="w-4 h-4 flex-shrink-0" />
                                    }
                                    <span className="flex-1">{task.label}</span>
                                    <span className={`text-xs font-bold ${done ? 'text-green-400' : 'text-white/20'}`}>+{task.xp} XP</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Next site CTA */}
                  {nextStageDef && (
                    <a
                      href={nextStageDef.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl border border-purple-400/20 bg-purple-400/5 hover:bg-purple-400/10 transition-all group"
                    >
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">Next destination</p>
                        <p className="font-bold text-white">{nextStageDef.site}</p>
                        <p className="text-xs text-purple-300">{nextStageDef.title} awaits</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
