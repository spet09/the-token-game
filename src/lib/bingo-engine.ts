/**
 * Bingo game engine — pure functions, no side effects.
 * Uses a seeded PRNG so every player gets the same daily card + draw order.
 */

import { COINS } from '../data/coins.js';
import type { RarityTier } from './wagmi-config.js';
import { getRarity } from './wagmi-config.js';

export interface BingoCoin {
  ticker: string;
  name: string;
  image: string;
  buyUrl: string;
  rarity: RarityTier;
  number: number; // 1-75 bingo number assigned to this coin
}

export interface BingoCard {
  cells: BingoCoin[];   // 25 cells, index 12 = FREE space
  seed: string;
  date: string;
}

export interface DrawnNumber {
  number: number;
  coin: BingoCoin;
  calledAt: number; // timestamp
}

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function seedFromDate(dateStr: string): number {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) h = (Math.imul(31, h) + dateStr.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Build coin pool with bingo numbers ───────────────────────────────────────
function buildCoinPool(rand: () => number): BingoCoin[] {
  const pool = COINS.filter(c => c.image).map((c, i) => ({
    ticker: c.ticker,
    name: c.name,
    image: c.image ?? '',
    buyUrl: c.buyUrl,
    rarity: getRarity(c.ticker),
    number: (i % 75) + 1,
  }));
  return shuffle(pool, rand);
}

// ── Generate today's card ─────────────────────────────────────────────────────
export function generateDailyCard(dateStr: string, playerSalt = ''): BingoCard {
  const seed = seedFromDate(dateStr + playerSalt);
  const rand = mulberry32(seed);
  const pool = buildCoinPool(rand);

  // Pick 24 coins (+ FREE center = 25 total)
  const picked = pool.slice(0, 24);
  const cells: BingoCoin[] = [
    ...picked.slice(0, 12),
    { ticker: 'FREE', name: 'Free Space', image: '/airo-assets/images/logo/primary', buyUrl: '', rarity: 'legendary', number: 0 },
    ...picked.slice(12),
  ];

  return { cells, seed: String(seed), date: dateStr };
}

// ── Generate today's draw order (60 numbers) ─────────────────────────────────
export function generateDailyDraw(dateStr: string): BingoCoin[] {
  const seed = seedFromDate('draw:' + dateStr);
  const rand = mulberry32(seed);
  const pool = buildCoinPool(rand);
  return pool.slice(0, 60);
}

// ── Win detection ─────────────────────────────────────────────────────────────
const WIN_PATTERNS = [
  // Rows
  [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
  // Cols
  [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
  // Diagonals
  [0,6,12,18,24], [4,8,12,16,20],
];

export function checkWin(marked: Set<number>): number[][] {
  return WIN_PATTERNS.filter(pattern => pattern.every(i => marked.has(i)));
}

export function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}
