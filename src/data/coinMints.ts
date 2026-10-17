/**
 * Maps each coin ticker to its Solana mint address.
 * Format: https://raydium.io/swap/?inputMint=sol&outputMint=<MINT_ADDRESS>
 *
 * Add new entries here as coins launch on Raydium Launchpad.
 */
export const COIN_MINTS: Record<string, string> = {
  // ── Permanent 12 ──────────────────────────────────────────────────────────
  // '$GM':   '',
  // '$CBC':  '',
  // '$OMC':  '',
  // '$BOAT': '',
  // '$JATB': '',
  // '$NUJV': '',
  // '$LEHR': '',
  // '$SFTD': '',
  // '$WLN':  '',
  // '$RIP':  '',
  // '$ELE':  '',
  // '$RPOP': '',

  // ── Seasonal — Year One ────────────────────────────────────────────────────
  // '$RESO': '',
  // Add new Raydium mints here as coins launch, e.g.:
  // '$DETOX': '<mint_address>',
};

/** All known mint addresses as a flat array (for batch RPC queries) */
export const ALL_MINTS = Object.values(COIN_MINTS);

/** Reverse lookup: mint address → ticker */
export const MINT_TO_TICKER: Record<string, string> = Object.fromEntries(
  Object.entries(COIN_MINTS).map(([ticker, mint]) => [mint, ticker])
);

/** Permanent coin tickers (for counting permanent vs seasonal) */
export const PERMANENT_TICKERS = new Set([
  '$GM', '$CBC', '$OMC', '$BOAT', '$JATB', '$NUJV',
  '$LEHR', '$SFTD', '$WLN', '$RIP', '$ELE', '$RPOP',
]);
