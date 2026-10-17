import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star } from 'lucide-react';
import { JOURNEY_STAGES } from './journeyData';

interface Leader {
  id: number;
  walletAddress: string;
  displayName: string | null;
  currentStage: number;
  xpPoints: number;
  totalBadges: number;
}

function shortWallet(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function stageName(stage: number) {
  return JOURNEY_STAGES.find(s => s.stage === stage)?.title ?? 'Novice';
}

function stageColor(stage: number) {
  return JOURNEY_STAGES.find(s => s.stage === stage)?.color ?? '#6B7280';
}

const RANK_ICONS = [
  <Trophy className="w-5 h-5 text-yellow-400" />,
  <Medal className="w-5 h-5 text-gray-300" />,
  <Medal className="w-5 h-5 text-amber-600" />,
];

export default function JourneyLeaderboard({ currentWallet }: { currentWallet?: string }) {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/journey/leaderboard')
      .then(r => r.json())
      .then(d => { setLeaders(d.leaders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No players yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leaders.map((leader, idx) => {
        const isMe = currentWallet && leader.walletAddress === currentWallet;
        const color = stageColor(leader.currentStage);

        return (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isMe
                ? 'border-purple-400/50 bg-purple-400/10'
                : 'border-white/5 bg-white/2 hover:bg-white/5'
            }`}
          >
            {/* Rank */}
            <div className="w-8 flex-shrink-0 flex items-center justify-center">
              {idx < 3 ? RANK_ICONS[idx] : (
                <span className="text-sm font-bold text-white/40">#{idx + 1}</span>
              )}
            </div>

            {/* Stage icon */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${color}22`, border: `1px solid ${color}44` }}
            >
              {JOURNEY_STAGES.find(s => s.stage === leader.currentStage)?.icon ?? '🎮'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">
                  {leader.displayName ?? shortWallet(leader.walletAddress)}
                </span>
                {isMe && <span className="text-xs text-purple-400 font-bold">YOU</span>}
              </div>
              <span className="text-xs" style={{ color }}>{stageName(leader.currentStage)}</span>
            </div>

            {/* XP + Badges */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-white">{leader.xpPoints.toLocaleString()} XP</p>
              <p className="text-xs text-white/40">{leader.totalBadges} badge{leader.totalBadges !== 1 ? 's' : ''}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
