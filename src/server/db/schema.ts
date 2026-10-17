/**
 * Drizzle ORM schema — The Token Game
 *
 * Tables:
 *   whitelist       — global wallet registrations (pending/approved/rejected)
 *   coin_whitelist  — per-coin whitelist entries with purchase limits
 *
 * After modifying this file:
 * 1. Run: npx drizzle-kit generate
 * 2. Run: npx drizzle-kit migrate
 */

/**
 * Drizzle ORM schema — The Token Game
 *
 * Tables:
 *   whitelist       — global wallet registrations (pending/approved/rejected)
 *   coin_whitelist  — per-coin whitelist entries with purchase limits
 *
 * After modifying this file:
 * 1. Run: npx drizzle-kit generate
 * 2. Run: npx drizzle-kit migrate
 */

import { mysqlTable, int, varchar, timestamp, mysqlEnum, decimal, boolean, text } from 'drizzle-orm/mysql-core';

// ─── BetterAuth Tables ───────────────────────────────────────────────────────
export const user = mysqlTable('user', {
  id:            varchar('id', { length: 36 }).primaryKey(),
  name:          varchar('name', { length: 255 }),
  email:         varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image:         text('image'),
  isAdmin:       boolean('is_admin').default(false),
  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const session = mysqlTable('session', {
  id:          varchar('id', { length: 36 }).primaryKey(),
  expiresAt:   timestamp('expires_at').notNull(),
  token:       varchar('token', { length: 255 }).notNull().unique(),
  ipAddress:   varchar('ip_address', { length: 45 }),
  userAgent:   text('user_agent'),
  userId:      varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const account = mysqlTable('account', {
  id:                      varchar('id', { length: 36 }).primaryKey(),
  accountId:               varchar('account_id', { length: 255 }).notNull(),
  providerId:              varchar('provider_id', { length: 255 }).notNull(),
  userId:                  varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken:             text('access_token'),
  refreshToken:            text('refresh_token'),
  idToken:                 text('id_token'),
  accessTokenExpiresAt:    timestamp('access_token_expires_at'),
  refreshTokenExpiresAt:   timestamp('refresh_token_expires_at'),
  scope:                   text('scope'),
  password:                varchar('password', { length: 255 }),
  createdAt:               timestamp('created_at').defaultNow(),
  updatedAt:               timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const verification = mysqlTable('verification', {
  id:          varchar('id', { length: 36 }).primaryKey(),
  identifier:  varchar('identifier', { length: 255 }).notNull(),
  value:       varchar('value', { length: 255 }).notNull(),
  expiresAt:   timestamp('expires_at').notNull(),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Global Whitelist ────────────────────────────────────────────────────────
// Players register their wallet address to be eligible for initial coin sales.
// Status flow: pending → approved | rejected

// ─── Global Whitelist ────────────────────────────────────────────────────────
// Players register their wallet address to be eligible for initial coin sales.
// Status flow: pending → approved | rejected
export const whitelist = mysqlTable('whitelist', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull().unique(),
  registeredAt:   timestamp('registered_at').defaultNow().notNull(),
  status:         mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending').notNull(),
  notes:          varchar('notes', { length: 500 }),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Per-Coin Whitelist ──────────────────────────────────────────────────────
// Links an approved wallet to a specific coin sale.
// Tracks purchase limit and whether the 1-hour cooldown has expired.
// publicOpenAt: timestamp after which the coin opens to all wallets.
export const coinWhitelist = mysqlTable('coin_whitelist', {
  id:             int('id').primaryKey().autoincrement(),
  coinId:         varchar('coin_id', { length: 64 }).notNull(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  purchaseLimit:  int('purchase_limit').default(1).notNull(),
  publicOpenAt:   timestamp('public_open_at').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── Stash Seasons ───────────────────────────────────────────────────────────
// Each season has a start/end date and a total SOL balance to distribute.
// Status: active → distributing → completed
export const stashSeasons = mysqlTable('stash_seasons', {
  id:             int('id').primaryKey().autoincrement(),
  seasonNumber:   int('season_number').notNull().unique(),
  label:          varchar('label', { length: 64 }).notNull(),        // e.g. "Season 1 — July 2026"
  startsAt:       timestamp('starts_at').notNull(),
  endsAt:         timestamp('ends_at').notNull(),
  totalSol:       decimal('total_sol', { precision: 18, scale: 6 }).default('0').notNull(),
  status:         mysqlEnum('status', ['active', 'distributing', 'completed']).default('active').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── Stash Holdings ──────────────────────────────────────────────────────────
// Records when a wallet acquired a coin and tracks holding duration.
// Used to determine 7-day eligibility for The Stash rewards.
export const stashHoldings = mysqlTable('stash_holdings', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  coinId:         varchar('coin_id', { length: 64 }).notNull(),
  acquiredAt:     timestamp('acquired_at').notNull(),
  isEligible:     boolean('is_eligible').default(false).notNull(),   // true once 7-day threshold passed
  seasonId:       int('season_id'),                                  // which season this holding counts toward
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── Stash Balance Log ───────────────────────────────────────────────────────
// Append-only log of fee deposits into The Stash.
// Each row = one fee event (e.g. a trade on tienko.exchange).
export const stashBalanceLog = mysqlTable('stash_balance_log', {
  id:             int('id').primaryKey().autoincrement(),
  seasonId:       int('season_id'),
  amountSol:      decimal('amount_sol', { precision: 18, scale: 6 }).notNull(),
  sourceTx:       varchar('source_tx', { length: 128 }),             // Solana tx signature
  sourceType:     varchar('source_type', { length: 32 }).default('trade_fee').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── Journey Profiles ────────────────────────────────────────────────────────
// One row per wallet. Tracks current stage (1–7) and XP points.
// stage: 1=Novice, 2=Trader, 3=Analyst, 4=Creator, 5=Market, 6=Exchange, 7=Tokenomics
export const journeyProfiles = mysqlTable('journey_profiles', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull().unique(),
  displayName:    varchar('display_name', { length: 64 }),
  currentStage:   int('current_stage').default(1).notNull(),         // 1–7
  xpPoints:       int('xp_points').default(0).notNull(),
  totalBadges:    int('total_badges').default(0).notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Journey Badges ──────────────────────────────────────────────────────────
// One row per badge earned. badgeId maps to the 7 stage badges.
// badgeId: novice | trader | analyst | creator | market | exchange | tokenomics
export const journeyBadges = mysqlTable('journey_badges', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  badgeId:        varchar('badge_id', { length: 32 }).notNull(),
  badgeName:      varchar('badge_name', { length: 64 }).notNull(),
  stage:          int('stage').notNull(),
  earnedAt:       timestamp('earned_at').defaultNow().notNull(),
  siteEarned:     varchar('site_earned', { length: 128 }).default('thetokengame.xyz').notNull(),
});

// ─── Journey Stage Progress ──────────────────────────────────────────────────
// Tracks per-stage task completion for each wallet.
// taskKey: e.g. "visited_world_map", "registered_whitelist", "held_coin_7days"
export const journeyProgress = mysqlTable('journey_progress', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  stage:          int('stage').notNull(),
  taskKey:        varchar('task_key', { length: 64 }).notNull(),
  completedAt:    timestamp('completed_at').defaultNow().notNull(),
});

// ─── RPG Characters ──────────────────────────────────────────────────────────
export const rpgCharacters = mysqlTable('rpg_characters', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull().unique(),
  displayName:    varchar('display_name', { length: 64 }).notNull(),
  characterClass: mysqlEnum('character_class', ['warrior', 'mage', 'merchant', 'explorer', 'collector']).notNull(),
  nation:         varchar('nation', { length: 32 }).notNull().default('global'),
  avatarSeed:     varchar('avatar_seed', { length: 64 }),
  level:          int('level').default(1).notNull(),
  xp:             int('xp').default(0).notNull(),
  xpToNextLevel:  int('xp_to_next_level').default(100).notNull(),
  totalXpEarned:  int('total_xp_earned').default(0).notNull(),
  powerPoints:    int('power_points').default(0).notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── RPG XP Log ──────────────────────────────────────────────────────────────
export const rpgXpLog = mysqlTable('rpg_xp_log', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  xpAwarded:      int('xp_awarded').notNull(),
  source:         varchar('source', { length: 32 }).notNull(),
  sourceRef:      varchar('source_ref', { length: 128 }),
  platform:       varchar('platform', { length: 64 }).default('thetokengame.xyz').notNull(),
  levelBefore:    int('level_before').notNull(),
  levelAfter:     int('level_after').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── RPG Inventory ───────────────────────────────────────────────────────────
export const rpgInventory = mysqlTable('rpg_inventory', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  itemId:         varchar('item_id', { length: 64 }).notNull(),
  itemType:       mysqlEnum('item_type', ['card', 'ability', 'cosmetic', 'boost']).notNull(),
  itemName:       varchar('item_name', { length: 128 }).notNull(),
  rarity:         mysqlEnum('rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common').notNull(),
  quantity:       int('quantity').default(1).notNull(),
  equippedSlot:   varchar('equipped_slot', { length: 32 }),
  acquiredFrom:   varchar('acquired_from', { length: 64 }),
  acquiredAt:     timestamp('acquired_at').defaultNow().notNull(),
});

// ─── RPG Pack Purchases ──────────────────────────────────────────────────────
export const rpgPackPurchases = mysqlTable('rpg_pack_purchases', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  packTier:       mysqlEnum('pack_tier', ['starter', 'adventurer', 'hero', 'legend', 'mythic']).notNull(),
  packName:       varchar('pack_name', { length: 64 }).notNull(),
  coinCost:       int('coin_cost').notNull(),
  xpAwarded:      int('xp_awarded').notNull(),
  cardsAwarded:   int('cards_awarded').notNull(),
  rewardSnapshot: text('reward_snapshot'),
  stripeSessionId: varchar('stripe_session_id', { length: 128 }),
  status:         mysqlEnum('status', ['pending', 'delivered', 'failed']).default('pending').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── RPG Abilities ───────────────────────────────────────────────────────────
export const rpgAbilities = mysqlTable('rpg_abilities', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 64 }).notNull(),
  abilityId:      varchar('ability_id', { length: 64 }).notNull(),
  abilityName:    varchar('ability_name', { length: 128 }).notNull(),
  unlockedAtLevel: int('unlocked_at_level').notNull(),
  isEquipped:     boolean('is_equipped').default(false).notNull(),
  unlockedAt:     timestamp('unlocked_at').defaultNow().notNull(),
});

// ─── Coin Purchases ──────────────────────────────────────────────────────────
export const coinPurchases = mysqlTable('coin_purchases', {
  id:               int('id').primaryKey().autoincrement(),
  stripeSessionId:  varchar('stripe_session_id', { length: 128 }).notNull().unique(),
  stripePaymentId:  varchar('stripe_payment_id', { length: 128 }),
  // accountEmail is the primary identity key — always set from Stripe customer_details.email
  accountEmail:     varchar('account_email', { length: 255 }),
  // walletAddress is optional — set if user had wallet connected at checkout time
  walletAddress:    varchar('wallet_address', { length: 64 }).notNull(),
  bundleId:         varchar('bundle_id', { length: 32 }).notNull(),
  bundleName:       varchar('bundle_name', { length: 64 }).notNull(),
  coinsAwarded:     int('coins_awarded').notNull(),
  amountPaid:       int('amount_paid').notNull(),
  currency:         varchar('currency', { length: 8 }).default('usd').notNull(),
  status:           mysqlEnum('status', ['pending', 'delivered', 'failed']).default('pending').notNull(),
  deliveredAt:      timestamp('delivered_at'),
  failureReason:    varchar('failure_reason', { length: 256 }),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Coin Balances ───────────────────────────────────────────────────────────
// accountKey is the primary lookup key. It is the Stripe customer email when
// no wallet was connected at purchase time, or the wallet address when one was.
// Once a user links their wallet via /api/wallet/link, accountKey stays as-is
// but walletAddress is populated so withdrawals become possible.
export const coinBalances = mysqlTable('coin_balances', {
  id:             int('id').primaryKey().autoincrement(),
  // accountKey: email address OR wallet address — whichever was used at purchase
  walletAddress:  varchar('wallet_address', { length: 255 }).notNull().unique(),
  // linkedWallet: the actual Solana wallet once the user links one (nullable)
  linkedWallet:   varchar('linked_wallet', { length: 64 }),
  totalCoins:     int('total_coins').default(0).notNull(),
  totalSpentUsd:  decimal('total_spent_usd', { precision: 10, scale: 2 }).default('0').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow(),
});


// ─── Coin Spends ─────────────────────────────────────────────────────────────
export const coinSpends = mysqlTable('coin_spends', {
  id:             int('id').primaryKey().autoincrement(),
  walletAddress:  varchar('wallet_address', { length: 255 }).notNull(),
  coinsSpent:     int('coins_spent').notNull(),
  itemId:         varchar('item_id', { length: 128 }).notNull(),
  itemName:       varchar('item_name', { length: 256 }).notNull(),
  category:       mysqlEnum('category', ['upgrade', 'event', 'cosmetic', 'rpg', 'other']).default('other').notNull(),
  platform:       varchar('platform', { length: 64 }).default('thetokengame.xyz').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── Coin Withdrawals ────────────────────────────────────────────────────────
// Records when a user moves coins from their account balance to a Solana wallet.
export const coinWithdrawals = mysqlTable('coin_withdrawals', {
  id:             int('id').primaryKey().autoincrement(),
  accountKey:     varchar('account_key', { length: 255 }).notNull(),  // email or wallet
  toWallet:       varchar('to_wallet', { length: 64 }).notNull(),
  coinsWithdrawn: int('coins_withdrawn').notNull(),
  status:         mysqlEnum('status', ['pending', 'completed', 'failed']).default('pending').notNull(),
  note:           varchar('note', { length: 256 }),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Webhook Events ──────────────────────────────────────────────────────────
// Append-only log of every Stripe webhook event received.
// Captures the full event payload, processing outcome, and timing.
// Used for monitoring, debugging, and manual retry.
export const webhookEvents = mysqlTable('webhook_events', {
  id:             int('id').primaryKey().autoincrement(),
  stripeEventId:  varchar('stripe_event_id', { length: 128 }).notNull().unique(),
  eventType:      varchar('event_type', { length: 64 }).notNull(),       // e.g. checkout.session.completed
  sessionId:      varchar('session_id', { length: 128 }),                // Stripe session ID if applicable
  accountKey:     varchar('account_key', { length: 255 }),               // email or wallet
  coinsAwarded:   int('coins_awarded'),
  amountPaid:     int('amount_paid'),                                     // cents
  status:         mysqlEnum('status', ['received', 'processing', 'delivered', 'failed', 'skipped']).default('received').notNull(),
  failureReason:  varchar('failure_reason', { length: 512 }),
  retryCount:     int('retry_count').default(0).notNull(),
  lastRetriedAt:  timestamp('last_retried_at'),
  processedMs:    int('processed_ms'),                                    // processing duration in ms
  rawPayload:     text('raw_payload'),                                    // full Stripe event JSON (truncated at 64KB)
  receivedAt:     timestamp('received_at').defaultNow().notNull(),
  processedAt:    timestamp('processed_at'),
});

// ─── Quest Progress ──────────────────────────────────────────────────────────
// One row per wallet+quest combination. Tracks completion and claim status.
// status flow: active → completed → claimed
export const questProgress = mysqlTable('quest_progress', {
  id:               int('id').primaryKey().autoincrement(),
  walletAddress:    varchar('wallet_address', { length: 64 }).notNull(),
  questId:          varchar('quest_id', { length: 64 }).notNull(),
  status:           mysqlEnum('status', ['active', 'completed', 'claimed']).default('active').notNull(),
  requirementsMet:  text('requirements_met'),                              // JSON array of booleans
  completedAt:      timestamp('completed_at'),
  claimedAt:        timestamp('claimed_at'),
  xpAwarded:        int('xp_awarded').default(0).notNull(),
  streakDay:        int('streak_day').default(0).notNull(),                // day-of-streak when completed
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Quest Streaks ────────────────────────────────────────────────────────────
// Tracks daily quest completion streaks per wallet.
export const questStreaks = mysqlTable('quest_streaks', {
  id:               int('id').primaryKey().autoincrement(),
  walletAddress:    varchar('wallet_address', { length: 64 }).notNull().unique(),
  currentStreak:    int('current_streak').default(0).notNull(),
  longestStreak:    int('longest_streak').default(0).notNull(),
  lastCompletedAt:  timestamp('last_completed_at'),
  totalCompleted:   int('total_completed').default(0).notNull(),
  totalXpEarned:    int('total_xp_earned').default(0).notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── Delivery Alerts ─────────────────────────────────────────────────────────
// One row per failure that needs operator attention.
// alertSent tracks whether the email notification has been dispatched.
export const deliveryAlerts = mysqlTable('delivery_alerts', {
  id:             int('id').primaryKey().autoincrement(),
  webhookEventId: int('webhook_event_id').notNull(),                     // FK → webhook_events.id
  stripeEventId:  varchar('stripe_event_id', { length: 128 }).notNull(),
  sessionId:      varchar('session_id', { length: 128 }),
  accountKey:     varchar('account_key', { length: 255 }),
  coinsAwarded:   int('coins_awarded'),
  amountPaid:     int('amount_paid'),
  failureReason:  varchar('failure_reason', { length: 512 }),
  severity:       mysqlEnum('severity', ['warning', 'critical']).default('critical').notNull(),
  alertSent:      boolean('alert_sent').default(false).notNull(),
  alertSentAt:    timestamp('alert_sent_at'),
  resolvedAt:     timestamp('resolved_at'),
  resolvedBy:     varchar('resolved_by', { length: 64 }),                // "admin" | "auto-retry"
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});


