/**
 * AnnouncementBanner — site-wide dismissible alert strip.
 * Shown above the header until the user closes it (stored in sessionStorage).
 */
import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const BANNER_KEY = 'ttg_banner_dismissed_v1';

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BANNER_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(BANNER_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="relative z-50 w-full bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-200 px-4 py-2.5"
    >
      <div className="mx-auto max-w-6xl flex items-center gap-3">
        <AlertTriangle size={15} className="shrink-0 text-yellow-400" />
        <p className="flex-1 text-sm leading-snug">
          <span className="font-semibold text-yellow-300">Notice:</span>{' '}
          We are aware of an issue affecting a number of Pump.fun coin addresses in the game.
          An investigation is underway. Ecosystem tokens (NYC, USGC, TIEN) are unaffected.
          More details will be shared with the community shortly.
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded p-1 hover:bg-yellow-500/20 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
