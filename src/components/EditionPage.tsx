import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Edition } from '@/data/editionCoins';
import type { Coin } from '@/data/coins';
import { getBackstory } from '@/data/backstories';
import type { CoinBackstory } from '@/data/backstories';

// ─── Live buy URL cache (fetched once per page load from /api/coins/directory) ───
let _buyUrlCache: Record<string, string> | null = null;
let _buyUrlFetch: Promise<Record<string, string>> | null = null;

async function getBuyUrls(): Promise<Record<string, string>> {
  if (_buyUrlCache) return _buyUrlCache;
  if (_buyUrlFetch) return _buyUrlFetch;
  _buyUrlFetch = fetch('/api/coins/directory')
    .then((r) => r.json())
    .then((data) => {
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

// ─── Coin Card ───
// CANVAS REPLACE RULES — do not break these:
//   1. <img> must always be in the DOM
//   2. src must ALWAYS be the coin's own unique slot URL — never a shared fallback
//      like /placeholder.jpg. If multiple coins share the same src, Replace on one
//      updates all of them. coin.image is already the slot URL; use it directly.
//   3. Never swap src in onError — that makes all empty slots share /placeholder.jpg
//      and breaks Replace. Use CSS background as the visual fallback instead.
//   4. No opacity:0, no hidden, no pointer-events:none on the <img>
function CoinCard({
  coin,
  editionName,
  accentColor,
  borderColor,
  backstory,
  liveBuyUrl,
}: {
  coin: Coin;
  editionName?: string;
  accentColor: string;
  borderColor: string;
  backstory?: CoinBackstory;
  liveBuyUrl?: string;
}) {
  // Buy button is live when a Raydium address has been entered for this coin
  const effectiveBuyUrl = liveBuyUrl ?? coin.buyUrl;
  const isLive = !!liveBuyUrl && liveBuyUrl !== '#';
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (backstory) {
      setExpanded((v) => !v);
    }
    try {
      if (typeof window !== 'undefined' && (window as any).Tienko) {
        (window as any).Tienko.discover({ coin: coin.ticker, edition: editionName });
      }
    } catch (err) {
      // Discovery is a bonus — never block the UI on it.
      // eslint-disable-next-line no-console
      console.debug('[Tienko] discovery failed', err);
    }
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${borderColor}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: backstory ? 'pointer' : undefined,
      }}
      onClick={handleClick}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.02)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
    >
      {/* Image area.
          The dark background is the visual fallback for empty slots — it shows through
          when the img 404s. The img src is ALWAYS coin.image (the unique slot URL) so
          the canvas editor can identify which slot to write to. Never share a src across
          multiple coins or Replace will update the wrong cards. */}
      <div
        className="aspect-square w-full overflow-hidden"
        style={{ background: '#111122' }}
      >
        <img
          src={coin.image}
          alt={coin.name}
          width={200}
          height={200}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-xs font-bold font-mono" style={{ color: accentColor }}>
            {coin.ticker}
          </p>
          <p className="text-xs text-foreground/60 leading-tight mt-0.5 line-clamp-2">
            {coin.name}
          </p>
        </div>

        {isLive ? (
          <a
            href={effectiveBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-auto flex items-center justify-center gap-1 text-xs font-bold py-1.5 px-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: accentColor, color: '#000' }}
          >
            Discover <ExternalLink size={10} />
          </a>
        ) : (
          <div
            className="mt-auto flex items-center justify-center text-xs font-bold py-1.5 px-2 rounded-lg opacity-30"
            style={{ border: `1px solid ${accentColor}`, color: accentColor }}
          >
            Undiscovered
          </div>
        )}
      </div>

      {/* Backstory panel */}
      {backstory && (
        <div
          style={{
            maxHeight: expanded ? '400px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.35s ease',
          }}
        >
          <div
            className="p-3 flex flex-col gap-2 text-[10px] leading-snug"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground/40 mb-0.5">Origin</p>
              <p className="text-foreground/75">{backstory.origin}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground/40 mb-0.5">Lore</p>
              <p className="text-foreground/75">{backstory.lore}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground/40 mb-0.5">Utility</p>
              <p className="text-foreground/75">{backstory.utility}</p>
            </div>
            <p className="italic mt-1" style={{ color: accentColor }}>
              ✦ {backstory.curatorNote}
            </p>
          </div>
        </div>
      )}

      {/* Chevron toggle indicator */}
      {backstory && (
        <div
          className="absolute top-2 right-2 rounded-full p-0.5"
          style={{ background: `${accentColor}30`, color: accentColor }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      )}

      {coin.permanent && !backstory && (
        <div
          className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: accentColor, color: '#000' }}
        >
          PERM
        </div>
      )}
      {coin.permanent && backstory && (
        <div
          className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: accentColor, color: '#000' }}
        >
          PERM
        </div>
      )}
    </div>
  );
}

// ─── Main EditionPage ───
export default function EditionPage({ edition }: { edition: Edition }) {
  const { name, flag, accentColor, bgColor, rimText, permanentCoins, seasonalGroups } = edition;
  const borderColor = `${accentColor}30`;

  // Live Raydium buy URLs — fetched once from /api/coins/directory
  const [buyUrls, setBuyUrls] = useState<Record<string, string>>({});
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getBuyUrls().then(setBuyUrls);
  }, []);

  const site = 'https://thetokengame.xyz';
  const canonicalUrl = `${site}${edition.path}`;
  const title = `${name} — The Token Game`;
  const description = `1,080 collectibles. 10 editions. ${rimText}.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen" style={{ background: bgColor }}>
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
            style={{ background: accentColor }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-4">{flag}</div>
            <div
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ border: `1px solid ${accentColor}50`, color: accentColor, background: `${accentColor}10` }}
            >
              {rimText}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: accentColor }}>
              {name}
            </h1>
            <p className="text-foreground/50 text-lg">108 collectibles · 365 days · One world</p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {[{ label: 'Permanent', value: '12' }, { label: 'Seasonal', value: '96' }, { label: 'Total', value: '108' }].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: accentColor }}>{s.value}</p>
                  <p className="text-xs text-foreground/40 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Permanent 12 ── */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px flex-1" style={{ background: `${accentColor}30` }} />
              <h2 className="text-xl font-bold tracking-widest uppercase" style={{ color: accentColor, fontFamily: 'var(--font-heading)' }}>
                Permanent Collection
              </h2>
              <div className="h-px flex-1" style={{ background: `${accentColor}30` }} />
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {permanentCoins.map((coin, i) => (
                <motion.div key={coin.ticker} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}>
                  <CoinCard coin={coin} editionName={name} accentColor={accentColor} borderColor={borderColor} backstory={getBackstory(coin.ticker)} liveBuyUrl={buyUrls[coin.ticker]} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Seasonal 96 ── */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="h-px flex-1" style={{ background: `${accentColor}30` }} />
              <h2 className="text-xl font-bold tracking-widest uppercase" style={{ color: accentColor, fontFamily: 'var(--font-heading)' }}>
                Seasonal Coins
              </h2>
              <div className="h-px flex-1" style={{ background: `${accentColor}30` }} />
            </motion.div>
            <div className="flex flex-col gap-16">
              {seasonalGroups.map((group, gi) => (
                <motion.div key={group.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: gi * 0.05 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                    <h3 className="text-lg font-bold" style={{ color: accentColor, fontFamily: 'var(--font-heading)' }}>{group.label}</h3>
                    <div className="h-px flex-1" style={{ background: `${accentColor}20` }} />
                    <span className="text-xs text-foreground/30">{group.coins.length} coins</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {group.coins.map((coin, ci) => (
                      <motion.div key={coin.ticker} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: ci * 0.03 }}>
                        <CoinCard coin={coin} editionName={name} accentColor={accentColor} borderColor={borderColor} backstory={getBackstory(coin.ticker)} liveBuyUrl={buyUrls[coin.ticker]} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Footer note ── */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-24 pb-8">
            <p className="text-foreground/20 text-sm">New coin art added regularly · Discoveries sync to your Tienko Collection</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}