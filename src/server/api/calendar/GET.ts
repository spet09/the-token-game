import type { Request, Response } from 'express';
import { getCalendarSummary, getSeasonStatus, getMonthView, parseDate, todayUTC } from '../../../data/calendarEngine';
import { SEASONS } from '../../../data/seasons';

/**
 * GET /api/calendar
 *
 * Query params:
 *   ?view=summary          (default) — active/upcoming/past seasons + active coins
 *   ?view=month&year=2026&month=8 — calendar grid for a specific month
 *   ?view=season&id=summer — single season detail
 *   ?date=YYYY-MM-DD       — override reference date (for testing)
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { view = 'summary', id, date } = req.query as Record<string, string>;
    const year  = parseInt((req.query.year  as string) || String(new Date().getUTCFullYear()), 10);
    const month = parseInt((req.query.month as string) || String(new Date().getUTCMonth() + 1), 10);

    const ref = date ? parseDate(date) : todayUTC();

    if (view === 'month') {
      const days = getMonthView(year, month, ref);
      return res.json({ year, month, days, today: ref.toISOString().slice(0, 10) });
    }

    if (view === 'season') {
      if (!id) return res.status(400).json({ error: 'id param required for season view' });
      const season = SEASONS.find((s) => s.id === id);
      if (!season) return res.status(404).json({ error: 'Season not found' });
      const status = getSeasonStatus(season, ref);
      return res.json({ season: status });
    }

    // Default: summary
    const summary = getCalendarSummary(ref);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar', message: String(error) });
  }
}
