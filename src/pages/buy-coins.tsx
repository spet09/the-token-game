import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Coins, Zap, Star, Trophy, Crown, Sparkles, ShoppingCart, ChevronRight, Globe, ArrowRight, Wallet, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from '@/contexts/use-cart';
import { startTrackedCheckout } from '@/lib/analytics/checkout';
import { useWallet } from '@/lib/wallet';
import BuyWithUSGC from '@/components/BuyWithUSGC';

interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string | null;
  images: string[];
  amount: number;
  currency: string;
  recurring: { interval: string; intervalCount: number } | null;
  // bundle-specific
  coins: number;
  bonusCoins: number;
  tier: 'starter' | 'explorer' | 'collector' | 'champion' | 'legend';
  highlight?: boolean;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod_UxInOAfhJDSO6f',
    priceId: 'price_1TxOm2DrRYQXHqfPmBpb8rs9',
    name: 'Starter Bundle',
    description: '500 coins — perfect for new players joining the Tienko ecosystem',
    images: [],
    amount: 499,
    currency: 'usd',
    recurring: null,
    coins: 500,
    bonusCoins: 0,
    tier: 'starter',
  },
  {
    id: 'prod_UxInaHiIvqn4so',
    priceId: 'price_1TxOm3DrRYQXHqfPhWVXhz18',
    name: 'Explorer Bundle',
    description: '1,200 coins + 200 bonus — unlock more editions and seasonal coins',
    images: [],
    amount: 999,
    currency: 'usd',
    recurring: null,
    coins: 1200,
    bonusCoins: 200,
    tier: 'explorer',
  },
  {
    id: 'prod_UxInXxre4MvX73',
    priceId: 'price_1TxOm3DrRYQXHqfPjZpcPfPu',
    name: 'Collector Bundle',
    description: '3,000 coins + 600 bonus — serious collectors and edition hunters',
    images: [],
    amount: 2000,
    currency: 'usd',
    recurring: null,
    coins: 3000,
    bonusCoins: 600,
    tier: 'collector',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'prod_UxIn1WdsrebUyz',
    priceId: 'price_1TxOm4DrRYQXHqfPY7OZna3i',
    name: 'Champion Bundle',
    description: '8,000 coins + 2,000 bonus — dominate the leaderboard across all platforms',
    images: [],
    amount: 5000,
    currency: 'usd',
    recurring: null,
    coins: 8000,
    bonusCoins: 2000,
    tier: 'champion',
    badge: 'Best Value',
  },
  {
    id: 'prod_UxIn0QsBmpaGlX',
    priceId: 'price_1TxOm5DrRYQXHqfPqtbfDb32',
    name: 'Legend Bundle',
    description: '20,000 coins + 6,000 bonus — the ultimate Tienko power pack',
    images: [],
    amount: 10000,
    currency: 'usd',
    recurring: null,
    coins: 20000,
    bonusCoins: 6000,
    tier: 'legend',
    badge: 'Ultimate',
  },
];

// ─── Tienko / USGC payment config ─────────────────────────────────────────────
// The Token Game treasury wallet — receives USGC payments
const GAME_TREASURY_ADDRESS = '7YXN23499vfFR9bEtWzPBiFi74LcsoVRvYt2Gg3YMMi5';

// USGC price per bundle (1 USGC ≈ $1 USD equivalent)
const USGC_PRICES: Record<string, number> = {
  starter:   5,
  explorer:  10,
  collector: 20,
  champion:  50,
  legend:    100,
};

const TIER_CONFIG = {
  starter: {
    icon: Coins,
    gradient: 'from-slate-700 to-slate-600',
    glow: 'shadow-slate-500/20',
    accent: '#94a3b8',
    ring: 'ring-slate-500/30',
  },
  explorer: {
    icon: Zap,
    gradient: 'from-blue-900 to-blue-700',
    glow: 'shadow-blue-500/30',
    accent: '#60a5fa',
    ring: 'ring-blue-500/30',
  },
  collector: {
    icon: Star,
    gradient: 'from-violet-900 to-purple-700',
    glow: 'shadow-purple-500/40',
    accent: '#a78bfa',
    ring: 'ring-purple-500/40',
  },
  champion: {
    icon: Trophy,
    gradient: 'from-amber-900 to-yellow-700',
    glow: 'shadow-yellow-500/40',
    accent: '#fbbf24',
    ring: 'ring-yellow-500/40',
  },
  legend: {
    icon: Crown,
    gradient: 'from-rose-900 to-pink-700',
    glow: 'shadow-pink-500/40',
    accent: '#f472b6',
    ring: 'ring-pink-500/40',
  },
};

const PLATFORMS = [
  { name: 'thetokengame.com', desc: 'Main game hub' },
  { name: 'tienko.io', desc: 'Core platform' },
  { name: 'tienko.exchange', desc: 'Trading platform' },
  { name: 'tienko.market', desc: 'Marketplace' },
];

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function BuyCoinsPage() {
  const { addToCart } = useCart();
  const { connected, publicKey, openModal } = useWallet();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Wallet is OPTIONAL for purchase — coins credit to email account
  const walletAddress = publicKey ?? undefined;

  async function handleBuyNow(product: Product) {
    // No wallet check — Stripe email is the account key
    setLoadingId(product.id);
    try {
      await startTrackedCheckout('products_buy_now', [
        {
          productId: product.id,
          priceId: product.priceId,
          name: product.name,
          amount: product.amount,
          currency: product.currency,
          quantity: 1,
        },
      ], walletAddress);
    } finally {
      setLoadingId(null);
    }
  }

  function handleAddToCart(product: Product) {
    // No wallet check — wallet is optional
    addToCart({
      id: product.id,
      priceId: product.priceId,
      name: product.name,
      image: product.images[0],
      price: product.amount,
      currency: product.currency,
    });
  }

  return (
    <>
      <Helmet>
        <title>Buy Coins — The Token Game | Starter to Legend Bundles</title>
        <meta name="description" content="Power up your web3 gaming journey. Buy Tienko coin bundles from $4.99 — no wallet required. Use coins across the entire Tienko ecosystem." />
        <link rel="canonical" href="https://thetokengame.xyz/buy-coins" />
        <meta property="og:title" content="Buy Coins — The Token Game" />
        <meta property="og:description" content="Power up your web3 gaming journey. Coin bundles from $4.99 — no wallet required." />
        <meta property="og:url" content="https://thetokengame.xyz/buy-coins" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Buy Coins — The Token Game" />
        <meta name="twitter:description" content="Power up your web3 gaming journey. Coin bundles from $4.99 — no wallet required." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Buy Coins — The Token Game',
          description: 'Power up your web3 gaming journey. Buy Tienko coin bundles from $4.99 — no wallet required.',
          url: 'https://thetokengame.xyz/buy-coins',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0f]">

        {/* Info Banner — wallet optional */}
        <div className="bg-purple-950/60 border-b border-purple-500/20 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
            <Info className="w-4 h-4 text-purple-400 shrink-0" />
            <p className="text-purple-200 text-sm">
              <span className="text-purple-300 font-semibold">No wallet needed to buy.</span>
              {' '}Coins are credited to your account email immediately after purchase.
              {connected
                ? <span className="text-green-400 ml-1">✓ Wallet connected — coins will also link to your wallet.</span>
                : <span className="text-purple-400 ml-1">Connect your wallet later to withdraw coins on-chain.</span>
              }
            </p>
            {!connected && (
              <Button size="sm" variant="outline" onClick={openModal}
                className="border-purple-500/40 text-purple-300 hover:bg-purple-900/40 shrink-0 gap-1.5 text-xs">
                <Wallet className="w-3.5 h-3.5" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Works across all Tienko platforms</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Buy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Coins</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                Power up your journey through the Tienko ecosystem. Coins work across every platform — collect, trade, and climb the leaderboard.
              </p>

              {/* Platform badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                    <Globe className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-gray-300">{p.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bundle Grid */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => {
              const config = TIER_CONFIG[product.tier];
              const Icon = config.icon;
              const totalCoins = product.coins + product.bonusCoins;
              const isLoading = loadingId === product.id;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`relative rounded-2xl border bg-[#0f0f1a] flex flex-col overflow-hidden
                    ${product.highlight
                      ? 'border-purple-500/60 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/30'
                      : `border-white/10 ${config.ring}`
                    }`}
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge
                        className={`text-xs font-bold px-2 py-0.5
                          ${product.tier === 'collector' ? 'bg-purple-500 text-white' : ''}
                          ${product.tier === 'champion' ? 'bg-yellow-500 text-black' : ''}
                          ${product.tier === 'legend' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : ''}
                        `}
                      >
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Card header gradient */}
                  <div className={`bg-gradient-to-br ${config.gradient} p-6 flex items-center gap-4`}>
                    <div className="w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7" style={{ color: config.accent }} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{product.name}</h3>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold text-white">
                          {formatPrice(product.amount, product.currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coin count */}
                  <div className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-extrabold text-white">
                          {totalCoins.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">total coins</div>
                      </div>
                      {product.bonusCoins > 0 && (
                        <div className="text-right">
                          <div className="text-sm font-semibold" style={{ color: config.accent }}>
                            +{product.bonusCoins.toLocaleString()} bonus
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((product.bonusCoins / product.coins) * 100)}% extra free
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-6 py-4 flex-1">
                    <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>

                    {/* Platform compatibility */}
                    <div className="mt-4 space-y-1.5">
                      {PLATFORMS.map((p) => (
                        <div key={p.name} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          <span>{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 space-y-2">
                    <Button
                      className="w-full font-bold"
                      style={{
                        background: product.highlight
                          ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                          : `linear-gradient(135deg, ${config.accent}33, ${config.accent}55)`,
                        color: product.highlight ? 'white' : config.accent,
                        border: `1px solid ${config.accent}44`,
                      }}
                      disabled={isLoading}
                      onClick={() => handleBuyNow(product)}
                    >
                      {isLoading ? 'Processing...' : `Buy Now — ${formatPrice(product.amount, product.currency)}`}
                    </Button>

                    {/* Buy with USGC — Tienko Wallet */}
                    <BuyWithUSGC
                      treasuryAddress={GAME_TREASURY_ADDRESS}
                      priceUSGC={USGC_PRICES[product.tier] ?? product.amount / 100}
                      itemName={product.name}
                      className="w-full"
                      onSuccess={(sig) => {
                        console.log(`[Tienko] ${product.name} purchased — tx: ${sig}`);
                      }}
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-gray-500 hover:text-gray-300 text-xs"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Crypto payment note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Prefer to pay with crypto?</h3>
              <p className="text-sm text-gray-400">
                You can also purchase coins directly on Solana using the Jupiter swap for the TIENKO token (TEN). Swap SOL or any SPL token for TEN and use it across all Tienko platforms.
              </p>
            </div>
            <a
              href="https://jup.ag/swap/SOL-6mKmxj4MMozaM54Jeruawduy2rTT8YaNoAhr1aMSFray"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Button variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 whitespace-nowrap">
                Buy TEN on Jupiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🔒', title: 'Secure Checkout', desc: 'Powered by Stripe — PCI-compliant, encrypted payments' },
              { icon: '⚡', title: 'Instant Credit', desc: 'Coins credited to your wallet immediately after payment' },
              { icon: '🌐', title: 'Cross-Platform', desc: 'Use your coins on all 4 Tienko ecosystem platforms' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-xl p-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="bg-[#0f0f1a] border-white/10 text-white max-w-md">
            {selectedProduct && (() => {
              const config = TIER_CONFIG[selectedProduct.tier];
              const Icon = config.icon;
              const totalCoins = selectedProduct.coins + selectedProduct.bonusCoins;
              const isLoading = loadingId === selectedProduct.id;
              return (
                <>
                  <DialogHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {selectedProduct.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Base coins</span>
                        <span className="text-white font-semibold">{selectedProduct.coins.toLocaleString()}</span>
                      </div>
                      {selectedProduct.bonusCoins > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Bonus coins</span>
                          <span className="font-semibold" style={{ color: config.accent }}>+{selectedProduct.bonusCoins.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-gray-300 font-medium">Total coins</span>
                        <span className="text-white font-bold text-lg">{totalCoins.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price</span>
                        <span className="text-white font-bold">{formatPrice(selectedProduct.amount, selectedProduct.currency)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Works on</div>
                      <div className="grid grid-cols-2 gap-2">
                        {PLATFORMS.map((p) => (
                          <div key={p.name} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-300">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 font-bold"
                        style={{ background: `linear-gradient(135deg, ${config.accent}66, ${config.accent}99)`, color: 'white' }}
                        disabled={isLoading}
                        onClick={() => handleBuyNow(selectedProduct)}
                      >
                        {isLoading ? 'Processing...' : `Buy Now — ${formatPrice(selectedProduct.amount, selectedProduct.currency)}`}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10"
                        onClick={() => {
                          handleAddToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
