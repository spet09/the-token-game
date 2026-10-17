/**
 * POST /api/nebula/respond
 *
 * Receives a player's message, sends it to Thirdweb Nebula AI
 * (blockchain-native AI), then posts the response into the Nebula
 * chat channel so all connected players see it via SSE.
 *
 * Nebula specialises in on-chain data: wallet balances, token prices,
 * transaction history, smart contracts, and Solana/EVM chain queries.
 *
 * Body: { playerMessage: string, playerUsername: string, walletAddress?: string }
 * Returns: { ok: true, reply: string } | { ok: false, reply: string }
 */

import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';
import { chatStore } from '../../chat/store.js';

// Rate-limit: 1 Nebula response per 6 s per IP
const nebulaRateMap = new Map<string, number>();
const NEBULA_RATE_MS = 6_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = nebulaRateMap.get(ip) ?? 0;
  if (now - last < NEBULA_RATE_MS) return true;
  nebulaRateMap.set(ip, now);
  return false;
}

const NEBULA_FALLBACK =
  '⚡ Nebula is scanning the chain… try again in a moment.';

// Nebula API endpoint
const NEBULA_API_URL = 'https://nebula-api.thirdweb.com/chat';

export default async function handler(req: Request, res: Response) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '0.0.0.0';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      ok: false,
      reply: '⚡ Nebula is still processing. A moment, please…',
    });
  }

  const {
    playerMessage,
    playerUsername = 'A player',
    walletAddress,
  } = req.body as {
    playerMessage?: string;
    playerUsername?: string;
    walletAddress?: string;
  };

  if (!playerMessage?.trim()) {
    return res.status(400).json({ ok: false, reply: 'No message provided.' });
  }

  const secretKey = getSecret('NEBULA_SECRET_KEY');
  if (!secretKey) {
    console.error('[Nebula] NEBULA_SECRET_KEY not configured');
    chatStore.post({
      channel: 'nebula',
      username: 'Nebula',
      countryCode: 'XX',
      text: '⚡ Nebula is not yet configured. Add your Thirdweb secret key to enable on-chain AI.',
      isCurator: true,
    });
    return res.status(503).json({ ok: false, reply: NEBULA_FALLBACK });
  }

  // Build the Nebula request — include wallet context if available
  const contextNote = walletAddress
    ? ` (Player wallet: ${walletAddress})`
    : '';
  const userMessage = `${playerUsername} asks${contextNote}: ${playerMessage.trim()}`;

  let reply = NEBULA_FALLBACK;
  let aiOk = true;

  try {
    const nebulaRes = await fetch(NEBULA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': secretKey as string,
      },
      body: JSON.stringify({
        message: userMessage,
        // Solana context — helps Nebula focus on the right chain
        context_filter: {
          chain_ids: ['solana'],
        },
        stream: false,
      }),
    });

    if (!nebulaRes.ok) {
      const errText = await nebulaRes.text();
      console.error('[Nebula] API error:', nebulaRes.status, errText);
      aiOk = false;
    } else {
      const data = await nebulaRes.json() as {
        message?: string;
        result?: string;
        response?: string;
      };
      // Nebula returns the answer in `message` or `result`
      reply = (data.message || data.result || data.response || '').trim() || NEBULA_FALLBACK;
    }
  } catch (err) {
    console.error('[Nebula] Fetch error:', err instanceof Error ? err.message : err);
    aiOk = false;
  }

  // Broadcast Nebula's reply into the nebula channel via SSE
  chatStore.post({
    channel: 'nebula',
    username: 'Nebula',
    countryCode: 'XX',
    text: reply,
    isCurator: true,
  });

  res.json({ ok: aiOk, reply });
}
