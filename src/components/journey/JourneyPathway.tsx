import { motion } from 'motion/react';
import { ExternalLink, Lock, CheckCircle } from 'lucide-react';
import { JOURNEY_STAGES, xpToNextStage } from './journeyData';

interface JourneyPathwayProps {
  currentStage: number;
  xpPoints: number;
  earnedBadgeIds: string[];
  compact?: boolean;
}

export default function JourneyPathway({ currentStage, xpPoints, earnedBadgeIds, compact = false }: JourneyPathwayProps) {
  return (
    <div className={`w-full ${compact ? '' : 'py-8'}`}>
      {/* Desktop: horizontal pathway */}
      <div className="hidden lg:flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-white/10 z-0" />
        {/* Progress fill */}
        <div
          className="absolute top-10 left-0 h-0.5 z-0 transition-all duration-1000"
          style={{
            width: `${((currentStage - 1) / 6) * 100}%`,
            background: 'linear-gradient(90deg, #BF5FFF, #FFD700)',
          }}
        />

        {JOURNEY_STAGES.map((stage, idx) => {
          const earned = earnedBadgeIds.includes(stage.badgeId);
          const isActive = stage.stage === currentStage;
          const isLocked = stage.stage > currentStage;
          const { pct } = xpToNextStage(xpPoints, currentStage);

          return (
            <motion.div
              key={stage.badgeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="flex flex-col items-center z-10 relative"
              style={{ flex: '1 1 0' }}
            >
              {/* Node */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2 transition-all duration-300 relative ${
                  earned
                    ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                    : isActive
                    ? 'border-purple-400 shadow-[0_0_20px_rgba(191,95,255,0.5)] animate-pulse'
                    : isLocked
                    ? 'border-white/10 opacity-40'
                    : 'border-white/30'
                }`}
                style={{
                  background: earned
                    ? `radial-gradient(circle, ${stage.color}33, #0a0a1a)`
                    : isActive
                    ? 'radial-gradient(circle, #BF5FFF22, #0a0a1a)'
                    : '#0a0a1a',
                }}
              >
                {earned ? (
                  <span className="text-3xl">{stage.icon}</span>
                ) : isLocked ? (
                  <Lock className="w-7 h-7 text-white/30" />
                ) : (
                  <span className="text-3xl">{stage.icon}</span>
                )}

                {/* Active progress ring */}
                {isActive && !earned && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="38" fill="none" stroke="#BF5FFF" strokeWidth="2" strokeOpacity="0.3" />
                    <circle
                      cx="40" cy="40" r="38" fill="none" stroke="#BF5FFF" strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 38}`}
                      strokeDashoffset={`${2 * Math.PI * 38 * (1 - pct / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                )}

                {earned && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="mt-3 text-center max-w-[100px]">
                <p className={`text-xs font-bold ${earned ? 'text-yellow-400' : isActive ? 'text-purple-300' : 'text-white/40'}`}>
                  Stage {stage.stage}
                </p>
                <p className={`text-sm font-semibold mt-0.5 ${earned ? 'text-white' : isActive ? 'text-white' : 'text-white/40'}`}>
                  {stage.title}
                </p>
                <p className={`text-xs mt-0.5 ${earned ? 'text-yellow-400/70' : isActive ? 'text-purple-400/70' : 'text-white/20'}`}>
                  {stage.site}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="lg:hidden space-y-3">
        {JOURNEY_STAGES.map((stage, idx) => {
          const earned = earnedBadgeIds.includes(stage.badgeId);
          const isActive = stage.stage === currentStage;
          const isLocked = stage.stage > currentStage;

          return (
            <motion.div
              key={stage.badgeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                earned
                  ? 'border-yellow-400/40 bg-yellow-400/5'
                  : isActive
                  ? 'border-purple-400/40 bg-purple-400/5'
                  : 'border-white/5 opacity-50'
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${stage.color}22`, border: `1px solid ${stage.color}44` }}
              >
                {isLocked ? <Lock className="w-5 h-5 text-white/30" /> : stage.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${earned ? 'text-yellow-400' : isActive ? 'text-purple-300' : 'text-white/40'}`}>
                    Stage {stage.stage}
                  </span>
                  {earned && <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />}
                </div>
                <p className="text-sm font-semibold text-white truncate">{stage.title}</p>
                <p className="text-xs text-white/40 truncate">{stage.site}</p>
              </div>
              {!isLocked && (
                <a href={stage.siteUrl} target="_blank" rel="noopener noreferrer"
                  className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
