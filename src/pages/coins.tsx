import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap, Layers, Star, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { COINS, TIENKO } from '@/data/coins';
import type { Coin } from '@/data/coins';
import { useState } from 'react';
import { getBackstory } from '@/data/backstories';
import { coins } from 'virtual:content';

// Deterministic color from ticker string
function tickerColor(ticker: string): string {
  const colors = [
    'hsl(276 100% 69%)',
    'hsl(306 100% 69%)',
    'hsl(96 100% 69%)',
    'hsl(200 100% 65%)',
    'hsl(45 100% 65%)',
    'hsl(340 100% 65%)',
  ];
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function CoinRowCard({ coin, color }: { coin: Coin; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const backstory = getBackstory(coin.ticker);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm overflow-hidden"
      style={{ cursor: backstory ? 'pointer' : undefined }}
      onClick={backstory ? () => setExpanded((v) => !v) : undefined}
    >
      <div className="p-5 flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden relative"
          style={{ background: `${color}18`, border: `2px solid ${color}55` }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ color, fontFamily: 'var(--font-heading)', opacity: coin.image ? 0 : 1 }}
          >
            {coin.ticker.replace('$', '').slice(0, 4)}
          </span>
          <img
            src={coin.image || '/placeholder.jpg'}
            alt={coin.name}
            width={48}
            height={48}
            className="w-full h-full object-cover absolute inset-0"
            style={{ opacity: coin.image ? 1 : 0 }}
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight" style={{ color, fontFamily: 'var(--font-heading)' }}>
            {coin.ticker}
          </div>
          <div className="text-xs text-foreground/50 leading-snug mt-0.5 truncate" title={coin.name}>
            {coin.name}
          </div>
        </div>

        {/* Chevron */}
        {backstory && (
          <div className="shrink-0 mr-1" style={{ color }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        )}

        {/* Discover button — only shown when a collectible detail page exists */}
        {coin.buyUrl && coin.buyUrl !== '#' ? (
          <a
            href={coin.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              className="gap-1.5 text-xs font-semibold"
              style={{ background: color, color: 'hsl(259 44% 7%)' }}
            >
              <span>{coins.discoverLabel}</span>
              <ExternalLink size={11} />
            </Button>
          </a>
        ) : (
          <div
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md opacity-30 border"
            style={{ borderColor: color, color }}
          >
            <span>{coins.undiscoveredLabel}</span>
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
            className="px-5 pb-4 flex flex-col gap-2 text-[11px] leading-snug"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div className="h-px w-full mb-1" style={{ background: `${color}25` }} />
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
            <p className="italic mt-1" style={{ color }}>
              ✦ {backstory.curatorNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoinsPage() {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(TIENKO.contractAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const title = 'All Coins — The Token Game';
  const description =
    '1,080 collectible coins across 10 regional editions. Browse the full Tienko Collection — discover lore, origin stories, and cultural moments.';

  const permanentCoins = COINS.filter((c) => c.permanent);
  const otherCoins = COINS.filter((c) => !c.permanent);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/coins" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/coins" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: 'https://thetokengame.xyz/coins',
          isPartOf: { '@type': 'WebSite', name: 'The Token Game', url: 'https://thetokengame.xyz' },
        })}</script>
      </Helmet>

      {/* Page header */}
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-15"
            style={{ background: 'hsl(276 100% 69%)' }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
              <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6"
              style={{
                borderColor: 'hsl(276 100% 69% / 0.4)',
                color: 'hsl(276 100% 69%)',
                background: 'hsl(276 100% 69% / 0.1)',
              }}
            >
              <span>{coins.header.badge}</span>
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span>{coins.header.heading}</span>
            </h1>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              <span>{coins.header.subheading}</span>
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mt-10"
          >
            {[
              { label: coins.header.statTotalLabel, value: '108' },
              { label: coins.header.statPermanentLabel, value: String(permanentCoins.length) },
              { label: coins.header.statLiveLabel, value: String(COINS.length) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: 'hsl(276 100% 69%)', fontFamily: 'var(--font-heading)' }}
                >
                  {value}
                </div>
                <div className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5"><span>{label}</span></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TIENKO Flagship Token ── */}
      <section className="py-14 border-b border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="relative rounded-3xl overflow-hidden border border-yellow-400/30 max-w-4xl mx-auto"
            style={{
              background: 'linear-gradient(135deg, #0d0a1a 0%, #1a1030 50%, #0d0a1a 100%)',
              boxShadow: '0 0 60px #D4A01722, 0 0 120px #BF5FFF11',
            }}
          >
            {/* Glow blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[80px] opacity-20"
                style={{ background: '#D4A017' }} />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-15"
                style={{ background: '#BF5FFF' }} />
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(#D4A017 1px, transparent 1px), linear-gradient(90deg, #D4A017 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
            </div>

            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              {/* Token image / badge */}
              <div className="shrink-0">
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden relative"
                  style={{
                    background: 'linear-gradient(135deg, #D4A01730, #BF5FFF20)',
                    border: '2px solid #D4A01760',
                    boxShadow: '0 0 30px #D4A01740',
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center text-2xl font-black"
                    style={{ color: '#D4A017', fontFamily: 'var(--font-heading)' }}
                  >
                    $TEN
                  </span>
                  <img
                    src={TIENKO.image || '/placeholder.jpg'}
                    alt="TIENKO token"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                    loading="eager"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ background: '#D4A01720', color: '#D4A017', border: '1px solid #D4A01740' }}>
                  <Star size={11} fill="currentColor" />
                  <span>{coins.tienko.flagshipBadge}</span>
                </div>

                <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                  <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#D4A017' }}>
                    {TIENKO.name}
                  </h2>
                  <span className="text-lg font-bold text-foreground/50">{TIENKO.ticker}</span>
                </div>

                <p className="text-foreground/65 text-sm leading-relaxed mb-5 max-w-lg">
                  {TIENKO.description}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                  {[
                    { icon: Layers, label: TIENKO.network },
                    { icon: Zap, label: `${TIENKO.totalSupply} supply` },
                    { icon: Zap, label: `${TIENKO.decimals} decimals` },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 text-foreground/55"
                    >
                      <Icon size={11} />
                      {label}
                    </span>
                  ))}
                </div>

                {/* Contract address */}
                <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
                  <span className="text-xs text-foreground/35 font-mono truncate max-w-[220px] md:max-w-xs">
                    {TIENKO.contractAddress}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="shrink-0 p-1.5 rounded-md border border-white/10 text-foreground/40 hover:text-foreground/70 hover:border-white/20 transition-colors"
                    aria-label="Copy contract address"
                  >
                    {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  </button>
                </div>

                {/* CTA */}
                <a
                  href={TIENKO.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-100"
                  style={{
                    background: 'linear-gradient(135deg, #D4A017, #F5C842)',
                    color: '#0d0a1a',
                    boxShadow: '0 0 30px #D4A01755',
                  }}
                >
                  <span>{coins.tienko.buyCtaLabel}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Permanent Coins */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              <span>{coins.permanentSection.heading}</span>
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: 'hsl(276 100% 69% / 0.15)',
                color: 'hsl(276 100% 69%)',
                border: '1px solid hsl(276 100% 69% / 0.3)',
              }}
            >
              {permanentCoins.length} coins
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {permanentCoins.map((coin, i) => {
              const color = tickerColor(coin.ticker);
              return (
                <motion.div
                  key={coin.ticker}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
                >
                  <CoinRowCard coin={coin} color={color} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other coins (if any added later) */}
      {otherCoins.length > 0 && (
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-8"
            >
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                <span>{coins.moreSection.heading}</span>
              </h2>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: 'hsl(306 100% 69% / 0.15)',
                  color: 'hsl(306 100% 69%)',
                  border: '1px solid hsl(306 100% 69% / 0.3)',
                }}
              >
                {otherCoins.length} coins
              </span>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {otherCoins.map((coin, i) => {
                const color = tickerColor(coin.ticker);
                return (
                  <motion.div
                    key={coin.ticker}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
                  >
                    <CoinRowCard coin={coin} color={color} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Coming soon placeholder */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 max-w-2xl mx-auto"
          >
            <div className="text-4xl mb-4">🪙</div>
            <h3 className="text-xl font-bold mb-2">More Coins Coming</h3>
            <p className="text-foreground/40 text-sm">
              {COINS.length} of 108 coins live. New coins drop throughout the year.
              Join Discord to be the first to know.
            </p>
            <a
              href="https://discord.gg/FvwyWzbnj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6"
            >
              <Button
                variant="outline"
                className="border-white/20 text-foreground/60 hover:border-primary/50 hover:text-primary"
              >
                Join Discord for Updates
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
