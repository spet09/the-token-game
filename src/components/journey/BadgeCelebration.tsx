import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { JOURNEY_STAGES } from './journeyData';

interface BadgeCelebrationProps {
  badgeId: string | null;
  onClose: () => void;
}

export default function BadgeCelebration({ badgeId, onClose }: BadgeCelebrationProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  const stage = JOURNEY_STAGES.find(s => s.badgeId === badgeId);

  useEffect(() => {
    if (!badgeId) return;
    const colors = ['#FFD700', '#BF5FFF', '#ff5fef', '#9fff5f', '#60A5FA'];
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles(newParticles);

    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [badgeId, onClose]);

  if (!stage) return null;

  return (
    <AnimatePresence>
      {badgeId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={onClose}
        >
          {/* Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{ width: p.size, height: p.size, background: p.color, left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
                y: [0, -80 - Math.random() * 120],
                x: [(Math.random() - 0.5) * 200],
              }}
              transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
            />
          ))}

          {/* Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 text-center p-10 rounded-3xl border max-w-sm mx-4"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${stage.color}22, #0a0a1a 70%)`,
              borderColor: stage.color + '66',
              boxShadow: `0 0 60px ${stage.color}44`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <motion.div
              className="text-7xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {stage.icon}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: stage.accentColor }}>
                Badge Earned
              </p>
              <h2 className="text-3xl font-black text-white mb-2">{stage.badgeName}</h2>
              <p className="text-white/60 text-sm mb-6">{stage.description}</p>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: `${stage.color}33`, color: stage.accentColor, border: `1px solid ${stage.color}66` }}
              >
                <span>Stage {stage.stage} Unlocked</span>
                <span>+{stage.stage * 100} XP</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
