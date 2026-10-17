import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { ExternalLink, Lock, CheckCircle2, Clock, Zap } from 'lucide-react';
import {
  PERMANENT_COINS,
  SEASONAL_YEAR_ONE,
  FINALE_COINS,
  YEAR_TWO_GROUPS,
  type Coin,
  type CoinGroup,
} from '@/data/coins';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Launch Calendar ──────────────────────────────────────────────────────────
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Map month name → index (0-based)
const MONTH_INDEX: Record<string, number> = {
  January:0, February:1, March:2, April:3, May:4, June:5,
  July:6, August:7, September:8, October:9, November:10, December:11,
};

function LaunchCalendar() {
  const primaryColor   = 'hsl(276 100% 69%)';
  const secondaryColor = 'hsl(306 100% 69%)';
  const accentColor    = 'hsl(96 100% 69%)';

  // Today's month index (0-based) — used to highlight "current" month
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear     = now.getFullYear();

  // Year One started January 2026 (first live coin was $RESO in Jan)
  const YEAR_ONE_START_YEAR = 2026;

  return (
    <section className="py-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-4"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}10` }}
          >
            Year One · 2026
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Launch Calendar
          </h2>
          <p className="text-foreground/50 text-sm max-w-2xl">
            New coins drop every month throughout Year One. Each month brings a fresh batch — collect them before the window closes.
          </p>
        </motion.div>

        {/* Calendar grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {SEASONAL_YEAR_ONE.map((group, i) => {
            const monthIdx = MONTH_INDEX[group.month ?? ''] ?? i;
            const liveCoins   = group.coins.filter(c => c.status === 'live');
            const totalCoins  = group.coins.length;
            const isFullyLive = liveCoins.length === totalCoins;
            const isPartial   = liveCoins.length > 0 && !isFullyLive;
            const hasAnyLive  = liveCoins.length > 0;

            // Is this month in the past, current, or future relative to today?
            const calYear = YEAR_ONE_START_YEAR;
            const isPast    = currentYear > calYear || (currentYear === calYear && currentMonthIdx > monthIdx);
            const isCurrent = currentYear === calYear && currentMonthIdx === monthIdx;

            let borderColor = 'hsl(255 20% 20%)';
            let bgColor     = 'hsl(255 20% 8%)';
            let labelColor  = 'hsl(255 20% 40%)';
            let statusIcon  = <Lock size={12} className="shrink-0" style={{ color: 'hsl(255 20% 35%)' }} />;
            let statusLabel = 'Upcoming';
            let statusColor = 'hsl(255 20% 35%)';
            let glowStyle: React.CSSProperties = {};

            if (isFullyLive) {
              borderColor = `${accentColor}50`;
              bgColor     = `${accentColor}08`;
              labelColor  = accentColor;
              statusIcon  = <CheckCircle2 size={12} className="shrink-0" style={{ color: accentColor }} />;
              statusLabel = 'Live';
              statusColor = accentColor;
              glowStyle   = { boxShadow: `0 0 16px ${accentColor}20` };
            } else if (isPartial) {
              borderColor = `${secondaryColor}50`;
              bgColor     = `${secondaryColor}08`;
              labelColor  = secondaryColor;
              statusIcon  = <Zap size={12} className="shrink-0" style={{ color: secondaryColor }} />;
              statusLabel = `${liveCoins.length}/${totalCoins} Live`;
              statusColor = secondaryColor;
              glowStyle   = { boxShadow: `0 0 16px ${secondaryColor}20` };
            } else if (isCurrent && !hasAnyLive) {
              borderColor = `${primaryColor}50`;
              bgColor     = `${primaryColor}08`;
              labelColor  = primaryColor;
              statusIcon  = <Clock size={12} className="shrink-0" style={{ color: primaryColor }} />;
              statusLabel = 'This Month';
              statusColor = primaryColor;
              glowStyle   = { boxShadow: `0 0 16px ${primaryColor}20` };
            } else if (isPast && !hasAnyLive) {
              statusLabel = 'Missed';
              statusColor = 'hsl(255 20% 30%)';
            }

            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: 'easeOut' as const }}
                className="rounded-xl border p-3 flex flex-col gap-2"
                style={{ borderColor, background: bgColor, ...glowStyle }}
              >
                {/* Month name */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-bold" style={{ color: labelColor, fontFamily: 'var(--font-heading)' }}>
                    {MONTH_ABBR[monthIdx]}
                  </span>
                  {statusIcon}
                </div>

                {/* Coin count */}
                <div className="text-xs" style={{ color: 'hsl(255 20% 45%)' }}>
                  {totalCoins} coin{totalCoins !== 1 ? 's' : ''}
                </div>

                {/* Coin ticker pills */}
                <div className="flex flex-wrap gap-1">
                  {group.coins.map(coin => (
                    <span
                      key={coin.ticker}
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: coin.status === 'live' ? `${labelColor}18` : 'hsl(255 20% 12%)',
                        color: coin.status === 'live' ? labelColor : 'hsl(255 20% 32%)',
                      }}
                    >
                      {coin.ticker.replace('$', '')}
                    </span>
                  ))}
                </div>

                {/* Status label */}
                <div className="text-[10px] font-semibold uppercase tracking-wider mt-auto pt-1" style={{ color: statusColor }}>
                  {statusLabel}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 mt-6 text-xs text-foreground/40">
          {[
            { icon: <CheckCircle2 size={12} />, color: accentColor,    label: 'All coins live' },
            { icon: <Zap size={12} />,          color: secondaryColor, label: 'Partially live' },
            { icon: <Clock size={12} />,         color: primaryColor,   label: 'Current month' },
            { icon: <Lock size={12} />,          color: 'hsl(255 20% 35%)', label: 'Coming soon' },
          ].map(({ icon, color, label }) => (
            <div key={label} className="flex items-center gap-1.5" style={{ color }}>
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function CoinCard({ coin, index }: { coin: Coin; index: number }) {
  const color = tickerColor(coin.ticker);
  const isLive = coin.status === 'live';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: 'easeOut' as const }}
      className={`rounded-xl border p-4 flex flex-col items-center gap-3 text-center transition-all duration-200 ${
        isLive
          ? 'bg-card/70 backdrop-blur-sm cursor-pointer'
          : 'bg-white/[0.02] opacity-60'
      }`}
      style={{
        borderColor: isLive ? `${color}40` : 'hsl(255 20% 20%)',
        boxShadow: isLive ? `0 0 0 0 ${color}00` : undefined,
      }}
      whileHover={isLive ? { y: -3, boxShadow: `0 0 20px ${color}30, 0 0 0 1px ${color}30` } : {}}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 relative"
        style={{
          background: isLive ? `${color}18` : 'hsl(255 20% 15%)',
          border: `2px solid ${isLive ? `${color}55` : 'hsl(255 20% 22%)'}`,
        }}
      >
        {/* Always render img so canvas Replace can target it */}
        <img
          src={coin.image || "/placeholder.jpg"}
          alt={coin.name}
          className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: coin.image ? 1 : 0 }}
          loading="lazy"
        />
        {!coin.image && isLive && (
          <span style={{ color, fontFamily: 'var(--font-heading)', fontSize: '10px' }}>
            {coin.ticker.replace('$', '').slice(0, 4)}
          </span>
        )}
        {!coin.image && !isLive && (
          <Lock size={16} className="text-foreground/20" />
        )}
      </div>

      {/* Ticker + name */}
      <div className="flex-1 min-w-0 w-full">
        <div
          className="font-bold text-sm leading-tight"
          style={{ color: isLive ? color : 'hsl(255 20% 45%)', fontFamily: 'var(--font-heading)' }}
        >
          {coin.ticker}
        </div>
        <div className="text-xs mt-0.5 leading-snug" style={{ color: isLive ? 'hsl(255 20% 65%)' : 'hsl(255 20% 35%)' }}>
          {coin.name}
        </div>
      </div>

      {/* CTA */}
      {isLive ? (
        <a href={coin.buyUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button
            size="sm"
            className="w-full gap-1 text-xs font-semibold"
            style={{ background: color, color: 'hsl(259 44% 7%)' }}
          >
            Buy
            <ExternalLink size={10} />
          </Button>
        </a>
      ) : (
        <div
          className="w-full text-center text-xs py-1.5 rounded-md font-medium"
          style={{ background: 'hsl(255 20% 12%)', color: 'hsl(255 20% 35%)' }}
        >
          Coming Soon
        </div>
      )}
    </motion.div>
  );
}

// ─── Month group block ────────────────────────────────────────────────────────
function MonthGroup({ group, accentColor }: { group: CoinGroup; accentColor: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
        >
          {group.label}
        </div>
        <div className="text-xs text-foreground/30">{group.coins.length} coins</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {group.coins.map((coin, i) => (
          <CoinCard key={coin.ticker} coin={coin} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  badge,
  badgeColor,
  title,
  subtitle,
  children,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-4"
            style={{
              borderColor: `${badgeColor}40`,
              color: badgeColor,
              background: `${badgeColor}10`,
            }}
          >
            {badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          <p className="text-foreground/50 text-sm max-w-2xl">{subtitle}</p>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const title = 'Coin Roadmap — The Token Game';
  const description =
    'The full Token Game roadmap: 12 permanent Solana coins, 96 seasonal drops across 2 years. See what\'s live, what\'s next, and what\'s coming.';

  const totalLive = [...PERMANENT_COINS, ...SEASONAL_YEAR_ONE.flatMap((g) => g.coins), ...FINALE_COINS, ...YEAR_TWO_GROUPS.flatMap((g) => g.coins)].filter(
    (c) => c.status === 'live'
  ).length;

  const primaryColor = 'hsl(276 100% 69%)';
  const secondaryColor = 'hsl(306 100% 69%)';
  const accentColor = 'hsl(96 100% 69%)';
  const goldColor = 'hsl(45 100% 65%)';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/roadmap" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/roadmap" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url: 'https://thetokengame.xyz/roadmap',
          isPartOf: { '@type': 'WebSite', name: 'The Token Game', url: 'https://thetokengame.xyz' },
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[130px] opacity-15"
            style={{ background: primaryColor }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6"
              style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}10` }}
            >
              108 Coins · 2 Years
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Coin Roadmap
            </h1>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Every coin that will ever exist in The Token Game. Permanent, seasonal, and Year Two drops — all in one place.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-10 mt-12"
          >
            {[
              { label: 'Total Coins', value: '108' },
              { label: 'Live Now', value: String(totalLive) },
              { label: 'Year One', value: '56' },
              { label: 'Year Two', value: '52' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor, fontFamily: 'var(--font-heading)' }}>
                  {value}
                </div>
                <div className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Launch Calendar ── */}
      <LaunchCalendar />

      {/* ── Permanent Collection ── */}
      <Section
        badge="Always Available"
        badgeColor={primaryColor}
        title="Permanent Collection"
        subtitle="These 12 coins are live all year, every year. Buy them anytime on Raydium."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {PERMANENT_COINS.map((coin, i) => (
            <CoinCard key={coin.ticker} coin={coin} index={i} />
          ))}
        </div>
      </Section>

      {/* ── Year One Seasonal ── */}
      <Section
        badge="Year One · Seasonal"
        badgeColor={secondaryColor}
        title="Seasonal Drops"
        subtitle="New coins drop each month throughout Year One. Hold them to climb the collector tiers."
      >
        <div className="flex flex-col gap-10">
          {SEASONAL_YEAR_ONE.map((group) => (
            <MonthGroup key={group.label} group={group} accentColor={secondaryColor} />
          ))}
        </div>
      </Section>

      {/* ── Finale ── */}
      <Section
        badge="Year One · Finale"
        badgeColor={accentColor}
        title="Finale Coins"
        subtitle="Three special coins to close out Year One. Only available at the end of the year."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-sm">
          {FINALE_COINS.map((coin, i) => (
            <CoinCard key={coin.ticker} coin={coin} index={i} />
          ))}
        </div>
      </Section>

      {/* ── Year Two ── */}
      <Section
        badge="Year Two"
        badgeColor={goldColor}
        title="Year Two"
        subtitle="52 coins exclusive to Year Two. A whole new season for collectors who make it through Year One."
      >
        <div className="flex flex-col gap-10">
          {YEAR_TWO_GROUPS.map((group) => (
            <MonthGroup key={`y2-${group.label}`} group={group} accentColor={goldColor} />
          ))}
        </div>
      </Section>
    </>
  );
}
