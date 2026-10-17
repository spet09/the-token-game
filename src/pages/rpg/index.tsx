/**
 * /rpg — RPG Hub page
 * Entry point for the Token Game RPG layer.
 */
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Link } from "react-router";
import { Sword, Package, User, Zap, Globe, ChevronRight, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CLASS_DEFINITIONS, PACK_DEFINITIONS, PLATFORM_UNLOCKS } from '@/lib/rpg/levels';
const FEATURES = [{
  icon: <User className="w-6 h-6" />,
  title: 'Character Creation',
  description: 'Choose your class, nation, and build your unique identity across the Tienko ecosystem.',
  href: '/rpg/create-character',
  color: '#BF5FFF',
  cta: 'Create Character'
}, {
  icon: <Package className="w-6 h-6" />,
  title: 'Value Packs',
  description: 'Open packs to earn cards, XP, and rare abilities. Five tiers from Starter to Mythic.',
  href: '/rpg/value-packs',
  color: '#f59e0b',
  cta: 'Open Packs'
}, {
  icon: <Zap className="w-6 h-6" />,
  title: 'Powers & Abilities',
  description: 'Unlock 19 unique abilities as you level up. Each class has exclusive powers.',
  href: '/rpg/profile',
  color: '#10b981',
  cta: 'View Abilities'
}, {
  icon: <Globe className="w-6 h-6" />,
  title: 'Unified Profile',
  description: 'One profile across thetokengame.xyz, tienko.io, tienko.exchange, and more.',
  href: '/rpg/profile',
  color: '#3b82f6',
  cta: 'View Profile'
}];
const LEVEL_MILESTONES = [{
  level: 1,
  xp: 0,
  reward: 'Basic Trade — buy and sell basic coins. Access to thepeoplegame.io.',
  icon: '🌱'
}, {
  level: 5,
  xp: 500,
  reward: 'Staking — stake coins for rewards. First value pack unlocked.',
  icon: '☀️'
}, {
  level: 10,
  xp: 1500,
  reward: 'Crafting — create basic items. Access to thetokengame.com + nation selection.',
  icon: '⭐'
}, {
  level: 20,
  xp: 5000,
  reward: 'Advanced Trade — premium trading pairs and advanced upgrades.',
  icon: '💫'
}, {
  level: 30,
  xp: 15000,
  reward: 'Exploration — special events, missions, and access to tienko.io.',
  icon: '🗺️'
}, {
  level: 50,
  xp: 50000,
  reward: 'Legendary Crafting — create legendary items. Legendary cards unlocked.',
  icon: '🔮'
}, {
  level: 75,
  xp: 150000,
  reward: 'Institutional Access — tienko.ltd and premium institutional features.',
  icon: '🏛️'
}, {
  level: 100,
  xp: 500000,
  reward: 'Mastery — ultimate powers, special abilities, and The Stash rewards.',
  icon: '🌌'
}];
export default function RpgHubPage() {
  return <>
      <Helmet>
        <title>RPG Layer — The Token Game</title>
        <meta name="description" content="Enter the Token Game RPG. Create your character, earn XP, open packs, and unlock powers across the Tienko ecosystem." />
        <link rel="canonical" href="https://thetokengame.xyz/rpg" />
        <meta property="og:title" content="RPG Layer — The Token Game" />
        <meta property="og:description" content="Enter the Token Game RPG. Create your character, earn XP, open packs, and unlock powers across the Tienko ecosystem." />
        <meta property="og:image" content="https://thetokengame.xyz/airo-assets/images/logo/primary" />
        <meta property="og:url" content="https://thetokengame.xyz/rpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RPG Layer — The Token Game" />
        <meta name="twitter:description" content="Enter the Token Game RPG. Create your character, earn XP, open packs, and unlock powers across the Tienko ecosystem." />
        <meta name="twitter:image" content="https://thetokengame.xyz/airo-assets/images/logo/primary" />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(191,95,255,0.2),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,95,239,0.1),transparent_60%)]" />
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-300 text-sm mb-6">
                <Sword className="w-4 h-4" />
                <span>The Token Game RPG</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-white">Enter the </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  RPG Layer
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Level up through trading, staking, and challenges. Unlock powers, open packs, and build your legacy across the entire Tienko ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/rpg/create-character">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8">
                    <Sword className="w-5 h-5 mr-2" /> Create Your Character
                  </Button>
                </Link>
                <Link to="/rpg/profile">
                  <Button size="lg" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 px-8">
                    <User className="w-5 h-5 mr-2" /> View Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Classes preview */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Choose Your Class</h2>
              <p className="text-gray-400">Five unique classes, each with exclusive abilities and bonuses.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(CLASS_DEFINITIONS).map(([key, cls], i) => <motion.div key={key} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }} className="bg-white/5 border rounded-2xl p-4 text-center hover:bg-white/8 transition-all cursor-pointer group" style={{
              borderColor: `${cls.color}33`
            }}>
                  <div className="text-4xl mb-3">{cls.icon}</div>
                  <div className="font-bold text-white text-sm mb-1">{cls.name}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{cls.bonuses[0]}</div>
                </motion.div>)}
            </div>
            <div className="text-center mt-6">
              <Link to="/rpg/create-character">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                  Pick Your Class <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-16 px-4 bg-white/2">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">RPG Features</h2>
              <p className="text-gray-400">Everything you need to build your legend.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((f, i) => <motion.div key={f.title} initial={{
              opacity: 0,
              x: i % 2 === 0 ? -20 : 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }}>
                  <Link to={f.href} className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                  background: `${f.color}22`,
                  color: f.color
                }}>
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{f.description}</p>
                    <span className="text-sm font-semibold flex items-center gap-1" style={{
                  color: f.color
                }}>
                      {f.cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Level milestones */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Level Milestones</h2>
              <p className="text-gray-400">Every milestone unlocks new powers and platform access.</p>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-yellow-500 hidden md:block" />
              <div className="space-y-4">
                {LEVEL_MILESTONES.map((m, i) => <motion.div key={m.level} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: i * 0.05
              }} className="flex items-center gap-4 md:pl-20 relative">
                    <div className="hidden md:flex absolute left-4 w-8 h-8 bg-[#0a0a0f] border-2 border-purple-500 rounded-full items-center justify-center text-sm font-bold text-purple-400">
                      {m.level}
                    </div>
                    <div className="text-2xl">{m.icon}</div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-purple-400 font-bold text-sm">Level {m.level}</span>
                        <span className="text-gray-500 text-xs">{m.xp.toLocaleString()} XP</span>
                        <span className="text-gray-300 text-sm">{m.reward}</span>
                      </div>
                    </div>
                  </motion.div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Platform unlock gates */}
        <section className="py-16 px-4 bg-white/2 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Platform Access</h2>
              <p className="text-gray-400">Level up to unlock the full Tienko ecosystem — one platform at a time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLATFORM_UNLOCKS.map((p, i) => <motion.div key={p.platform} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }} className="bg-white/5 border rounded-2xl p-5 flex items-start gap-4" style={{
              borderColor: `${p.color}33`
            }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{
                background: `${p.color}22`
              }}>
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-white text-sm">{p.platform}</span>
                      {p.level === 1 ? <span className="flex items-center gap-1 text-xs text-emerald-400"><Unlock className="w-3 h-3" /> Free to start</span> : <span className="flex items-center gap-1 text-xs" style={{
                    color: p.color
                  }}><Lock className="w-3 h-3" /> Level {p.level} · {p.xpRequired.toLocaleString()} XP</span>}
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.description}</p>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Packs preview */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Value Packs</h2>
              <p className="text-gray-400">Five tiers of packs. Spend USD, earn USGC coins, cards, and XP.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {PACK_DEFINITIONS.map((pack, i) => <motion.div key={pack.tier} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }} className="bg-white/5 border rounded-2xl p-4 text-center" style={{
              borderColor: `${pack.color}44`
            }}>
                  <div className="text-3xl mb-2">{pack.icon}</div>
                  <div className="font-bold text-white text-sm mb-1">{pack.name}</div>
                  <div className="text-lg font-black mb-1" style={{
                color: pack.color
              }}>${pack.usdPrice}</div>
                  <div className="text-xs text-gray-300 mb-1">🪙 {pack.usgcAmount.toLocaleString()} USGC{pack.bonusCoins > 0 ? ` + ${pack.bonusCoins.toLocaleString()} bonus` : ''}</div>
                  <div className="text-xs text-gray-400 mb-1">{pack.cardsAwarded} card{pack.cardsAwarded !== 1 ? 's' : ''}{pack.rareCards > 0 ? ` · ${pack.rareCards} rare` : ''}{pack.legendaryCards > 0 ? ` · ${pack.legendaryCards} legendary` : ''}</div>
                  {pack.xpAwarded > 0 && <div className="text-xs text-purple-400">+{pack.xpAwarded.toLocaleString()} XP</div>}
                  <div className="text-xs text-gray-500 mt-1">Lv.{pack.levelRequired}+</div>
                </motion.div>)}
            </div>
            <div className="text-center mt-6">
              <Link to="/rpg/value-packs">
                <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white">
                  Browse All Packs <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center border-t border-white/5">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-4">⚔️</div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin?</h2>
            <p className="text-gray-400 mb-8">Create your character and start earning XP across the Tienko ecosystem today.</p>
            <Link to="/rpg/create-character">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 text-white font-bold px-10 py-4 text-lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>;
}
