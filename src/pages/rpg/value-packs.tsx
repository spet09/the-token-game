import { useEffect, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Coins, Sparkles, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PACK_DEFINITIONS, type PackDefinition } from '@/lib/rpg/levels';
import { rpg_value_packs } from 'virtual:content';

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface RewardCard {
  id: string;
  name: string;
  rarity: Rarity;
  type?: string;
  icon?: string;
}

interface PackResponse {
  rewards?: RewardCard[];
  cards?: RewardCard[];
  xpAwarded?: number;
  xp?: number;
}

const rarityClass: Record<Rarity, string> = {
  common: 'border-slate-400/40 bg-slate-400/10 text-slate-200',
  uncommon: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  rare: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
  epic: 'border-primary/50 bg-primary/10 text-primary',
  legendary: 'border-amber-400/50 bg-amber-400/10 text-amber-300',
};

function asRarity(value: string): Rarity {
  return value in rarityClass ? value as Rarity : 'common';
}

function typeIcon(type?: string, icon?: string): string {
  if (icon) return icon;
  if (type?.toLowerCase().includes('ability')) return '✨';
  if (type?.toLowerCase().includes('coin')) return '🪙';
  return '🎴';
}

export default function ValuePacksPage() {
  const [walletInput, setWalletInput] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [coinBalance, setCoinBalance] = useState<number | null>(null);
  const [playerLevel] = useState(1);
  const [openingTier, setOpeningTier] = useState<PackDefinition['tier'] | null>(null);
  const [rewardData, setRewardData] = useState<{ rewards: RewardCard[]; xp: number } | null>(null);
  const [visibleRewards, setVisibleRewards] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!rewardData) return undefined;
    setVisibleRewards(0);
    const timers = rewardData.rewards.map((_, index) => window.setTimeout(() => {
      setVisibleRewards(index + 1);
    }, (index + 1) * 200));
    return () => timers.forEach(window.clearTimeout);
  }, [rewardData]);

  async function connectWallet() {
    const nextWallet = walletInput.trim();
    if (!nextWallet) return;
    setError('');
    setWalletAddress(nextWallet);
    setCoinBalance(null);

    try {
      const response = await fetch(`/api/wallet/balance?wallet=${encodeURIComponent(nextWallet)}`);
      if (!response.ok) throw new Error('Unable to load wallet balance.');
      const data: unknown = await response.json();
      const balance = typeof data === 'object' && data !== null && 'balance' in data
        ? Number(data.balance)
        : NaN;
      if (!Number.isFinite(balance)) throw new Error('Wallet balance was unavailable.');
      setCoinBalance(balance);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load wallet balance.');
    }
  }

  async function openPack(pack: PackDefinition) {
    if (!walletAddress || playerLevel < pack.levelRequired) return;
    setOpeningTier(pack.tier);
    setError('');
    try {
      const response = await fetch('/api/rpg/pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, packTier: pack.tier }),
      });
      if (!response.ok) throw new Error('Unable to open this pack. Please try again.');
      const data = await response.json() as PackResponse;
      const rewards = data.rewards ?? data.cards ?? [];
      setRewardData({ rewards, xp: data.xpAwarded ?? data.xp ?? pack.xpAwarded });
      if (coinBalance !== null) setCoinBalance(Math.max(0, coinBalance - pack.usgcAmount));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to open this pack.');
    } finally {
      setOpeningTier(null);
    }
  }

  return (
    <>
      <Helmet>
        <title>{rpg_value_packs.seo.title}</title>
        <meta name="description" content={rpg_value_packs.seo.description} />
        <link rel="canonical" href="https://thetokengame.xyz/rpg/value-packs" />
        <meta property="og:title" content={rpg_value_packs.seo.title} />
        <meta property="og:description" content={rpg_value_packs.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/rpg/value-packs" />
        <meta property="og:image" content="https://thetokengame.xyz/airo-assets/images/logo/primary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={rpg_value_packs.seo.title} />
        <meta name="twitter:description" content={rpg_value_packs.seo.description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/airo-assets/images/logo/primary" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: rpg_value_packs.seo.title,
          url: 'https://thetokengame.xyz/rpg/value-packs',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background px-4 py-16 text-foreground md:py-20">
        <section className="mx-auto max-w-6xl">
          <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-4 py-2 text-sm text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              <span>RPG rewards</span>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-foreground md:text-6xl">{rpg_value_packs.hero.title}</h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">{rpg_value_packs.hero.subtitle}</p>
          </motion.header>

          <section aria-label="Wallet connection" className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/25 bg-card p-4 shadow-lg shadow-primary/10 md:p-5">
            {walletAddress ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <WalletCards className="size-4 text-accent" aria-hidden="true" />
                  <span className="text-muted-foreground">Connected:</span>
                  <span className="font-mono text-foreground text-xs truncate max-w-[200px]">{walletAddress}</span>
                  {coinBalance !== null && <span className="font-semibold text-accent">🪙 {coinBalance.toLocaleString()} coins</span>}
                  <span className="rounded-full border border-border/20 px-2 py-0.5 text-muted-foreground">Level {playerLevel}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setWalletAddress(''); setWalletInput(''); setCoinBalance(null); }} className="border-border/20 text-muted-foreground hover:text-foreground text-xs">
                  Disconnect
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="wallet-address">{rpg_value_packs.wallet.prompt}</label>
                  <Input id="wallet-address" value={walletInput} onChange={(event) => setWalletInput(event.target.value)} onKeyDown={(e) => e.key === 'Enter' && connectWallet()} placeholder="Wallet address" className="border-border/20 bg-background text-foreground placeholder:text-muted-foreground" />
                  <Button onClick={connectWallet} className="bg-primary text-primary-foreground hover:bg-primary/90">Connect</Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                  <WalletCards className="size-3.5" aria-hidden="true" /> {rpg_value_packs.wallet.prompt}
                </p>
              </>
            )}
            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
          </section>
        </section>

        <section aria-label="Available value packs" className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PACK_DEFINITIONS.map((pack, index) => {
            const locked = playerLevel < pack.levelRequired;
            const opening = openingTier === pack.tier;
            return (
              <motion.article key={pack.tier} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} className="flex flex-col rounded-2xl border bg-card p-6 shadow-xl" style={{ borderColor: pack.color, boxShadow: `0 0 28px ${pack.color}22` }}>
                <div className="text-center">
                  <div className="text-6xl" aria-hidden="true">{pack.icon}</div>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{pack.name}</h2>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{pack.tier}</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-background p-3"><span className="block text-muted-foreground">Price</span><span className="mt-1 block font-bold text-foreground">${pack.usdPrice}</span></div>
                  <div className="rounded-xl bg-background p-3"><span className="block text-muted-foreground">USGC</span><span className="mt-1 block font-bold text-accent">🪙 {pack.usgcAmount.toLocaleString()}{pack.bonusCoins > 0 ? ` +${pack.bonusCoins.toLocaleString()}` : ''}</span></div>
                  <div className="rounded-xl bg-background p-3"><span className="block text-muted-foreground">Cards</span><span className="mt-1 block font-bold text-foreground">{pack.cardsAwarded} card{pack.cardsAwarded !== 1 ? 's' : ''}{pack.rareCards > 0 ? ` · ${pack.rareCards} rare` : ''}{pack.legendaryCards > 0 ? ` · ${pack.legendaryCards} legendary` : ''}</span></div>
                  <div className="rounded-xl bg-background p-3"><span className="block text-muted-foreground">XP</span><span className="mt-1 block font-bold text-purple-400">{pack.xpAwarded > 0 ? `✨ ${pack.xpAwarded.toLocaleString()}` : '—'}</span></div>
                </div>

                <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">{pack.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3"><span className="rounded-full border border-border/20 px-3 py-1 text-xs text-muted-foreground">Level {pack.levelRequired} required</span><Coins className="size-4 text-accent" aria-hidden="true" /></div>
                <Button disabled={locked || !walletAddress || opening} onClick={() => openPack(pack)} className="mt-5 bg-primary font-bold text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground">{opening ? 'Opening...' : locked ? `Requires Level ${pack.levelRequired}` : 'Open Pack'}</Button>
              </motion.article>
            );
          })}
        </section>
      </main>

      <Dialog open={rewardData !== null} onOpenChange={(open) => !open && setRewardData(null)}>
        <DialogContent className="max-w-3xl border-primary/30 bg-card text-card-foreground">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl text-foreground">{rpg_value_packs.modal.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">Your new cards have been revealed.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {rewardData?.rewards.slice(0, visibleRewards).map((reward) => (
              <motion.div key={reward.id} initial={{ opacity: 0, rotateY: 90, scale: 0.85 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ duration: 0.38 }} className={`min-h-36 rounded-xl border p-4 ${rarityClass[asRarity(reward.rarity)]}`} style={{ transformStyle: 'preserve-3d' }}>
                <div className="text-3xl" aria-hidden="true">{typeIcon(reward.type, reward.icon)}</div>
                <h3 className="mt-3 font-bold text-foreground">{reward.name}</h3>
                <span className="mt-2 inline-flex rounded-full border border-current px-2 py-0.5 text-xs font-semibold">{reward.rarity}</span>
              </motion.div>
            ))}
          </div>
          {rewardData && <div className="flex flex-col items-center gap-4 border-t border-border/20 pt-5 sm:flex-row sm:justify-between"><p className="font-semibold text-accent">✨ {rewardData.xp.toLocaleString()} {rpg_value_packs.modal.xpLabel}</p><Button onClick={() => setRewardData(null)} className="bg-primary text-primary-foreground hover:bg-primary/90">Claim Rewards</Button></div>}
        </DialogContent>
      </Dialog>
    </>
  );
}
