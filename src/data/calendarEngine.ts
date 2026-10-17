/**
 * Calendar Engine
 *
 * Pure functions for computing season status, active coins, and upcoming
 * windows relative to a given reference date (UTC midnight).
 */

import { SEASONS } from './seasons';
import type { Season, SeasonCoinWindow, SeasonStatus } from './calendarTypes';

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Parse YYYY-MM-DD → UTC midnight Date */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Format Date → YYYY-MM-DD */
export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Days between two dates (positive = b is after a) */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Today at UTC midnight */
export function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// ─── Season status ────────────────────────────────────────────────────────────

export function getSeasonStatus(season: Season, ref: Date = todayUTC()): SeasonStatus {
  const start = parseDate(season.startDate);
  const end   = parseDate(season.endDate);

  const isPast     = ref > end;
  const isActive   = ref >= start && ref <= end;
  const isUpcoming = ref < start;

  const totalDays    = daysBetween(start, end) || 1;
  const elapsedDays  = isActive ? daysBetween(start, ref) : isUpcoming ? 0 : totalDays;
  const progressPct  = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  const activeCoins   = getActiveCoins(season, ref);
  const upcomingCoins = getUpcomingCoins(season, ref, 14);

  return {
    season,
    status:          isPast ? 'past' : isActive ? 'active' : 'upcoming',
    daysUntilStart:  isUpcoming ? daysBetween(ref, start) : null,
    daysUntilEnd:    isActive   ? daysBetween(ref, end)   : null,
    progressPct,
    activeCoins,
    upcomingCoins,
  };
}

/** Coins whose individual window (or the season itself) is active on `ref` */
export function getActiveCoins(season: Season, ref: Date = todayUTC()): SeasonCoinWindow[] {
  const seasonStart = parseDate(season.startDate);
  const seasonEnd   = parseDate(season.endDate);
  if (ref < seasonStart || ref > seasonEnd) return [];

  return season.coins.filter((coin) => {
    if (!coin.startDate && !coin.endDate) return true; // always active within season
    const cs = coin.startDate ? parseDate(coin.startDate) : seasonStart;
    const ce = coin.endDate   ? parseDate(coin.endDate)   : seasonEnd;
    return ref >= cs && ref <= ce;
  });
}

/** Coins whose window starts within the next `withinDays` days */
export function getUpcomingCoins(
  season: Season,
  ref: Date = todayUTC(),
  withinDays = 14,
): SeasonCoinWindow[] {
  const seasonStart = parseDate(season.startDate);
  const seasonEnd   = parseDate(season.endDate);
  if (ref > seasonEnd) return [];

  const horizon = new Date(ref.getTime() + withinDays * 86_400_000);

  return season.coins.filter((coin) => {
    if (!coin.startDate) return false; // no specific start = already covered by active
    const cs = parseDate(coin.startDate);
    return cs > ref && cs <= horizon && cs >= seasonStart && cs <= seasonEnd;
  });
}

// ─── All-seasons summary ──────────────────────────────────────────────────────

export interface CalendarSummary {
  activeSeasons:   SeasonStatus[];
  upcomingSeasons: SeasonStatus[];
  pastSeasons:     SeasonStatus[];
  allActiveCoins:  SeasonCoinWindow[];
  allUpcomingCoins:SeasonCoinWindow[];
  today:           string;
}

export function getCalendarSummary(ref: Date = todayUTC()): CalendarSummary {
  const statuses = SEASONS.map((s) => getSeasonStatus(s, ref));

  const activeSeasons   = statuses.filter((s) => s.status === 'active');
  const upcomingSeasons = statuses.filter((s) => s.status === 'upcoming')
    .sort((a, b) => (a.daysUntilStart ?? 0) - (b.daysUntilStart ?? 0));
  const pastSeasons     = statuses.filter((s) => s.status === 'past');

  // Deduplicate coins by slug across all active seasons
  const seenSlugs = new Set<string>();
  const allActiveCoins: SeasonCoinWindow[] = [];
  for (const s of activeSeasons) {
    for (const c of s.activeCoins) {
      if (!seenSlugs.has(c.slug)) {
        seenSlugs.add(c.slug);
        allActiveCoins.push(c);
      }
    }
  }

  const seenUpcoming = new Set<string>();
  const allUpcomingCoins: SeasonCoinWindow[] = [];
  for (const s of [...activeSeasons, ...upcomingSeasons]) {
    for (const c of s.upcomingCoins) {
      if (!seenUpcoming.has(c.slug)) {
        seenUpcoming.add(c.slug);
        allUpcomingCoins.push(c);
      }
    }
  }

  return {
    activeSeasons,
    upcomingSeasons,
    pastSeasons,
    allActiveCoins,
    allUpcomingCoins,
    today: formatDate(ref),
  };
}

// ─── Month view ───────────────────────────────────────────────────────────────

export interface MonthDay {
  date: string;
  dayOfMonth: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  activeSeasonIds: string[];
  coinEvents: Array<{ slug: string; ticker: string; icon: string; type: 'start' | 'end' | 'active' }>;
}

export function getMonthView(year: number, month: number, ref: Date = todayUTC()): MonthDay[] {
  // month is 1-based
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const lastDay  = new Date(Date.UTC(year, month, 0));

  // Pad to start on Monday
  const startPad = (firstDay.getUTCDay() + 6) % 7; // Mon=0
  const days: MonthDay[] = [];

  for (let i = -startPad; i <= lastDay.getUTCDate() - 1 + (6 - (lastDay.getUTCDay() + 6) % 7); i++) {
    const d = new Date(Date.UTC(year, month - 1, 1 + i));
    const dateStr = formatDate(d);
    const isCurrentMonth = d.getUTCMonth() === month - 1;

    const activeSeasonIds: string[] = [];
    const coinEvents: MonthDay['coinEvents'] = [];

    for (const season of SEASONS) {
      const start = parseDate(season.startDate);
      const end   = parseDate(season.endDate);
      if (d >= start && d <= end) {
        activeSeasonIds.push(season.id);
        for (const coin of season.coins) {
          const cs = coin.startDate ? parseDate(coin.startDate) : null;
          const ce = coin.endDate   ? parseDate(coin.endDate)   : null;
          if (cs && formatDate(cs) === dateStr) {
            coinEvents.push({ slug: coin.slug, ticker: coin.ticker, icon: coin.icon, type: 'start' });
          } else if (ce && formatDate(ce) === dateStr) {
            coinEvents.push({ slug: coin.slug, ticker: coin.ticker, icon: coin.icon, type: 'end' });
          }
        }
      }
    }

    days.push({
      date: dateStr,
      dayOfMonth: d.getUTCDate(),
      isToday: dateStr === formatDate(ref),
      isCurrentMonth,
      activeSeasonIds,
      coinEvents,
    });
  }

  return days;
}
