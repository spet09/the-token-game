import { Link } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { data } from 'virtual:content';
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
          {data.blogPosts.map((post: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          publishedAt: string;
          tags: string[];
          featuredImage: string;
          published: boolean;
        }) => <Link key={post.id} to={`/blog/${post.slug}`} className={`group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors${post.published ? '' : ' hidden'}`}>
              <div className="aspect-video overflow-hidden bg-muted">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width={600} height={338} />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag: string) => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
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
