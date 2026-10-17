import { global } from 'virtual:content';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getEdition } from '@/data/editionCoins';
import { getBackstory } from '@/data/backstories';
import type { Coin } from '@/data/coins';

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE = 'https://thetokengame.xyz';
const title = 'Global Edition — The Token Game | 212 Seasonal Crypto Coins';
const description = '212 crypto collectible coins covering every universal moment — from $REKT to $HOPIUM. The Global Edition. Collect on Solana.';
const url = `${SITE}/global`;
const ogImage = `${SITE}/og-image.png`;

// accent driven by CSS primary variable — resolved at runtime for inline styles
const ACCENT = 'hsl(var(--primary))';
const ACCENT_HEX = '#BF5FFF'; // used only for box-shadow / border opacity tricks where hsl() doesn't compose
const BORDER = `${ACCENT_HEX}30`;

// ─── Buy URL cache ────────────────────────────────────────────────────────────
let _buyUrlCache: Record<string, string> | null = null;
let _buyUrlFetch: Promise<Record<string, string>> | null = null;
async function getBuyUrls(): Promise<Record<string, string>> {
  if (_buyUrlCache) return _buyUrlCache;
  if (_buyUrlFetch) return _buyUrlFetch;
  _buyUrlFetch = fetch('/api/coins/directory')
    .then(r => r.json())
    .then(data => {
      const map: Record<string, string> = {};
      for (const c of data.coins ?? []) {
        if (c.hasMint && c.buyUrl) map[c.ticker] = c.buyUrl;
      }
      _buyUrlCache = map;
      return map;
    })
    .catch(() => ({}));
  return _buyUrlFetch;
}

// ─── Coin Card ────────────────────────────────────────────────────────────────
function CoinCard({ coin, liveBuyUrl, highlight }: { coin: Coin; liveBuyUrl?: string; highlight?: string }) {
  const backstory = getBackstory(coin.ticker);
  const effectiveBuyUrl = liveBuyUrl ?? coin.buyUrl;
  const hasBuy = effectiveBuyUrl && effectiveBuyUrl !== '#';

  function hl(text: string) {
    if (!highlight) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-primary/30 text-primary rounded px-0.5">{text.slice(idx, idx + highlight.length)}</mark>
        {text.slice(idx + highlight.length)}
      </span>
    );
  }

  return (
    <div
      className="group relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
      style={{ borderColor: BORDER, background: `${ACCENT_HEX}06` }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-black/20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `${ACCENT_HEX}10` }} />
        {coin.image && (
          <img
            src={coin.image}
            alt={coin.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {coin.permanent && (
          <div className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
            PERM
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <div className="text-[10px] font-bold font-mono truncate text-primary">
          {hl(coin.ticker)}
        </div>
        <div className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
          {hl(coin.name)}
        </div>
      </div>

      {/* Buy button */}
      <div className="px-2.5 pb-2.5">
        {hasBuy ? (
          <a
            href={effectiveBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 w-full text-[10px] font-bold py-1.5 rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            onClick={e => e.stopPropagation()}
          >
            Buy <ExternalLink size={9} />
          </a>
        ) : (
          <div
            className="flex items-center justify-center w-full text-[10px] font-semibold py-1.5 rounded-lg"
            style={{ background: `${ACCENT_HEX}12`, color: `${ACCENT_HEX}80`, border: `1px solid ${ACCENT_HEX}20` }}
          >
            Undiscovered
          </div>
        )}
      </div>

      {/* Backstory lore on hover */}
      {backstory?.lore && (
        <div
          className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10 p-3 text-[10px] text-muted-foreground leading-relaxed rounded-b-2xl"
          style={{ background: 'hsl(var(--card))', borderTop: `1px solid ${BORDER}` }}
        >
          {backstory.lore.slice(0, 80)}{backstory.lore.length > 80 ? '…' : ''}
        </div>
      )}
    </div>
  );
}

// ─── Month chip ───────────────────────────────────────────────────────────────
function MonthChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-semibold px-3 py-1 rounded-full border transition-all whitespace-nowrap"
      style={{
        borderColor: active ? ACCENT_HEX : 'rgba(255,255,255,0.12)',
        background: active ? `${ACCENT_HEX}20` : 'transparent',
        color: active ? ACCENT : 'hsl(var(--muted-foreground))',
      }}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GlobalPage() {
  const edition = getEdition('global')!;

  const [buyUrls, setBuyUrls] = useState<Record<string, string>>({});
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getBuyUrls().then(setBuyUrls);
  }, []);

  const [query, setQuery] = useState('');
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'all' | 'permanent' | 'seasonal'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all coins with their group label
  const allCoins = useMemo(() => {
    const out: Array<{ coin: Coin; group: string }> = [];
    for (const c of edition.permanentCoins) out.push({ coin: c, group: 'Permanent' });
    for (const g of edition.seasonalGroups) {
      for (const c of g.coins) out.push({ coin: c, group: g.label });
    }
    return out;
  }, [edition]);

  const totalCoins = allCoins.length;

  // Filtered list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCoins.filter(({ coin, group }) => {
      if (activeType === 'permanent' && !coin.permanent) return false;
      if (activeType === 'seasonal' && coin.permanent) return false;
      if (activeMonth && group !== activeMonth) return false;
      if (q) {
        return (
          coin.ticker.toLowerCase().includes(q) ||
          coin.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allCoins, query, activeMonth, activeType]);

  // Group filtered results preserving order
  const groupedFiltered = useMemo(() => {
    const map = new Map<string, Coin[]>();
    for (const { coin, group } of filtered) {
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(coin);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const hasFilters = query.trim() !== '' || activeMonth !== null || activeType !== 'all';
  const isSearching = query.trim() !== '';

  const clearAll = useCallback(() => {
    setQuery('');
    setActiveMonth(null);
    setActiveType('all');
  }, []);

  // Press / to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url,
          isPartOf: { '@id': `${SITE}/#website` },
          about: { '@id': `${SITE}/#organization` },
        })}</script>
      </Helmet>
      <h1 className="sr-only">{title}</h1>
      <div className="min-h-screen bg-background">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[180px] opacity-15"
            style={{ background: ACCENT_HEX }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">

          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🌐</div>
            <div
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ border: `1px solid ${ACCENT_HEX}50`, color: ACCENT, background: `${ACCENT_HEX}10` }}
            >
              Global Edition
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              All {totalCoins} Coins
            </h2>
            <p className="text-muted-foreground text-lg">Universal moments · 2 years · Solana</p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {[
                { label: 'Permanent', value: String(edition.permanentCoins.length) },
                { label: 'Seasonal', value: String(edition.seasonalGroups.reduce((s, g) => s + g.coins.length, 0)) },
                { label: 'Total', value: String(totalCoins) },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Search + Filter bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="sticky top-20 z-30 mb-8"
          >
            <div
              className="rounded-2xl border p-4 flex flex-col gap-3 backdrop-blur-md bg-background/90"
              style={{ borderColor: `${ACCENT_HEX}25` }}
            >
              {/* Search row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search ticker or name… (press / to focus)"
                    className="pl-9 pr-9 border-white/15 bg-white/[0.04] text-sm h-9"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Type toggle */}
                <div className="flex gap-1 shrink-0">
                  {(['all', 'permanent', 'seasonal'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveType(t)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all capitalize"
                      style={{
                        borderColor: activeType === t ? ACCENT_HEX : 'rgba(255,255,255,0.1)',
                        background: activeType === t ? `${ACCENT_HEX}20` : 'transparent',
                        color: activeType === t ? ACCENT : 'hsl(var(--muted-foreground))',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Month filter toggle */}
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0"
                  style={{
                    borderColor: showFilters ? ACCENT_HEX : 'rgba(255,255,255,0.1)',
                    background: showFilters ? `${ACCENT_HEX}20` : 'transparent',
                    color: showFilters ? ACCENT : 'hsl(var(--muted-foreground))',
                  }}
                >
                  <SlidersHorizontal size={12} />
                  Month
                  <ChevronDown size={11} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <X size={11} />
                    Clear
                  </button>
                )}
              </div>

              {/* Month chips */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-1">
                      <MonthChip label="All months" active={activeMonth === null} onClick={() => setActiveMonth(null)} />
                      <MonthChip label="Permanent" active={activeMonth === 'Permanent'} onClick={() => { setActiveMonth('Permanent'); setActiveType('all'); }} />
                      {global.MONTHS.map(m => (
                        <button
                          key={m}
                          onClick={() => setActiveMonth(m)}
                          className="text-[11px] font-semibold px-3 py-1 rounded-full border transition-all whitespace-nowrap"
                          style={{
                            borderColor: activeMonth === m ? ACCENT_HEX : 'rgba(255,255,255,0.12)',
                            background: activeMonth === m ? `${ACCENT_HEX}20` : 'transparent',
                            color: activeMonth === m ? ACCENT : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results count */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {filtered.length === totalCoins
                    ? `All ${totalCoins} coins`
                    : `${filtered.length} of ${totalCoins} coins`}
                  {activeMonth && <span className="ml-1">· {activeMonth}</span>}
                  {activeType !== 'all' && <span className="ml-1">· {activeType}</span>}
                </span>
                {isSearching && filtered.length === 0 && (
                  <span>No coins match &ldquo;{query}&rdquo;</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Coin grid ── */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-muted-foreground text-lg mb-2">No coins found</p>
                <p className="text-muted-foreground text-sm mb-6">Try a different search or clear your filters</p>
                <Button variant="outline" size="sm" onClick={clearAll} className="border-white/15">
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Flat grid when searching */}
                {isSearching ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {filtered.map(({ coin }) => (
                      <motion.div
                        key={coin.ticker}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CoinCard coin={coin} liveBuyUrl={buyUrls[coin.ticker]} highlight={query.trim()} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Grouped view */
                  (<div className="flex flex-col gap-14">
                    {groupedFiltered.map(([group, coins]) => (
                      <section key={group}>
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: ACCENT_HEX, boxShadow: `0 0 8px ${ACCENT_HEX}` }}
                          />
                          <h2
                            className="text-lg font-bold text-primary"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {group}
                          </h2>
                          <div className="h-px flex-1" style={{ background: `${ACCENT_HEX}20` }} />
                          <span className="text-xs text-muted-foreground shrink-0">{coins.length} coins</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                          {coins.map((coin, i) => (
                            <motion.div
                              key={coin.ticker}
                              initial={{ opacity: 0, y: 12 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: i * 0.02 }}
                            >
                              <CoinCard coin={coin} liveBuyUrl={buyUrls[coin.ticker]} />
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>)
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-24 pb-8">
            <p className="text-muted-foreground/30 text-sm">Raydium buy links added as each coin launches</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
