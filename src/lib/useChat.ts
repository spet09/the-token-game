// ─── useChat hook ─────────────────────────────────────────────────────────────
// Connects to /api/chat/stream via SSE for real-time messages.
// Loads history on mount and channel switch.
// Exposes send(), report(), and channel switching.

import { useEffect, useRef, useState, useCallback } from 'react';

export type ChatMessage = {
  id: string;
  channel: string;
  username: string;
  countryCode: string;
  text: string;
  ts: number;
  isCurator: boolean;
  reported: boolean;
};

export type ChatChannel = 'global' | 'curator' | string;

const MAX_DISPLAY = 100;

export function useChat(opts: {
  channel: ChatChannel;
  username: string;
  countryCode: string;
}) {
  const { channel, username, countryCode } = opts;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const channelRef = useRef(channel);

  // ── Load history when channel changes ────────────────────────────────────
  useEffect(() => {
    channelRef.current = channel;
    setMessages([]);

    fetch(`/api/chat/history?channel=${encodeURIComponent(channel)}`)
      .then((r) => r.json())
      .then((data: { messages: ChatMessage[] }) => {
        if (channelRef.current === channel) {
          setMessages(data.messages ?? []);
        }
      })
      .catch(() => { /* ignore — SSE will catch up */ });
  }, [channel]);

  // ── SSE connection ────────────────────────────────────────────────────────
  useEffect(() => {
    // Close any existing connection
    esRef.current?.close();

    const es = new EventSource(`/api/chat/stream?channel=${encodeURIComponent(channel)}`);
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => {
      setConnected(false);
      // EventSource auto-reconnects — just update state
    };

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as ChatMessage;
        if (msg.channel === channelRef.current) {
          setMessages((prev) => {
            // Deduplicate by id
            if (prev.some((m) => m.id === msg.id)) return prev;
            const next = [...prev, msg];
            return next.length > MAX_DISPLAY ? next.slice(-MAX_DISPLAY) : next;
          });
        }
      } catch { /* ignore malformed */ }
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, [channel]);

  // ── Send a message ────────────────────────────────────────────────────────
  const send = useCallback(async (text: string): Promise<{ error?: string }> => {
    if (!text.trim()) return { error: 'Empty message' };
    if (channel === 'curator') return { error: 'Curator channel is read-only' };

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, username, countryCode, text }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error ?? 'Failed to send' };
      return {};
    } catch {
      return { error: 'Network error' };
    }
  }, [channel, username, countryCode]);

  // ── Report a message ──────────────────────────────────────────────────────
  const report = useCallback(async (messageId: string): Promise<void> => {
    try {
      await fetch('/api/chat/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
      // Optimistically mark as reported in UI
      setMessages((prev) =>
        prev.map((m) => m.id === messageId ? { ...m, reported: true } : m),
      );
    } catch { /* ignore */ }
  }, []);

  return { messages, connected, send, report };
}
