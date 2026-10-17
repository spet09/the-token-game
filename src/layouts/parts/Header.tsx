import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown, Globe, Map, ShoppingCart, Trophy } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/use-cart';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserJourneyPanel from '@/components/journey/UserJourneyPanel';

const TienkoWalletButton = lazy(() => import('@/components/TienkoWalletButton'));
const EDITIONS = [{
  href: '/global',
  label: 'Global',
  flag: '🌐'
}, {
  href: '/australia',
  label: 'Australia',
  flag: '🇦🇺'
}, {
  href: '/china',
  label: 'China',
  flag: '🇨🇳'
}, {
  href: '/usa',
  label: 'USA',
  flag: '🇺🇸'
}, {
  href: '/europe',
  label: 'Europe',
  flag: '🇪🇺'
}, {
  href: '/africa',
  label: 'Africa',
  flag: '🌍'
}, {
  href: '/russia',
  label: 'Russia',
  flag: '🇷🇺'
}, {
  href: '/india',
  label: 'India',
  flag: '🇮🇳'
}, {
  href: '/japan',
  label: 'Japan',
  flag: '🇯🇵'
}, {
  href: '/southamerica',
  label: 'South America',
  flag: '🌎'
}, {
  href: '/middleeast',
  label: 'Middle East',
  flag: '🌙'
}, {
  href: '/oceania',
  label: 'Oceania',
  flag: '🌊'
}, {
  href: '/northamerica',
  label: 'North America',
  flag: '🍁'
}, {
  href: '/centralamerica',
  label: 'Central America',
  flag: '🌺'
}, {
  href: '/arctic',
  label: 'Arctic',
  flag: '🧊'
}, {
  href: '/antarctica',
  label: 'Antarctica',
  flag: '🐧'
}];
const WALLET_ICONS: Record<string, string> = {
  phantom: '👻',
  solflare: '🔆',
  backpack: '🎒'
};
export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileEditionsOpen, setMobileEditionsOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const {
    cartCount
  } = useCart();
  // Row 2 — primary gameplay & collecting links
  const navRow2 = [{
    href: '/oasis',
    label: '🌐 The Nexus'
  }, {
    href: '/crafting',
    label: '⚗️ Crafting'
  }, {
    href: '/community',
    label: '👥 Community'
  }, {
    href: '/quests',
    label: '⚔️ Quests'
  }, {
    href: '/calendar',
    label: '📅 Calendar'
  }, {
    href: '/coins',
    label: 'All Coins'
  }, {
    href: '/coin-directory',
    label: 'Coin Directory'
  }, {
    href: '/buy-coins',
    label: '🪙 Browse Collection'
  }, {
    href: '/world-map',
    label: 'World Map'
  }, {
    href: '/journey',
    label: '🗺️ Journey'
  }];

  // Row 3 — lore, info & meta links (+ dropdowns)
  const navRow3 = [{
    href: '/rwa',
    label: 'RWA'
  }, {
    href: '/curator',
    label: 'The Curator'
  }, {
    href: '/backstories',
    label: '📚 Backstories'
  }, {
    href: '/roadmap',
    label: 'Roadmap'
  }, {
    href: '/war-room',
    label: 'War Room'
  }, {
    href: '/tokenomics',
    label: 'Tokenomics'
  }, {
    href: '/how-to-play',
    label: 'How to Play'
  }, {
    href: '/about',
    label: 'About'
  }, {
    href: '/blog',
    label: '📝 Blog'
  }];

  // Combined for mobile menu
  const navItems = [...navRow2, ...navRow3];
  const LEADERBOARDS = [{
    href: '/leaderboard',
    label: '🏆 Season Leaderboard',
    desc: 'XP, quests & streaks'
  }, {
    href: '/coin-leaderboard',
    label: '📊 Coin Leaderboard',
    desc: 'Live trading activity'
  }, {
    href: '/hall-of-legends',
    label: '🌟 Hall of Legends',
    desc: 'All-time greats'
  }];
  const isLeaderboardActive = LEADERBOARDS.some(l => location.pathname === l.href);
  const isEditionActive = EDITIONS.some(e => location.pathname === e.href);
  return <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">

          {/* ── Row 1: Logo + CTAs ── */}
          <div className="flex h-14 items-center justify-between border-b border-white/5">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/airo-assets/images/logo/horizontal-3" alt="The Token Game" className="h-9 w-auto object-contain shrink-0 self-center" />
            </Link>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart icon */}
              <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>}
              </Link>
              <Button variant="outline" size="sm" className="font-semibold border-white/20 text-foreground/70 hover:border-primary/50 hover:text-primary" asChild>
                <a href="https://discord.gg/FvwyWzbnj" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>

              {/* Journey button */}
              <Button size="sm" onClick={() => setJourneyOpen(true)} className="font-semibold gap-1.5" style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(191,95,255,0.12))',
              color: '#FFD700',
              border: '1px solid rgba(255,215,0,0.35)',
              boxShadow: '0 0 14px rgba(255,215,0,0.15)'
            }}>
                <Map size={13} />
                My Journey
              </Button>

              <Button size="sm" className="font-semibold gap-1.5" style={{
              background: 'linear-gradient(135deg, rgba(191,95,255,0.15), rgba(255,95,239,0.15))',
              color: '#BF5FFF',
              border: '1px solid rgba(191,95,255,0.4)',
              boxShadow: '0 0 14px rgba(191,95,255,0.2)'
            }} asChild>
                <Link to="/rpg">
                  <span className="text-xs">⚔️</span>
                  RPG
                </Link>
              </Button>

              <Button size="sm" className="font-semibold gap-1.5" style={{
              background: 'linear-gradient(135deg, hsl(276 100% 69% / 0.15), hsl(306 100% 69% / 0.15))',
              color: 'hsl(276 100% 69%)',
              border: '1px solid hsl(276 100% 69% / 0.4)',
              boxShadow: '0 0 14px hsl(276 100% 69% / 0.2)'
            }} asChild>
                <Link to="/whitelist">
                  <span className="text-xs">⚡</span>
                  Join the Republic
                </Link>
              </Button>

              {/* Tienko Wallet button — always visible in desktop nav */}
              <Suspense fallback={null}>
                <TienkoWalletButton size="sm" />
              </Suspense>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors" aria-label="Toggle menu">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* ── Row 2: Primary nav links (desktop only) ── */}
          <div className="hidden md:flex h-10 items-center justify-center gap-0.5 border-b border-white/5">
            {navRow2.map(item => <Link key={item.href} to={item.href} className={`text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors duration-200 hover:text-primary hover:bg-white/5 whitespace-nowrap ${location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-foreground/60'}`}>
                {item.label}
              </Link>)}
          </div>

          {/* ── Row 3: Secondary nav + dropdowns (desktop only) ── */}
          <div className="hidden md:flex h-10 items-center justify-center gap-0.5">
            {navRow3.map(item => <Link key={item.href} to={item.href} className={`text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors duration-200 hover:text-primary hover:bg-white/5 whitespace-nowrap ${location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-foreground/60'}`}>
                {item.label}
              </Link>)}

            {/* Leaderboards dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors duration-200 hover:text-primary hover:bg-white/5 outline-none whitespace-nowrap ${isLeaderboardActive ? 'text-primary bg-primary/10' : 'text-foreground/60'}`}>
                  <Trophy size={13} />
                  Leaderboards
                  <ChevronDown size={12} className="opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border-white/10 p-1">
                {LEADERBOARDS.map(lb => <DropdownMenuItem key={lb.href} asChild>
                    <Link to={lb.href} className={`flex flex-col gap-0.5 px-3 py-2 rounded-md cursor-pointer transition-colors ${location.pathname === lb.href ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:text-foreground'}`}>
                      <span className="text-sm font-medium">{lb.label}</span>
                      <span className="text-xs text-foreground/40">{lb.desc}</span>
                    </Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Editions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors duration-200 hover:text-primary hover:bg-white/5 outline-none whitespace-nowrap ${isEditionActive ? 'text-primary bg-primary/10' : 'text-foreground/60'}`}>
                  <Globe size={13} />
                  Editions
                  <ChevronDown size={12} className="opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 bg-card border-white/10 grid grid-cols-1 p-1">
                {EDITIONS.map(ed => <DropdownMenuItem key={ed.href} asChild>
                    <Link to={ed.href} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer transition-colors ${location.pathname === ed.href ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:text-foreground'}`}>
                      <span>{ed.flag}</span>
                      {ed.label}
                    </Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && <div className="md:hidden border-t border-white/10 py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map(item => <Link key={item.href} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary py-3 px-2 rounded-md ${location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-foreground/70'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </Link>)}

                {/* Mobile Leaderboards section */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wide px-2 pt-2">Leaderboards</p>
                  {LEADERBOARDS.map(lb => <Link key={lb.href} to={lb.href} className={`flex items-center justify-between text-sm font-medium py-2.5 px-2 rounded-md transition-colors hover:text-primary ${location.pathname === lb.href ? 'text-primary bg-primary/10' : 'text-foreground/70'}`} onClick={() => setIsMobileMenuOpen(false)}>
                      <span>{lb.label}</span>
                      <span className="text-xs text-foreground/30">{lb.desc}</span>
                    </Link>)}
                </div>

                {/* Mobile Editions toggle */}
                <button onClick={() => setMobileEditionsOpen(!mobileEditionsOpen)} className={`flex items-center justify-between text-sm font-medium py-3 px-2 rounded-md transition-colors hover:text-primary ${isEditionActive ? 'text-primary bg-primary/10' : 'text-foreground/70'}`}>
                  <span className="flex items-center gap-2">
                    <Globe size={14} /> Editions
                  </span>
                  <ChevronDown size={13} className={`transition-transform ${mobileEditionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileEditionsOpen && <div className="pl-4 flex flex-col gap-1">
                    {EDITIONS.map(ed => <Link key={ed.href} to={ed.href} className={`flex items-center gap-2 text-sm py-2 px-2 rounded-md transition-colors hover:text-primary ${location.pathname === ed.href ? 'text-primary bg-primary/10' : 'text-foreground/60'}`} onClick={() => {
                setIsMobileMenuOpen(false);
                setMobileEditionsOpen(false);
              }}>
                        <span>{ed.flag}</span>
                        {ed.label}
                      </Link>)}
                  </div>}

                <div className="pt-3 flex flex-col gap-2">
                  <Button className="w-full font-semibold gap-2" style={{
                background: 'linear-gradient(135deg, hsl(276 100% 69% / 0.15), hsl(306 100% 69% / 0.15))',
                color: 'hsl(276 100% 69%)',
                border: '1px solid hsl(276 100% 69% / 0.4)'
              }} asChild>
                    <Link to="/whitelist" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>⚡</span>
                      Join the Republic
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full font-semibold border-white/20 text-foreground/70" asChild>
                    <a href="https://discord.gg/FvwyWzbnj" target="_blank" rel="noopener noreferrer">
                      Join Discord
                    </a>
                  </Button>

                  <Suspense fallback={null}>
                    <TienkoWalletButton />
                  </Suspense>
                </div>
              </nav>
            </div>}
        </div>
      </header>

      <UserJourneyPanel open={journeyOpen} onClose={() => setJourneyOpen(false)} walletAddress={undefined} />
    </>;
}
