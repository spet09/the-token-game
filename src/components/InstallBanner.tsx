import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Check if already dismissed this session
    if (sessionStorage.getItem('pwa-banner-dismissed')) return;

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as { standalone?: boolean }).standalone;
    if (ios) {
      setIsIOS(true);
      setShowBanner(true);
      return;
    }

    // Android / Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem('pwa-banner-dismissed', '1');
    setDismissed(true);
  }

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setDismissed(true);
  }

  if (dismissed || !showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-white/10 p-4 flex items-center gap-3 shadow-2xl md:left-auto md:right-6 md:w-80"
      style={{ background: 'hsl(259 44% 10%)', boxShadow: '0 0 40px hsl(276 100% 69% / 0.2)' }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
        style={{ border: '1px solid hsl(276 100% 69% / 0.3)' }}
      >
        <img src="/assets/$RESO.png" alt="The Token Game" className="w-full h-full object-cover" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">Add to Home Screen</p>
        {isIOS ? (
          <p className="text-xs text-foreground/50 mt-0.5">
            Tap <span className="font-semibold" style={{ color: 'hsl(276 100% 69%)' }}>Share</span> then "Add to Home Screen"
          </p>
        ) : (
          <p className="text-xs text-foreground/50 mt-0.5">Install The Token Game as an app</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!isIOS && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'hsl(276 100% 69%)', color: 'white' }}
          >
            <Download size={12} />
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground/70 transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
