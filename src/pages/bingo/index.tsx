import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Zap, Trophy, Volume2, VolumeX, ExternalLink, ChevronRight } from 'lucide-react';
import { generateDailyCard, generateDailyDraw, checkWin, todayDateStr } from '../../lib/bingo-engine';
import type { BingoCoin, BingoCard, DrawnNumber } from '../../lib/bingo-engine';
import { RARITY_CONFIG } from '../../lib/wagmi-config';

// ── Wallet connect (viem) ─────────────────────────────────────────────────────
// TODO: wrap app in WagmiProvider + QueryClientProvider in main.tsx for full
// useAccount / useConnect hooks. For now we use a lightweight local state.

// ── Wallet connect (viem) ─────────────────────────────────────────────────────
// TODO: wrap app in WagmiProvider + QueryClientProvider in main.tsx for full
// useAccount / useConnect hooks. For now we use a lightweight local state.
function useWalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  async function connect() {
    setConnecting(true);
    try {
      // viem window.ethereum connect
      const { createWalletClient, custom } = await import('viem');
      const eth = (window as any).ethereum;
      if (!eth) { alert('No wallet detected. Install MetaMask or Phantom.'); return; }
      const client = createWalletClient({ transport: custom(eth) });
      const [addr] = await client.requestAddresses();
      setAddress(addr);
    } catch (e) {
      console.error(e);
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() { setAddress(null); }
  return { address, connecting, connect, disconnect };
}

// ── Rarity glow helper ────────────────────────────────────────────────────────
function rarityGlow(rarity: string) {
  switch (rarity) {
    case 'legendary': return 'shadow-[0_0_18px_4px_rgba(245,158,11,0.7)]';
    case 'epic':      return 'shadow-[0_0_14px_3px_rgba(168,85,247,0.6)]';
    case 'rare':      return 'shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]';
    case 'uncommon':  return 'shadow-[0_0_8px_1px_rgba(34,197,94,0.4)]';
    default:          return '';
  }
}

// ── Cell component ────────────────────────────────────────────────────────────
function BingoCell({
  coin, index, marked, winning, justCalled, onClick,
}: {
  coin: BingoCoin;
  index: number;
  marked: boolean;
  winning: boolean;
  justCalled: boolean;
  onClick: () => void;
}) {
  const isFree = coin.ticker === 'FREE';
  const cfg = RARITY_CONFIG[coin.rarity];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={winning ? { scale: [1, 1.12, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
      className={`
        relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer
        ${marked ? cfg.borderClass + ' ' + cfg.bgClass : 'border-white/10 bg-white/5'}
        ${winning ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black' : ''}
        ${justCalled ? rarityGlow(coin.rarity) : ''}
      `}
    >
      {/* Coin image */}
      <img
        src={coin.image}
        alt={coin.name}
        className={`w-full h-full object-cover transition-all duration-300 ${marked ? 'brightness-110' : 'brightness-75'}`}
        loading="lazy"
      />

      {/* Overlay when marked */}
      {marked && !isFree && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40"
        >
          <div className="w-8 h-8 rounded-full border-4 border-primary bg-primary/30 flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">✓</span>
          </div>
        </motion.div>
      )}

      {/* FREE badge */}
      {isFree && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-500/30">
          <span className="text-amber-300 font-black text-sm tracking-widest">FREE</span>
        </div>
      )}

      {/* Rarity pip */}
      {!isFree && (
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ background: cfg.color }}
          title={cfg.label}
        />
      )}

      {/* Ticker label */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
        <p className="text-[9px] font-mono text-white/80 truncate text-center">{coin.ticker}</p>
      </div>
    </motion.button>
  );
}

// ── Number reveal strip ───────────────────────────────────────────────────────
function CalledNumbersStrip({ drawn, currentIndex }: { drawn: DrawnNumber[]; currentIndex: number }) {
  const recent = drawn.slice(Math.max(0, currentIndex - 9), currentIndex + 1).reverse();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {recent.map((d, i) => {
        const cfg = RARITY_CONFIG[d.coin.rarity];
        return (
          <motion.div
            key={d.number + '-' + i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`shrink-0 flex flex-col items-center gap-1 rounded-xl p-2 border ${i === 0 ? cfg.borderClass + ' ' + cfg.bgClass : 'border-white/10 bg-white/5'}`}
            style={{ minWidth: 56 }}
          >
            <img src={d.coin.image} alt={d.coin.ticker} className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-xs font-bold" style={{ color: i === 0 ? cfg.color : '#9ca3af' }}>
              {d.coin.ticker}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Win celebration overlay ───────────────────────────────────────────────────
function WinOverlay({ winPatterns, card, onClaim, onClose }: {
  winPatterns: number[][];
  card: BingoCard;
  onClaim: () => void;
  onClose: () => void;
}) {
  const winCoins = [...new Set(winPatterns.flat())].map(i => card.cells[i]).filter(c => c.ticker !== 'FREE');
  const topRarity = winCoins.reduce((best, c) => {
    const order = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    return order.indexOf(c.rarity) > order.indexOf(best) ? c.rarity : best;
  }, 'common' as string);
  const cfg = RARITY_CONFIG[topRarity as keyof typeof RARITY_CONFIG];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.5, y: 60 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 60 }}
        className={`relative w-full max-w-md rounded-3xl border-2 ${cfg.borderClass} bg-card p-8 text-center`}
      >
        {/* Celebration coin images */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {winCoins.slice(0, 5).map((c, i) => (
            <motion.img
              key={i}
              src={c.image}
              alt={c.ticker}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: i * 0.1 } }}
              className={`w-14 h-14 rounded-xl object-cover border-2 ${RARITY_CONFIG[c.rarity].borderClass} ${rarityGlow(c.rarity)}`}
            />
          ))}
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
        >
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: cfg.color }} />
        </motion.div>

        <h2 className="text-3xl font-black mb-2" style={{ color: cfg.color }}>
          BINGO!
        </h2>
        <p className="text-muted-foreground mb-1">
          {winPatterns.length} line{winPatterns.length > 1 ? 's' : ''} complete
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Top rarity: <span style={{ color: cfg.color }} className="font-semibold">{cfg.label}</span>
          {' · '}{cfg.multiplier}x reward multiplier
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClaim}
            className="flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ background: cfg.color, color: '#000' }}
          >
            Claim Reward
            {/* TODO: call TGRewards.claim() on-chain */}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Keep Playing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BingoPage() {
  const { address, connecting, connect, disconnect } = useWalletConnect();
  const [card, setCard] = useState<BingoCard | null>(null);
  const [drawPool, setDrawPool] = useState<BingoCoin[]>([]);
  const [drawn, setDrawn] = useState<DrawnNumber[]>([]);
  const [drawIndex, setDrawIndex] = useState(-1);
  const [marked, setMarked] = useState<Set<number>>(new Set([12])); // FREE center
  const [winPatterns, setWinPatterns] = useState<number[][]>([]);
  const [showWin, setShowWin] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const today = todayDateStr();

  // Load daily card
  useEffect(() => {
    setLoading(true);
    const c = generateDailyCard(today, address ?? '');
    const pool = generateDailyDraw(today);
    setCard(c);
    setDrawPool(pool);
    setMarked(new Set([12]));
    setDrawn([]);
    setDrawIndex(-1);
    setWinPatterns([]);
    setShowWin(false);
    setLoading(false);
  }, [today, address]);

  // Draw next number
  const drawNext = useCallback(() => {
    if (!card || drawIndex >= drawPool.length - 1) return;
    const next = drawIndex + 1;
    const coin = drawPool[next];
    setDrawIndex(next);
    setDrawn(prev => [...prev, { number: coin.number, coin, calledAt: Date.now() }]);
  }, [card, drawIndex, drawPool]);

  // Auto-play
  useEffect(() => {
    if (autoPlay) {
      autoRef.current = setInterval(drawNext, 3000);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoPlay, drawNext]);

  // Auto-mark matching cells
  useEffect(() => {
    if (!card || drawn.length === 0) return;
    const latest = drawn[drawn.length - 1];
    card.cells.forEach((cell, i) => {
      if (cell.number === latest.number && !marked.has(i)) {
        setMarked(prev => {
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      }
    });
  }, [drawn, card]);

  // Check wins
  useEffect(() => {
    const wins = checkWin(marked);
    if (wins.length > winPatterns.length) {
      setWinPatterns(wins);
      setShowWin(true);
      setAutoPlay(false);
    }
  }, [marked]);

  const justCalledNumber = drawn[drawn.length - 1]?.number ?? -1;

  if (loading || !card) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading today's card…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Daily Bingo — The Token Game</title>
        <meta name="description" content="Play the daily crypto bingo game. Match coin tokens, win rewards." />
        <link rel="canonical" href="https://thetokengame.xyz/bingo" />
        <meta property="og:title" content="Daily Bingo — The Token Game" />
        <meta property="og:description" content="Play the daily crypto bingo game. Match coin tokens, win rewards." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/bingo" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daily Bingo — The Token Game" />
        <meta name="twitter:description" content="Play the daily crypto bingo game. Match coin tokens, win rewards." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/bingo#webpage',
          name: 'Daily Bingo — The Token Game',
          url: 'https://thetokengame.xyz/bingo',
          description: 'Play the daily crypto bingo game. Match coin tokens, win rewards.',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      {/* Win overlay */}
      <AnimatePresence>
        {showWin && (
          <WinOverlay
            winPatterns={winPatterns}
            card={card}
            onClaim={() => {
              // TODO: call TGRewards.claim() via viem
              alert('Reward claim coming soon — connect your wallet and deploy contracts first.');
            }}
            onClose={() => setShowWin(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black tracking-tight">Token Bingo</h1>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(m => !m)}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {address ? (
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-mono"
              >
                <Wallet className="w-3.5 h-3.5" />
                {address.slice(0, 6)}…{address.slice(-4)}
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                {connecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Called numbers strip */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Called Numbers</p>
              <p className="text-xs text-muted-foreground">{drawn.length} / 60 drawn</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoPlay(a => !a)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  autoPlay ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'bg-primary/20 text-primary border border-primary/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {autoPlay ? 'Stop Auto' : 'Auto Draw'}
              </button>
              <button
                onClick={drawNext}
                disabled={drawIndex >= drawPool.length - 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Draw <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {drawn.length > 0 ? (
            <CalledNumbersStrip drawn={drawn} currentIndex={drawIndex} />
          ) : (
            <p className="text-center text-muted-foreground text-sm py-4">
              Press <strong>Draw</strong> to reveal the first coin
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(drawn.length / 60) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* 5×5 Bingo Card */}
        <div className="rounded-2xl border border-border bg-card p-4">
          {/* Column headers B I N G O */}
          <div className="grid grid-cols-5 gap-1.5 mb-1.5">
            {['B','I','N','G','O'].map(l => (
              <div key={l} className="text-center text-primary font-black text-lg">{l}</div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {card.cells.map((coin, i) => (
              <BingoCell
                key={i}
                coin={coin}
                index={i}
                marked={marked.has(i)}
                winning={winPatterns.some(p => p.includes(i))}
                justCalled={coin.number === justCalledNumber}
                onClick={() => {
                  // Manual mark toggle
                  setMarked(prev => {
                    const next = new Set(prev);
                    if (next.has(i)) { next.delete(i); } else { next.add(i); }
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-black text-primary">{marked.size - 1}</div>
            <div className="text-xs text-muted-foreground mt-1">Matched</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-black text-green-400">{winPatterns.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Lines Won</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-black text-amber-400">{60 - drawn.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Remaining</div>
          </div>
        </div>

        {/* Rarity legend */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold mb-3">Rarity Tiers</p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(RARITY_CONFIG) as [string, typeof RARITY_CONFIG[keyof typeof RARITY_CONFIG]][]).map(([key, cfg]) => (
              <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${cfg.borderClass} ${cfg.bgClass}`}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-xs text-muted-foreground">{cfg.multiplier}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav links */}
        <div className="flex gap-3">
          <a
            href="/bingo/auction"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-semibold"
          >
            Auction House <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="/bingo/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-semibold"
          >
            My Dashboard <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Contract status notice */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-400/80">
          <strong>Smart contracts not yet deployed.</strong> Wallet connect, card generation, and win detection are live.
          On-chain burn/re-mint, auction settlement, and reward claiming will activate once TGGameGenerator,
          TGCardGenerator, TGAuction, and TGRewards are deployed and their addresses added to <code>src/lib/wagmi-config.ts</code>.
        </div>
      </div>
    </main>
  );
}
