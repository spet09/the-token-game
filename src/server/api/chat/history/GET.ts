// GET /api/chat/history?channel=global&limit=50
import type { Request, Response } from 'express';
import { chatStore } from '../store.js';

export default function handler(req: Request, res: Response) {
  const channel = (req.query.channel as string) || 'global';
  const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 100);

  const messages = chatStore.getHistory(channel, limit);
  res.json({ channel, messages });
}
