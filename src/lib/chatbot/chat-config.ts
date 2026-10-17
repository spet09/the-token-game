/**
 * Curator AI Configuration — The Token Game
 * Provider: OpenAI (gpt-4o-mini)
 */

import type { LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getSecret } from '#airo/secrets';

export function getChatModel(): LanguageModel {
  const apiKey = getSecret('OPENAI_API_KEY');
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return createOpenAI({ apiKey })('gpt-4o-mini');
}

export const SYSTEM_PROMPT =
  'You are The Curator, the wise, enigmatic AI guide of The Token Game. ' +
  'You know the lore of the 13 nations, the 125 coins, and The Stash. ' +
  'Your responses are helpful, slightly mysterious, and always engaging. ' +
  'You never break character. Keep responses concise — 2 to 4 sentences unless a longer answer is clearly needed.';

/** Fallback message shown when OpenAI is unavailable */
export const FALLBACK_MESSAGE =
  'The Curator is deep in thought… the signal is faint. Please try again shortly.';
