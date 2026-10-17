import express, { type NextFunction, type Request, type Response } from "express";
import { fileURLToPath } from "node:url";
import { dirname, extname, join } from "node:path";
import { readFileSync } from "node:fs";
import { siteMeta } from "../lib/site-meta.js";

// <api-imports>
import admin__credit_coins__post from "./api/admin/credit-coins/POST";
import admin__pump_addresses__get from "./api/admin/pump-addresses/GET";
import admin__pump_addresses__patch from "./api/admin/pump-addresses/PATCH";
import admin__relay__get from "./api/admin/relay/GET";
import admin__relay__patch from "./api/admin/relay/PATCH";
import admin__seed_admin__post from "./api/admin/seed-admin/POST";
import admin__webhook_monitor__get from "./api/admin/webhook-monitor/GET";
import admin__webhook_retry__post from "./api/admin/webhook-retry/POST";
import analytics__config__get from "./api/analytics/config/GET";
import auth__action__get from "./api/auth/[action]/GET";
import auth__action__post from "./api/auth/[action]/POST";
import auth__action__detail__get from "./api/auth/[action]/[detail]/GET";
import auth__action__detail__post from "./api/auth/[action]/[detail]/POST";
import bingo__auctions__get from "./api/bingo/auctions/GET";
import bingo__daily__get from "./api/bingo/daily/GET";
import bingo__metadata__get from "./api/bingo/metadata/GET";
import calendar__get from "./api/calendar/GET";
import chat__post from "./api/chat/POST";
import chat__curator__post from "./api/chat/curator/POST";
import chat__history__get from "./api/chat/history/GET";
import chat__message__post from "./api/chat/message/POST";
import chat__report__post from "./api/chat/report/POST";
import chat__stream__get from "./api/chat/stream/GET";
import coins__credit__post from "./api/coins/credit/POST";
import coins__directory__get from "./api/coins/directory/GET";
import coins__history__get from "./api/coins/history/GET";
import coins__leaderboard__get from "./api/coins/leaderboard/GET";
import coins__sync__get from "./api/coins/sync/GET";
import curator__respond__post from "./api/curator/respond/POST";
import hall_of_legends__get from "./api/hall-of-legends/GET";
import health__get from "./api/health/GET";
import journey__badge__post from "./api/journey/badge/POST";
import journey__leaderboard__get from "./api/journey/leaderboard/GET";
import journey__profile__get from "./api/journey/profile/GET";
import journey__progress__post from "./api/journey/progress/POST";
import leaderboard__get from "./api/leaderboard/GET";
import leaderboard__register__post from "./api/leaderboard/register/POST";
import leaderboard__wallet__address__get from "./api/leaderboard/wallet/[address]/GET";
import nebula__respond__post from "./api/nebula/respond/POST";
import newsletter__subscribe__post from "./api/newsletter/subscribe/POST";
import og__get from "./api/og/GET";
import og_image__get from "./api/og-image/GET";
import player__profile__get from "./api/player/profile/GET";
import players__checkin__post from "./api/players/checkin/POST";
import players__checkout__post from "./api/players/checkout/POST";
import players__heartbeat__post from "./api/players/heartbeat/POST";
import players__online__get from "./api/players/online/GET";
import quests__get from "./api/quests/GET";
import quests__progress__get from "./api/quests/progress/GET";
import quests__progress__post from "./api/quests/progress/POST";
import quests__questId__get from "./api/quests/[questId]/GET";
import rpg__character__get from "./api/rpg/character/GET";
import rpg__character__post from "./api/rpg/character/POST";
import rpg__pack__post from "./api/rpg/pack/POST";
import rpg__xp__post from "./api/rpg/xp/POST";
import season_leaderboard__get from "./api/season-leaderboard/GET";
import staking__pools__get from "./api/staking/pools/GET";
import staking__position__get from "./api/staking/position/GET";
import staking__referral__get from "./api/staking/referral/GET";
import staking__referral__post from "./api/staking/referral/POST";
import stash__get from "./api/stash/GET";
import stash__eligibility__get from "./api/stash/eligibility/GET";
import stash__holdings__post from "./api/stash/holdings/POST";
import stash__leaderboard__get from "./api/stash/leaderboard/GET";
import stash__season__get from "./api/stash/season/GET";
import stripe__create_checkout_session__post from "./api/stripe/create-checkout-session/POST";
import stripe__session__sessionId__get from "./api/stripe/session/[sessionId]/GET";
import stripe__webhook__post from "./api/stripe/webhook/POST";
import upload_coin__post from "./api/upload-coin/POST";
import wallet__balance__get from "./api/wallet/balance/GET";
import wallet__link__post from "./api/wallet/link/POST";
import wallet__spend__post from "./api/wallet/spend/POST";
import wallet__withdraw__post from "./api/wallet/withdraw/POST";
import whitelist__admin__get from "./api/whitelist/admin/GET";
import whitelist__admin__update__post from "./api/whitelist/admin/update/POST";
import whitelist__coin__post from "./api/whitelist/coin/POST";
import whitelist__coin__check__get from "./api/whitelist/coin/check/GET";
import whitelist__register__post from "./api/whitelist/register/POST";
import whitelist__status__get from "./api/whitelist/status/GET";
// </api-imports>
import { seoRoutes } from "../lib/seo-routes";
import { isSystemHost } from "./seo-host";

function normalizeCommerceApiBaseUrlEnv() {
	if (process.env.GODADDY_API_BASE_URL) return;
	const hostOnly = process.env.VITE_GODADDY_API_HOST;
	if (!hostOnly) return;
	const normalizedHost = hostOnly.replace(/^https?:\/\//, "").trim();
	if (!normalizedHost) return;
	process.env.GODADDY_API_BASE_URL = `https://${normalizedHost}`;
}

normalizeCommerceApiBaseUrlEnv();

const app = express();

// Honour x-forwarded-* from the load balancer so req.protocol/req.hostname
// reflect the public-facing values. Express-maintained parsing respects the
// existing trust-proxy config; direct header reads would let a client spoof
// the sitemap origin in robots.txt.
app.set("trust proxy", true);

// Stripe webhook must receive raw body for signature verification
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripe__webhook__post);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// <api-registrations>
app.post("/api/admin/credit-coins", admin__credit_coins__post);
app.get("/api/admin/pump-addresses", admin__pump_addresses__get);
app.patch("/api/admin/pump-addresses", admin__pump_addresses__patch);
app.get("/api/admin/relay", admin__relay__get);
app.patch("/api/admin/relay", admin__relay__patch);
app.post("/api/admin/seed-admin", admin__seed_admin__post);
app.get("/api/admin/webhook-monitor", admin__webhook_monitor__get);
app.post("/api/admin/webhook-retry", admin__webhook_retry__post);
app.get("/api/analytics/config", analytics__config__get);
app.get("/api/auth/:action", auth__action__get);
app.post("/api/auth/:action", auth__action__post);
app.get("/api/auth/:action/:detail", auth__action__detail__get);
app.post("/api/auth/:action/:detail", auth__action__detail__post);
app.get("/api/bingo/auctions", bingo__auctions__get);
app.get("/api/bingo/daily", bingo__daily__get);
app.get("/api/bingo/metadata", bingo__metadata__get);
app.get("/api/calendar", calendar__get);
app.post("/api/chat", chat__post);
app.post("/api/chat/curator", chat__curator__post);
app.get("/api/chat/history", chat__history__get);
app.post("/api/chat/message", chat__message__post);
app.post("/api/chat/report", chat__report__post);
app.get("/api/chat/stream", chat__stream__get);
app.post("/api/coins/credit", coins__credit__post);
app.get("/api/coins/directory", coins__directory__get);
app.get("/api/coins/history", coins__history__get);
app.get("/api/coins/leaderboard", coins__leaderboard__get);
app.get("/api/coins/sync", coins__sync__get);
app.post("/api/curator/respond", curator__respond__post);
app.get("/api/hall-of-legends", hall_of_legends__get);
app.get("/api/health", health__get);
app.post("/api/journey/badge", journey__badge__post);
app.get("/api/journey/leaderboard", journey__leaderboard__get);
app.get("/api/journey/profile", journey__profile__get);
app.post("/api/journey/progress", journey__progress__post);
app.get("/api/leaderboard", leaderboard__get);
app.post("/api/leaderboard/register", leaderboard__register__post);
app.get("/api/leaderboard/wallet/:address", leaderboard__wallet__address__get);
app.post("/api/nebula/respond", nebula__respond__post);
app.post("/api/newsletter/subscribe", newsletter__subscribe__post);
app.get("/api/og", og__get);
app.get("/api/og-image", og_image__get);
app.get("/api/player/profile", player__profile__get);
app.post("/api/players/checkin", players__checkin__post);
app.post("/api/players/checkout", players__checkout__post);
app.post("/api/players/heartbeat", players__heartbeat__post);
app.get("/api/players/online", players__online__get);
app.get("/api/quests", quests__get);
app.get("/api/quests/progress", quests__progress__get);
app.post("/api/quests/progress", quests__progress__post);
app.get("/api/quests/:questId", quests__questId__get);
app.get("/api/rpg/character", rpg__character__get);
app.post("/api/rpg/character", rpg__character__post);
app.post("/api/rpg/pack", rpg__pack__post);
app.post("/api/rpg/xp", rpg__xp__post);
app.get("/api/season-leaderboard", season_leaderboard__get);
app.get("/api/staking/pools", staking__pools__get);
app.get("/api/staking/position", staking__position__get);
app.get("/api/staking/referral", staking__referral__get);
app.post("/api/staking/referral", staking__referral__post);
app.get("/api/stash", stash__get);
app.get("/api/stash/eligibility", stash__eligibility__get);
app.post("/api/stash/holdings", stash__holdings__post);
app.get("/api/stash/leaderboard", stash__leaderboard__get);
app.get("/api/stash/season", stash__season__get);
app.post("/api/stripe/create-checkout-session", stripe__create_checkout_session__post);
app.get("/api/stripe/session/:sessionId", stripe__session__sessionId__get);
app.post("/api/stripe/webhook", stripe__webhook__post);
app.post("/api/upload-coin", upload_coin__post);
app.get("/api/wallet/balance", wallet__balance__get);
app.post("/api/wallet/link", wallet__link__post);
app.post("/api/wallet/spend", wallet__spend__post);
app.post("/api/wallet/withdraw", wallet__withdraw__post);
app.get("/api/whitelist/admin", whitelist__admin__get);
app.post("/api/whitelist/admin/update", whitelist__admin__update__post);
app.post("/api/whitelist/coin", whitelist__coin__post);
app.get("/api/whitelist/coin/check", whitelist__coin__check__get);
app.post("/api/whitelist/register", whitelist__register__post);
app.get("/api/whitelist/status", whitelist__status__get);
// </api-registrations>

// Error middleware must be registered AFTER the routes it protects; Express
// only passes errors to middleware defined later in the stack.
app.use("/api", (err: unknown, req: Request, res: Response, _next: NextFunction) => {
	// Always respond JSON on /api so clients parsing response.json() don't
	// receive Express's default HTML error page for non-Error throws.
	console.error("ssr.api.error", {
		url: req.url,
		error: err instanceof Error ? err.stack : String(err),
	});
	res.status(500).json({ error: "Internal server error" });
});

function baseUrl(req: Request): string {
	return `${req.protocol}://${req.hostname}`;
}

function escapeXml(s: string): string {
	return s.replace(/[&<>"']/g, (c) =>
		({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
	);
}

// OG image — must be before static middleware so it takes precedence over public/og-image.svg
app.get("/og-image.png", og_image__get);

app.get("/robots.txt", (req, res) => {
	if (isSystemHost(req)) {
		res
			.type("text/plain")
			.set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host")
			.send("User-agent: *\nDisallow: /\n");
		return;
	}
	const base = baseUrl(req);
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${base}/sitemap.xml`,
		"",
		`# AI crawlers — see ${base}/llms.txt for a structured overview of this site`,
		"",
	].join("\n");
	res.type("text/plain").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send(body);
});

app.get("/llms.txt", (req, res) => {
	if (isSystemHost(req)) {
		res.type("text/plain").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send("");
		return;
	}
	const base = baseUrl(req);
	const body = [
		`# ${siteMeta.name}`,
		``,
		`> ${siteMeta.summary}`,
		``,
		`## What is The Token Game?`,
		``,
		`The Token Game is the world's first seasonal meme coin ecosystem built on Solana. Players collect, craft, trade, and stake 212+ seasonal coins across 16 global editions — each tied to real-world cultural moments, seasons, and events.`,
		``,
		`## The 8-Coin Economy`,
		``,
		`- **TKN** (Tier 1) — The base currency. Earned through gameplay and quests.`,
		`- **GOLD** (Tier 2) — Crafted from 100 TKN. Mid-tier tradeable token.`,
		`- **OASIS** (Tier 3) — Crafted from 1,000 GOLD. High-value ecosystem token.`,
		`- **USGC** (Tier 4) — Crafted from 10 OASIS. Top-tier staking token (18.5% APY pool).`,
		`- **XP Coin** — Non-tradeable. Earned through quests and gameplay milestones.`,
		`- **ARTFCT** — Special non-craftable artifact token.`,
		`- **NTN** — Special non-craftable nation token.`,
		`- **CUR8** — Special non-craftable curator token.`,
		``,
		`## Core Features`,
		``,
		`- **212 Seasonal Coins** — Collectible meme coins tied to cultural events, holidays, and seasons across 16 global editions (Africa, Antarctica, Arctic, Australia, Central America, China, Europe, India, Japan, Middle East, North America, Oceania, Russia, South America, UK, USA).`,
		`- **Crafting System** — Forward and reverse crafting calculators. Combine lower-tier coins into higher-tier tokens using the hierarchy: TKN → GOLD → OASIS → USGC.`,
		`- **Staking Pools** — Stake USGC (18.5% APY), NYC (24% APY), and TIEN (32% APY) to earn passive rewards.`,
		`- **Quests** — 30 quests across 6 categories and 4 tiers. Complete quests to earn XP and advance your journey.`,
		`- **War Room** — 19 nation pages where players compete for dominance. Nations: Africa, Antarctica, Arctic, Australia, Central America, China, Europe, India, Japan, Middle East, North America, Oceania, Russia, South America, UK, USA, and more.`,
		`- **Leaderboards** — Global player rankings, coin leaderboards, and Hall of Legends for top performers.`,
		`- **Seasonal Calendar** — 10 seasons with 130+ coin release windows. Coins are only available during their designated season.`,
		`- **Bingo** — Seasonal bingo game with auction mechanics and a dedicated dashboard.`,
		`- **RPG Classes** — 5 character classes with 19 unique abilities. Create your character and choose your playstyle.`,
		`- **Referral Program** — Wallet-based referral codes with Bronze → Diamond tier rewards.`,
		`- **Backstories** — 1,582 coin lore entries with a searchable split-panel interface.`,
		`- **Raydium Integration** — Buy coins directly via Raydium DEX swap links.`,
		``,
		`## Tienko Ecosystem`,
		``,
		`The Token Game is part of the broader Tienko ecosystem. TIEN is the ecosystem's governance and utility token with a 32% APY staking pool.`,
		``,
		`## How to Play`,
		``,
		`1. Connect your Solana wallet at ${base}`,
		`2. Browse the seasonal coin calendar at ${base}/calendar`,
		`3. Collect coins during their active windows`,
		`4. Craft higher-tier tokens using the crafting system at ${base}/crafting`,
		`5. Stake your tokens for passive rewards at ${base}/staking`,
		`6. Complete quests at ${base}/quests to earn XP and level up`,
		`7. Compete in the War Room at ${base}/war-room`,
		``,
		`## Key Pages`,
		``,
		`- Home: ${base}/`,
		`- About: ${base}/about`,
		`- Coin Directory: ${base}/coin-directory`,
		`- Crafting: ${base}/crafting`,
		`- Staking: ${base}/staking`,
		`- Quests: ${base}/quests`,
		`- War Room: ${base}/war-room`,
		`- Leaderboard: ${base}/leaderboard`,
		`- Hall of Legends: ${base}/hall-of-legends`,
		`- Seasonal Calendar: ${base}/calendar`,
		`- Backstories: ${base}/backstories`,
		`- Bingo: ${base}/bingo`,
		``,
		`## Tagline`,
		``,
		`Play Smart. Win Big. Own It.`,
		``,
	].join("\n");
	res.type("text/plain").set("Cache-Control", "public, max-age=3600, must-revalidate").set("Vary", "Host").send(body);
});

app.get("/sitemap.xml", (req, res) => {
	if (isSystemHost(req)) {
		const empty = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n`;
		res.type("application/xml").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send(empty);
		return;
	}
	const base = baseUrl(req);
	const urls = seoRoutes
		.filter((r) => typeof r.path === "string" && r.path.startsWith("/"))
		.map((r) => {
			const loc = `${base}${r.path}`;
			const parts = [`    <loc>${escapeXml(loc)}</loc>`];
			if (r.lastmod) parts.push(`    <lastmod>${escapeXml(r.lastmod)}</lastmod>`);
			if (r.changefreq) parts.push(`    <changefreq>${r.changefreq}</changefreq>`);
			if (r.priority !== undefined)
				parts.push(`    <priority>${r.priority.toFixed(1)}</priority>`);
			return `  <url>\n${parts.join("\n")}\n  </url>`;
		})
		.join("\n");
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	res.type("application/xml").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send(body);
});

if (import.meta.env.PROD) {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const clientDir = join(__dirname, "client");

	app.use(
		express.static(clientDir, {
			index: false,
			setHeaders(res, filePath) {
				res.set(
					"Cache-Control",
					filePath.includes("/assets/")
						? "public, max-age=31536000, immutable"
						: "no-cache",
				);
			},
		}),
	);

	app.use((_req, res, next) => {
		res.set("Cache-Control", "no-cache");
		next();
	});

	let template: string;
	try {
		template = readFileSync(join(clientDir, "index.html"), "utf-8");
	} catch (err) {
		console.error("ssr.template.load-failed", {
			path: join(clientDir, "index.html"),
			error: err instanceof Error ? err.message : String(err),
		});
		process.exit(1);
	}
	if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
		// Fail fast at boot, same as a template load failure above: without
		// markers, every .replace() call on the render path is a no-op and we
		// would serve a shell with no <head> content and no rendered body on
		// every request. Preferring process.exit over a degraded mode ensures
		// an operator notices and fixes the build rather than serving broken
		// SEO-invisible pages indefinitely.
		console.error("ssr.template.markers-missing", {
			hasHead: template.includes("<!--app-head-->"),
			hasHtml: template.includes("<!--app-html-->"),
		});
		process.exit(1);
	}
	const fallbackShell = template
		.replace("<!--app-head-->", "")
		.replace("<!--app-html-->", "");

	// Resolve the SSR module once into a stable render function. A failed
	// load is unrecoverable at runtime - exiting lets the container
	// scheduler restart with a clean slate rather than leaving the server
	// to serve silent 503s indefinitely against a single startup log.
	type RenderResult = {
		html: string;
		head: string;
		status: number;
		redirect?: string;
	};
	let renderFn: ((url: string) => Promise<RenderResult>) | null = null;
	const SSR_MODULE_LOAD_TIMEOUT_MS = 30_000;
	const loadTimeout = setTimeout(() => {
		if (renderFn !== null) return;
		console.error("ssr.module.load-timeout", {
			timeoutMs: SSR_MODULE_LOAD_TIMEOUT_MS,
		});
		process.exit(1);
	}, SSR_MODULE_LOAD_TIMEOUT_MS);
	loadTimeout.unref();
	import("../entry-server").then(
		(mod) => {
			clearTimeout(loadTimeout);
			renderFn = mod.render;
		},
		(err) => {
			clearTimeout(loadTimeout);
			console.error("ssr.module.load-failed", {
				error: err instanceof Error ? err.stack : String(err),
			});
			process.exit(1);
		},
	);

	app.get(/.*/, async (req, res, next) => {
		if (req.method !== "GET") return next();
		if (req.path.startsWith("/api")) return next();
		if (extname(req.path)) return next();
		const sendFallback = () =>
			res
				.status(503)
				.set("Content-Type", "text/html; charset=utf-8")
				.set("Cache-Control", "no-store")
				.send(fallbackShell);
		if (renderFn === null) {
			// Module not yet resolved; fall back without logging to avoid startup
			// noise before the first render is even possible. A terminal load
			// failure (import reject or 30s timeout) process.exit(1)s from the
			// loader above, so this branch is only the brief warmup window.
			return sendFallback();
		}
		try {
			const result = await renderFn(req.url);
			if (result.redirect) {
				// Redirect thrown from a loader/action surfaces as a Response.
				// Forward it so the browser actually navigates to the new URL
				// instead of seeing an empty shell with a stale status.
				res.redirect(result.status, result.redirect);
				return;
			}
			if (!result.html) {
				// A non-redirect Response was thrown from a loader (e.g.
				// `throw new Response(null, { status: 404 })`). renderToString
				// produced no markup, so we have a real status but no body.
				// Log so the case is observable in ops dashboards, and mark
				// no-store so CDNs don't cache an empty page as a valid hit.
				// User-visible 404 / error pages should come from a route
				// errorElement, not from this fallback path.
				console.error("ssr.render.error-response", {
					url: req.url,
					status: result.status,
				});
				res
					.status(result.status)
					.set("Content-Type", "text/html; charset=utf-8")
					.set("Cache-Control", "no-store")
					.send(fallbackShell);
				return;
			}
			// Per-host SEO injection. System URLs get a noindex meta so
			// crawlers drop them from the index over time; customer-attached
			// hosts get a self-canonical link so search engines treat them
			// as authoritative for the rendered content.
			const seoHead = isSystemHost(req)
				? `<meta name="robots" content="noindex,nofollow">`
				: `<link rel="canonical" href="${escapeXml(`${req.protocol}://${req.hostname}${req.path}`)}">`;
			// Function replacements disable String.replace's $-special sequences
			// ($&, $', $`, $$) so user-authored titles / JSON-LD like
			// "Save $& today" insert literally instead of being interpolated.
			const out = template
				.replace("<!--app-head-->", () => seoHead + result.head)
				.replace("<!--app-html-->", () => result.html);
			res
				.status(result.status)
				.set("Content-Type", "text/html; charset=utf-8")
				.set("Cache-Control", "no-cache")
				.send(out);
		} catch (err) {
			// 503 surfaces the failure in CDN/monitoring without caching a broken
			// page as success. console.error (not warn) puts it at the right log
			// level for the observability pipeline to alert on.
			console.error("ssr.render.failed", {
				url: req.url,
				// Log the full stack — React's renderToString annotates it with
				// the failing component's call tree, which the message alone
				// discards.
				error: err instanceof Error ? err.stack : String(err),
			});
			sendFallback();
		}
	});

	const shutdown = async (signal: string) => {
		console.log(`Got ${signal}, shutting down gracefully...`);
		// Scope the ERR_MODULE_NOT_FOUND suppression to the import() only.
		// A closeConnection() failure that happens to carry the same code
		// (unlikely but possible for wrapped errors) must not be silently
		// swallowed - it indicates a real db-close failure worth logging.
		let mod: { closeConnection?: () => Promise<void> | void } | null = null;
		try {
			const dbClient = "./db/client" + ".js";
			// Source-literal optional module path; no request, environment, or user input reaches import().
			// eslint-disable-next-line no-unsanitized/method
			mod = await import(/* @vite-ignore */ dbClient);
		} catch (error: unknown) {
			const code = (error as { code?: string } | null)?.code;
			if (code !== "ERR_MODULE_NOT_FOUND") {
				console.error("ssr.shutdown.db-import-failed", {
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}
		if (mod && typeof mod.closeConnection === "function") {
			try {
				await mod.closeConnection();
				console.log("Database connections closed");
			} catch (error: unknown) {
				console.error("ssr.shutdown.db-close-failed", {
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}
		process.exit(0);
	};

	(["SIGTERM", "SIGINT"] as const).forEach((signal) => {
		process.once(signal, () => {
			void shutdown(signal);
		});
	});

	const rawPort = process.env.PORT || "3000";
	const port = parseInt(rawPort, 10);
	if (!Number.isInteger(port) || port <= 0 || port > 65535) {
		// parseInt("abc") returns NaN; passing that to app.listen throws
		// synchronously before the server.on("error") handler below can catch
		// it. Fail fast with an actionable log rather than a cryptic crash.
		console.error("ssr.server.invalid-port", { rawPort });
		process.exit(1);
	}
	const host = process.env.HOST || "0.0.0.0";
	const server = app.listen(port, host, () => {
		console.log(`Server listening on http://${host}:${port}`);
	});
	server.on("error", (err: NodeJS.ErrnoException) => {
		console.error("ssr.server.listen-failed", {
			port,
			host,
			code: err.code,
			error: err.message,
		});
		process.exit(1);
	});
}

export default app;

// ─── Testable helpers ─────────────────────────────────────────────────────────

type AdSenseConfig = {
  publisherId?: string | null;
  scriptHtml: string;
  adsTxt?: string | null;
  appAdsTxt?: string | null;
};

/** Render an SSR document by replacing the two HTML markers. */
export function renderSsrDocument(
  template: string,
  result: { head: string; html: string },
  adsense: { scriptHtml: string },
): string {
  const headContent = result.head + (adsense.scriptHtml ? '\n' + adsense.scriptHtml : '');
  return template
    .replace('<!--app-head-->', () => headContent)
    .replace('<!--app-html-->', () => result.html);
}

/** Register /ads.txt and /app-ads.txt routes on an Express app. */
export function registerAdSenseTextRoutes(
  expressApp: import('express').Express,
  config: AdSenseConfig,
): void {
  expressApp.get('/ads.txt', (_req, res) => {
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'no-cache');
    if (config.adsTxt) {
      res.status(200).send(config.adsTxt);
    } else {
      res.status(404).send('');
    }
  });
  expressApp.get('/app-ads.txt', (_req, res) => {
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'no-cache');
    if (config.appAdsTxt) {
      res.status(200).send(config.appAdsTxt);
    } else {
      res.status(404).send('');
    }
  });
}
