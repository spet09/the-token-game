import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
}
function parseDateMs(raw: string): number | null {
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? null : t;
}
function getTimeLeft(targetDate: string) {
  if (!targetDate) return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: true
  };
  const end = parseDateMs(targetDate);
  if (end === null) return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: true
  };
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: true
  };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60) % 24),
    minutes: Math.floor(diff / (1000 * 60) % 60),
    seconds: Math.floor(diff / 1000 % 60),
    ended: false
  };
}
function CountdownUnit({
  value,
  label
}: {
  value: number;
  label: string;
}) {
  return <div className="flex flex-col items-center bg-card border border-border rounded-lg px-4 py-3 min-w-[64px]">
      <span className="font-mono text-3xl font-bold text-primary tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
    </div>;
}
function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }
  return <section className="bg-muted border-y border-border">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Stay in the loop</h2>
        <p className="text-muted-foreground mb-8">
          Get notified when new seasonal coins drop and when staking pools open.
        </p>
        {status === 'success' ? <div className="bg-primary/10 border border-primary/30 rounded-lg px-6 py-4 text-primary font-semibold">
            ✓ You're on the list — we'll be in touch before the next drop.
          </div> : <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input ref={inputRef} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required disabled={status === 'loading'} className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50" />
            <button type="submit" disabled={status === 'loading' || !email.trim()} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap">
              {status === 'loading' ? 'Sending…' : 'Notify me'}
            </button>
          </form>}
        {status === 'error' && <p className="mt-3 text-sm text-destructive">{errorMsg}</p>}
        <p className="text-xs text-muted-foreground mt-4">No spam. Unsubscribe any time.</p>
      </div>
    </section>;
}
export default function JoinTheGamePage({
  startDate,
  endDate
}: {
  startDate?: string;
  endDate?: string;
}) {
  const [searchParams] = useSearchParams();
  const saleStart = startDate ? `${startDate}T00:00:00Z` : '';
  const saleEnd = endDate ? `${endDate}T23:59:59Z` : '';
  const effectiveSaleStart = (import.meta.env.VITE_PARENT_ORIGIN ? searchParams.get('__preview_start') : null) ?? saleStart;
  const effectiveSaleEnd = (import.meta.env.VITE_PARENT_ORIGIN ? searchParams.get('__preview_end') : null) ?? saleEnd;
  const now = Date.now();
  const startMs = effectiveSaleStart ? parseDateMs(effectiveSaleStart) : null;
  const endMs = effectiveSaleEnd ? parseDateMs(effectiveSaleEnd) : null;
  const hasStarted = startMs !== null ? now >= startMs : true;
  const hasEnded = endMs !== null ? now >= endMs : false;
  const saleCountdown = useCountdown(effectiveSaleEnd);
  const startCountdown = useCountdown(effectiveSaleStart);

  // CAMPAIGN ENDED
  if (hasEnded) {
    return <>
        <Helmet>
          <title>The Token Game — Season Closed</title>
          <meta name="description" content="This recruitment window has closed. The Token Game continues — connect your Solana wallet and jump in for the next season." />
        </Helmet>
        <section className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-6 py-20 max-w-lg mx-auto">
            <div className="text-6xl mb-6">🏁</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">This window has closed.</h1>
            <p className="text-muted-foreground text-lg mb-8">
              The recruitment campaign has ended — but The Token Game never stops. New seasons, new coins, new chances to dominate.
            </p>
            <Link to="/" className="inline-block bg-primary text-primary-foreground font-bold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity">
              Enter The Token Game →
            </Link>
          </div>
        </section>
      </>;
  }

  // COMING SOON
  if (!hasStarted) {
    return <>
        <Helmet>
          <title>The Token Game — Coming Soon</title>
          <meta name="description" content="The Token Game player recruitment is opening soon. 212 seasonal meme coins, 16 global editions, built on Solana." />
        </Helmet>
        <section className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-6 py-20 max-w-lg mx-auto">
            <div className="text-6xl mb-6">⏳</div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Something big is coming.</h1>
            <p className="text-muted-foreground text-lg mb-8">
              The Token Game opens its doors soon. 212 seasonal meme coins. 16 global editions. All on Solana.
            </p>
            <div className="flex justify-center gap-3 mb-10">
              <CountdownUnit value={startCountdown.days} label="days" />
              <CountdownUnit value={startCountdown.hours} label="hours" />
              <CountdownUnit value={startCountdown.minutes} label="min" />
              <CountdownUnit value={startCountdown.seconds} label="sec" />
            </div>
            <p className="text-sm text-muted-foreground">Get your Solana wallet ready.</p>
          </div>
        </section>
      </>;
  }

  // ACTIVE — full recruitment landing page
  return <>
      <Helmet>
        <title>Join The Token Game — Connect Your Solana Wallet & Start Playing</title>
        <meta name="description" content="212 seasonal meme coins. 16 global editions. Craft, stake, quest, and compete on Solana. Connect your wallet and start playing The Token Game today." />
        <link rel="canonical" href="https://thetokengame.xyz/lp/join-the-game" />
        <meta property="og:title" content="Join The Token Game — Connect Your Solana Wallet & Start Playing" />
        <meta property="og:description" content="212 seasonal meme coins. 16 global editions. Craft, stake, quest, and compete on Solana." />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/lp/join-the-game" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join The Token Game — Connect Your Solana Wallet & Start Playing" />
        <meta name="twitter:description" content="212 seasonal meme coins. 16 global editions. Craft, stake, quest, and compete on Solana." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/lp/join-the-game#webpage',
          name: 'Join The Token Game',
          url: 'https://thetokengame.xyz/lp/join-the-game',
          description: '212 seasonal meme coins. 16 global editions. Craft, stake, quest, and compete on Solana.',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        {/* Countdown banner */}
        <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
          <span>🎮 Recruitment window closes in: </span>
          <span className="font-mono font-bold">
            {saleCountdown.days}d {saleCountdown.hours}h {saleCountdown.minutes}m {saleCountdown.seconds}s
          </span>
          <span> — connect your wallet now</span>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img src="/airo-assets/images/pages/lp/join-the-game/hero" alt="" className="w-full h-full object-cover opacity-20" loading="eager" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
            <div className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              Now Open — Season Recruitment
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Play Smart.<br />
              <span className="text-primary">Win Big.</span><br />
              Own It.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The Token Game is the world's first seasonal meme coin ecosystem on Solana. Collect 212+ coins, craft your way up the tier ladder, stake for up to 32% APY, and compete across 16 global editions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="inline-block bg-primary text-primary-foreground font-bold px-10 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity">
                Connect Wallet & Start Playing →
              </Link>
              <Link to="/how-to-play" className="inline-block border border-border text-foreground font-semibold px-8 py-4 rounded-lg text-lg hover:bg-muted transition-colors">
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border bg-card">
          <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-primary">212+</div>
              <div className="text-sm text-muted-foreground mt-1">Seasonal Coins</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">16</div>
              <div className="text-sm text-muted-foreground mt-1">Global Editions</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">32%</div>
              <div className="text-sm text-muted-foreground mt-1">Max Staking APY</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">30+</div>
              <div className="text-sm text-muted-foreground mt-1">Quests to Complete</div>
            </div>
          </div>
        </section>

        {/* How to get started */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">Get started in 3 steps</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            No complicated setup. No gas fees to worry about. Just connect and play.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            step: '01',
            title: 'Connect Your Solana Wallet',
            desc: 'Phantom, Solflare, or any Solana-compatible wallet. One click and you\'re in.',
            icon: '🔗'
          }, {
            step: '02',
            title: 'Collect Seasonal Coins',
            desc: 'Browse the calendar and grab coins during their active windows. Miss the window, miss the coin.',
            icon: '🪙'
          }, {
            step: '03',
            title: 'Craft, Stake & Compete',
            desc: 'Combine coins to climb the tier ladder. Stake USGC, NYC, or TIEN for passive rewards. Dominate the War Room.',
            icon: '⚔️'
          }].map(item => <div key={item.step} className="bg-card border border-border rounded-xl p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-mono text-primary mb-2">{item.step}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>)}
          </div>
        </section>

        {/* 8-Coin Economy */}
        <section className="bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">The 8-Coin Economy</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Every coin has a role. Craft your way from TKN to USGC and unlock the highest staking yields in the ecosystem.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{
              coin: 'TKN',
              tier: 'Tier 1',
              desc: 'The base currency. Earned through gameplay and quests.',
              color: 'text-yellow-400'
            }, {
              coin: 'GOLD',
              tier: 'Tier 2',
              desc: 'Crafted from 100 TKN. Mid-tier tradeable token.',
              color: 'text-yellow-500'
            }, {
              coin: 'OASIS',
              tier: 'Tier 3',
              desc: 'Crafted from 1,000 GOLD. High-value ecosystem token.',
              color: 'text-primary'
            }, {
              coin: 'USGC',
              tier: 'Tier 4',
              desc: 'Crafted from 10 OASIS. Top-tier — 18.5% APY staking pool.',
              color: 'text-secondary'
            }, {
              coin: 'XP Coin',
              tier: 'Special',
              desc: 'Non-tradeable. Earned through quests and milestones.',
              color: 'text-accent'
            }, {
              coin: 'ARTFCT',
              tier: 'Special',
              desc: 'Rare artifact token. Non-craftable.',
              color: 'text-muted-foreground'
            }, {
              coin: 'NTN',
              tier: 'Special',
              desc: 'Nation token. Tied to War Room dominance.',
              color: 'text-muted-foreground'
            }, {
              coin: 'CUR8',
              tier: 'Special',
              desc: 'Curator token. Non-craftable.',
              color: 'text-muted-foreground'
            }].map(item => <div key={item.coin} className="flex items-start gap-4 bg-background border border-border rounded-lg p-4">
                  <div className={`font-mono font-bold text-lg ${item.color} min-w-[64px]`}>{item.coin}</div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{item.tier}</div>
                    <div className="text-sm text-foreground">{item.desc}</div>
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Everything in one ecosystem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            icon: '📅',
            title: 'Seasonal Calendar',
            desc: '10 seasons, 130+ coin windows. Timing is everything.'
          }, {
            icon: '⚗️',
            title: 'Crafting System',
            desc: 'Forward and reverse calculators. Combine coins to climb tiers.'
          }, {
            icon: '💰',
            title: 'Staking Pools',
            desc: 'USGC 18.5% · NYC 24% · TIEN 32% APY.'
          }, {
            icon: '⚔️',
            title: 'War Room',
            desc: '19 nation pages. Compete for global dominance.'
          }, {
            icon: '🗺️',
            title: '30 Quests',
            desc: '6 categories, 4 tiers. Complete quests to earn XP and level up.'
          }, {
            icon: '🏆',
            title: 'Leaderboards',
            desc: 'Global rankings, coin leaderboards, and Hall of Legends.'
          }, {
            icon: '📖',
            title: '1,582 Backstories',
            desc: 'Every coin has lore. Explore the full universe.'
          }, {
            icon: '🎲',
            title: 'Bingo & Auctions',
            desc: 'Seasonal bingo with auction mechanics.'
          }, {
            icon: '🧙',
            title: 'RPG Classes',
            desc: '5 character classes, 19 unique abilities.'
          }].map(f => <div key={f.title} className="bg-card border border-border rounded-xl p-5">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>)}
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-primary">
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-extrabold text-primary-foreground mb-4">
              Your wallet. Your coins. Your game.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-4">
              Seasonal coins are only available during their windows. Once they're gone, they're gone.
            </p>
            <div className="flex justify-center gap-3 mb-8">
              <CountdownUnit value={saleCountdown.days} label="days" />
              <CountdownUnit value={saleCountdown.hours} label="hours" />
              <CountdownUnit value={saleCountdown.minutes} label="min" />
              <CountdownUnit value={saleCountdown.seconds} label="sec" />
            </div>
            <Link to="/" className="inline-block bg-primary-foreground text-primary font-extrabold px-12 py-5 rounded-lg text-xl hover:opacity-90 transition-opacity">
              Connect Wallet & Start Playing →
            </Link>
            <p className="text-primary-foreground/60 text-sm mt-4">
              Solana wallet required · No registration fee · Play immediately
            </p>
          </div>
        </section>

        {/* Email capture */}
        <EmailCapture />

        {/* Footer note */}
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Link to="/about" className="hover:text-foreground transition-colors">Learn more about The Token Game</Link>
          {' · '}
          <Link to="/how-to-play" className="hover:text-foreground transition-colors">How to play</Link>
          {' · '}
          <Link to="/calendar" className="hover:text-foreground transition-colors">Seasonal calendar</Link>
        </div>

      </div>
    </>;
}
