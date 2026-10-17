import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Globe, Flag, BookOpen, Send, AlertTriangle, Wifi, WifiOff,
  MessageSquare, X, Maximize2, Minimize2, Zap,
} from 'lucide-react';
import { useChat, type ChatMessage, type ChatChannel } from '@/lib/useChat';

// ─── Nation colours (matches world-map) ──────────────────────────────────────
const NATION_COLORS: Record<string, string> = {
  AU: '#00C9FF', CN: '#FF4444', US: '#4488FF', GB: '#FF8844',
  IN: '#FF9933', JP: '#FF6688', RU: '#4444FF', BR: '#44FF88',
  ZA: '#FFDD44', DE: '#FF8800', FR: '#4466FF', IT: '#44CC44',
  ES: '#FF4400', MX: '#44AA44', AR: '#44AAFF', NG: '#008800',
  KR: '#FF4488', TR: '#FF2200',
};

function nationColor(code: string) {
  return NATION_COLORS[code] ?? '#BF5FFF';
}

// ─── Curator AI trigger ───────────────────────────────────────────────────────
// Fires when a player sends a message in the Curator channel (or @curator in Global/Nation).
async function triggerCuratorAI(opts: {
  playerMessage: string;
  playerUsername: string;
  channel: string;
}): Promise<void> {
  try {
    await fetch('/api/curator/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    });
    // Response is broadcast to all SSE subscribers automatically by the server
  } catch {
    // Silently ignore — fallback message is handled server-side
  }
}

// ─── Nebula AI trigger ────────────────────────────────────────────────────────
// Fires when a player sends a message in the Nebula channel.
async function triggerNebulaAI(opts: {
  playerMessage: string;
  playerUsername: string;
  walletAddress?: string;
}): Promise<void> {
  try {
    await fetch('/api/nebula/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    });
  } catch {
    // Silently ignore — fallback handled server-side
  }
}

// ─── Channels config ──────────────────────────────────────────────────────────
type ChannelDef = { id: ChatChannel; label: string; icon: React.ReactNode; readOnly?: boolean; aiEnabled?: boolean; isNebula?: boolean };

function getChannels(nationCode: string): ChannelDef[] {
  return [
    { id: 'global',   label: 'Global',  icon: <Globe size={13} /> },
    { id: nationCode, label: 'Nation',  icon: <Flag size={13} /> },
    { id: 'curator',  label: 'Curator', icon: <BookOpen size={13} />, aiEnabled: true },
    { id: 'nebula',   label: 'Nebula',  icon: <Zap size={13} />, aiEnabled: true, isNebula: true },
  ];
}

// ─── Timestamp formatter ──────────────────────────────────────────────────────
function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Single message row ───────────────────────────────────────────────────────
function MessageRow({
  msg,
  onReport,
}: {
  msg: ChatMessage;
  onReport: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [reported, setReported] = useState(msg.reported);

  function handleReport() {
    if (reported) return;
    setReported(true);
    onReport(msg.id);
  }

  const color = msg.isCurator
    ? (msg.username === 'Nebula' ? '#00D4FF' : '#D4A017')
    : nationColor(msg.countryCode);

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {msg.isCurator && (
        <div className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: `1px solid ${msg.username === 'Nebula' ? '#00D4FF30' : '#D4A01730'}`,
            background: msg.username === 'Nebula' ? '#00D4FF08' : '#D4A01708',
          }} />
      )}

      <div className="flex items-baseline gap-2 flex-wrap">
        {/* Username */}
        <span
          className="text-xs font-bold shrink-0"
          style={{ color, textShadow: msg.isCurator ? `0 0 8px ${color}60` : 'none' }}
        >
          {msg.isCurator && '✦ '}{msg.username}
        </span>
        {/* Country badge */}
        {msg.countryCode !== 'XX' && !msg.isCurator && (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ background: color + '20', color }}>
            {msg.countryCode}
          </span>
        )}
        {/* Timestamp */}
        <span className="text-[10px] text-foreground/25 ml-auto shrink-0">{formatTime(msg.ts)}</span>
      </div>

      {/* Message text */}
      <p className={`text-xs mt-0.5 leading-relaxed break-words ${reported ? 'opacity-30 italic' : 'text-foreground/75'}`}>
        {reported ? '[reported]' : msg.text}
      </p>

      {/* Report button — appears on hover, hidden for curator messages */}
      {!msg.isCurator && hovered && !reported && (
        <button
          onClick={handleReport}
          className="absolute top-2 right-2 p-1 rounded text-foreground/20 hover:text-orange-400 transition-colors"
          title="Report message"
          aria-label="Report message"
        >
          <AlertTriangle size={11} />
        </button>
      )}
    </motion.div>
  );
}

// ─── ChatPanel ────────────────────────────────────────────────────────────────
type Props = {
  username: string;
  countryCode: string;
  walletAddress?: string;
  onClose?: () => void;
};

export default function ChatPanel({ username, countryCode, walletAddress, onClose }: Props) {
  const channels = getChannels(countryCode);
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('global');
  const [inputText, setInputText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, connected, send, report } = useChat({
    channel: activeChannel,
    username,
    countryCode,
  });

  const activeDef = channels.find((c) => c.id === activeChannel) ?? channels[0];
  const isReadOnly = false; // Curator channel now accepts player questions
  const isAiChannel = activeDef.aiEnabled ?? false;
  const isNebulaChannel = activeDef.isNebula ?? false;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!collapsed) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, collapsed]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || sending || isReadOnly) return;
    setSending(true);
    setSendError(null);
    const msgText = inputText.trim();

    // Nebula channel — post player question then trigger Nebula AI
    if (isNebulaChannel) {
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'nebula',
          username,
          countryCode,
          text: msgText,
        }),
      });
      setInputText('');
      triggerNebulaAI({ playerMessage: msgText, playerUsername: username, walletAddress });
      setSending(false);
      return;
    }

    // For the Curator channel, post the player's question directly then trigger AI
    if (isAiChannel) {
      // Post player's question to the curator channel so others see it
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'curator',
          username,
          countryCode,
          text: msgText,
        }),
      });
      setInputText('');
      // Fire AI response (non-blocking — The Curator's reply arrives via SSE)
      triggerCuratorAI({ playerMessage: msgText, playerUsername: username, channel: 'curator' });
      setSending(false);
      return;
    }

    const result = await send(msgText);
    setSending(false);
    if (result.error) {
      setSendError(result.error);
    } else {
      setInputText('');

      // Also trigger Curator AI if player @mentions curator in Global/Nation
      if (msgText.toLowerCase().includes('@curator')) {
        triggerCuratorAI({ playerMessage: msgText, playerUsername: username, channel: 'curator' });
      }
      // Also trigger Nebula AI if player @mentions nebula in Global/Nation
      if (msgText.toLowerCase().includes('@nebula')) {
        triggerNebulaAI({ playerMessage: msgText, playerUsername: username, walletAddress });
      }
    }
  }, [inputText, sending, isReadOnly, isAiChannel, isNebulaChannel, send, username, countryCode, walletAddress]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="flex flex-col rounded-2xl overflow-hidden border border-white/10"
      style={{
        background: 'linear-gradient(160deg, #0a0718 0%, #0d0820 100%)',
        boxShadow: '0 0 40px #BF5FFF18',
        width: '100%',
        height: collapsed ? 'auto' : '520px',
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0"
        style={{ background: '#0d0820' }}
      >
        <MessageSquare size={14} style={{ color: '#BF5FFF' }} />
        <span className="text-sm font-bold text-foreground/80 flex-1">Live Chat</span>

        {/* Connection indicator */}
        <div className="flex items-center gap-1.5 text-[10px]">
          {connected
            ? <><Wifi size={10} className="text-green-400" /><span className="text-green-400/70">Live</span></>
            : <><WifiOff size={10} className="text-foreground/30" /><span className="text-foreground/30">Connecting…</span></>
          }
        </div>

        {/* Collapse / expand */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded text-foreground/30 hover:text-foreground/60 transition-colors"
          aria-label={collapsed ? 'Expand chat' : 'Collapse chat'}
        >
          {collapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-foreground/30 hover:text-foreground/60 transition-colors"
            aria-label="Close chat"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          {/* ── Channel tabs ── */}
          <div className="flex border-b border-white/10 shrink-0">
            {channels.map((ch) => {
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => { setActiveChannel(ch.id); setSendError(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all relative"
                  style={{
                    color: isActive
                      ? ch.isNebula ? '#00D4FF'
                        : ch.id === 'curator' ? '#D4A017'
                        : '#BF5FFF'
                      : 'rgba(255,255,255,0.35)',
                    background: isActive ? 'rgba(191,95,255,0.06)' : 'transparent',
                  }}
                >
                  {ch.icon}
                  {ch.label}
                  {ch.aiEnabled && (
                    <span className="text-[9px] px-1 rounded"
                      style={{
                        background: ch.isNebula ? '#00D4FF20' : '#D4A01720',
                        color: ch.isNebula ? '#00D4FF' : '#D4A017',
                      }}>
                      AI
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="chat-tab-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 rounded-full"
                      style={{
                        background: ch.isNebula ? '#00D4FF'
                          : ch.id === 'curator' ? '#D4A017'
                          : '#BF5FFF',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Channel description ── */}
          {activeChannel === 'curator' && (
            <div className="px-4 py-2 text-[10px] text-foreground/40 border-b border-white/5 shrink-0"
              style={{ background: '#D4A01708' }}>
              ✦ Ask The Curator anything — lore, coins, The Stash. Powered by AI.
            </div>
          )}
          {activeChannel === 'nebula' && (
            <div className="px-4 py-2 text-[10px] border-b border-white/5 shrink-0 flex items-center gap-1.5"
              style={{ background: '#00D4FF08', color: '#00D4FF80' }}>
              <Zap size={10} style={{ color: '#00D4FF' }} />
              Ask Nebula about wallets, tokens, prices &amp; on-chain data. Powered by Thirdweb.
            </div>
          )}
          {activeChannel !== 'global' && activeChannel !== 'curator' && activeChannel !== 'nebula' && (
            <div className="px-4 py-2 text-[10px] text-foreground/40 border-b border-white/5 shrink-0">
              Nation channel — {countryCode} players only
            </div>
          )}

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto py-2 min-h-0 scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#BF5FFF30 transparent' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
                <MessageSquare size={28} className="text-foreground/10 mb-3" />
                <p className="text-xs text-foreground/25">
                  {activeChannel === 'curator'
                    ? 'Ask The Curator a question — it knows the lore of all 13 nations.'
                    : activeChannel === 'nebula'
                    ? 'Ask Nebula about any wallet, token, or on-chain data on Solana.'
                    : 'No messages yet. Be the first to say something.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {messages.map((msg) => (
                  <MessageRow key={msg.id} msg={msg} onReport={report} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input ── */}
          <div className="shrink-0 border-t border-white/10 p-3">
            {sendError && (
              <p className="text-[10px] text-orange-400 mb-2 px-1">{sendError}</p>
            )}
            {isReadOnly ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 text-xs text-foreground/25"
                style={{ background: '#ffffff05' }}>
                <BookOpen size={12} />
                This channel is read-only
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isNebulaChannel ? 'Ask Nebula about wallets, tokens, prices…'
                    : isAiChannel ? 'Ask The Curator…'
                    : 'Say something…'
                  }
                  maxLength={280}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-foreground/25 outline-none focus:border-primary/50 transition-colors"
                  style={
                    isNebulaChannel ? { borderColor: '#00D4FF40' }
                    : isAiChannel ? { borderColor: '#D4A01740' }
                    : {}
                  }
                  aria-label="Chat message input"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || sending}
                  className="p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background: inputText.trim()
                      ? isNebulaChannel
                        ? 'linear-gradient(135deg, #00D4FF, #0099cc)'
                        : isAiChannel
                        ? 'linear-gradient(135deg, #D4A017, #b8860b)'
                        : 'linear-gradient(135deg, #BF5FFF, #9f3fff)'
                      : '#ffffff10',
                    boxShadow: inputText.trim()
                      ? isNebulaChannel ? '0 0 16px #00D4FF50'
                        : isAiChannel ? '0 0 16px #D4A01750'
                        : '0 0 16px #BF5FFF50'
                      : 'none',
                  }}
                  aria-label="Send message"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            )}
            {/* Character count */}
            {!isReadOnly && inputText.length > 200 && (
              <p className="text-[10px] text-foreground/30 mt-1 text-right">
                {280 - inputText.length} remaining
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
