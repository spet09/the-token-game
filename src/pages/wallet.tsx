import { wallet } from 'virtual:content';
import { useState } from 'react';
import { Link } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Coins, CreditCard, History, LoaderCircle, Wallet, ArrowDownToLine, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useCoinBalance, type CoinPurchase, type CoinSpend } from '@/hooks/useCoinBalance';
import { useWallet } from '@/lib/wallet';
interface ShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  icon: string;
  category: string;
}
const CATEGORY_STYLES: Record<CoinSpend['category'], string> = {
  upgrade: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  cosmetic: 'bg-primary/15 text-primary border-primary/30',
  event: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
  rpg: 'bg-pink-500/15 text-pink-300 border-pink-400/30',
  other: 'bg-muted text-muted-foreground border-border/30'
};
function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}
function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value / 100);
}
function PurchaseStatus({
  status
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    delivered: 'bg-accent/15 text-accent border-accent/30',
    pending: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
    failed: 'bg-destructive/15 text-destructive border-destructive/30'
  };
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${styles[status] ?? 'bg-muted text-muted-foreground'}`}>{status}</span>;
}
function PurchasesList({
  purchases
}: {
  purchases: CoinPurchase[];
}) {
  if (!purchases.length) return <p className="rounded-xl border border-border/20 bg-card p-6 text-center text-muted-foreground">No purchases yet. Buy your first coin pack!</p>;
  return <div className="overflow-hidden rounded-xl border border-border/20 bg-card">{purchases.map(purchase => <div key={purchase.id} className="grid gap-3 border-b border-border/15 p-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"><div><p className="font-semibold text-foreground">{purchase.bundleName}</p><p className="text-sm text-accent">+{purchase.coinsAwarded.toLocaleString()} coins</p></div><p className="font-medium text-foreground">{formatMoney(purchase.amountPaid)}</p><PurchaseStatus status={purchase.status} /><time dateTime={purchase.createdAt} className="text-sm text-muted-foreground">{formatDate(purchase.createdAt)}</time></div>)}</div>;
}
function SpendsList({
  spends
}: {
  spends: CoinSpend[];
}) {
  if (!spends.length) return <p className="rounded-xl border border-border/20 bg-card p-6 text-center text-muted-foreground">No spending yet. Use your coins in the shop above!</p>;
  return <div className="overflow-hidden rounded-xl border border-border/20 bg-card">{spends.map(spend => <div key={spend.id} className="grid gap-3 border-b border-border/15 p-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"><div><p className="font-semibold text-foreground">{spend.itemName}</p><p className="text-sm text-orange-300">-{spend.coinsSpent.toLocaleString()} coins</p></div><span className={`w-fit rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${CATEGORY_STYLES[spend.category as CoinSpend['category']] ?? CATEGORY_STYLES.other}`}>{spend.category}</span><span className="w-fit rounded-full border border-border/20 bg-muted px-2 py-0.5 text-xs text-muted-foreground">{spend.platform}</span><time dateTime={spend.createdAt} className="text-sm text-muted-foreground">{formatDate(spend.createdAt)}</time></div>)}</div>;
}
export default function WalletPage() {
  const {
    publicKey,
    openModal,
    connected
  } = useWallet();
  const [emailLookup, setEmailLookup] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const {
    coins,
    totalSpentUsd,
    purchases,
    spends,
    loading,
    refresh,
    hasLinkedWallet,
    accountKey
  } = useCoinBalance(emailLookup || undefined);
  const {
    toast
  } = useToast();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawCoins, setWithdrawCoins] = useState('');

  // Show balance if wallet connected OR email lookup active
  const hasAccount = !!(publicKey || emailLookup);
  async function buyItem(item: ShopItem) {
    const key = publicKey ?? emailLookup;
    if (!key) return;
    setBuyingId(item.id);
    try {
      const response = await fetch('/api/wallet/spend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: key,
          amount: item.cost,
          itemId: item.id,
          itemName: item.name,
          category: item.category
        })
      });
      if (response.status === 402) {
        toast({
          title: 'Not enough coins',
          description: 'Buy more coins to complete this purchase.'
        });
        return;
      }
      if (!response.ok) throw new Error('Purchase failed');
      toast({
        title: `Purchased ${item.name}!`,
        description: 'Your purchase is ready to use.'
      });
      await refresh();
    } catch {
      toast({
        title: 'Purchase failed',
        description: 'Please try again in a moment.'
      });
    } finally {
      setBuyingId(null);
    }
  }
  async function handleWithdraw() {
    if (!accountKey || !publicKey) return;
    const amount = parseInt(withdrawCoins, 10);
    if (!amount || amount <= 0 || amount > coins) {
      toast({
        title: 'Invalid amount',
        description: `Enter a number between 1 and ${coins}.`
      });
      return;
    }
    setWithdrawing(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountKey,
          toWallet: publicKey,
          coins: amount
        })
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        newBalance?: number;
      };
      if (!res.ok || !data.success) {
        toast({
          title: 'Withdrawal failed',
          description: data.error ?? 'Please try again.'
        });
        return;
      }
      toast({
        title: `✅ ${amount.toLocaleString()} coins withdrawn!`,
        description: `Linked to wallet ${publicKey.slice(0, 8)}…`
      });
      setWithdrawCoins('');
      await refresh();
    } catch {
      toast({
        title: 'Withdrawal failed',
        description: 'Please try again in a moment.'
      });
    } finally {
      setWithdrawing(false);
    }
  }
  return <>
      <Helmet>
        <title>Coin Wallet — The Token Game</title>
        <meta name="description" content="Track your Tienko coin balance, purchases, and spending across The Token Game ecosystem." />
        <link rel="canonical" href="https://thetokengame.xyz/wallet" />
        <meta property="og:title" content="Coin Wallet — The Token Game" /><meta property="og:description" content="Track your Tienko coin balance, purchases, and spending history. Link your Solana wallet to withdraw coins." /><meta property="og:type" content="website" /><meta property="og:url" content="https://thetokengame.xyz/wallet" /><meta property="og:image" content="https://thetokengame.xyz/og-image.png" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="Coin Wallet — The Token Game" /><meta name="twitter:description" content="Track your Tienko coin balance, purchases, and spending history." /><meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Coin Wallet — The Token Game',
          description: 'Track your Tienko coin balance, purchases, and spending history.',
          url: 'https://thetokengame.xyz/wallet',
          isPartOf: {
            '@id': 'https://thetokengame.xyz/#website'
          },
          about: {
            '@id': 'https://thetokengame.xyz/#organization'
          }
        })}</script>
      </Helmet>
      <main className="min-h-screen bg-background pb-20 text-foreground">
        {/* Header */}
        <section className="border-b border-border/15 bg-card px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link><span className="mx-2">›</span><span aria-current="page">Wallet</span>
            </nav>
            <motion.div initial={{
            opacity: 0,
            y: 16
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.35
          }}>
              <p className="mb-3 text-sm font-medium text-primary">Tienko wallet</p>
              <h1 className="text-4xl font-bold sm:text-6xl">Your Coin Wallet</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Track your balance, purchases, and spending. No wallet required — coins are tied to your purchase email.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Account lookup — no wallet required */}
        {!hasAccount && <section className="mx-auto max-w-6xl px-4 py-16">
            <div className="mx-auto max-w-xl rounded-2xl border border-primary/30 bg-card p-8 shadow-xl shadow-primary/10">
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Coins aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-center">View your balance</h2>
              <p className="mt-3 text-muted-foreground text-center text-sm">
                Enter the email you used at checkout, or connect your Solana wallet.
              </p>

              {/* Email lookup */}
              <div className="mt-6 space-y-3">
                <label className="text-sm font-medium text-foreground" htmlFor="email-lookup">
                  Look up by email
                </label>
                <div className="flex gap-2">
                  <Input id="email-lookup" type="email" placeholder="you@example.com" value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') setEmailLookup(emailInput.trim().toLowerCase());
              }} className="flex-1" />
                  <Button onClick={() => setEmailLookup(emailInput.trim().toLowerCase())} disabled={!emailInput.trim()}>
                    <Mail className="w-4 h-4 mr-1" /> Look up
                  </Button>
                </div>
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/30" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border/30" />
              </div>

              <Button className="w-full" onClick={openModal}>
                <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
              </Button>
            </div>
          </section>}

        {/* Balance dashboard */}
        {hasAccount && <section className="mx-auto max-w-6xl px-4 py-10">
            {loading ? <div className="flex justify-center py-16 text-primary"><LoaderCircle className="size-8 animate-spin" /></div> : <>
                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <article className="rounded-2xl border border-primary/40 bg-card p-6 shadow-lg shadow-primary/15">
                    <Coins className="mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Coin Balance</p>
                    <p className="mt-2 text-4xl font-bold text-primary">🪙 {coins.toLocaleString()}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Your spendable coins</p>
                    <Link to="/buy-coins" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Buy More Coins →</Link>
                  </article>
                  <article className="rounded-2xl border border-border/20 bg-card p-6">
                    <CreditCard className="mb-4 text-accent" />
                    <p className="text-sm text-muted-foreground">Total Spent (USD)</p>
                    <p className="mt-2 text-4xl font-bold text-accent">${totalSpentUsd}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Across all purchases</p>
                  </article>
                  <article className="rounded-2xl border border-border/20 bg-card p-6">
                    <History className="mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="mt-2 text-4xl font-bold">{purchases.length + spends.length}</p>
                    <p className="mt-2 text-sm text-muted-foreground">All time activity</p>
                  </article>
                </div>

                {/* Withdraw to wallet section */}
                <section className="mt-10 rounded-2xl border border-border/20 bg-card p-6" aria-labelledby="withdraw-heading">
                  <h2 id="withdraw-heading" className="text-xl font-bold flex items-center gap-2">
                    <ArrowDownToLine className="w-5 h-5 text-primary" />
                    Withdraw to Wallet
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Move coins from your account balance to your connected Solana wallet for on-chain use.
                    {' '}<span className="text-primary font-medium">Wallet connection required for withdrawal only.</span>
                  </p>

                  {!connected ? <div className="mt-4 flex items-center gap-4 flex-wrap">
                      <p className="text-sm text-muted-foreground">Connect your wallet to enable withdrawals.</p>
                      <Button size="sm" onClick={openModal} className="gap-2">
                        <Wallet className="w-4 h-4" /> Connect Wallet
                      </Button>
                    </div> : hasLinkedWallet ? <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Wallet already linked. Coins are synced to your connected wallet.
                    </div> : <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <Input type="number" min={1} max={coins} placeholder={`Amount (max ${coins.toLocaleString()})`} value={withdrawCoins} onChange={e => setWithdrawCoins(e.target.value)} className="w-48" />
                      <Button onClick={handleWithdraw} disabled={withdrawing || !withdrawCoins || parseInt(withdrawCoins) <= 0 || parseInt(withdrawCoins) > coins} className="gap-2">
                        {withdrawing ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                        Withdraw Coins
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        To: {publicKey?.slice(0, 8)}…{publicKey?.slice(-4)}
                      </p>
                    </div>}
                </section>

                {/* Shop */}
                <section className="mt-14" aria-labelledby="shop-heading">
                  <h2 id="shop-heading" className="text-3xl font-bold">Shop with coins</h2>
                  <p className="mt-2 text-muted-foreground">Spend your balance on upgrades, cosmetics, events, and RPG power.</p>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wallet.SHOP_ITEMS.map(item => <article key={item.id} className="flex flex-col rounded-2xl border border-border/20 bg-card p-5">
                        <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                        <h3 className="mt-4 text-xl font-bold">{item.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">🪙 {item.cost.toLocaleString()}</span>
                          <Button size="sm" disabled={buyingId === item.id} onClick={() => buyItem(item)}>
                            {buyingId === item.id ? <LoaderCircle className="animate-spin" /> : 'Buy'}
                          </Button>
                        </div>
                      </article>)}
                  </div>
                </section>

                {/* Transaction history */}
                <section className="mt-14" aria-labelledby="history-heading">
                  <h2 id="history-heading" className="text-3xl font-bold">Transaction history</h2>
                  <Tabs defaultValue="purchases" className="mt-6">
                    <TabsList><TabsTrigger value="purchases">Purchases</TabsTrigger><TabsTrigger value="spends">Spends</TabsTrigger></TabsList>
                    <TabsContent value="purchases"><PurchasesList purchases={purchases} /></TabsContent>
                    <TabsContent value="spends"><SpendsList spends={spends} /></TabsContent>
                  </Tabs>
                </section>

                {/* Ecosystem */}
                <section className="mt-14 rounded-2xl border border-primary/30 bg-card p-6">
                  <h2 className="text-xl font-bold">Your coins work across the entire Tienko ecosystem</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">thetokengame.xyz</span>
                    {['tienko.io', 'tienko.exchange', 'tienko.market', 'tienko.world'].map(platform => <span key={platform} className="rounded-full border border-border/20 bg-muted px-3 py-1.5 text-sm text-muted-foreground">{platform} · Coming Soon</span>)}
                  </div>
                </section>
              </>}
          </section>}
      </main>
    </>;
}
