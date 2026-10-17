import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Input } from '@/components/ui/input';
import { Link } from "react-router";
import { Search, BookOpen, Sparkles, ChevronDown, ChevronUp, X, ArrowLeft, Scroll, Star } from 'lucide-react';
import { ALL_BACKSTORIES } from '@/data/backstories';
import { PERMANENT_COINS, SEASONAL_YEAR_ONE, YEAR_TWO_GROUPS } from '@/data/coins';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CoinEntry {
  ticker: string; // without $
  displayTicker: string; // with $
  name: string;
  image?: string;
  group: string; // 'Permanent' | 'January' | 'February' | …
  year?: number;
}

// ─── Build flat coin list with group metadata ─────────────────────────────────
function buildCoinList(): CoinEntry[] {
  const entries: CoinEntry[] = [];
  for (const c of PERMANENT_COINS) {
    const raw = c.ticker.replace('$', '');
    if (!ALL_BACKSTORIES[raw]) continue;
    entries.push({
      ticker: raw,
      displayTicker: c.ticker,
      name: c.name,
      image: c.image,
      group: 'Permanent'
    });
  }
  for (const group of SEASONAL_YEAR_ONE) {
    for (const c of group.coins) {
      const raw = c.ticker.replace('$', '');
      if (!ALL_BACKSTORIES[raw]) continue;
      entries.push({
        ticker: raw,
        displayTicker: c.ticker,
        name: c.name,
        image: c.image,
        group: group.month ?? group.label,
        year: 1
      });
    }
  }
  for (const group of YEAR_TWO_GROUPS) {
    for (const c of group.coins) {
      const raw = c.ticker.replace('$', '');
      if (!ALL_BACKSTORIES[raw]) continue;
      entries.push({
        ticker: raw,
        displayTicker: c.ticker,
        name: c.name,
        image: c.image,
        group: group.month ?? group.label,
        year: 2
      });
    }
  }
  return entries;
}
const ALL_COINS = buildCoinList();
const ALL_GROUPS = ['All', 'Permanent', ...Array.from(new Set(ALL_COINS.filter(c => c.group !== 'Permanent').map(c => c.group)))];

// ─── Coin card ────────────────────────────────────────────────────────────────
function CoinCard({
  coin,
  selected,
  onClick
}: {
  coin: CoinEntry;
  selected: boolean;
  onClick: () => void;
}) {
  return <motion.button onClick={onClick} whileHover={{
    y: -2,
    scale: 1.015
  }} whileTap={{
    scale: 0.97
  }} className="w-full text-left rounded-2xl border p-3 flex items-center gap-3 transition-all" style={{
    borderColor: selected ? 'hsl(var(--primary) / 0.55)' : 'hsl(var(--border) / 0.4)',
    background: selected ? 'hsl(var(--primary) / 0.08)' : 'hsl(var(--card) / 0.5)',
    boxShadow: selected ? '0 0 18px hsl(var(--primary) / 0.15)' : 'none'
  }}>
      {/* Coin image */}
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/5">
        {coin.image ? <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-lg">
            🪙
          </div>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono font-bold truncate" style={{
        color: selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
      }}>
          {coin.displayTicker}
        </div>
        <div className="text-sm font-semibold leading-tight truncate">{coin.name}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{coin.group}</div>
      </div>

      {/* Lore indicator */}
      <Scroll size={13} className="shrink-0" style={{
      color: selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.4)'
    }} />
    </motion.button>;
}

// ─── Lore panel ───────────────────────────────────────────────────────────────
function LorePanel({
  coin
}: {
  coin: CoinEntry;
}) {
  const backstory = ALL_BACKSTORIES[coin.ticker];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    origin: true,
    lore: true,
    utility: false,
    curatorNote: false
  });
  const toggle = (key: string) => setExpanded(prev => ({
    ...prev,
    [key]: !prev[key]
  }));
  const sections: Array<{
    key: string;
    label: string;
    icon: string;
    content: string;
  }> = [{
    key: 'origin',
    label: 'Origin',
    icon: '🌱',
    content: backstory.origin
  }, {
    key: 'lore',
    label: 'Lore',
    icon: '📜',
    content: backstory.lore
  }, {
    key: 'utility',
    label: 'Utility',
    icon: '⚡',
    content: backstory.utility
  }, {
    key: 'curatorNote',
    label: "Curator's Note",
    icon: '📖',
    content: backstory.curatorNote
  }];
  return <AnimatePresence mode="wait">
      <motion.div key={coin.ticker} initial={{
      opacity: 0,
      y: 12
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -8
    }} transition={{
      duration: 0.28
    }} className="flex flex-col gap-5 h-full">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/15 bg-white/5">
            {coin.image ? <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🪙</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-mono font-bold mb-0.5" style={{
            color: 'hsl(var(--primary))'
          }}>
              {coin.displayTicker}
            </div>
            <h2 className="text-2xl font-bold leading-tight">{coin.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                {coin.group}
              </span>
              {coin.year && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                  Year {coin.year}
                </span>}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3">
          {sections.map(({
          key,
          label,
          icon,
          content
        }) => <div key={key} className="rounded-2xl border border-white/10 overflow-hidden" style={{
          background: 'hsl(var(--card) / 0.4)'
        }}>
              <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                {expanded[key] ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
              </button>

              <AnimatePresence initial={false}>
                {expanded[key] && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.22
            }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1">
                      {key === 'curatorNote' ? <blockquote className="border-l-2 pl-4 italic text-sm leading-relaxed" style={{
                  borderColor: 'hsl(var(--primary) / 0.5)',
                  color: 'hsl(var(--primary))'
                }}>
                          {content}
                        </blockquote> : <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>}
                    </div>
                  </motion.div>}
              </AnimatePresence>
            </div>)}
        </div>
      </motion.div>
    </AnimatePresence>;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({
  query
}: {
  query: string;
}) {
  return <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <BookOpen size={32} className="text-muted-foreground/40" />
      <div className="text-sm text-muted-foreground">
        {query ? <>No coins match <span className="font-mono font-semibold text-foreground">"{query}"</span></> : 'No coins in this category yet.'}
      </div>
    </div>;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BackstoriesPage() {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [selected, setSelected] = useState<CoinEntry | null>(ALL_COINS[0] ?? null);
  const [showPanel, setShowPanel] = useState(false); // mobile: show detail panel
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_COINS.filter(c => {
      const groupMatch = activeGroup === 'All' || c.group === activeGroup;
      if (!groupMatch) return false;
      if (!q) return true;
      return c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || ALL_BACKSTORIES[c.ticker]?.lore?.toLowerCase().includes(q) || ALL_BACKSTORIES[c.ticker]?.origin?.toLowerCase().includes(q);
    });
  }, [query, activeGroup]);
  const handleSelect = useCallback((coin: CoinEntry) => {
    setSelected(coin);
    setShowPanel(true);
  }, []);
  const site = 'https://thetokengame.xyz';
  const url = `${site}/backstories`;
  return <>
      <Helmet>
        <title>Coin Backstories — The Token Game</title>
        <meta name="description" content="Explore the origin stories, lore, and Curator's notes for every coin in The Token Game. 1,500+ backstories across all editions." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Coin Backstories — The Token Game" />
        <meta property="og:description" content="Explore the origin stories, lore, and Curator's notes for every coin in The Token Game." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          name: 'Coin Backstories',
          url,
          description: 'Origin stories, lore, and Curator notes for every coin in The Token Game.',
          isPartOf: {
            '@id': `${site}/#website`
          }
        })}</script>
      </Helmet>

      <main className="min-h-screen">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-white/8">
          <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.12), transparent)'
        }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold" style={{
              borderColor: 'hsl(var(--primary) / 0.3)',
              color: 'hsl(var(--primary))',
              background: 'hsl(var(--primary) / 0.08)'
            }}>
                <BookOpen size={12} />
                <span>{ALL_COINS.length.toLocaleString()} coin backstories</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                The Coin{' '}
                <span style={{
                color: 'hsl(var(--primary))'
              }}>Archives</span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
                Every coin has a story. Origin myths, lore fragments, utility records, and notes from The Curator — all preserved here.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center gap-6 mt-2">
                {[{
                label: 'Permanent coins',
                value: PERMANENT_COINS.filter(c => ALL_BACKSTORIES[c.ticker.replace('$', '')]).length
              }, {
                label: 'Seasonal coins',
                value: ALL_COINS.filter(c => c.group !== 'Permanent').length
              }, {
                label: 'Lore entries',
                value: ALL_COINS.length * 4
              }].map(({
                label,
                value
              }) => <div key={label} className="flex flex-col items-center gap-0.5">
                    <span className="text-2xl font-black" style={{
                  color: 'hsl(var(--primary))'
                }}>
                      {value.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Search + Filter bar ── */}
        <div className="sticky top-0 z-20 border-b border-white/8 bg-background/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search coins or lore… (/)" className="pl-9 pr-8 text-sm border-white/15 bg-background/60 h-9" />
              {query && <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>}
            </div>

            {/* Group filter chips — scrollable */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 min-w-0">
              {ALL_GROUPS.map(g => <button key={g} onClick={() => setActiveGroup(g)} className="shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border transition-all whitespace-nowrap" style={{
              borderColor: activeGroup === g ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--border) / 0.4)',
              background: activeGroup === g ? 'hsl(var(--primary) / 0.12)' : 'transparent',
              color: activeGroup === g ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
            }}>
                  {g}
                </button>)}
            </div>

            {/* Result count */}
            <div className="text-xs text-muted-foreground shrink-0 hidden sm:block">
              {filtered.length} coin{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ── Main layout: list + detail ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6 items-start">

            {/* ── Left: coin list ── */}
            <div className={`
                w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-2
                ${showPanel ? 'hidden lg:flex' : 'flex'}
              `}>
              {filtered.length === 0 ? <EmptyState query={query} /> : filtered.map((coin, i) => <motion.div key={coin.ticker} initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.2,
              delay: Math.min(i * 0.015, 0.3)
            }}>
                    <CoinCard coin={coin} selected={selected?.ticker === coin.ticker} onClick={() => handleSelect(coin)} />
                  </motion.div>)}
            </div>

            {/* ── Right: lore detail panel ── */}
            <div className={`
                flex-1 min-w-0
                ${showPanel ? 'block' : 'hidden lg:block'}
              `}>
              {selected ? <div className="lg:sticky lg:top-[72px]">
                  {/* Mobile back button */}
                  <button onClick={() => setShowPanel(false)} className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
                    <ArrowLeft size={14} />
                    Back to list
                  </button>

                  <div className="rounded-2xl border border-white/10 p-5 md:p-6" style={{
                background: 'hsl(var(--card) / 0.4)'
              }}>
                    <LorePanel coin={selected} />
                  </div>

                  {/* Curator callout */}
                  <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }} className="mt-4 rounded-2xl border border-white/8 p-4 flex items-start gap-3" style={{
                background: 'hsl(var(--primary) / 0.04)'
              }}>
                    <Star size={14} className="shrink-0 mt-0.5" style={{
                  color: 'hsl(var(--primary))'
                }} />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Backstories are written by The Curator and preserved in the Archives. Each entry is canon within the Tienko universe.{' '}
                      <Link to="/curator" className="underline underline-offset-2 hover:text-foreground transition-colors">
                        Visit The Curator
                      </Link>
                    </p>
                  </motion.div>
                </div> : <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                  <Sparkles size={32} className="text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Select a coin to read its backstory</p>
                </div>}
            </div>
          </div>
        </div>
      </main>
    </>;
}
