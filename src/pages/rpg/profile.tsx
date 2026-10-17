/**
 * /rpg/profile — Unified RPG Profile
 * Shows level, XP, character, abilities, inventory, and cross-platform progress.
 */
/**
 * /rpg/profile — Unified RPG Profile
 * Shows level, XP, character, abilities, inventory, and cross-platform progress.
 */
import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Link } from "react-router";
import { Zap, Package, Shield, Star, ChevronRight, Wallet, Plus, BarChart3, Globe, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CLASS_DEFINITIONS, ABILITIES_CATALOG, CHARACTER_POWERS, PLATFORM_UNLOCKS, type CharacterClass } from '@/lib/rpg/levels';
interface Character {
  walletAddress: string;
  displayName: string;
  characterClass: CharacterClass;
  nation: string;
  avatarSeed: string | null;
  level: number;
  xp: number;
  totalXpEarned: number;
  powerPoints: number;
}
interface Ability {
  abilityId: string;
  abilityName: string;
  unlockedAtLevel: number;
  isEquipped: boolean;
}
interface InventoryItem {
  id: number;
  itemId: string;
  itemName: string;
  itemType: string;
  rarity: string;
  quantity: number;
  equippedSlot: string | null;
}
interface ProfileData {
  character: Character;
  progress: {
    level: number;
    current: number;
    needed: number;
    pct: number;
  };
  abilities: Ability[];
  availableAbilities: typeof ABILITIES_CATALOG;
  inventory: InventoryItem[];
  recentXp: Array<{
    xpAwarded: number;
    source: string;
    levelBefore: number;
    levelAfter: number;
    createdAt: string;
  }>;
  hasCharacter: boolean;
}
const RARITY_COLORS: Record<string, string> = {
  common: '#6b7280',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};
function AvatarDisplay({
  seed,
  size = 64
}: {
  seed: string | null;
  size?: number;
}) {
  const palette = ['#BF5FFF', '#ff5fef', '#9fff5f', '#5fffff', '#ff9f5f', '#5f9fff', '#ff5f5f', '#ffff5f'];
  const grid = Array.from({
    length: 25
  }, (_, i) => {
    const char = seed ? seed[i % seed.length] : 'x';
    return palette[char.charCodeAt(0) % palette.length];
  });
  const cell = Math.floor(size / 5);
  return <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(5, ${cell}px)`,
    gap: 1,
    borderRadius: 8,
    overflow: 'hidden'
  }}>
      {grid.map((color, i) => <div key={i} style={{
      width: cell,
      height: cell,
      background: color
    }} />)}
    </div>;
}

// Unused — replaced by PLATFORM_UNLOCKS from levels.ts

export default function RpgProfilePage() {
  const [wallet, setWallet] = useState('');
  const [walletInput, setWalletInput] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'abilities' | 'inventory' | 'history'>('overview');
  async function loadProfile(w: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/rpg/character?wallet=${encodeURIComponent(w)}`);
      const data = await res.json();
      if (!res.ok || !data.hasCharacter) {
        setError('No character found for this wallet. Create one first!');
        setProfile(null);
      } else {
        setProfile(data as ProfileData);
      }
    } catch {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  function handleConnect() {
    const w = walletInput.trim();
    if (!w || w.length < 10) return;
    setWallet(w);
    loadProfile(w);
  }
  const classDef = profile ? CLASS_DEFINITIONS[profile.character.characterClass] : null;
  return <>
      <Helmet>
        <title>RPG Profile — The Token Game</title>
        <meta name="description" content="View your RPG character, level, XP, abilities, and cross-platform progress across the Tienko ecosystem." />
        <link rel="canonical" href="https://thetokengame.xyz/rpg/profile" />
        <meta property="og:title" content="RPG Profile — The Token Game" />
        <meta property="og:description" content="View your RPG character, level, XP, abilities, and cross-platform progress across the Tienko ecosystem." />
        <meta property="og:image" content="https://thetokengame.xyz/airo-assets/images/logo/primary" />
        <meta property="og:url" content="https://thetokengame.xyz/rpg/profile" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RPG Profile — The Token Game" />
        <meta name="twitter:description" content="View your RPG character, level, XP, abilities, and cross-platform progress across the Tienko ecosystem." />
        <meta name="twitter:image" content="https://thetokengame.xyz/airo-assets/images/logo/primary" />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0f] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-b from-purple-900/30 to-transparent border-b border-white/5 py-12 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(191,95,255,0.15),transparent_70%)]" />
          <div className="max-w-5xl mx-auto relative">
            <div className="flex items-center gap-2 text-purple-400 text-sm mb-3">
              <Link to="/rpg" className="hover:text-purple-300">RPG</Link>
              <ChevronRight className="w-3 h-3" />
              <span>Profile</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Your RPG Profile</h1>
            <p className="text-gray-400">Track your level, abilities, and progress across the Tienko ecosystem.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-8">
          {/* Wallet connect */}
          {!wallet && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 text-sm mb-6">Enter your Solana wallet address to view your RPG profile.</p>
              <div className="flex gap-2">
                <input value={walletInput} onChange={e => setWalletInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleConnect()} placeholder="Your Solana wallet address..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500" />
                <Button onClick={handleConnect} className="bg-purple-600 hover:bg-purple-500 text-white">
                  Load
                </Button>
              </div>
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              <div className="mt-4 pt-4 border-t border-white/5">
                <Link to="/rpg/create-character">
                  <Button variant="outline" className="border-white/10 text-gray-300 w-full">
                    <Plus className="w-4 h-4 mr-2" /> Create New Character
                  </Button>
                </Link>
              </div>
            </motion.div>}

          {loading && <div className="text-center py-20 text-gray-400">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading profile...
            </div>}

          {profile && !loading && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="space-y-6">
              {/* Character card */}
              <div className="bg-white/5 border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start" style={{
            borderColor: `${classDef?.color}44`
          }}>
                <div className="flex-shrink-0">
                  <AvatarDisplay seed={profile.character.avatarSeed} size={80} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{profile.character.displayName}</h2>
                    <Badge style={{
                  background: `${classDef?.color}33`,
                  color: classDef?.color,
                  border: `1px solid ${classDef?.color}44`
                }}>
                      {classDef?.icon} {classDef?.name}
                    </Badge>
                    <Badge className="bg-white/10 text-gray-300 border-white/10">
                      🌍 {profile.character.nation.charAt(0).toUpperCase() + profile.character.nation.slice(1)}
                    </Badge>
                  </div>
                  {/* Level + XP bar */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl font-black text-purple-400">Lv.{profile.progress.level}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{profile.progress.current.toLocaleString()} XP</span>
                        <span>{profile.progress.needed.toLocaleString()} XP to next level</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{
                      width: 0
                    }} animate={{
                      width: `${profile.progress.pct}%`
                    }} transition={{
                      duration: 1,
                      ease: 'easeOut'
                    }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4" /><span>{profile.character.totalXpEarned.toLocaleString()} total XP</span></div>
                    <div className="flex items-center gap-1 text-blue-400"><Zap className="w-4 h-4" /><span>{profile.character.powerPoints} power points</span></div>
                    <div className="flex items-center gap-1 text-green-400"><Shield className="w-4 h-4" /><span>{profile.abilities.length} abilities</span></div>
                    <div className="flex items-center gap-1 text-purple-400"><Package className="w-4 h-4" /><span>{profile.inventory.length} items</span></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to="/rpg/value-packs">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                      Open Packs
                    </Button>
                  </Link>
                  <Link to="/rpg/create-character">
                    <Button variant="outline" className="border-white/10 text-gray-300 text-sm">
                      Edit Character
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
                {(['overview', 'abilities', 'inventory', 'history'] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {tab}
                  </button>)}
              </div>

              {/* Overview tab */}
              {activeTab === 'overview' && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Class bonuses */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span>{classDef?.icon}</span> Class Bonuses
                    </h3>
                    <ul className="space-y-2">
                      {classDef?.bonuses.map((b, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full" style={{
                    background: classDef.color
                  }} />
                          {b}
                        </li>)}
                    </ul>
                  </div>

                  {/* Platform access — level gated */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-400" /> Platform Access
                    </h3>
                    <ul className="space-y-2">
                      {PLATFORM_UNLOCKS.map(p => {
                  const unlocked = profile.progress.level >= p.level;
                  return <li key={p.platform} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-300">
                              <span>{p.icon}</span>
                              {unlocked ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{p.platform}</a> : <span className="text-gray-500">{p.platform}</span>}
                            </span>
                            {unlocked ? <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1"><Unlock className="w-3 h-3" /> Unlocked</Badge> : <Badge className="bg-white/5 text-gray-500 border-white/10 flex items-center gap-1"><Lock className="w-3 h-3" /> Lv.{p.level}</Badge>}
                          </li>;
                })}
                    </ul>
                  </div>

                  {/* Character powers */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:col-span-2">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" /> Character Powers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {CHARACTER_POWERS.map(cp => {
                  const unlocked = profile.progress.level >= cp.level;
                  return <div key={cp.level} className={`rounded-xl p-3 border transition-all ${unlocked ? 'bg-white/8 border-purple-500/30' : 'bg-white/3 border-white/5 opacity-50'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{cp.icon}</span>
                              <span className={`text-xs font-bold ${unlocked ? 'text-purple-400' : 'text-gray-600'}`}>Lv.{cp.level}</span>
                              {unlocked && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs ml-auto">Active</Badge>}
                            </div>
                            <div className="text-sm font-semibold text-white mb-0.5">{cp.power}</div>
                            <div className="text-xs text-gray-400 leading-relaxed">{cp.effect}</div>
                          </div>;
                })}
                    </div>
                  </div>
                </div>}

              {/* Abilities tab */}
              {activeTab === 'abilities' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.abilities.map(a => {
              const catalog = ABILITIES_CATALOG.find(c => c.id === a.abilityId);
              return <div key={a.abilityId} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                        <span className="text-2xl">{catalog?.icon ?? '⚡'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">{a.abilityName}</span>
                            {a.isEquipped && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Equipped</Badge>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{catalog?.description}</p>
                          {catalog && <Badge className="mt-2 text-xs" style={{
                    background: `${RARITY_COLORS[catalog.rarity]}22`,
                    color: RARITY_COLORS[catalog.rarity],
                    border: `1px solid ${RARITY_COLORS[catalog.rarity]}44`
                  }}>
                              {catalog.rarity}
                            </Badge>}
                        </div>
                      </div>;
            })}
                  {profile.abilities.length === 0 && <div className="col-span-3 text-center py-12 text-gray-500">
                      No abilities yet. Earn XP to unlock them!
                    </div>}
                </div>}

              {/* Inventory tab */}
              {activeTab === 'inventory' && <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {profile.inventory.map(item => <div key={item.id} className="bg-white/5 border rounded-xl p-3 text-center" style={{
              borderColor: `${RARITY_COLORS[item.rarity]}44`
            }}>
                      <div className="text-2xl mb-1">🎴</div>
                      <div className="text-xs font-semibold text-white truncate">{item.itemName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">×{item.quantity}</div>
                      <Badge className="mt-1 text-xs w-full justify-center" style={{
                background: `${RARITY_COLORS[item.rarity]}22`,
                color: RARITY_COLORS[item.rarity],
                border: `1px solid ${RARITY_COLORS[item.rarity]}44`
              }}>
                        {item.rarity}
                      </Badge>
                    </div>)}
                  {profile.inventory.length === 0 && <div className="col-span-6 text-center py-12 text-gray-500">
                      No items yet. Open a Value Pack to get started!
                    </div>}
                </div>}

              {/* History tab */}
              {activeTab === 'history' && <div className="space-y-2">
                  {profile.recentXp.map((entry, i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white capitalize">{entry.source.replace('_', ' ')}</div>
                          {entry.levelBefore !== entry.levelAfter && <div className="text-xs text-yellow-400">Level up! {entry.levelBefore} → {entry.levelAfter}</div>}
                        </div>
                      </div>
                      <div className="text-green-400 font-bold text-sm">+{entry.xpAwarded} XP</div>
                    </div>)}
                  {profile.recentXp.length === 0 && <div className="text-center py-12 text-gray-500">No XP history yet. Start earning!</div>}
                </div>}
            </motion.div>}
        </div>
      </main>
    </>;
}
