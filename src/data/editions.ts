// ─── Edition zones — canonical list used across the app ──────────────────────
// Zone colors are game-design constants (each zone has a distinct identity).
// They are intentionally data-driven, not brand palette tokens.

export const EDITIONS = [
  { href: '/global',          label: 'Global',          flag: '🌐', coins: 212, zoneColor: '#BF5FFF' },
  { href: '/usa',             label: 'USA',             flag: '🇺🇸', coins: 96,  zoneColor: '#3B82F6' },
  { href: '/europe',          label: 'Europe',          flag: '🇪🇺', coins: 96,  zoneColor: '#6366F1' },
  { href: '/china',           label: 'China',           flag: '🇨🇳', coins: 96,  zoneColor: '#EF4444' },
  { href: '/japan',           label: 'Japan',           flag: '🇯🇵', coins: 96,  zoneColor: '#EC4899' },
  { href: '/india',           label: 'India',           flag: '🇮🇳', coins: 96,  zoneColor: '#F97316' },
  { href: '/australia',       label: 'Australia',       flag: '🇦🇺', coins: 96,  zoneColor: '#10B981' },
  { href: '/africa',          label: 'Africa',          flag: '🌍',  coins: 96,  zoneColor: '#F59E0B' },
  { href: '/russia',          label: 'Russia',          flag: '🇷🇺', coins: 96,  zoneColor: '#8B5CF6' },
  { href: '/southamerica',    label: 'South America',   flag: '🌎',  coins: 96,  zoneColor: '#14B8A6' },
  { href: '/middleeast',      label: 'Middle East',     flag: '🌙',  coins: 96,  zoneColor: '#D97706' },
  { href: '/oceania',         label: 'Oceania',         flag: '🌊',  coins: 96,  zoneColor: '#0EA5E9' },
  { href: '/northamerica',    label: 'North America',   flag: '🍁',  coins: 96,  zoneColor: '#DC2626' },
  { href: '/centralamerica',  label: 'Central America', flag: '🌺',  coins: 96,  zoneColor: '#16A34A' },
  { href: '/arctic',          label: 'Arctic',          flag: '🧊',  coins: 96,  zoneColor: '#67E8F9' },
  { href: '/antarctica',      label: 'Antarctica',      flag: '🐧',  coins: 96,  zoneColor: '#A5B4FC' },
] as const;

export type Edition = typeof EDITIONS[number];
