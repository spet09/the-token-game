// POST /api/chat/curator
// Posts a message as The Curator. Protected by a simple secret token.
// Body: { channel, text, token }
import type { Request, Response } from 'express';
import { chatStore } from '../store.js';
import { getSecret } from '#airo/secrets';

export default function handler(req: Request, res: Response) {
  const { channel = 'curator', text, token } = req.body as {
    channel?: string;
    text?: string;
    token?: string;
  };

  // Simple token auth — set CURATOR_TOKEN in secrets
  const expected = getSecret('CURATOR_TOKEN') || 'curator-dev-token';
  if (token !== expected) {
    return res.status(401).json({ error: 'Invalid curator token' });
  }

  if (!text?.trim()) return res.status(400).json({ error: 'Text required' });

  const result = chatStore.post({
    channel,
    username: 'The Curator',
    countryCode: 'XX',
    text,
    isCurator: true,
  });

  if ('error' in result) return res.status(400).json(result);
  res.status(201).json(result);
}
