/**
 * PlayerMenu — persistent player status bar shown below the header on every page.
 *
 * Displays: avatar · username · class badge · power level · rank · USD value ·
 *           coin balance · XP progress bar
 *
 * Only renders when a Solana wallet is connected. Collapses to a slim pill on
 * mobile with a tap-to-expand drawer.
 */
import { useState } from 'react';
import { Link } from "react-router";
import { ChevronDown, ChevronUp, Zap, Trophy, DollarSign } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import { usePlayerProfile } from '@/hooks/usePlayerProfile';

// ─── Class colours & icons ────────────────────────────────────────────────────
const CLASS_META: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: string;
}> = {
  warrior: {
    label: 'Warrior',
    color: '#ff6b6b',
    bg: 'rgba(255,107,107,0.15)',
    icon: '⚔️'
  },
  mage: {
    label: 'Mage',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
    icon: '🔮'
  },
  merchant: {
    label: 'Merchant',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.15)',
    icon: '💰'
  },
  explorer: {
    label: 'Explorer',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
    icon: '🧭'
  },
  collector: {
    label: 'Collector',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.15)',
    icon: '🃏'
  }
};

// ─── Rank label ───────────────────────────────────────────────────────────────
function rankLabel(rank: number): string {
  if (rank === 1) return '#1 🥇';
  if (rank === 2) return '#2 🥈';
  if (rank === 3) return '#3 🥉';
  return `#${rank.toLocaleString()}`;
}

// ─── Avatar: pixel-art-style deterministic colour from wallet address ─────────
function avatarColor(seed: string | null, wallet: string): string {
  const src = seed ?? wallet;
  let hash = 0;
  for (let i = 0; i < src.length; i++) hash = src.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}
function avatarInitials(name: string | null, wallet: string): string {
  if (name) return name.slice(0, 2).toUpperCase();
  return wallet.slice(0, 2).toUpperCase();
}

// ─── XP bar ───────────────────────────────────────────────────────────────────
function XpBar({
  pct,
  current,
  needed
}: {
  pct: number;
  current: number;
  needed: number;
}) {
  return <div className="flex items-center gap-2 min-w-0">
      <div className="relative flex-1 h-1.5 rounded-full overflow-hidden" style={{
      background: 'rgba(255,255,255,0.08)',
      minWidth: 60
    }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #BF5FFF, #9fff5f)',
        boxShadow: '0 0 6px rgba(191,95,255,0.6)'
      }} />
      </div>
      <span className="text-[10px] font-mono whitespace-nowrap" style={{
      color: 'rgba(255,255,255,0.35)'
    }}>
        {current.toLocaleString()} / {needed.toLocaleString()} XP
      </span>
    </div>;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)'
  }}>
      <span style={{
      color
    }} className="flex items-center">{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] uppercase tracking-wide" style={{
        color: 'rgba(255,255,255,0.35)'
      }}>
          {label}
        </span>
        <span className="text-xs font-bold font-mono mt-0.5" style={{
        color
      }}>
          {value}
        </span>
      </div>
    </div>;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PlayerMenu() {
  const {
    connected,
    publicKey
  } = useWallet();
  const {
    profile,
    loading
  } = usePlayerProfile();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Only render when wallet is connected
  if (!connected || !publicKey) return null;
  const classMeta = profile?.characterClass ? CLASS_META[profile.characterClass] : null;
  const avatarBg = avatarColor(profile?.avatarSeed ?? null, publicKey);
  const initials = avatarInitials(profile?.displayName ?? null, publicKey);
  const displayName = profile?.displayName ?? publicKey.slice(0, 6) + '…' + publicKey.slice(-4);

  // Skeleton shimmer while loading
  const shimmer = (w: string) => <span className="inline-block rounded animate-pulse" style={{
    width: w,
    height: 12,
    background: 'rgba(255,255,255,0.08)'
  }} />;
  return <div className="w-full border-b" style={{
    background: 'linear-gradient(135deg, rgba(10,8,20,0.97) 0%, rgba(18,12,35,0.97) 100%)',
    borderColor: 'rgba(255,215,0,0.12)',
    backdropFilter: 'blur(12px)'
  }}>
      {/* ── Desktop bar ── */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 container mx-auto">

        {/* Avatar + name + class */}
        <Link to="/rpg/profile" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-offset-1 transition-all group-hover:ring-offset-0" style={{
          background: avatarBg,
          color: '#fff',
          boxShadow: `0 0 10px ${avatarBg}55`
        }}>
            {initials}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
              {loading ? shimmer('80px') : displayName}
            </span>
            {classMeta && <span className="text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded-full w-fit" style={{
            background: classMeta.bg,
            color: classMeta.color
          }}>
                {classMeta.icon} {classMeta.label}
              </span>}
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 shrink-0" style={{
        background: 'rgba(255,255,255,0.08)'
      }} />

        {/* Level badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black" style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#0a0814',
          boxShadow: '0 0 8px rgba(255,215,0,0.4)'
        }}>
            {loading ? '?' : profile?.level ?? 1}
          </div>
          <span className="text-[10px] text-white/40 uppercase tracking-wide">Lv</span>
        </div>

        {/* XP bar — takes remaining space */}
        <div className="flex-1 min-w-0 max-w-xs">
          {loading ? <div className="h-1.5 rounded-full animate-pulse" style={{
          background: 'rgba(255,255,255,0.08)'
        }} /> : <XpBar pct={profile?.progress.pct ?? 0} current={profile?.progress.current ?? 0} needed={profile?.progress.needed ?? 80} />}
        </div>

        {/* Divider */}
        <div className="w-px h-6 shrink-0" style={{
        background: 'rgba(255,255,255,0.08)'
      }} />

        {/* Stat pills */}
        <div className="flex items-center gap-2 shrink-0">
          <StatPill icon={<Zap size={11} />} label="Power" value={loading ? '…' : (profile?.powerLevel ?? 0).toLocaleString()} color="#BF5FFF" />
          <StatPill icon={<Trophy size={11} />} label="Rank" value={loading ? '…' : rankLabel(profile?.rank ?? 1)} color="#FFD700" />
          <StatPill icon={<span className="text-[11px]">🪙</span>} label="Coins" value={loading ? '…' : (profile?.coins ?? 0).toLocaleString()} color="#9fff5f" />
          <StatPill icon={<DollarSign size={11} />} label="Est. Value" value={loading ? '…' : `$${profile?.estimatedUsd ?? '0.00'}`} color="#34d399" />
        </div>

        {/* Divider */}
        <div className="w-px h-6 shrink-0" style={{
        background: 'rgba(255,255,255,0.08)'
      }} />

        {/* Quick links */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <Link to="/wallet" className="text-[10px] px-2 py-1 rounded-md font-medium transition-all hover:bg-white/5" style={{
          color: 'rgba(255,255,255,0.4)'
        }}>
            Wallet
          </Link>
          <Link to="/rpg/profile" className="text-[10px] px-2 py-1 rounded-md font-medium transition-all hover:bg-white/5" style={{
          color: 'rgba(255,255,255,0.4)'
        }}>
            Profile
          </Link>
          {!profile?.hasCharacter && <Link to="/rpg/create-character" className="text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all" style={{
          background: 'rgba(191,95,255,0.15)',
          color: '#BF5FFF',
          border: '1px solid rgba(191,95,255,0.3)'
        }}>
              Create Character
            </Link>}
        </div>
      </div>

      {/* ── Mobile collapsed pill ── */}
      <div className="md:hidden">
        <button onClick={() => setMobileExpanded(v => !v)} className="w-full flex items-center gap-2 px-4 py-1.5">
          {/* Avatar */}
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{
          background: avatarBg,
          color: '#fff'
        }}>
            {initials}
          </div>

          {/* Name */}
          <span className="text-xs font-semibold text-white/80 truncate flex-1 text-left">
            {loading ? '…' : displayName}
          </span>

          {/* Level */}
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0" style={{
          background: 'rgba(255,215,0,0.15)',
          color: '#FFD700'
        }}>
            Lv {loading ? '?' : profile?.level ?? 1}
          </span>

          {/* Coins */}
          <span className="text-[10px] font-mono shrink-0" style={{
          color: '#9fff5f'
        }}>
            🪙 {loading ? '…' : (profile?.coins ?? 0).toLocaleString()}
          </span>

          {/* Chevron */}
          <span className="text-white/30 shrink-0">
            {mobileExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {/* Mobile expanded panel */}
        {mobileExpanded && <div className="px-4 pb-3 flex flex-col gap-2 border-t" style={{
        borderColor: 'rgba(255,255,255,0.06)'
      }}>
            {/* XP bar */}
            <div className="pt-2">
              <XpBar pct={profile?.progress.pct ?? 0} current={profile?.progress.current ?? 0} needed={profile?.progress.needed ?? 80} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <StatPill icon={<Zap size={11} />} label="Power Level" value={loading ? '…' : (profile?.powerLevel ?? 0).toLocaleString()} color="#BF5FFF" />
              <StatPill icon={<Trophy size={11} />} label="Rank" value={loading ? '…' : rankLabel(profile?.rank ?? 1)} color="#FFD700" />
              <StatPill icon={<span className="text-[11px]">🪙</span>} label="Coins" value={loading ? '…' : (profile?.coins ?? 0).toLocaleString()} color="#9fff5f" />
              <StatPill icon={<DollarSign size={11} />} label="Est. Value" value={loading ? '…' : `$${profile?.estimatedUsd ?? '0.00'}`} color="#34d399" />
            </div>

            {/* Quick links */}
            <div className="flex gap-2 pt-1">
              <Link to="/wallet" className="flex-1 text-center text-xs py-1.5 rounded-md font-medium" style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)'
          }} onClick={() => setMobileExpanded(false)}>
                Wallet
              </Link>
              <Link to="/rpg/profile" className="flex-1 text-center text-xs py-1.5 rounded-md font-medium" style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)'
          }} onClick={() => setMobileExpanded(false)}>
                RPG Profile
              </Link>
            </div>
          </div>}
      </div>
    </div>;
}
