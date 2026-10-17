import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from "react-router";
import { ArrowRight, ArrowDown, ChevronRight, Zap, TrendingUp, RefreshCw, Coins, Target } from 'lucide-react';
import { CRAFTABLE_COINS, SPECIAL_COINS, XP_COIN, CONVERSION_RATES, TIER_LABELS, TIER_COLORS, convertCoins, type CraftableCoin, type SpecialCoin } from '@/data/crafting';

// ─── Coin emoji fallbacks ─────────────────────────────────────────────────────
const COIN_EMOJI: Record<string, string> = {
  TKN: '🔷',
  GOLD: '🥇',
  OASIS: '🌐',
  USGC: '🪙',
  ARTFCT: '🔥',
  NTN: '🌍',
  CUR8: '📖',
  XP: '⚡'
};

// ─── Coin Icon ────────────────────────────────────────────────────────────────
function CoinIcon({
  ticker,
  color,
  glowColor,
  size = 'md',
  pulse = false
}: {
  ticker: string;
  color: string;
  glowColor: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
}) {
  const sizeMap = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-28 h-28 text-4xl'
  };
  const inner = <div className={`${sizeMap[size]} rounded-full flex items-center justify-center relative shrink-0`} style={{
    background: `radial-gradient(circle at 35% 35%, ${glowColor}55, ${color}35, ${color}18)`,
    border: `2px solid ${color}55`,
    boxShadow: `0 0 18px ${color}35, inset 0 1px 0 ${glowColor}35`
  }}>
      <span role="img" aria-label={ticker}>{COIN_EMOJI[ticker] ?? '🪙'}</span>
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{
      background: `linear-gradient(135deg, ${glowColor}25 0%, transparent 55%)`
    }} />
    </div>;
  if (!pulse) return inner;
  return <motion.div animate={{
    rotate: [0, 4, -4, 0],
    scale: [1, 1.04, 1]
  }} transition={{
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const
  }}>
      {inner}
    </motion.div>;
}

// ─── Tier badge ───────────────────────────────────────────────────────────────
function TierBadge({
  tier
}: {
  tier: number;
}) {
  const color = TIER_COLORS[tier as keyof typeof TIER_COLORS] ?? '#888';
  const label = TIER_LABELS[tier as keyof typeof TIER_LABELS] ?? `T${tier}`;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{
    color,
    borderColor: `${color}45`,
    background: `${color}12`
  }}>
      Tier {tier} · {label}
    </span>;
}

// ─── Rarity badge ─────────────────────────────────────────────────────────────
const RARITY_COLORS: Record<string, string> = {
  common: '#A8B5C8',
  uncommon: '#C8A96E',
  rare: '#4FC3F7',
  epic: '#BF5FFF',
  legendary: '#FFB300',
  artifact: '#FF6D00'
};
function RarityBadge({
  rarity
}: {
  rarity: string;
}) {
  const color = RARITY_COLORS[rarity] ?? '#888';
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize" style={{
    color,
    borderColor: `${color}45`,
    background: `${color}12`
  }}>
      {rarity}
    </span>;
}

// ─── Craftable coin card (left column selector) ───────────────────────────────
function CraftableCoinCard({
  coin,
  selected,
  onClick
}: {
  coin: CraftableCoin;
  selected: boolean;
  onClick: () => void;
}) {
  return <motion.button onClick={onClick} whileHover={{
    y: -3,
    scale: 1.015
  }} whileTap={{
    scale: 0.98
  }} className="w-full text-left rounded-2xl border p-4 flex flex-col gap-3 transition-all" style={{
    borderColor: selected ? `${coin.color}65` : `${coin.color}22`,
    background: selected ? `linear-gradient(135deg, ${coin.color}16, ${coin.color}07)` : `${coin.color}05`,
    boxShadow: selected ? `0 0 22px ${coin.color}22` : 'none'
  }}>
      <div className="flex items-start gap-3">
        <CoinIcon ticker={coin.ticker} color={coin.color} glowColor={coin.glowColor} size="md" pulse={selected} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <TierBadge tier={coin.tier} />
            <RarityBadge rarity={coin.rarity} />
          </div>
          <div className="font-bold text-sm leading-tight">{coin.name}</div>
          <div className="text-xs font-mono font-semibold mt-0.5" style={{
          color: coin.color
        }}>
            ${coin.ticker}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {coin.description}
      </p>
      <div className="pt-2 border-t border-white/8 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">1 coin =</span>
        <span className="text-xs font-mono font-bold" style={{
        color: coin.color
      }}>
          {coin.tknValue.toLocaleString()} TKN
        </span>
      </div>
    </motion.button>;
}

// ─── Special coin card ────────────────────────────────────────────────────────
function SpecialCoinCard({
  coin
}: {
  coin: SpecialCoin;
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 16
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.4
  }} className="rounded-2xl border p-5 flex flex-col gap-3" style={{
    borderColor: `${coin.color}22`,
    background: `${coin.color}05`
  }}>
      <div className="flex items-start gap-3">
        <CoinIcon ticker={coin.ticker} color={coin.color} glowColor={coin.glowColor} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <RarityBadge rarity={coin.rarity} />
            {coin.tradeable ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/30 text-accent bg-accent/10">
                Tradeable
              </span> : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                Non-tradeable
              </span>}
          </div>
          <div className="font-bold text-sm">{coin.name}</div>
          <div className="text-xs font-mono font-semibold" style={{
          color: coin.color
        }}>${coin.ticker}</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{coin.description}</p>
      <div className="pt-2 border-t border-white/8">
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/50">Earned by: </span>
          <span>{coin.howToEarn}</span>
        </div>
      </div>
    </motion.div>;
}

// ─── Craft detail panel (right column) ───────────────────────────────────────
function CraftPanel({
  coin
}: {
  coin: CraftableCoin;
}) {
  return <AnimatePresence mode="wait">
      <motion.div key={coin.ticker} initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -10
    }} transition={{
      duration: 0.28
    }} className="rounded-2xl border p-6 flex flex-col gap-5 h-full" style={{
      borderColor: `${coin.color}32`,
      background: `${coin.color}07`
    }}>
        {/* Header */}
        <div className="flex items-center gap-4">
          <CoinIcon ticker={coin.ticker} color={coin.color} glowColor={coin.glowColor} size="lg" pulse />
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <TierBadge tier={coin.tier} />
              <RarityBadge rarity={coin.rarity} />
            </div>
            <h3 className="text-xl font-bold leading-tight">{coin.name}</h3>
            <div className="text-sm font-mono font-semibold" style={{
            color: coin.color
          }}>
              ${coin.ticker}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{coin.description}</p>

        {/* Used for */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Used for</div>
          <div className="text-sm">{coin.usedFor}</div>
        </div>

        {/* Recipes */}
        {coin.recipes.length > 0 ? <div>
            <div className="text-xs font-semibold text-muted-foreground mb-3">Craft recipes</div>
            <div className="flex flex-col gap-2">
              {coin.recipes.map((recipe, i) => {
            const fromCoin = CRAFTABLE_COINS.find(c => c.ticker === recipe.from);
            return <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <CoinIcon ticker={recipe.from} color={fromCoin?.color ?? '#888'} glowColor={fromCoin?.glowColor ?? '#aaa'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono font-bold" style={{
                  color: fromCoin?.color
                }}>
                        {recipe.amount.toLocaleString()} {recipe.from}
                      </div>
                      <div className="text-xs text-muted-foreground">{fromCoin?.name}</div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-bold" style={{
                  color: coin.color
                }}>
                        1 {coin.ticker}
                      </div>
                    </div>
                  </div>;
          })}
            </div>
          </div> : <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Zap size={14} className="text-accent shrink-0" />
            <span>Base currency — earned through gameplay, quests, and daily check-ins. Cannot be crafted.</span>
          </div>}

        {/* TKN value */}
        <div className="rounded-xl border p-4 flex items-center justify-between mt-auto" style={{
        borderColor: `${coin.color}22`,
        background: `${coin.color}07`
      }}>
          <div className="text-xs text-muted-foreground">TKN equivalent</div>
          <div className="font-mono font-bold text-sm" style={{
          color: coin.color
        }}>
            1 {coin.ticker} = {coin.tknValue.toLocaleString()} TKN
          </div>
        </div>
      </motion.div>
    </AnimatePresence>;
}

// ─── Hierarchy flow (center column) ──────────────────────────────────────────
function HierarchyFlow({
  activeTicker
}: {
  activeTicker: string;
}) {
  return <div className="flex flex-col items-center gap-0 w-full">
      {CRAFTABLE_COINS.map((coin, i) => {
      const isActive = coin.ticker === activeTicker;
      return <div key={coin.ticker} className="flex flex-col items-center w-full">
            <motion.div initial={{
          opacity: 0,
          scale: 0.88
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.35,
          delay: i * 0.07
        }} className="w-full rounded-2xl border p-3 flex items-center gap-3 transition-all" style={{
          borderColor: isActive ? `${coin.color}60` : `${coin.color}28`,
          background: isActive ? `linear-gradient(135deg, ${coin.color}18, ${coin.color}07)` : `${coin.color}05`,
          boxShadow: isActive ? `0 0 20px ${coin.color}20` : 'none'
        }}>
              <CoinIcon ticker={coin.ticker} color={coin.color} glowColor={coin.glowColor} size="sm" pulse={isActive} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs leading-tight">{coin.name}</div>
                <div className="text-[10px] font-mono" style={{
              color: coin.color
            }}>${coin.ticker}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-muted-foreground">value</div>
                <div className="text-xs font-mono font-bold" style={{
              color: coin.color
            }}>
                  {coin.tknValue >= 1000 ? `${(coin.tknValue / 1000).toFixed(0)}K` : coin.tknValue} TKN
                </div>
              </div>
            </motion.div>

            {i < CRAFTABLE_COINS.length - 1 && (() => {
          const nextCoin = CRAFTABLE_COINS[i + 1];
          const recipe = nextCoin.recipes.find(r => r.from === coin.ticker);
          return <div className="flex flex-col items-center py-1">
                  <div className="w-px h-2 bg-white/10" />
                  {recipe && <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] text-muted-foreground my-0.5">
                      <span className="font-mono font-semibold" style={{
                color: coin.color
              }}>
                        {recipe.amount.toLocaleString()} {coin.ticker}
                      </span>
                      <ArrowRight size={9} />
                      <span className="font-mono font-semibold" style={{
                color: nextCoin.color
              }}>
                        1 {nextCoin.ticker}
                      </span>
                    </div>}
                  <div className="w-px h-2 bg-white/10" />
                  <ArrowDown size={11} className="text-white/20" />
                </div>;
        })()}
          </div>;
    })}
    </div>;
}

// ─── Conversion calculator ────────────────────────────────────────────────────
function ConversionCalculator() {
  const tickers = Object.keys(CONVERSION_RATES);
  const [fromTicker, setFromTicker] = useState('TKN');
  const [toTicker, setToTicker] = useState('USGC');
  const [amount, setAmount] = useState('1000000');
  const parsed = parseFloat(amount) || 0;
  const {
    result,
    remainder
  } = convertCoins(fromTicker, parsed, toTicker);
  const fromCoin = CRAFTABLE_COINS.find(c => c.ticker === fromTicker);
  const toCoin = CRAFTABLE_COINS.find(c => c.ticker === toTicker);
  const swap = useCallback(() => {
    setFromTicker(toTicker);
    setToTicker(fromTicker);
  }, [fromTicker, toTicker]);
  const minNeeded = CONVERSION_RATES[toTicker] / CONVERSION_RATES[fromTicker];
  return <div className="rounded-2xl border border-white/10 bg-card/40 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <RefreshCw size={15} className="text-primary" />
        <span className="font-bold text-sm">Conversion Calculator</span>
        <span className="text-xs text-muted-foreground ml-auto">All rates are exact — no slippage</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        {/* From */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground font-semibold">From</label>
          <select value={fromTicker} onChange={e => setFromTicker(e.target.value)} className="rounded-lg border border-white/15 bg-background/60 px-3 py-2 text-sm font-mono font-semibold focus:outline-none focus:border-primary/50 w-full" style={{
          color: fromCoin?.color ?? 'inherit'
        }}>
            {tickers.map(t => <option key={t} value={t}>${t}</option>)}
          </select>
          <Input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} className="font-mono text-sm border-white/15 bg-background/60" placeholder="Amount" />
        </div>

        {/* Swap */}
        <button onClick={swap} className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all mx-auto mb-0.5" aria-label="Swap currencies">
          <ArrowRight size={14} className="text-muted-foreground" />
        </button>

        {/* To */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground font-semibold">To</label>
          <select value={toTicker} onChange={e => setToTicker(e.target.value)} className="rounded-lg border border-white/15 bg-background/60 px-3 py-2 text-sm font-mono font-semibold focus:outline-none focus:border-primary/50 w-full" style={{
          color: toCoin?.color ?? 'inherit'
        }}>
            {tickers.map(t => <option key={t} value={t}>${t}</option>)}
          </select>
          <div className="rounded-lg border px-3 py-2 text-sm font-mono font-bold min-h-[38px] flex items-center" style={{
          borderColor: `${toCoin?.color ?? '#888'}38`,
          background: `${toCoin?.color ?? '#888'}0d`,
          color: toCoin?.color ?? 'inherit'
        }}>
            {result > 0 ? result.toLocaleString() : '—'}
          </div>
        </div>
      </div>

      {/* Result */}
      {parsed > 0 && result > 0 && <motion.div initial={{
      opacity: 0,
      y: 6
    }} animate={{
      opacity: 1,
      y: 0
    }} className="rounded-xl border p-4 text-sm" style={{
      borderColor: `${toCoin?.color ?? '#888'}22`,
      background: `${toCoin?.color ?? '#888'}07`
    }}>
          <span className="font-mono font-bold" style={{
        color: fromCoin?.color
      }}>
            {parsed.toLocaleString()} {fromTicker}
          </span>
          <span className="text-muted-foreground mx-2">=</span>
          <span className="font-mono font-bold" style={{
        color: toCoin?.color
      }}>
            {result.toLocaleString()} {toTicker}
          </span>
          {remainder > 0 && <span className="text-muted-foreground text-xs ml-2">
              + {remainder.toLocaleString()} TKN remainder
            </span>}
        </motion.div>}

      {parsed > 0 && result === 0 && <div className="rounded-xl border border-white/10 p-4 text-sm text-muted-foreground">
          Not enough {fromTicker} to craft 1 {toTicker}. Minimum:{' '}
          <span className="font-mono font-semibold text-foreground">
            {minNeeded.toLocaleString()} {fromTicker}
          </span>
        </div>}
    </div>;
}

// ─── Reverse Calculator ───────────────────────────────────────────────────────
// "I want N of tier X — how many TKN do I need?"
// Shows the full crafting path: TKN → GOLD → OASIS → USGC
const TIER_ORDER: Array<{
  ticker: string;
  label: string;
}> = [{
  ticker: 'TKN',
  label: 'Token Fragment'
}, {
  ticker: 'GOLD',
  label: 'Gold Ingot'
}, {
  ticker: 'OASIS',
  label: 'OASIS Token'
}, {
  ticker: 'USGC',
  label: 'Universal Sol Gaming Coin'
}];
function ReverseCalculator() {
  const [targetTicker, setTargetTicker] = useState<string>('USGC');
  const [targetAmount, setTargetAmount] = useState<string>('1');
  const parsed = Math.max(0, Math.floor(parseFloat(targetAmount) || 0));
  const targetRate = CONVERSION_RATES[targetTicker] ?? 1;
  const totalTkn = parsed * targetRate;

  // Build the full crafting path breakdown
  const targetIdx = TIER_ORDER.findIndex(t => t.ticker === targetTicker);
  const path = TIER_ORDER.slice(0, targetIdx + 1);

  // For each tier in the path, how many of that coin are needed?
  const breakdown = path.map(({
    ticker,
    label
  }) => {
    const rate = CONVERSION_RATES[ticker] ?? 1;
    const count = totalTkn / rate;
    const coin = CRAFTABLE_COINS.find(c => c.ticker === ticker);
    return {
      ticker,
      label,
      count,
      coin
    };
  });
  const targetCoin = CRAFTABLE_COINS.find(c => c.ticker === targetTicker);

  // Shortcut amounts
  const shortcuts = [1, 5, 10, 100];
  return <div className="rounded-2xl border border-white/10 bg-card/40 p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target size={15} className="text-primary" />
        <span className="font-bold text-sm">Reverse calculator</span>
        <span className="text-xs text-muted-foreground ml-auto">How many TKN do I need?</span>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target tier */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground font-semibold">I want to reach</label>
          <div className="grid grid-cols-5 gap-1.5">
            {TIER_ORDER.map(({
            ticker
          }) => {
            const coin = CRAFTABLE_COINS.find(c => c.ticker === ticker);
            const active = ticker === targetTicker;
            return <button key={ticker} onClick={() => setTargetTicker(ticker)} className="flex flex-col items-center gap-1 rounded-xl border py-2.5 px-1 text-[10px] font-bold transition-all" style={{
              borderColor: active ? `${coin?.color ?? '#888'}80` : 'rgba(255,255,255,0.08)',
              background: active ? `${coin?.color ?? '#888'}18` : 'transparent',
              color: active ? coin?.color ?? 'inherit' : 'hsl(var(--muted-foreground))',
              boxShadow: active ? `0 0 16px ${coin?.color ?? '#888'}20` : 'none'
            }}>
                  <span className="text-base">{COIN_EMOJI[ticker]}</span>
                  <span>{ticker}</span>
                </button>;
          })}
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground font-semibold">
            How many{' '}
            <span className="font-mono font-bold" style={{
            color: targetCoin?.color
          }}>
              ${targetTicker}
            </span>
            ?
          </label>
          <Input type="number" min="1" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="font-mono text-sm border-white/15 bg-background/60" placeholder="e.g. 1" />
          {/* Quick-pick shortcuts */}
          <div className="flex gap-1.5 flex-wrap">
            {shortcuts.map(n => <button key={n} onClick={() => setTargetAmount(String(n))} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary">
                {n}
              </button>)}
          </div>
        </div>
      </div>

      {/* Result banner */}
      {parsed > 0 && <motion.div key={`${targetTicker}-${parsed}`} initial={{
      opacity: 0,
      y: 6
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.22
    }} className="rounded-xl border p-4 flex flex-col gap-1" style={{
      borderColor: `${targetCoin?.color ?? '#888'}35`,
      background: `${targetCoin?.color ?? '#888'}0c`
    }}>
          <div className="text-xs text-muted-foreground font-semibold mb-1">Total TKN required</div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold font-mono" style={{
          color: targetCoin?.color
        }}>
              {totalTkn.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground font-mono">TKN</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            to craft{' '}
            <span className="font-mono font-semibold" style={{
          color: targetCoin?.color
        }}>
              {parsed.toLocaleString()} ${targetTicker}
            </span>
            {' '}from scratch
          </div>
        </motion.div>}

      {/* Crafting path breakdown */}
      {parsed > 0 && targetIdx > 0 && <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
            Crafting path
          </div>
          <div className="flex flex-col gap-1.5">
            {breakdown.map(({
          ticker,
          label,
          count,
          coin
        }, i) => {
          const isTarget = ticker === targetTicker;
          const isFirst = i === 0;
          return <div key={ticker} className="flex items-center gap-3">
                  {/* Step connector */}
                  <div className="flex flex-col items-center w-6 shrink-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{
                background: isTarget ? `${coin?.color ?? '#888'}25` : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${isTarget ? `${coin?.color ?? '#888'}60` : 'rgba(255,255,255,0.1)'}`,
                color: coin?.color ?? 'hsl(var(--muted-foreground))'
              }}>
                      {COIN_EMOJI[ticker]}
                    </div>
                    {!isTarget && <div className="w-px h-3 bg-white/10 mt-0.5" />}
                  </div>

                  {/* Coin info */}
                  <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono font-bold shrink-0" style={{
                  color: coin?.color
                }}>
                        ${ticker}
                      </span>
                      <span className="text-xs text-muted-foreground truncate hidden sm:block">
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-mono font-bold" style={{
                  color: isTarget ? coin?.color ?? 'inherit' : 'hsl(var(--foreground))'
                }}>
                        {count.toLocaleString()}
                      </span>
                      {!isFirst && <span className="text-[10px] text-muted-foreground">
                          ×{(CONVERSION_RATES[ticker] / CONVERSION_RATES[TIER_ORDER[i - 1].ticker]).toLocaleString()} per prev
                        </span>}
                    </div>
                  </div>
                </div>;
        })}
          </div>
        </div>}

      {/* TKN = 1 edge case */}
      {parsed > 0 && targetTicker === 'TKN' && <div className="text-xs text-muted-foreground rounded-xl border border-white/10 p-3">
          TKN is the base unit — no crafting required. You need{' '}
          <span className="font-mono font-semibold text-foreground">{parsed.toLocaleString()} TKN</span>.
        </div>}
    </div>;
}

// ─── Full rate table ──────────────────────────────────────────────────────────
function RateTable() {
  const tickers = Object.keys(CONVERSION_RATES);
  return <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            <th className="text-left px-4 py-3 text-muted-foreground font-semibold whitespace-nowrap">
              1 coin →
            </th>
            {tickers.map(t => {
            const c = CRAFTABLE_COINS.find(x => x.ticker === t);
            return <th key={t} className="px-4 py-3 text-center font-mono font-bold whitespace-nowrap" style={{
              color: c?.color
            }}>
                  {t}
                </th>;
          })}
          </tr>
        </thead>
        <tbody>
          {tickers.map((from, ri) => {
          const fromCoin = CRAFTABLE_COINS.find(c => c.ticker === from);
          return <tr key={from} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{COIN_EMOJI[from]}</span>
                    <span className="font-mono font-semibold" style={{
                  color: fromCoin?.color
                }}>
                      {from}
                    </span>
                  </div>
                </td>
                {tickers.map((to, ci) => {
              if (from === to) {
                return <td key={to} className="px-4 py-3 text-center text-muted-foreground">—</td>;
              }
              const toCoin = CRAFTABLE_COINS.find(c => c.ticker === to);
              const fromRate = CONVERSION_RATES[from];
              const toRate = CONVERSION_RATES[to];
              const isUpgrade = ci > ri; // going up the hierarchy
              const ratio = fromRate / toRate;
              return <td key={to} className="px-4 py-3 text-center whitespace-nowrap">
                      {isUpgrade ? ratio < 1 ? <span className="text-muted-foreground text-[10px]">
                            {`1/${Math.round(1 / ratio).toLocaleString()}`}
                          </span> : <span className="font-mono font-semibold" style={{
                  color: toCoin?.color
                }}>
                            {ratio.toLocaleString()}
                          </span> : <span className="font-mono text-muted-foreground">
                          {(toRate / fromRate).toLocaleString()}
                        </span>}
                    </td>;
            })}
              </tr>;
        })}
        </tbody>
      </table>
    </div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CraftingPage() {
  const [selectedCoin, setSelectedCoin] = useState<CraftableCoin>(CRAFTABLE_COINS[0]);
  const title = 'Coin Crafting System — The Token Game';
  const description = 'Five tiers from Token Fragment to USGC. Craft, convert, and earn your way to the apex of the Tienko Nexus economy.';
  const canonical = 'https://thetokengame.xyz/crafting';
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
        <section className="relative overflow-hidden border-b border-white/10 py-20">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full blur-[160px] opacity-8" style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
          }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center">
              {/* Coin parade */}
              <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                {CRAFTABLE_COINS.map((coin, i) => <motion.div key={coin.ticker} initial={{
                opacity: 0,
                scale: 0
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.4,
                delay: i * 0.1
              }}>
                    <CoinIcon ticker={coin.ticker} color={coin.color} glowColor={coin.glowColor} size="lg" pulse />
                  </motion.div>)}
              </div>

              <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/40 text-primary bg-primary/10">
                  Tienko Universe
                </span>
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/40 text-accent bg-accent/10">
                  5 Tiers · 9 Coin Types
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Coin Crafting System
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Every coin in the Tienko universe is part of a hierarchy. Start with Token Fragments. Forge Heritage Coins. Smelt Gold Ingots. Unlock OASIS Tokens. Reach the apex with USGC.
              </p>
            </motion.div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto mt-12">
              {CRAFTABLE_COINS.map((coin, i) => <motion.button key={coin.ticker} onClick={() => setSelectedCoin(coin)} initial={{
              opacity: 0,
              y: 12
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: 0.3 + i * 0.07
            }} whileHover={{
              y: -3
            }} className="rounded-xl border p-3 text-center transition-all" style={{
              borderColor: selectedCoin.ticker === coin.ticker ? `${coin.color}55` : `${coin.color}28`,
              background: selectedCoin.ticker === coin.ticker ? `${coin.color}12` : `${coin.color}06`
            }}>
                  <div className="text-xl mb-1">{COIN_EMOJI[coin.ticker]}</div>
                  <div className="text-xs font-mono font-bold" style={{
                color: coin.color
              }}>${coin.ticker}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {coin.tknValue >= 1000 ? `${(coin.tknValue / 1000).toFixed(0)}K` : coin.tknValue} TKN
                  </div>
                </motion.button>)}
            </div>
          </div>
        </section>

        {/* ── Hierarchy + Craft Panel ───────────────────────────────────────── */}
        <section className="py-20 border-b border-white/10">
          <div className="container mx-auto px-4">
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
          }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                The crafting hierarchy
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Select any coin to see its full recipe, usage, and TKN equivalent. Every tier builds on the last.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_1fr] gap-6 max-w-6xl mx-auto">
              {/* Left: selector cards */}
              <div className="flex flex-col gap-3">
                {CRAFTABLE_COINS.map(coin => <CraftableCoinCard key={coin.ticker} coin={coin} selected={selectedCoin.ticker === coin.ticker} onClick={() => setSelectedCoin(coin)} />)}
              </div>

              {/* Center: hierarchy flow (desktop only) */}
              <div className="hidden lg:flex flex-col items-center justify-center">
                <HierarchyFlow activeTicker={selectedCoin.ticker} />
              </div>

              {/* Right: craft detail */}
              <div>
                <CraftPanel coin={selectedCoin} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Conversion Calculator ─────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/10">
          <div className="container mx-auto px-4 max-w-2xl">
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
          }} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Conversion calculator
              </h2>
              <p className="text-muted-foreground">
                Convert any amount between coin tiers instantly. Exact rates, no slippage.
              </p>
            </motion.div>
            <ConversionCalculator />
          </div>
        </section>

        {/* ── Reverse Calculator ────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/10">
          <div className="container mx-auto px-4 max-w-2xl">
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
          }} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Reverse calculator
              </h2>
              <p className="text-muted-foreground">
                Pick a target tier and quantity — see exactly how many TKN you need and the full crafting path to get there.
              </p>
            </motion.div>
            <ReverseCalculator />
          </div>
        </section>

        {/* ── Full Rate Table ───────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/10">
          <div className="container mx-auto px-4">
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
          }} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Full conversion rate table
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every cross-tier exchange rate at a glance. Rows = from, columns = to. Values show how many of the column coin you get from 1 of the row coin.
              </p>
            </motion.div>
            <div className="max-w-4xl mx-auto">
              <RateTable />
            </div>
          </div>
        </section>

        {/* ── Special Coins ─────────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/10">
          <div className="container mx-auto px-4">
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
          }} className="text-center mb-12">
              <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-destructive/30 text-destructive bg-destructive/8 mb-4">
                Not craftable
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Special coins
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                These coins cannot be crafted, purchased, or converted. They are earned through exceptional play and carry unique privileges across the Nexus.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {SPECIAL_COINS.map(coin => <SpecialCoinCard key={coin.ticker} coin={coin} />)}
            </div>
          </div>
        </section>

        {/* ── XP Coin ───────────────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/10">
          <div className="container mx-auto px-4 max-w-3xl">
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
              <div className="rounded-2xl border p-8 flex flex-col md:flex-row gap-6 items-start" style={{
              borderColor: `${XP_COIN.color}28`,
              background: `${XP_COIN.color}07`
            }}>
                <CoinIcon ticker={XP_COIN.ticker} color={XP_COIN.color} glowColor={XP_COIN.glowColor} size="xl" pulse />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <RarityBadge rarity={XP_COIN.rarity} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                      Non-tradeable
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground bg-white/5">
                      Non-transferable
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{XP_COIN.name}</h3>
                  <div className="text-sm font-mono font-semibold mb-4" style={{
                  color: XP_COIN.color
                }}>
                    ${XP_COIN.ticker}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-5">{XP_COIN.description}</p>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Earned by</div>
                    <div className="text-sm">{XP_COIN.howToEarn}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-20">
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
              <div className="text-5xl mb-6">⚗️</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Start crafting.
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                Every TKN you earn is a step toward USGC. The hierarchy is the game.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2 font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90" style={{
                boxShadow: '0 0 40px hsl(var(--primary) / 0.4)'
              }} asChild>
                  <Link to="/journey">
                    <Zap size={15} />
                    Earn XP &amp; TKN
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                  <Link to="/staking">
                    <TrendingUp size={15} />
                    Stake USGC
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 hover:border-primary/50 hover:text-primary" asChild>
                  <Link to="/oasis">
                    <Coins size={15} />
                    Back to Nexus
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>;
}
