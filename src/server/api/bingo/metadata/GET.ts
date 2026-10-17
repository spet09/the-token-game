/**
 * GET /api/bingo/metadata?ticker=TICKER
 * Returns AI-generated rarity metadata for a coin.
 * Cached in-memory; in production persist to DB.
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';
import { getRarity, RARITY_CONFIG } from '../../../../lib/wagmi-config.js';

const metaCache = new Map<string, Record<string, unknown>>();

export default async function handler(req: Request, res: Response) {
  const ticker = ((req.query.ticker as string) || '').toUpperCase().replace(/^\$/, '');
  if (!ticker) return res.status(400).json({ error: 'ticker required' });

  if (metaCache.has(ticker)) return res.json(metaCache.get(ticker));

  const rarity = getRarity('$' + ticker);
  const rarityInfo = RARITY_CONFIG[rarity];

  let lore = '';
  let utility = '';
  try {
    const apiKeyRaw = getSecret('OPENAI_API_KEY');
    const apiKey = typeof apiKeyRaw === 'string' ? apiKeyRaw : undefined;
    if (apiKey) {
      const { generateText } = await import('ai');
      const { createOpenAI } = await import('@ai-sdk/openai');
      const openai = createOpenAI({ apiKey });

      const { text: loreText } = await generateText({
        model: openai('gpt-4o-mini'),
        maxOutputTokens: 120,
        messages: [
          { role: 'system', content: 'You write short, punchy crypto meme coin lore for a bingo card game. 1-2 sentences max. Crypto-native humor.' },
          { role: 'user', content: `Write lore for the "${ticker}" token (rarity: ${rarity}). Include what special power it grants in the bingo game.` },
        ],
      });
      lore = loreText.trim();

      const { text: utilityText } = await generateText({
        model: openai('gpt-4o-mini'),
        maxOutputTokens: 60,
        messages: [
          { role: 'system', content: 'One short sentence describing a game utility for a crypto bingo token.' },
          { role: 'user', content: `Utility for $${ticker} (${rarity} rarity, ${rarityInfo.multiplier}x multiplier):` },
        ],
      });
      utility = utilityText.trim();
    }
  } catch {
    // AI unavailable — use fallback
  }

  const result = {
    ticker: '$' + ticker,
    rarity,
    rarityLabel: rarityInfo.label,
    multiplier: rarityInfo.multiplier,
    color: rarityInfo.color,
    lore: lore || `$${ticker} is a ${rarity} token with ${rarityInfo.multiplier}x reward multiplier.`,
    utility: utility || `Grants a ${rarityInfo.multiplier}x score bonus when matched on your bingo card.`,
  };

  metaCache.set(ticker, result);
  res.json(result);
}
