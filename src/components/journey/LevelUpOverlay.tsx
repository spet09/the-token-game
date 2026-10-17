/**
 * LevelUpOverlay — fullscreen cinematic burst shown when the player's
 * stage number increases. Distinct from BadgeCelebration (badge earn).
 */
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap } from 'lucide-react';
import { JOURNEY_STAGES } from './journeyData';

interface LevelUpOverlayProps {
  show: boolean;
  newStage: number;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: 'circle' | 'star' | 'rect';
  delay: number;
  duration: number;
}

// Stage-specific accent colors are design-system values for the Journey feature,
// not brand palette overrides — they live in journeyData.ts and are passed through.
const PARTICLE_COLORS = ['#FFD700', '#BF5FFF', '#ff5fef', '#9fff5f', '#60A5FA', '#ffffff'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(5, 95),
    y: randomBetween(10, 90),
    vx: (Math.random() - 0.5) * 300,
    vy: -(randomBetween(80, 260)),
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    size: randomBetween(5, 14),
    shape: (['circle', 'star', 'rect'] as const)[Math.floor(Math.random() * 3)],
    delay: randomBetween(0, 0.6),
    duration: randomBetween(1.4, 2.8),
  }));
}

export default function LevelUpOverlay({ show, newStage, onClose }: LevelUpOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const stage = JOURNEY_STAGES.find(s => s.stage === newStage);
  const prevStage = JOURNEY_STAGES.find(s => s.stage === newStage - 1);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!show) return;
    setParticles(buildParticles(60));
    const t = setTimeout(handleClose, 6000);
    return () => clearTimeout(t);
  }, [show, handleClose]);

  if (!stage) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="level-up-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-background/95"
          onClick={handleClose}
        >
          {/* Radial burst behind card */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 2.5, 3] }}
            transition={{ duration: 1.2, ease: 'easeOut' as const }}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${stage.color}55 0%, transparent 65%)`,
            }}
          />

          {/* Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.shape === 'rect' ? p.size * 0.4 : p.size,
                background: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                clipPath: p.shape === 'star'
                  ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  : undefined,
              }}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.2, 0.8, 0],
                opacity: [1, 1, 0.6, 0],
                x: p.vx,
                y: p.vy,
                rotate: Math.random() * 720 - 360,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' as const }}
            />
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
            className="relative z-10 text-center px-10 py-12 rounded-3xl border max-w-md mx-4"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${stage.color}28 0%, hsl(var(--background)) 65%)`,
              borderColor: stage.color + '88',
              boxShadow: `0 0 80px ${stage.color}55, 0 0 160px ${stage.color}22`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-foreground/30 hover:text-foreground/80 transition-colors"
              aria-label="Close level-up overlay"
            >
              <X className="w-5 h-5" />
            </button>

            {/* "LEVEL UP" kicker */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <Zap className="w-5 h-5" style={{ color: stage.color }} />
              </motion.div>
              <span
                className="text-xs font-black tracking-[0.25em] uppercase"
                style={{ color: stage.accentColor }}
              >
                Level Up!
              </span>
              <motion.div
                animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <Zap className="w-5 h-5" style={{ color: stage.color }} />
              </motion.div>
            </motion.div>

            {/* Stage icon — bouncy entrance */}
            <motion.div
              className="text-8xl mb-5 select-none"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.4, 0.9, 1.1, 1], rotate: [-30, 10, -5, 3, 0] }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' as const }}
            >
              {stage.icon}
            </motion.div>

            {/* Stage name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {prevStage && (
                <p className="text-sm text-foreground/30 mb-1 line-through">{prevStage.title}</p>
              )}
              <h2
                className="text-4xl font-black mb-1"
                style={{
                  background: `linear-gradient(135deg, ${stage.color}, ${stage.accentColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stage.title}
              </h2>
              <p className="text-foreground/50 text-sm mb-6 max-w-xs mx-auto">{stage.description}</p>
            </motion.div>

            {/* Stage badge pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{
                background: `${stage.color}22`,
                color: stage.accentColor,
                border: `1px solid ${stage.color}55`,
                boxShadow: `0 0 20px ${stage.color}33`,
              }}
            >
              <span>Stage {stage.stage} of 7</span>
              <span className="opacity-50">·</span>
              <span>{stage.site}</span>
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.5 }}
              className="text-xs text-foreground/30 mt-5"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
