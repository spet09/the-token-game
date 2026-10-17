import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Wallet, Trophy, Zap, BarChart3, ArrowLeft, Star, ExternalLink } from 'lucide-react';
import { COINS } from '../../data/coins';
import { getRarity, RARITY_CONFIG } from '../../lib/wagmi-config';
import { generateDailyCard, todayDateStr } from '../../lib/bingo-engine';

// ── Fake history generator (replace with DB reads) ────────────────────────────
function generateHistory(wallet: string) {
  const dates: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates.map(date => {
    const seed = wallet.length + date.charCodeAt(5);
    const won = seed % 3 === 0;
    const lines = won ? 1 + (seed % 3) : 0;
    const rarity = ['common', 'uncommon', 'rare', 'epic', 'legendary'][seed % 5];
    const cfg = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG];
    return { date, won, lines, rarity, rarityLabel: cfg.label, color: cfg.color, reward: won ? (cfg.multiplier * 0.01).toFixed(4) : '0' };
  });
}

// ── Coin collection preview ───────────────────────────────────────────────────
function CoinCollection({ wallet }: { wallet: string }) {
  // Show a deterministic subset of coins "owned" by this wallet
  const seed = wallet.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const owned = COINS.filter(c => c.image).filter((_, i) => (i + seed) % 4 === 0).slice(0, 24);

  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
      {owned.map((coin, i) => {
        const rarity = getRarity(coin.ticker);
        const cfg = RARITY_CONFIG[rarity];
        return (
          <motion.div
            key={coin.ticker}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.02 } }}
            className={`relative aspect-square rounded-lg overflow-hidden border ${cfg.borderClass} cursor-pointer`}
            title={`${coin.ticker} — ${cfg.label}`}
          >
            <img src={coin.image} alt={coin.ticker} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function BingoDashboard() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [tab, setTab] = useState<'overview' | 'history' | 'collection'>('overview');

  async function connectWallet() {
    setConnecting(true);
    try {
      const { createWalletClient, custom } = await import('viem');
      const eth = (window as any).ethereum;
      if (!eth) { alert('No wallet detected.'); return; }
      const client = createWalletClient({ transport: custom(eth) });
      const [addr] = await client.requestAddresses();
      setWallet(addr);
    } catch {}
    finally { setConnecting(false); }
  }

  const today = todayDateStr();
  const history = wallet ? generateHistory(wallet) : [];
  const totalWins = history.filter(h => h.won).length;
  const totalLines = history.reduce((a, h) => a + h.lines, 0);
  const bestRarity = history.reduce((best, h) => {
    const order = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    return order.indexOf(h.rarity) > order.indexOf(best) ? h.rarity : best;
  }, 'common');
  const bestCfg = RARITY_CONFIG[bestRarity as keyof typeof RARITY_CONFIG];

  const todayCard = wallet ? generateDailyCard(today, wallet) : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>My Dashboard — Token Bingo | The Token Game</title>
        <meta name="description" content="View your Token Bingo stats, game history, and coin collection." />
        <link rel="canonical" href="https://thetokengame.xyz/bingo/dashboard" />
        <meta property="og:title" content="My Dashboard — Token Bingo | The Token Game" />
        <meta property="og:description" content="View your Token Bingo stats, game history, and coin collection." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/bingo/dashboard" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Dashboard — Token Bingo | The Token Game" />
        <meta name="twitter:description" content="View your Token Bingo stats, game history, and coin collection." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/bingo/dashboard#webpage',
          name: 'My Dashboard — Token Bingo | The Token Game',
          url: 'https://thetokengame.xyz/bingo/dashboard',
          description: 'View your Token Bingo stats, game history, and coin collection.',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/bingo" className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <h1 className="text-lg font-black flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                My Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Token Bingo stats</p>
            </div>
          </div>
          {wallet ? (
            <span className="text-xs font-mono text-primary border border-primary/30 px-3 py-1.5 rounded-xl">
              {wallet.slice(0, 6)}…{wallet.slice(-4)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {!wallet ? (
          <div className="text-center py-20 space-y-4">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Connect your wallet to view your dashboard</p>
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <div className="text-2xl font-black">{totalWins}</div>
                <div className="text-xs text-muted-foreground">Wins (14d)</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-black">{totalLines}</div>
                <div className="text-xs text-muted-foreground">Lines Won</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2" style={{ color: bestCfg.color }} />
                <div className="text-lg font-black" style={{ color: bestCfg.color }}>{bestCfg.label}</div>
                <div className="text-xs text-muted-foreground">Best Rarity</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-black text-green-400">
                  {history.reduce((a, h) => a + parseFloat(h.reward), 0).toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">SOL Earned</div>
              </div>
            </div>

            {/* Today's card preview */}
            {todayCard && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">Today's Card Preview</p>
                  <a href="/bingo" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    Play now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {todayCard.cells.map((coin, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10">
                      <img src={coin.image} alt={coin.ticker} className="w-full h-full object-cover opacity-80" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex rounded-xl border border-border bg-card overflow-hidden">
              {(['overview', 'history', 'collection'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                    tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === 'overview' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">14-Day Performance</p>
                <div className="flex gap-1 items-end h-20">
                  {history.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t transition-all ${h.won ? 'bg-primary' : 'bg-muted'}`}
                        style={{ height: `${Math.max(8, h.lines * 20 + 8)}px` }}
                        title={`${h.date}: ${h.lines} lines`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>14 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            )}

            {tab === 'history' && (
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className={`flex items-center justify-between rounded-xl border p-3 ${h.won ? 'border-green-500/20 bg-green-500/5' : 'border-border bg-card'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${h.won ? 'bg-green-400' : 'bg-muted-foreground'}`} />
                      <div>
                        <p className="text-sm font-medium">{h.date}</p>
                        <p className="text-xs text-muted-foreground">{h.won ? `${h.lines} line${h.lines > 1 ? 's' : ''}` : 'No win'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: h.won ? '#22c55e' : undefined }}>
                        {h.won ? `+${h.reward} SOL` : '—'}
                      </p>
                      <p className="text-xs" style={{ color: RARITY_CONFIG[h.rarity as keyof typeof RARITY_CONFIG].color }}>
                        {h.rarityLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'collection' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">Your Coin Collection</p>
                <p className="text-xs text-muted-foreground">
                  Coins you've matched in bingo games. Rarity dots indicate tier.
                  {/* TODO: replace with on-chain TGCardGenerator.getOwnedCards(wallet) */}
                </p>
                <CoinCollection wallet={wallet} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
