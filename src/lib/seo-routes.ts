/**
 * Auto-synced registry of publicly-crawlable routes. Consumed by the
 * /sitemap.xml handler in src/server/entry.ts.
 *
 * DO NOT add or remove paths by hand. Static paths are mirrored here from
 * src/routes.tsx automatically whenever that file is edited (any manual
 * path edit would be overwritten on the next routes.tsx change). For sync
 * to pick up a route, its `path` must be a literal string starting with "/";
 * template literals and identifier refs are skipped, and dynamic-param routes
 * like "/products/:id" are excluded.
 *
 * The only fields safe to hand-edit are the per-entry metadata below, after a
 * sync:
 * - `priority` (0.0–1.0): Home = 1.0, main sections = 0.8, deep pages = 0.5.
 * - `changefreq` and `lastmod`.
 */

export interface SeoRoute {
  path: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  lastmod?: string;
}

export const seoRoutes: SeoRoute[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/bingo", changefreq: "monthly", priority: 0.8 },
  { path: "/bingo/auction", changefreq: "monthly", priority: 0.5 },
  { path: "/bingo/dashboard", changefreq: "monthly", priority: 0.5 },
  { path: "/coins", changefreq: "monthly", priority: 0.8 },
  { path: "/coin-directory", changefreq: "monthly", priority: 0.8 },
  { path: "/how-to-play", changefreq: "monthly", priority: 0.8 },
  { path: "/roadmap", changefreq: "monthly", priority: 0.8 },
  { path: "/tokenomics", changefreq: "monthly", priority: 0.8 },
  { path: "/leaderboard", changefreq: "monthly", priority: 0.8 },
  { path: "/global", changefreq: "monthly", priority: 0.8 },
  { path: "/australia", changefreq: "monthly", priority: 0.8 },
  { path: "/china", changefreq: "monthly", priority: 0.8 },
  { path: "/usa", changefreq: "monthly", priority: 0.8 },
  { path: "/europe", changefreq: "monthly", priority: 0.8 },
  { path: "/africa", changefreq: "monthly", priority: 0.8 },
  { path: "/russia", changefreq: "monthly", priority: 0.8 },
  { path: "/india", changefreq: "monthly", priority: 0.8 },
  { path: "/japan", changefreq: "monthly", priority: 0.8 },
  { path: "/southamerica", changefreq: "monthly", priority: 0.8 },
  { path: "/war-room", changefreq: "monthly", priority: 0.8 },
  { path: "/war-room/usa", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/uk", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/india", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/japan", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/south-korea", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/brazil", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/turkey", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/australia", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/nigeria", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/russia", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/china", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/europe", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/africa", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/middle-east", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/oceania", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/north-america", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/central-america", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/arctic", changefreq: "monthly", priority: 0.5 },
  { path: "/war-room/antarctica", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/login", changefreq: "monthly", priority: 0.5 },
  { path: "/admin", changefreq: "monthly", priority: 0.8 },
  { path: "/admin/upload-coins", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/global-upload", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/curator", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/whitelist", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/pump-addresses", changefreq: "monthly", priority: 0.5 },
  { path: "/coin-leaderboard", changefreq: "monthly", priority: 0.8 },
  { path: "/whitelist", changefreq: "monthly", priority: 0.8 },
  { path: "/stash", changefreq: "monthly", priority: 0.8 },
  { path: "/middleeast", changefreq: "monthly", priority: 0.8 },
  { path: "/oceania", changefreq: "monthly", priority: 0.8 },
  { path: "/northamerica", changefreq: "monthly", priority: 0.8 },
  { path: "/centralamerica", changefreq: "monthly", priority: 0.8 },
  { path: "/arctic", changefreq: "monthly", priority: 0.8 },
  { path: "/antarctica", changefreq: "monthly", priority: 0.8 },
  { path: "/stash-key", changefreq: "monthly", priority: 0.8 },
  { path: "/curator", changefreq: "monthly", priority: 0.8 },
  { path: "/rwa", changefreq: "monthly", priority: 0.8 },
  { path: "/world-map", changefreq: "monthly", priority: 0.8 },
  { path: "/journey", changefreq: "monthly", priority: 0.8 },
  { path: "/buy-coins", changefreq: "monthly", priority: 0.8 },
  { path: "/rpg/value-packs", changefreq: "monthly", priority: 0.5 },
  { path: "/rpg", changefreq: "monthly", priority: 0.8 },
  { path: "/rpg/profile", changefreq: "monthly", priority: 0.5 },
  { path: "/cart", changefreq: "monthly", priority: 0.8 },
  { path: "/checkout/success", changefreq: "monthly", priority: 0.5 },
  { path: "/checkout/cancel", changefreq: "monthly", priority: 0.5 },
  { path: "/rpg/create-character", changefreq: "monthly", priority: 0.5 },
  { path: "/wallet", changefreq: "monthly", priority: 0.8 },
  { path: "/staking", changefreq: "monthly", priority: 0.8 },
  { path: "/staking/referral", changefreq: "monthly", priority: 0.5 },
  { path: "/invest", changefreq: "monthly", priority: 0.8 },
  { path: "/oasis", changefreq: "monthly", priority: 0.8 },
  { path: "/crafting", changefreq: "monthly", priority: 0.8 },
  { path: "/community", changefreq: "monthly", priority: 0.8 },
  { path: "/quests", changefreq: "monthly", priority: 0.8 },
  { path: "/calendar", changefreq: "monthly", priority: 0.8 },
  { path: "/hall-of-legends", changefreq: "monthly", priority: 0.8 },
  { path: "/season-leaderboard", changefreq: "monthly", priority: 0.8 },
  { path: "/backstories", changefreq: "monthly", priority: 0.8 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/lp/join-the-game", changefreq: "monthly", priority: 0.7 },
];
