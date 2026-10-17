/**
 * AnimatedXPBar — replaces the static XP progress bar in journey.tsx.
 *
 * Features:
 *  - Smooth width transition when xpPoints changes
 *  - Gold flash + scale pulse on XP gain
 *  - Glowing fill that matches the current → next stage gradient
 *  - "+N XP" floating toast that rises and fades on gain
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JourneyStage } from './journeyData';

interface AnimatedXPBarProps {
  xpPoints: number;
  pct: number;
  needed: number;
  currentStageDef: JourneyStage | undefined;
  nextStageDef: JourneyStage | undefined;
}

interface XPToast {
  id: number;
  amount: number;
}

export default function AnimatedXPBar({
  xpPoints,
  pct,
  needed,
  currentStageDef,
  nextStageDef,
}: AnimatedXPBarProps) {
  const prevXp = useRef(xpPoints);
  const [toasts, setToasts] = useState<XPToast[]>([]);
  const [pulse, setPulse] = useState(false);
  const toastCounter = useRef(0);

  useEffect(() => {
    const diff = xpPoints - prevXp.current;
    if (diff > 0) {
      setPulse(true);
      const id = ++toastCounter.current;
      setToasts(prev => [...prev, { id, amount: diff }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2000);
      setTimeout(() => setPulse(false), 600);
    }
    prevXp.current = xpPoints;
  }, [xpPoints]);

  const fromColor = currentStageDef?.color ?? 'hsl(var(--primary))';
  const toColor = nextStageDef?.color ?? 'hsl(var(--accent))';

  if (!nextStageDef) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mb-12 p-5 rounded-2xl border relative overflow-visible"
      style={{
        background: 'hsl(var(--card))',
        borderColor: pulse ? fromColor + '88' : 'hsl(var(--border))',
        transition: 'border-color 0.4s ease',
        boxShadow: pulse ? `0 0 24px ${fromColor}44` : 'none',
      }}
    >
      {/* Floating XP toasts */}
      <div className="absolute -top-2 right-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -48, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' as const }}
              className="text-sm font-black absolute right-0"
              style={{ color: fromColor, textShadow: `0 0 12px ${fromColor}` }}
            >
              +{t.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Labels row */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xl"
            animate={pulse ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {currentStageDef?.icon}
          </motion.span>
          <span className="font-bold text-foreground">{currentStageDef?.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/40">{needed} XP to</span>
          <span className="font-bold" style={{ color: nextStageDef.color }}>{nextStageDef.title}</span>
          <span className="text-xl">{nextStageDef.icon}</span>
        </div>
      </div>

      {/* Bar track */}
      <div className="h-4 rounded-full overflow-hidden relative bg-muted">
        {/* Animated fill */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${fromColor}, ${toColor})`,
            boxShadow: `0 0 12px ${fromColor}88`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' as const }}
        >
          {/* Shimmer sweep on gain — uses a CSS class to avoid rgba literal */}
          <AnimatePresence>
            {pulse && (
              <motion.div
                key="shimmer"
                className="absolute inset-0 rounded-full xp-shimmer"
                initial={{ opacity: 0.8, x: '-100%' }}
                animate={{ opacity: 0, x: '200%' }}
                exit={{}}
                transition={{ duration: 0.55, ease: 'easeOut' as const }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pulse ring on gain */}
        <AnimatePresence>
          {pulse && (
            <motion.div
              key="pulse-ring"
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.06 }}
              exit={{}}
              transition={{ duration: 0.5 }}
              style={{ border: `2px solid ${fromColor}` }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Percentage + total XP */}
      <div className="flex justify-between items-center mt-2">
        <motion.span
          className="text-xs font-semibold"
          style={{ color: fromColor }}
          animate={pulse ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {pct}%
        </motion.span>
        <span className="text-xs text-foreground/30">{xpPoints.toLocaleString()} XP total</span>
      </div>
    </motion.div>
  );
}
