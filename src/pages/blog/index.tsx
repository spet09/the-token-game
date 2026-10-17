import { lazy, Suspense } from 'react';
import { Link } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';

// Blog posts are loaded from markdown files via the blog data
const posts = [{
  slug: 'best-web3-game-solana',
  title: "The Best Web3 Game You Haven't Played Yet (And Why It's on Solana)",
  excerpt: "Most meme coin projects are one-trick ponies. The Token Game is something else entirely — a full seasonal ecosystem with 212+ coins, crafting, staking, quests, and a War Room. Here's why it's the most interesting thing happening on Solana right now.",
  publishedAt: '2026-08-11',
  tags: ['Solana', 'Web3 Gaming', 'Meme Coins', 'DeFi'],
  featuredImage: '/airo-assets/images/blog/best-web3-game-solana'
}, {
  slug: 'token-game-how-it-works',
  title: '212 Seasonal Meme Coins, 16 Global Editions: How The Token Game Works',
  excerpt: "Crafting, staking, quests, and a War Room — The Token Game is a full Web3 ecosystem built on Solana. Here's a deep dive into how it all fits together.",
  publishedAt: '2026-08-18',
  tags: ['How It Works', 'Crafting', 'Staking', 'Solana'],
  featuredImage: '/airo-assets/images/blog/token-game-how-it-works'
}];
export default function BlogIndex() {
  return <>
      <Helmet>
        <title>Blog — The Token Game</title>
        <meta name="description" content="Guides, deep dives, and strategy for The Token Game — the seasonal meme coin ecosystem on Solana." />
        <link rel="canonical" href="https://thetokengame.xyz/blog" />
      </Helmet>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-foreground mb-3">The Token Game Blog</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Guides, deep dives, and strategy for the seasonal meme coin ecosystem on Solana.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => <Link key={post.slug} to={`/blog/${post.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
              <div className="aspect-video overflow-hidden bg-muted">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width={600} height={338} />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {tag}
                    </span>)}
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
                </div>
              </div>
            </Link>)}
        </div>
      </main>
    </>;
}
