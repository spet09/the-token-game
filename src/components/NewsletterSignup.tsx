import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type State = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  /** Visual variant — 'hero' is larger, 'inline' is compact for sections */
  variant?: 'hero' | 'inline';
  placeholder?: string;
}

export default function NewsletterSignup({
  variant = 'hero',
  placeholder = 'your@email.com',
}: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isHero = variant === 'hero';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState('success');
        setEmail('');
      } else {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setState('error');
    }
  }

  const primaryColor = 'hsl(276 100% 69%)';
  const accentColor  = 'hsl(96 100% 69%)';

  return (
    <div className={isHero ? 'w-full max-w-md mx-auto' : 'w-full max-w-sm'}>
      <AnimatePresence mode="wait">
        {state === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3 py-4 text-center"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40` }}
            >
              <CheckCircle2 size={24} style={{ color: accentColor }} />
            </div>
            <p className="font-semibold" style={{ color: accentColor }}>
              You're in!
            </p>
            <p className="text-sm text-foreground/50">
              We'll let you know when the next coin drops.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Label */}
            {isHero && (
              <div className="flex items-center gap-2 justify-center mb-1">
                <Mail size={14} style={{ color: primaryColor }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: primaryColor }}>
                  Get notified on every drop
                </span>
              </div>
            )}

            {/* Input row */}
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                placeholder={placeholder}
                required
                disabled={state === 'loading'}
                className={[
                  'flex-1 rounded-lg px-4 bg-white/5 text-foreground placeholder:text-foreground/30',
                  'border outline-none transition-all duration-200',
                  'focus:ring-2 disabled:opacity-50',
                  isHero ? 'h-12 text-sm' : 'h-10 text-sm',
                  state === 'error'
                    ? 'border-red-500/60 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-primary/60 focus:ring-primary/20',
                ].join(' ')}
              />
              <button
                type="submit"
                disabled={state === 'loading' || !email.trim()}
                className={[
                  'shrink-0 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isHero ? 'h-12 px-5 text-sm' : 'h-10 px-4 text-sm',
                ].join(' ')}
                style={{
                  background: primaryColor,
                  color: 'white',
                  boxShadow: state !== 'loading' ? `0 0 20px ${primaryColor}40` : 'none',
                }}
              >
                {state === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {isHero ? 'Notify Me' : 'Join'}
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {state === 'error' && errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 text-center"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            {isHero && (
              <p className="text-xs text-foreground/30 text-center">
                No spam. Just coin drops.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
