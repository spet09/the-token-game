// POST /api/chat/report
// Body: { messageId }
import type { Request, Response } from 'express';
import { chatStore } from '../store.js';

export default function handler(req: Request, res: Response) {
  const { messageId } = req.body as { messageId?: string };
  if (!messageId) return res.status(400).json({ error: 'messageId required' });

  const found = chatStore.report(messageId);
  if (!found) return res.status(404).json({ error: 'Message not found' });

  res.json({ ok: true });
}
