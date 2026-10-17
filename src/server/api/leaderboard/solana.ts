/**
 * Solana RPC helpers for Token Game leaderboard.
 * Uses the public mainnet RPC — no API key required.
 * Swap SOLANA_RPC_URL secret for a private endpoint (Helius, QuickNode, etc.)
 * if you hit rate limits at scale.
 */

import { getSecret } from '#airo/secrets';

function getRpcUrl(): string {
  try {
    const secret: unknown = getSecret('SOLANA_RPC_URL');
    if (typeof secret === 'string' && secret) return secret;
  } catch {
    // secret not configured — fall through to public endpoint
  }
  return 'https://api.mainnet-beta.solana.com';
}

async function rpc(method: string, params: unknown[]): Promise<unknown> {
  const url = getRpcUrl();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: { message: string } };
  if (json.error) throw new Error(`RPC error: ${json.error.message}`);
  return json.result;
}

export interface TokenAccount {
  mint: string;
  amount: bigint;
}

/**
 * Returns all SPL token accounts for a wallet address that have a non-zero balance.
 */
export async function getTokenAccounts(walletAddress: string): Promise<TokenAccount[]> {
  const result = await rpc('getTokenAccountsByOwner', [
    walletAddress,
    { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
    { encoding: 'jsonParsed' },
  ]);

  const accounts = (result as {
    value: Array<{
      account: {
        data: {
          parsed: {
            info: {
              mint: string;
              tokenAmount: { uiAmount: number; amount: string };
            };
          };
        };
      };
    }>;
  }).value;

  return accounts
    .map((a) => ({
      mint: a.account.data.parsed.info.mint,
      amount: BigInt(a.account.data.parsed.info.tokenAmount.amount),
    }))
    .filter((a) => a.amount > 0n);
}

/**
 * Checks which of the provided mint addresses the wallet holds (any non-zero balance).
 */
export async function getHeldMints(walletAddress: string, targetMints: Set<string>): Promise<Set<string>> {
  const accounts = await getTokenAccounts(walletAddress);
  const held = new Set<string>();
  for (const acc of accounts) {
    if (targetMints.has(acc.mint)) {
      held.add(acc.mint);
    }
  }
  return held;
}
