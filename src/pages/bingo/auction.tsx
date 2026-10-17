import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Gavel, Clock, TrendingUp, Wallet, ArrowLeft, Flame } from 'lucide-react';
import { RARITY_CONFIG } from '../../lib/wagmi-config';

interface AuctionListing {
  id: string;
  coin: {
    ticker: string;
    name: string;
    image: string;
    rarity: string;
    rarityLabel: string;
    color: string;
    multiplier: number;
  };
  currentBid: number;
  minBid: number;
  bidCount: number;
  endsAt: number;
  seller: string;
}

function useCountdown(endsAt: number) {
  const [remaining, setRemaining] = useState(endsAt - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(endsAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  if (remaining <= 0) return 'Ended';
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

function AuctionCard({ listing, onBid }: { listing: AuctionListing; onBid: (id: string, amount: number) => void }) {
  const [bidAmount, setBidAmount] = useState(listing.minBid.toFixed(4));
  const countdown = useCountdown(listing.endsAt);
  const cfg = RARITY_CONFIG[listing.coin.rarity as keyof typeof RARITY_CONFIG];
  const isEnded = countdown === 'Ended';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 ${cfg.borderClass} bg-card overflow-hidden`}
    >
      {/* Coin image */}
      <div className="relative aspect-square">
        <img
          src={listing.coin.image}
          alt={listing.coin.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Rarity badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold border ${cfg.borderClass} ${cfg.bgClass}`}
          style={{ color: cfg.color }}
        >
          {listing.coin.rarityLabel}
        </div>
        {/* Multiplier badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-amber-400 text-xs font-bold">
          {listing.coin.multiplier}x
        </div>
        {/* Countdown overlay */}
        <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1.5 ${isEnded ? 'bg-destructive/80' : 'bg-black/70'}`}>
          <Clock className="w-3 h-3 text-white/70" />
          <span className="text-xs text-white font-mono">{countdown}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="font-bold text-sm">{listing.coin.ticker}</p>
          <p className="text-xs text-muted-foreground">{listing.coin.name}</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-muted-foreground">Current bid</p>
            <p className="font-bold text-lg text-foreground">{listing.currentBid} SOL</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Bids</p>
            <p className="font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              {listing.bidCount}
            </p>
          </div>
        </div>

        {!isEnded && (
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              min={listing.minBid}
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => onBid(listing.id, parseFloat(bidAmount))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <Gavel className="w-3.5 h-3.5" />
              Bid
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground truncate">
          Seller: <span className="font-mono">{listing.seller}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default function AuctionPage() {
  const [listings, setListings] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bingo/auctions')
      .then(r => r.json())
      .then(d => { setListings(d.listings ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function connectWallet() {
    try {
      const { createWalletClient, custom } = await import('viem');
      const eth = (window as any).ethereum;
      if (!eth) { alert('No wallet detected.'); return; }
      const client = createWalletClient({ transport: custom(eth) });
      const [addr] = await client.requestAddresses();
      setWalletAddress(addr);
    } catch {}
  }

  function handleBid(id: string, amount: number) {
    if (!walletAddress) { connectWallet(); return; }
    // TODO: call TGAuction.placeBid(id, amount) via viem
    alert(`Bid of ${amount} SOL on auction ${id} — contract integration coming soon.`);
  }

  const rarities = ['all', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
  const filtered = filter === 'all' ? listings : listings.filter(l => l.coin.rarity === filter);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Auction House — Token Bingo | The Token Game</title>
        <meta name="description" content="Bid on rare Token Game bingo cards and coin NFTs in the auction house." />
        <link rel="canonical" href="https://thetokengame.xyz/bingo/auction" />
        <meta property="og:title" content="Auction House — Token Bingo | The Token Game" />
        <meta property="og:description" content="Bid on rare Token Game bingo cards and coin NFTs in the auction house." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/bingo/auction" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Auction House — Token Bingo | The Token Game" />
        <meta name="twitter:description" content="Bid on rare Token Game bingo cards and coin NFTs in the auction house." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/bingo/auction#webpage',
          name: 'Auction House — Token Bingo | The Token Game',
          url: 'https://thetokengame.xyz/bingo/auction',
          description: 'Bid on rare Token Game bingo cards and coin NFTs in the auction house.',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/bingo" className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <h1 className="text-lg font-black flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Auction House
              </h1>
              <p className="text-xs text-muted-foreground">{listings.length} active listings</p>
            </div>
          </div>
          {walletAddress ? (
            <span className="text-xs font-mono text-primary border border-primary/30 px-3 py-1.5 rounded-xl">
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Wallet className="w-4 h-4" /> Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Rarity filter */}
        <div className="flex gap-2 flex-wrap">
          {rarities.map(r => {
            const cfg = r !== 'all' ? RARITY_CONFIG[r as keyof typeof RARITY_CONFIG] : null;
            return (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors border ${
                  filter === r
                    ? (cfg ? cfg.borderClass + ' ' + cfg.bgClass : 'border-primary bg-primary/20 text-primary')
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
                style={filter === r && cfg ? { color: cfg.color } : {}}
              >
                {r}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No listings for this rarity.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(listing => (
              <AuctionCard key={listing.id} listing={listing} onBid={handleBid} />
            ))}
          </div>
        )}

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-400/80">
          <strong>Contract integration pending.</strong> Bids are simulated until TGAuction is deployed.
          Add the contract address to <code>src/lib/wagmi-config.ts</code> to go live.
        </div>
      </div>
    </main>
  );
}
