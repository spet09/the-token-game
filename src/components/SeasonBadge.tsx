/**
 * SeasonBadge — reusable pill/badge for a season theme.
 * Uses game-design identity colors passed via style props (same pattern as zone colors).
 */

import type { SeasonTheme } from '@/data/calendarTypes';

// Game-design constants — season identity colors, not brand palette tokens
export const SEASON_THEME_COLORS: Record<SeasonTheme, string> = {
  winter:  '#7EC8E3',
  spring:  '#7FD67F',
  summer:  '#FFD700',
  autumn:  '#E07B39',
  holiday: '#C41E3A',
  crypto:  '#BF5FFF',
  school:  '#FFB347',
  food:    '#FF9F43',
  spooky:  '#FF6B35',
  love:    '#FF5F8F',
  tax:     '#FF8C42',
  special: '#FFD700',
};

export const SEASON_THEME_LABELS: Record<SeasonTheme, string> = {
  winter:  'Winter',
  spring:  'Spring',
  summer:  'Summer',
  autumn:  'Autumn',
  holiday: 'Holiday',
  crypto:  'Crypto',
  school:  'School',
  food:    'Food',
  spooky:  'Spooky',
  love:    'Love',
  tax:     'Tax',
  special: 'Special',
};

interface SeasonBadgeProps {
  theme: SeasonTheme;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  icon?: string;
}

export function SeasonBadge({ theme, label, size = 'sm', icon }: SeasonBadgeProps) {
  const color = SEASON_THEME_COLORS[theme];
  const text  = label ?? SEASON_THEME_LABELS[theme];

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-0.5',
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{
        background:  `${color}18`,
        color,
        border:      `1px solid ${color}35`,
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'upcoming' | 'past';
  size?: 'xs' | 'sm' | 'md';
}

const STATUS_COLORS = {
  active:   '#7FD67F',
  upcoming: '#FFD700',
  past:     '#888888',
};

const STATUS_LABELS = {
  active:   'Active',
  upcoming: 'Upcoming',
  past:     'Past',
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses}`}
      style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
    >
      {status === 'active' && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: color }}
        />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}
