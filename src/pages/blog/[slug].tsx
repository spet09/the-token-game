import { useParams, Link } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
const posts: Record<string, {
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  featuredImage: string;
  content: string;
}> = {
  'best-web3-game-solana': {
    title: "The Best Web3 Game You Haven't Played Yet (And Why It's on Solana)",
    excerpt: "Most meme coin projects are one-trick ponies. The Token Game is something else entirely — a full seasonal ecosystem with 212+ coins, crafting, staking, quests, and a War Room.",
    publishedAt: '2026-08-11',
    tags: ['Solana', 'Web3 Gaming', 'Meme Coins', 'DeFi'],
    featuredImage: '/airo-assets/images/blog/best-web3-game-solana',
    content: `
Most meme coin projects follow the same playbook: launch, hype, dump, disappear. The Token Game is built on a completely different premise — what if a meme coin ecosystem had actual depth?

## What Makes It Different

The Token Game isn't a single token. It's a **seasonal ecosystem of 212+ collectible meme coins** spread across 16 global editions — Africa, Antarctica, the Arctic, Australia, Central America, China, Europe, India, Japan, the Middle East, North America, Oceania, Russia, South America, the UK, and the USA.

Each coin is tied to a real-world cultural moment, season, or event. Miss the window, miss the coin. That scarcity is real — not manufactured.

## Built on Solana for a Reason

Solana's speed and low fees make micro-transactions and frequent trading actually viable. The Token Game takes full advantage: you can craft, trade, and stake without gas fees eating your gains.

The ecosystem runs on a **4-tier coin hierarchy**:

- **TKN** (Tier 1) — the base currency, earned through gameplay
- **GOLD** (Tier 2) — crafted from 100 TKN
- **OASIS** (Tier 3) — crafted from 1,000 GOLD
- **USGC** (Tier 4) — crafted from 10 OASIS, earns 18.5% APY in the staking pool

That crafting ladder gives every player a clear progression path. You're not just holding — you're building.

## The Seasonal Calendar Is the Core Loop

Ten seasons. 130+ coin release windows. The calendar is the heartbeat of the game. Coins are only available during their designated windows, which means the community is always chasing the next drop, the next craft, the next season.

This creates genuine urgency without artificial scarcity mechanics. The coins are scarce because time is scarce.

## Quests, War Room, and Leaderboards

Beyond collecting and crafting, The Token Game has:

- **30 quests** across 6 categories and 4 tiers — complete them to earn XP and level up
- **The War Room** — 19 nation pages where players compete for dominance
- **Leaderboards** — global rankings, coin leaderboards, and a Hall of Legends for top performers
- **1,582 backstories** — every coin has lore, searchable in a dedicated interface

This is the layer that turns a coin collection into a game.

## Why Now?

The Token Game is live and the seasonal calendar is running. New coins are dropping, quests are active, and the War Room is heating up. The players who connect early get first access to seasonal coins before their windows close.

Ready to see what the game is actually about? [Connect your wallet and start playing](/lp/join-the-game).
    `.trim()
  },
  'token-game-how-it-works': {
    title: '212 Seasonal Meme Coins, 16 Global Editions: How The Token Game Works',
    excerpt: "Crafting, staking, quests, and a War Room — The Token Game is a full Web3 ecosystem built on Solana. Here's a deep dive into how it all fits together.",
    publishedAt: '2026-08-18',
    tags: ['How It Works', 'Crafting', 'Staking', 'Solana'],
    featuredImage: '/airo-assets/images/blog/token-game-how-it-works',
    content: `
If you've heard about The Token Game but aren't sure how it actually works, this is the guide for you. Let's break down every system — from the coin economy to the War Room — so you know exactly what you're getting into.

## The 8-Coin Economy

The Token Game runs on eight distinct coins, each with a specific role:

**Tradeable tier coins (craftable):**
- **TKN** — Tier 1 base currency. Earned through gameplay and quests.
- **GOLD** — Tier 2. Crafted from 100 TKN.
- **OASIS** — Tier 3. Crafted from 1,000 GOLD.
- **USGC** — Tier 4. Crafted from 10 OASIS. Earns 18.5% APY in the staking pool.

**Special coins (non-craftable):**
- **XP Coin** — Non-tradeable. Earned through quests and milestones.
- **ARTFCT** — Rare artifact token.
- **NTN** — Nation token, tied to War Room performance.
- **CUR8** — Curator token.

The crafting ladder is the core economic engine. Every TKN you earn is a step toward USGC — and USGC is where the real staking yields live.

## The Seasonal Calendar

Ten seasons. 130+ coin release windows. Each of the 212+ seasonal coins is only available during its designated window. Once the window closes, that coin is gone from the primary market.

This isn't artificial scarcity — it's time-based scarcity. The calendar is public, so you can plan ahead. But you have to show up.

## Crafting: Forward and Reverse

The crafting system has two modes:

- **Forward crafting** — combine lower-tier coins into higher-tier ones (TKN → GOLD → OASIS → USGC)
- **Reverse crafting** — break higher-tier coins back down if you need liquidity

The crafting page includes calculators for both directions, so you always know exactly what you're getting before you commit.

## Staking Pools

Three staking pools are available:

| Token | APY |
|-------|-----|
| USGC | 18.5% |
| NYC | 24% |
| TIEN | 32% |

Stake your tokens and earn passive rewards. The higher the tier, the higher the yield — but you have to craft your way there first.

## Quests and XP

30 quests across 6 categories and 4 tiers. Complete quests to earn XP, level up your journey profile, and unlock new milestones. The quest system is the primary way to earn XP Coins, which track your progression through the ecosystem.

## The War Room

19 nation pages. Players compete for dominance across Africa, Antarctica, the Arctic, Australia, Central America, China, Europe, India, Japan, the Middle East, North America, Oceania, Russia, South America, the UK, and the USA.

The War Room is where the competitive layer of the game plays out. Nation tokens (NTN) are tied to War Room performance.

## Leaderboards and Hall of Legends

Global player rankings, coin leaderboards, and a Hall of Legends for the top performers in the ecosystem. Your position on the leaderboard is a function of your coins, your crafting activity, and your quest completions.

## Getting Started

All you need is a Solana wallet. Connect it, check the seasonal calendar for active coin windows, and start collecting. The crafting system, staking pools, and quests are all available from day one.

The ecosystem is live and the calendar is running. [Connect your wallet and join the game](/lp/join-the-game) before the current season's windows close.
    `.trim()
  }
};
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="font-bold text-foreground mb-2">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">
          {items.map((item, j) => {
          const parts = item.split(/\*\*(.*?)\*\*/g);
          return <li key={j}>
                {parts.map((p, k) => k % 2 === 1 ? <strong key={k} className="text-foreground">{p}</strong> : p)}
              </li>;
        })}
        </ul>);
      continue;
    } else if (line.startsWith('| ')) {
      // Simple table
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].includes('---')) {
          rows.push(lines[i].split('|').filter(Boolean).map(c => c.trim()));
        }
        i++;
      }
      elements.push(<div key={`table-${i}`} className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                {rows[0]?.map((cell, j) => <th key={j} className="text-left py-2 px-3 font-semibold text-foreground">{cell}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, j) => <tr key={j} className="border-b border-border/50">
                  {row.map((cell, k) => <td key={k} className="py-2 px-3 text-muted-foreground">{cell}</td>)}
                </tr>)}
            </tbody>
          </table>
        </div>);
      continue;
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      // Regular paragraph — handle inline bold and links
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>;
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return <Link key={j} to={linkMatch[2]} className="text-primary hover:underline">{linkMatch[1]}</Link>;
        }
        return part;
      });
      elements.push(<p key={i} className="text-muted-foreground leading-relaxed mb-4">{rendered}</p>);
    }
    i++;
  }
  return elements;
}
export default function BlogPost() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const post = slug ? posts[slug] : null;
  if (!post) {
    return <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
      </main>;
  }
  const site = 'https://thetokengame.xyz';
  const url = `${site}/blog/${slug}`;
  return <>
      <Helmet>
        <title>{post.title} — The Token Game</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          url,
          image: `${site}/og-image.png`,
          author: {
            '@type': 'Organization',
            name: 'The Token Game',
            url: site
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Token Game',
            url: site
          }
        })}</script>
      </Helmet>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← Back to blog
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>)}
        </div>
        <h1 className="text-4xl font-extrabold text-foreground mb-4 leading-tight">{post.title}</h1>
        <p className="text-muted-foreground mb-6">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </p>
        <div className="aspect-video rounded-xl overflow-hidden mb-10 bg-muted">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" width={800} height={450} />
        </div>
        <article className="prose-custom">
          {renderMarkdown(post.content)}
        </article>
      </main>
    </>;
}
