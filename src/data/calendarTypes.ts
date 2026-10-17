/**
 * Seasonal Calendar — type definitions
 *
 * A "season" is a named period (e.g. "Winter 2025", "Tax Season") that
 * activates a set of coins. Coins within a season have an optional
 * individual window (startDate / endDate) that narrows when they are
 * "active" within the broader season.
 *
 * All dates are ISO-8601 strings (YYYY-MM-DD). Comparisons use UTC midnight.
 */

export type SeasonId = string;

export type SeasonTheme =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'holiday'
  | 'crypto'
  | 'school'
  | 'food'
  | 'spooky'
  | 'love'
  | 'tax'
  | 'special';

export interface SeasonCoinWindow {
  /** Coin slug as used in the edition page (e.g. "janend", "val") */
  slug: string;
  /** Human-readable coin name */
  name: string;
  /** Ticker symbol */
  ticker: string;
  /** Edition the coin belongs to */
  edition: string;
  /** Optional narrower active window within the season */
  startDate: string | null;
  endDate: string | null;
  /** Short flavour text for the calendar */
  flavour: string;
  /** Emoji icon */
  icon: string;
}

export interface Season {
  id: SeasonId;
  name: string;
  theme: SeasonTheme;
  /** Broad season window */
  startDate: string;
  endDate: string;
  /** Colour used for UI accents (game-design constant, not brand token) */
  color: string;
  /** Emoji representing the season */
  icon: string;
  /** Short description */
  description: string;
  coins: SeasonCoinWindow[];
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  seasons: SeasonId[];
  activeCoins: SeasonCoinWindow[];
  upcomingCoins: SeasonCoinWindow[]; // start within next 7 days
}

export interface SeasonStatus {
  season: Season;
  status: 'active' | 'upcoming' | 'past';
  daysUntilStart: number | null;
  daysUntilEnd: number | null;
  progressPct: number; // 0-100
  activeCoins: SeasonCoinWindow[];
  upcomingCoins: SeasonCoinWindow[];
}
