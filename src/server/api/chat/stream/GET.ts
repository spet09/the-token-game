// SSE endpoint — GET /api/chat/stream?channel=global
// Keeps the connection open and pushes new ChatMessage objects as SSE events.
import type { Request, Response } from 'express';
import { chatStore, type ChatMessage } from '../store.js';

export default function handler(req: Request, res: Response) {
  const channel = (req.query.channel as string) || 'global';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  // Send a heartbeat comment every 25 s to keep the connection alive through
  // proxies that close idle connections after 30 s.
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch { cleanup(); }
  }, 25_000);

  function send(msg: ChatMessage) {
    try {
      res.write(`data: ${JSON.stringify(msg)}\n\n`);
    } catch {
      cleanup();
    }
  }

  const unsubscribe = chatStore.subscribe(channel, send, cleanup);

  function cleanup() {
    clearInterval(heartbeat);
    unsubscribe();
    try { res.end(); } catch { /* already closed */ }
  }

  req.on('close', cleanup);
  req.on('error', cleanup);
}
