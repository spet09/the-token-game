import { useState, useMemo, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Search, ExternalLink, Copy, CheckCircle, XCircle, RefreshCw, ShoppingCart, Clock } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DirectoryCoin {
  ticker: string;
  name: string;
  image: string | null;
  buyUrl: string;
  status: string | null;
  permanent: boolean;
  hasMint: boolean;
  mintAddress: string | null;
}

type FilterMode = 'all' | 'live' | 'pending';

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── CoinCard ─────────────────────────────────────────────────────────────────

function CoinCard({ coin, index }: { coin: DirectoryCoin; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.4), ease: 'easeOut' as const }}
      className={`rounded-2xl border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-3 ${
        coin.hasMint ? 'border-green-500/20' : 'border-border/50'
      }`}
    >
      {/* Top row: image + ticker + name + status badge */}
      <div className="flex items-center gap-3">
        {coin.image ? (
          <img
            src={coin.image}
            alt={coin.name}
            width={44}
            height={44}
            loading="lazy"
            className="w-11 h-11 rounded-full object-cover shrink-0 border border-white/10"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border text-xs font-bold text-muted-foreground">
            {coin.ticker.replace('$', '').slice(0, 3)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-primary text-sm">{coin.ticker}</span>
            {coin.permanent && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Flagship
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{coin.name}</div>
        </div>
        {coin.hasMint ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle className="w-2.5 h-2.5" /> Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/50 border border-border px-2 py-0.5 rounded-full shrink-0">
            <XCircle className="w-2.5 h-2.5" /> Pending
          </span>
        )}
      </div>

      {/* Mint address row */}
      <div className="rounded-xl bg-background/60 border border-border/50 px-3 py-2 flex items-center gap-2 min-w-0">
        {coin.hasMint && coin.mintAddress ? (
          <>
            <span className="font-mono text-[11px] text-muted-foreground truncate flex-1 select-all">
              {coin.mintAddress}
            </span>
            <CopyButton text={coin.mintAddress} label="mint address" />
            <a
              href={coin.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary transition-colors shrink-0"
              title="View on Raydium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground/50 italic flex-1">
            Mint address pending
          </span>
        )}
      </div>

      {/* Buy / Coming soon button */}
      {coin.hasMint ? (
        <a
          href={coin.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground text-xs font-semibold py-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Buy on Raydium
        </a>
      ) : (
        <div className="flex items-center justify-center gap-2 w-full rounded-xl bg-muted/40 border border-border/50 text-muted-foreground/50 text-xs font-medium py-2 cursor-not-allowed select-none">
          <Clock className="w-3.5 h-3.5" />
          Coming soon
        </div>
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoinDirectoryPage() {
  const [coins, setCoins] = useState<DirectoryCoin[]>([]);
  const [summary, setSummary] = useState({ total: 0, live: 0, missing: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  useEffect(() => {
    fetch('/api/coins/directory')
      .then(r => r.json())
      .then(d => {
        setCoins(d.coins ?? []);
        setSummary(d.summary ?? { total: 0, live: 0, missing: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return coins.filter((c) => {
      if (filterMode === 'live'    && !c.hasMint) return false;
      if (filterMode === 'pending' &&  c.hasMint) return false;
      if (!q) return true;
      return (
        c.ticker.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.mintAddress ?? '').toLowerCase().includes(q)
      );
    });
  }, [coins, search, filterMode]);

  // Group by permanent vs seasonal for display
  const sections = useMemo(() => {
    const flagship = filtered.filter(c => c.permanent);
    const seasonal = filtered.filter(c => !c.permanent);
    const groups: Array<{ label: string; coins: DirectoryCoin[] }> = [];
    if (flagship.length) groups.push({ label: 'Flagship Coins', coins: flagship });
    if (seasonal.length) groups.push({ label: 'Seasonal Coins', coins: seasonal });
    return groups;
  }, [filtered]);

  const site = 'https://thetokengame.xyz';
  const url  = `${site}/coin-directory`;

  return (
    <>
      <Helmet>
        <title>Coin Directory — The Token Game</title>
        <meta name="description" content={`Browse all ${summary.total || 212} Token Game coins. Find Raydium mint addresses, live status, and direct buy links for every seasonal and flagship coin.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Coin Directory — The Token Game" />
        <meta property="og:description" content={`All ${summary.total || 212} Token Game coins with Raydium mint addresses.`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          name: 'Coin Directory — The Token Game',
          url,
          description: `All ${summary.total || 212} Token Game coins with Raydium mint addresses`,
          isPartOf: { '@id': `${site}/#website` },
          about: { '@id': `${site}/#organization` },
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background text-foreground">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 py-16 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              <p className="text-sm text-muted-foreground mb-3 font-medium">Raydium</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Coin Directory
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Every Token Game coin — mint addresses, live status, and direct buy links in one place.
              </p>

              {/* Stats */}
              <div className="inline-flex items-center gap-6 bg-card/60 border border-border rounded-2xl px-6 py-4 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{loading ? '…' : summary.total}</div>
                  <div className="text-xs text-muted-foreground">Total coins</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{loading ? '…' : summary.live}</div>
                  <div className="text-xs text-muted-foreground">Live on Raydium</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{loading ? '…' : summary.missing}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Controls */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/50">
          <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ticker, name, or mint address…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            {/* Filter tabs */}
            <div className="flex rounded-xl border border-border bg-card overflow-hidden shrink-0">
              {([
                { key: 'all',     label: `All (${summary.total})` },
                { key: 'live',    label: `Live (${summary.live})` },
                { key: 'pending', label: `Pending (${summary.missing})` },
              ] as { key: FilterMode; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterMode(key)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    filterMode === key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin opacity-50" />
              <p>Loading coin directory…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <XCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No coins match your search.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.label}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-muted-foreground">{section.label}</h2>
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground">{section.coins.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.coins.map((coin, i) => (
                    <CoinCard key={coin.ticker} coin={coin} index={i} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer note */}
        <div className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
          <p>
            Mint addresses are updated as coins launch on Raydium.{' '}
            {summary.missing} coins are still pending launch.
          </p>
        </div>
      </main>
    </>
  );
}
