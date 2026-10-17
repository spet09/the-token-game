/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                     TIENKO ECOSYSTEM SDK  v1.0                         ║
 * ║                                                                        ║
 * ║  Drop this script on any Tienko ecosystem site to get:                 ║
 * ║    • Unified coin balance (email or wallet lookup)                     ║
 * ║    • Real-time balance sync via SSE                                    ║
 * ║    • Coin credit after purchase                                        ║
 * ║    • Full transaction history                                          ║
 * ║    • Player Menu bar (optional UI component)                           ║
 * ║                                                                        ║
 * ║  SETUP (server-side only — never expose the API key in the browser):   ║
 * ║    Your server calls POST /api/coins/credit with:                      ║
 * ║      Authorization: Bearer <TIENKO_API_SECRET>                         ║
 * ║      { accountKey, coins, platform, reason }                           ║
 * ║                                                                        ║
 * ║  BROWSER USAGE:                                                        ║
 * ║    <script src="https://thetokengame.xyz/tienko-sdk.js"></script>      ║
 * ║    <script>                                                            ║
 * ║      const sdk = new TienkoSDK({                                       ║
 * ║        apiBase: 'https://thetokengame.xyz',                            ║
 * ║        apiKey:  'YOUR_TIENKO_API_SECRET',  // server-side only!        ║
 * ║        platform: 'tienko.io',                                          ║
 * ║      });                                                               ║
 * ║      await sdk.init('user@example.com');                               ║
 * ║      sdk.mountPlayerMenu('#player-menu-container');                    ║
 * ║    </script>                                                           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ⚠️  SECURITY NOTE:
 *     The apiKey (TIENKO_API_SECRET) must ONLY be used server-to-server.
 *     For browser-side balance display, use the public read endpoints
 *     (GET /api/wallet/balance?email=...) which do NOT require auth.
 *     The SDK's credit() and history() methods are intended for server use.
 */

(function (global) {
  'use strict';

  // ── Constants ───────────────────────────────────────────────────────────────
  const SDK_VERSION = '1.0.0';
  const DEFAULT_API_BASE = 'https://thetokengame.xyz';

  // ── TienkoSDK class ─────────────────────────────────────────────────────────
  class TienkoSDK {
    /**
     * @param {object} config
     * @param {string} config.apiBase     — Base URL of thetokengame.xyz (default: https://thetokengame.xyz)
     * @param {string} [config.apiKey]    — TIENKO_API_SECRET (server-side only)
     * @param {string} config.platform    — Your site name, e.g. "tienko.io"
     * @param {boolean} [config.autoSync] — Auto-subscribe to SSE balance updates (default: true)
     */
    constructor(config = {}) {
      this.apiBase   = (config.apiBase || DEFAULT_API_BASE).replace(/\/$/, '');
      this.apiKey    = config.apiKey || null;
      this.platform  = config.platform || 'unknown';
      this.autoSync  = config.autoSync !== false;
      this.version   = SDK_VERSION;

      this._accountKey = null;
      this._balance    = 0;
      this._listeners  = {};
      this._sse        = null;
      this._menuEl     = null;
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    /**
     * Initialise the SDK for a user account.
     * @param {string} accountKey — email or wallet address
     * @returns {Promise<{accountKey, totalCoins, totalSpentUsd, hasLinkedWallet}>}
     */
    async init(accountKey) {
      if (!accountKey) throw new Error('TienkoSDK.init: accountKey is required');
      this._accountKey = accountKey.trim().toLowerCase();

      const data = await this._fetchBalance(this._accountKey);
      this._balance = data.totalCoins || 0;
      this._emit('ready', data);

      if (this.autoSync) {
        this._startSSE();
      }

      return data;
    }

    // ── Balance ───────────────────────────────────────────────────────────────
    /** Returns the current in-memory balance (set after init). */
    get balance() {
      return this._balance;
    }

    /**
     * Fetch the latest balance from the API.
     * @param {string} [accountKey] — defaults to the one passed to init()
     */
    async getBalance(accountKey) {
      const key = accountKey || this._accountKey;
      if (!key) throw new Error('TienkoSDK.getBalance: call init() first or pass accountKey');
      const data = await this._fetchBalance(key);
      this._balance = data.totalCoins || 0;
      this._emit('balance', data);
      return data;
    }

    // ── Credit (server-side only) ─────────────────────────────────────────────
    /**
     * Credit coins to an account. MUST be called server-side only.
     * @param {object} opts
     * @param {string} opts.accountKey
     * @param {number} opts.coins
     * @param {string} [opts.reason]
     * @param {string} [opts.idempotencyKey]
     */
    async credit({ accountKey, coins, reason, idempotencyKey } = {}) {
      if (!this.apiKey) throw new Error('TienkoSDK.credit: apiKey is required (server-side only)');
      const res = await fetch(`${this.apiBase}/api/coins/credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'x-tienko-platform': this.platform,
        },
        body: JSON.stringify({
          accountKey: accountKey || this._accountKey,
          coins,
          platform: this.platform,
          reason: reason || `Credit from ${this.platform}`,
          idempotencyKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Credit failed: ${res.status}`);
      this._balance = data.newBalance;
      this._emit('credited', data);
      return data;
    }

    // ── History (server-side only) ────────────────────────────────────────────
    /**
     * Fetch unified transaction history.
     * @param {object} [opts]
     * @param {string} [opts.accountKey]
     * @param {number} [opts.limit]
     * @param {number} [opts.offset]
     * @param {'all'|'purchases'|'spends'} [opts.type]
     */
    async getHistory({ accountKey, limit = 50, offset = 0, type = 'all' } = {}) {
      if (!this.apiKey) throw new Error('TienkoSDK.getHistory: apiKey is required (server-side only)');
      const key = accountKey || this._accountKey;
      const params = new URLSearchParams({ accountKey: key, limit, offset, type });
      const res = await fetch(`${this.apiBase}/api/coins/history?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'x-tienko-platform': this.platform,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `History fetch failed: ${res.status}`);
      return data;
    }

    // ── Real-time sync ────────────────────────────────────────────────────────
    /**
     * Subscribe to real-time balance updates via SSE.
     * Called automatically by init() when autoSync is true.
     * @param {string} [accountKey]
     */
    startSync(accountKey) {
      const key = accountKey || this._accountKey;
      if (!key) throw new Error('TienkoSDK.startSync: call init() first');
      this._startSSE(key);
    }

    stopSync() {
      if (this._sse) {
        this._sse.close();
        this._sse = null;
      }
    }

    // ── Player Menu UI ────────────────────────────────────────────────────────
    /**
     * Mount the Tienko Player Menu bar into a container element.
     * @param {string|HTMLElement} container — CSS selector or DOM element
     * @param {object} [opts]
     * @param {string} [opts.theme] — "dark" (default) | "light"
     */
    mountPlayerMenu(container, opts = {}) {
      const el = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!el) {
        console.warn(`TienkoSDK.mountPlayerMenu: container "${container}" not found`);
        return;
      }

      const theme = opts.theme || 'dark';
      el.innerHTML = this._renderPlayerMenu(theme);
      this._menuEl = el;

      // Update balance display whenever it changes
      this.on('balance', (data) => this._updateMenuBalance(data.totalCoins));
      this.on('balance_update', (data) => this._updateMenuBalance(data.newBalance));
      this.on('ready', (data) => this._updateMenuBalance(data.totalCoins));

      // Wire up the "View Wallet" link
      const walletLink = el.querySelector('[data-tienko-wallet-link]');
      if (walletLink) {
        walletLink.href = `${this.apiBase}/wallet`;
        walletLink.target = '_blank';
        walletLink.rel = 'noopener noreferrer';
      }

      // Wire up the "Buy Coins" link
      const buyLink = el.querySelector('[data-tienko-buy-link]');
      if (buyLink) {
        buyLink.href = `${this.apiBase}/buy-coins`;
        buyLink.target = '_blank';
        buyLink.rel = 'noopener noreferrer';
      }
    }

    // ── Events ────────────────────────────────────────────────────────────────
    on(event, fn) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
      return this; // chainable
    }

    off(event, fn) {
      if (!this._listeners[event]) return this;
      this._listeners[event] = this._listeners[event].filter((f) => f !== fn);
      return this;
    }

    // ── Private ───────────────────────────────────────────────────────────────
    async _fetchBalance(key) {
      const isEmail = key.includes('@');
      const params = new URLSearchParams(isEmail ? { email: key } : { wallet: key });
      const res = await fetch(`${this.apiBase}/api/wallet/balance?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Balance fetch failed: ${res.status}`);
      }
      return res.json();
    }

    _startSSE(accountKey) {
      const key = accountKey || this._accountKey;
      if (!key) return;

      // Close existing connection
      if (this._sse) this._sse.close();

      const url = `${this.apiBase}/api/coins/sync?accountKey=${encodeURIComponent(key)}`;

      // EventSource doesn't support custom headers in browsers.
      // For browser use, we use a polling fallback.
      // For server use (Node.js), use the credit() method which triggers SSE push.
      if (typeof EventSource !== 'undefined') {
        // Browser: use EventSource (no auth header — balance is public read)
        // We use the public /api/wallet/balance endpoint for polling instead
        this._startPolling(key);
      }
    }

    _startPolling(key, intervalMs = 15000) {
      // Poll balance every 15s as a fallback for browser SSE (which can't send auth headers)
      const poll = async () => {
        try {
          const data = await this._fetchBalance(key);
          if (data.totalCoins !== this._balance) {
            this._balance = data.totalCoins;
            this._emit('balance_update', { newBalance: data.totalCoins, accountKey: key });
            this._updateMenuBalance(data.totalCoins);
          }
        } catch {
          // silent — network error, will retry
        }
      };
      this._pollInterval = setInterval(poll, intervalMs);
    }

    _emit(event, data) {
      const fns = this._listeners[event] || [];
      fns.forEach((fn) => {
        try { fn(data); } catch (e) { console.error(`TienkoSDK event "${event}" error:`, e); }
      });
    }

    _updateMenuBalance(coins) {
      if (!this._menuEl) return;
      const pill = this._menuEl.querySelector('[data-tienko-balance]');
      if (pill) pill.textContent = `🪙 ${Number(coins).toLocaleString()}`;
    }

    _renderPlayerMenu(theme) {
      const isDark = theme !== 'light';
      const bg     = isDark ? '#1a0a2e' : '#f8f4ff';
      const border = isDark ? '#7c3aed33' : '#ddd6fe';
      const text   = isDark ? '#e9d5ff' : '#4c1d95';
      const pill   = isDark ? '#7c3aed' : '#8b5cf6';
      const pillTx = '#ffffff';

      return `
<div style="
  display:flex; align-items:center; justify-content:space-between;
  padding:8px 16px; background:${bg}; border-bottom:1px solid ${border};
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  font-size:13px; color:${text}; gap:12px; flex-wrap:wrap;
" data-tienko-player-menu>
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-weight:700;letter-spacing:.5px;">TIENKO</span>
    <span style="
      background:${pill}; color:${pillTx}; border-radius:999px;
      padding:2px 10px; font-weight:700; font-size:12px;
    " data-tienko-balance>🪙 —</span>
  </div>
  <div style="display:flex;align-items:center;gap:12px;">
    <a href="#" data-tienko-wallet-link style="color:${text};text-decoration:none;font-weight:600;">
      View Wallet
    </a>
    <a href="#" data-tienko-buy-link style="
      background:${pill}; color:${pillTx}; border-radius:6px;
      padding:4px 12px; text-decoration:none; font-weight:700; font-size:12px;
    ">
      Buy Coins
    </a>
  </div>
</div>`;
    }
  }

  // ── Node.js server-side helper ────────────────────────────────────────────
  /**
   * Lightweight server-side helper for crediting coins after a Stripe webhook.
   * Use this in your partner site's webhook handler.
   *
   * Example (Express):
   *   const { creditCoins } = require('./tienko-sdk-server');
   *   app.post('/webhook/stripe', async (req, res) => {
   *     const session = stripe.webhooks.constructEvent(...);
   *     if (session.type === 'checkout.session.completed') {
   *       await creditCoins({
   *         apiBase: 'https://thetokengame.xyz',
   *         apiKey: process.env.TIENKO_API_SECRET,
   *         accountKey: session.data.object.customer_details.email,
   *         coins: 500,
   *         platform: 'tienko.io',
   *         reason: `Stripe ${session.data.object.id}`,
   *         idempotencyKey: session.data.object.id,
   *       });
   *     }
   *   });
   */
  async function creditCoins({ apiBase, apiKey, accountKey, coins, platform, reason, idempotencyKey }) {
    const res = await fetch(`${apiBase}/api/coins/credit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-tienko-platform': platform || 'unknown',
      },
      body: JSON.stringify({ accountKey, coins, platform, reason, idempotencyKey }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Credit failed: ${res.status}`);
    return data;
  }

  // ── Expose globally ───────────────────────────────────────────────────────
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (Node.js)
    module.exports = { TienkoSDK, creditCoins };
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], () => ({ TienkoSDK, creditCoins }));
  } else {
    // Browser global
    global.TienkoSDK = TienkoSDK;
    global.tienkoCredit = creditCoins;
  }

})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
