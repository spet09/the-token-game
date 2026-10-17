/**
 * POST /api/curator/respond
 *
 * Receives a player's message, sends it to OpenAI as The Curator,
 * then posts the AI response into the Curator chat channel so all
 * connected players see it in real time via SSE.
 *
 * Body: { playerMessage: string, playerUsername: string, channel?: string }
 * Returns: { ok: true, reply: string } | { ok: false, reply: string (fallback) }
 */

import type { Request, Response } from 'express';
import { generateText } from 'ai';
import { getChatModel, SYSTEM_PROMPT, FALLBACK_MESSAGE } from '@/lib/chatbot/chat-config';
import { chatStore } from '../../chat/store.js';

// Simple rate-limit: 1 Curator response per 8 s per IP to control API costs
const curatorRateMap = new Map<string, number>();
const CURATOR_RATE_MS = 8_000;

function isCuratorRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = curatorRateMap.get(ip) ?? 0;
  if (now - last < CURATOR_RATE_MS) return true;
  curatorRateMap.set(ip, now);
  return false;
}

export default async function handler(req: Request, res: Response) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '0.0.0.0';

  if (isCuratorRateLimited(ip)) {
    return res.status(429).json({
      ok: false,
      reply: 'The Curator is still composing a response. A moment, please…',
    });
  }

  const { playerMessage, playerUsername = 'A seeker', channel = 'curator' } =
    req.body as {
      playerMessage?: string;
      playerUsername?: string;
      channel?: string;
    };

  if (!playerMessage?.trim()) {
    return res.status(400).json({ ok: false, reply: 'No message provided.' });
  }

  // Build conversation context — include the player's question so The Curator
  // responds to it directly.
  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    {
      role: 'user',
      content: `${playerUsername} asks: ${playerMessage.trim()}`,
    },
  ];

  let reply: string;
  let aiOk = true;

  try {
    const model = getChatModel();
    const result = await generateText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 300,
    });
    reply = result.text.trim() || FALLBACK_MESSAGE;
  } catch (err) {
    console.error('[Curator AI] OpenAI error:', err instanceof Error ? err.message : err);
    reply = FALLBACK_MESSAGE;
    aiOk = false;
  }

  // Post The Curator's reply into the chat channel so all SSE subscribers see it
  chatStore.post({
    channel,
    username: 'The Curator',
    countryCode: 'XX',
    text: reply,
    isCurator: true,
  });

  res.json({ ok: aiOk, reply });
}
