import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Coins, Swords, Calendar, Clock, Zap, TrendingUp } from 'lucide-react';
import { calendar } from 'virtual:content';
// Cast to the known shape — content layer alias
const calendarContent = calendar as unknown as {
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  tabs: {
    overview: string;
    month: string;
    seasons: string;
  };
  activeLabel: string;
  upcomingLabel: string;
  noActive: string;
  noUpcoming: string;
  progressLabel: string;
  coinsLabel: string;
  daysLeft: string;
  daysUntil: string;
  cta: {
    headline: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};
import { SEASONS } from '@/data/seasons';
import { getCalendarSummary, getMonthView, getSeasonStatus, todayUTC, formatDate } from '@/data/calendarEngine';
import { SeasonBadge, StatusBadge } from '@/components/SeasonBadge';
import type { SeasonStatus, SeasonCoinWindow } from '@/data/calendarTypes';

// ─── Month names ──────────────────────────────────────────────────────────────
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─── Coin Window Card ─────────────────────────────────────────────────────────
function CoinWindowCard({
  coin,
  seasonColor
}: {
  coin: SeasonCoinWindow;
  seasonColor: string;
}) {
  return <motion.div whileHover={{
    y: -2,
    scale: 1.01
  }} className="rounded-xl border p-3 flex items-center gap-3" style={{
    borderColor: `${seasonColor}25`,
    background: `${seasonColor}06`
  }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0" style={{
      background: `${seasonColor}18`,
      border: `1.5px solid ${seasonColor}30`
    }}>
        {coin.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-xs">{coin.name}</span>
          <span className="text-[10px] font-mono" style={{
          color: seasonColor
        }}>{coin.ticker}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
          {coin.flavour}
        </p>
      </div>
      {coin.startDate && <div className="text-[9px] text-muted-foreground shrink-0 text-right">
          <div>{coin.startDate?.slice(5)}</div>
          {coin.endDate && <div>→ {coin.endDate?.slice(5)}</div>}
        </div>}
    </motion.div>;
}

// ─── Season Card ──────────────────────────────────────────────────────────────
function SeasonCard({
  status,
  expanded,
  onToggle
}: {
  status: SeasonStatus;
  expanded: boolean;
  onToggle: () => void;
}) {
  const {
    season
  } = status;
  const color = season.color;
  return <motion.div layout className="rounded-2xl border overflow-hidden" style={{
    borderColor: `${color}30`,
    background: `${color}06`
  }}>
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left p-4 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{
        background: `${color}18`,
        border: `1.5px solid ${color}35`
      }}>
          {season.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-sm">{season.name}</span>
            <StatusBadge status={status.status} />
            <SeasonBadge theme={season.theme} size="xs" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {season.description}
          </p>
        </div>
        <ChevronRight size={14} className="text-muted-foreground shrink-0 mt-1 transition-transform" style={{
        transform: expanded ? 'rotate(90deg)' : 'none'
      }} />
      </button>

      {/* Progress bar */}
      {status.status !== 'upcoming' && <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>{calendarContent.progressLabel}</span>
            <span>{status.progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{
          background: color
        }} initial={{
          width: 0
        }} animate={{
          width: `${status.progressPct}%`
        }} transition={{
          duration: 0.8,
          ease: 'easeOut' as const
        }} />
          </div>
        </div>}

      {/* Meta strip */}
      <div className="px-4 pb-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Coins size={10} />
          <span>{status.activeCoins.length} {calendarContent.coinsLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={10} />
          <span>{season.startDate.slice(5)} → {season.endDate.slice(5)}</span>
        </div>
        {status.status === 'active' && status.daysUntilEnd !== null && <div className="flex items-center gap-1" style={{
        color
      }}>
            <Clock size={10} />
            <span>{status.daysUntilEnd} {calendarContent.daysLeft}</span>
          </div>}
        {status.status === 'upcoming' && status.daysUntilStart !== null && <div className="flex items-center gap-1" style={{
        color
      }}>
            <Zap size={10} />
            <span>{status.daysUntilStart} {calendarContent.daysUntil}</span>
          </div>}
      </div>

      {/* Expanded coin list */}
      <AnimatePresence>
        {expanded && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.25
      }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-2 border-t border-white/10 pt-3">
              {status.activeCoins.length > 0 && <>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Active coins
                  </div>
                  {status.activeCoins.map(coin => <CoinWindowCard key={coin.slug} coin={coin} seasonColor={color} />)}
                </>}
              {status.upcomingCoins.length > 0 && <>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-2 mb-1">
                    Coming soon
                  </div>
                  {status.upcomingCoins.map(coin => <CoinWindowCard key={coin.slug} coin={coin} seasonColor={color} />)}
                </>}
              {status.activeCoins.length === 0 && status.upcomingCoins.length === 0 && <p className="text-xs text-muted-foreground italic">
                  {status.status === 'upcoming' ? 'Coins activate when the season begins.' : 'Season has ended.'}
                </p>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}

// ─── Month Calendar ───────────────────────────────────────────────────────────
function MonthCalendar() {
  const today = todayUTC();
  const [year, setYear] = useState(today.getUTCFullYear());
  const [month, setMonth] = useState(today.getUTCMonth() + 1);
  const days = useMemo(() => getMonthView(year, month, today), [year, month]);
  function prev() {
    if (month === 1) {
      setYear(y => y - 1);
      setMonth(12);
    } else setMonth(m => m - 1);
  }
  function next() {
    if (month === 12) {
      setYear(y => y + 1);
      setMonth(1);
    } else setMonth(m => m + 1);
  }
  return <div>
      {/* Nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-2 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <span className="font-bold text-sm">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button onClick={next} className="p-2 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">
            {d}
          </div>)}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
        // Pick the first active season's color for the day tint
        const firstSeasonId = day.activeSeasonIds[0];
        const firstSeason = firstSeasonId ? SEASONS.find(s => s.id === firstSeasonId) : null;
        const dayColor = firstSeason?.color ?? null;
        return <div key={day.date} className="rounded-lg p-1 min-h-[52px] flex flex-col gap-0.5 relative" style={dayColor ? {
          background: `${dayColor}08`,
          border: `1px solid ${dayColor}20`
        } : {
          border: '1px solid transparent'
        }}>
              <span className={`text-[11px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ${!day.isCurrentMonth ? 'text-muted-foreground/40' : ''}`} style={day.isToday ? {
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))'
          } : dayColor ? {
            color: dayColor
          } : {}}>
                {day.dayOfMonth}
              </span>
              {/* Coin event dots */}
              <div className="flex flex-wrap gap-0.5">
                {day.coinEvents.slice(0, 3).map((ev, i) => <span key={i} className="text-[9px] leading-none" title={`${ev.ticker} ${ev.type}`}>
                    {ev.icon}
                  </span>)}
                {day.coinEvents.length > 3 && <span className="text-[8px] text-muted-foreground">+{day.coinEvents.length - 3}</span>}
              </div>
            </div>;
      })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        {SEASONS.filter(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        const monthStart = new Date(Date.UTC(year, month - 1, 1));
        const monthEnd = new Date(Date.UTC(year, month, 0));
        return start <= monthEnd && end >= monthStart;
      }).map(s => <div key={s.id} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{
          background: s.color
        }} />
            <span>{s.icon} {s.name}</span>
          </div>)}
      </div>
    </div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'month' | 'seasons'>('overview');
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);
  const today = todayUTC();
  const summary = useMemo(() => getCalendarSummary(today), []);
  const allStatuses = useMemo(() => SEASONS.map(s => getSeasonStatus(s, today)).sort((a, b) => {
    const order = {
      active: 0,
      upcoming: 1,
      past: 2
    };
    return order[a.status] - order[b.status];
  }), []);
  const tabs: Array<{
    id: typeof activeTab;
    label: string;
  }> = [{
    id: 'overview',
    label: calendarContent.tabs.overview
  }, {
    id: 'month',
    label: calendarContent.tabs.month
  }, {
    id: 'seasons',
    label: calendarContent.tabs.seasons
  }];
  const title = 'Seasonal Calendar — The Token Game';
  const description = 'Track active seasons, coin windows, and upcoming events in the Token Game Nexus. Know what coins are live and what\'s coming next.';
  const canonical = 'https://thetokengame.xyz/calendar';
  const ogImage = 'https://thetokengame.xyz/og-image.png';
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: title,
          url: canonical,
          description,
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/10 py-16">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full blur-[140px] opacity-10" style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
          }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/40 text-primary bg-primary/10">
                  {calendarContent.hero.eyebrow}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {calendarContent.hero.headline}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                {calendarContent.hero.body}
              </p>
            </motion.div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
              {[{
              icon: '🌊',
              label: 'Active seasons',
              value: String(summary.activeSeasons.length)
            }, {
              icon: '🪙',
              label: 'Active coins',
              value: String(summary.allActiveCoins.length)
            }, {
              icon: '⏳',
              label: 'Upcoming seasons',
              value: String(summary.upcomingSeasons.length)
            }, {
              icon: '📅',
              label: 'Today',
              value: formatDate(today).slice(5)
            }].map((stat, i) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: 0.15 + i * 0.06
            }} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Tab bar */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
              {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px" style={activeTab === tab.id ? {
              borderColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary))'
            } : {
              borderColor: 'transparent',
              color: 'hsl(var(--muted-foreground))'
            }}>
                  {tab.label}
                </button>)}
            </div>

            <AnimatePresence mode="wait">
              {/* ── Overview tab ─────────────────────────────────────────── */}
              {activeTab === 'overview' && <motion.div key="overview" initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.2
            }}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Active coins */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <h2 className="font-bold text-base">{calendarContent.activeLabel}</h2>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {summary.allActiveCoins.length} coins
                        </span>
                      </div>
                      {summary.allActiveCoins.length === 0 ? <p className="text-sm text-muted-foreground italic">{calendarContent.noActive}</p> : <div className="flex flex-col gap-2">
                          {summary.allActiveCoins.map(coin => {
                      // Find the season this coin belongs to for color
                      const season = SEASONS.find(s => s.coins.some(c => c.slug === coin.slug));
                      const color = season?.color ?? '#888';
                      return <CoinWindowCard key={coin.slug} coin={coin} seasonColor={color} />;
                    })}
                        </div>}
                    </div>

                    {/* Upcoming coins */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <h2 className="font-bold text-base">{calendarContent.upcomingLabel}</h2>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {summary.allUpcomingCoins.length} coins
                        </span>
                      </div>
                      {summary.allUpcomingCoins.length === 0 ? <p className="text-sm text-muted-foreground italic">{calendarContent.noUpcoming}</p> : <div className="flex flex-col gap-2">
                          {summary.allUpcomingCoins.map(coin => {
                      const season = SEASONS.find(s => s.coins.some(c => c.slug === coin.slug));
                      const color = season?.color ?? '#888';
                      return <CoinWindowCard key={coin.slug} coin={coin} seasonColor={color} />;
                    })}
                        </div>}
                    </div>
                  </div>

                  {/* Active seasons strip */}
                  {summary.activeSeasons.length > 0 && <div className="mt-10">
                      <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                        <TrendingUp size={15} className="text-primary" />
                        Active seasons
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {summary.activeSeasons.map((s, i) => <motion.div key={s.season.id} initial={{
                    opacity: 0,
                    y: 12
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    duration: 0.3,
                    delay: i * 0.05
                  }} className="rounded-2xl border p-4 flex flex-col gap-3" style={{
                    borderColor: `${s.season.color}30`,
                    background: `${s.season.color}07`
                  }}>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{s.season.icon}</span>
                              <div>
                                <div className="font-bold text-sm">{s.season.name}</div>
                                <div className="flex gap-1 mt-0.5">
                                  <StatusBadge status="active" size="xs" />
                                  <SeasonBadge theme={s.season.theme} size="xs" />
                                </div>
                              </div>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{
                        width: `${s.progressPct}%`,
                        background: s.season.color
                      }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>{s.activeCoins.length} coins active</span>
                              {s.daysUntilEnd !== null && <span style={{
                        color: s.season.color
                      }}>{s.daysUntilEnd}d left</span>}
                            </div>
                          </motion.div>)}
                      </div>
                    </div>}
                </motion.div>}

              {/* ── Month tab ─────────────────────────────────────────────── */}
              {activeTab === 'month' && <motion.div key="month" initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.2
            }} className="max-w-2xl">
                  <MonthCalendar />
                </motion.div>}

              {/* ── All seasons tab ───────────────────────────────────────── */}
              {activeTab === 'seasons' && <motion.div key="seasons" initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.2
            }}>
                  <div className="flex flex-col gap-3">
                    {allStatuses.map((status, i) => <motion.div key={status.season.id} initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.3,
                  delay: i * 0.03
                }}>
                        <SeasonCard status={status} expanded={expandedSeason === status.season.id} onToggle={() => setExpandedSeason(expandedSeason === status.season.id ? null : status.season.id)} />
                      </motion.div>)}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 16
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <div className="text-5xl mb-6">📅</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                {calendarContent.cta.headline}
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                {calendarContent.cta.body}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2 font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90" style={{
                boxShadow: '0 0 40px hsl(var(--primary) / 0.4)'
              }} asChild>
                  <Link to="/coins">
                    <Coins size={15} />
                    {calendarContent.cta.primaryLabel}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                  <Link to="/quests">
                    <Swords size={15} />
                    {calendarContent.cta.secondaryLabel}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>;
}
