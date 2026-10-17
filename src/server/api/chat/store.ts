// ─── In-memory chat store ─────────────────────────────────────────────────────
// Channels: 'global' | 'curator' | nation code (e.g. 'AU', 'US')
// Messages are capped at MAX_MESSAGES_PER_CHANNEL per channel.
// SSE clients subscribe per-channel and receive new messages as they arrive.

export type ChatChannel = string; // 'global' | 'curator' | 'AU' | 'US' | etc.

export type ChatMessage = {
  id: string;
  channel: ChatChannel;
  username: string;
  countryCode: string;
  text: string;
  ts: number; // Date.now()
  isCurator: boolean;
  reported: boolean;
};

const MAX_MESSAGES_PER_CHANNEL = 100;
const MAX_MESSAGE_LENGTH = 280;

// ─── Profanity filter (basic word list) ──────────────────────────────────────
const BAD_WORDS = [
  'fuck', 'shit', 'cunt', 'nigger', 'nigga', 'faggot', 'retard',
  'bitch', 'asshole', 'bastard', 'whore', 'slut', 'dick', 'cock',
  'pussy', 'twat', 'wanker', 'prick',
];

function censorText(text: string): string {
  let out = text;
  for (const word of BAD_WORDS) {
    const re = new RegExp(`\\b${word}\\b`, 'gi');
    out = out.replace(re, '*'.repeat(word.length));
  }
  return out;
}

// ─── SSE subscriber registry ─────────────────────────────────────────────────
type Subscriber = {
  channel: ChatChannel;
  send: (msg: ChatMessage) => void;
  close: () => void;
};

const subscribers = new Set<Subscriber>();

function broadcast(channel: ChatChannel, msg: ChatMessage) {
  for (const sub of subscribers) {
    if (sub.channel === channel) {
      try { sub.send(msg); } catch { subscribers.delete(sub); }
    }
  }
}

// ─── Message store ────────────────────────────────────────────────────────────
const channels = new Map<ChatChannel, ChatMessage[]>();

function getChannel(channel: ChatChannel): ChatMessage[] {
  if (!channels.has(channel)) channels.set(channel, []);
  return channels.get(channel)!;
}

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const chatStore = {
  // ── Subscribe to a channel via SSE ──────────────────────────────────────
  subscribe(channel: ChatChannel, send: (msg: ChatMessage) => void, close: () => void): () => void {
    const sub: Subscriber = { channel, send, close };
    subscribers.add(sub);
    return () => subscribers.delete(sub);
  },

  // ── Get recent history ───────────────────────────────────────────────────
  getHistory(channel: ChatChannel, limit = 50): ChatMessage[] {
    return getChannel(channel).slice(-limit);
  },

  // ── Post a message ───────────────────────────────────────────────────────
  post(opts: {
    channel: ChatChannel;
    username: string;
    countryCode: string;
    text: string;
    isCurator?: boolean;
  }): ChatMessage | { error: string } {
    const raw = opts.text.trim();
    if (!raw) return { error: 'Empty message' };
    if (raw.length > MAX_MESSAGE_LENGTH) return { error: `Max ${MAX_MESSAGE_LENGTH} characters` };

    const text = opts.isCurator ? raw : censorText(raw);

    const msg: ChatMessage = {
      id: randomId(),
      channel: opts.channel,
      username: opts.username.slice(0, 32),
      countryCode: opts.countryCode || 'XX',
      text,
      ts: Date.now(),
      isCurator: !!opts.isCurator,
      reported: false,
    };

    const list = getChannel(opts.channel);
    list.push(msg);
    if (list.length > MAX_MESSAGES_PER_CHANNEL) list.splice(0, list.length - MAX_MESSAGES_PER_CHANNEL);

    broadcast(opts.channel, msg);
    return msg;
  },

  // ── Report a message ─────────────────────────────────────────────────────
  report(msgId: string): boolean {
    for (const list of channels.values()) {
      const msg = list.find((m) => m.id === msgId);
      if (msg) { msg.reported = true; return true; }
    }
    return false;
  },

  subscriberCount(): number {
    return subscribers.size;
  },
};
