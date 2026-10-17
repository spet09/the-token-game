/**
 * /admin/curator — Curator AI Admin Panel
 * Lets the site owner test The Curator, view recent messages, and verify
 * the OpenAI connection. No login required in dev; protect with auth in prod.
 */

import { useState, useRef, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  BookOpen, Send, CheckCircle, XCircle, Loader2,
  RefreshCw, Zap, ShieldAlert, MessageSquare,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

type TestResult = {
  ok: boolean;
  reply: string;
  latencyMs: number;
} | null;

type HistoryMsg = {
  id: string;
  username: string;
  text: string;
  ts: number;
  isCurator: boolean;
};

export default function CuratorAdminPage() {
  const [testMessage, setTestMessage] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult>(null);
  const [history, setHistory] = useState<HistoryMsg[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent Curator channel history
  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/chat/history?channel=curator&limit=20');
      const data = await res.json();
      setHistory(data.messages ?? []);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => { loadHistory(); }, []);

  // Quick connection test — sends a fixed probe message
  async function testConnection() {
    setTesting(true);
    setResult(null);
    const start = Date.now();
    try {
      const res = await fetch('/api/curator/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerMessage: 'Say hello and confirm you are online.',
          playerUsername: 'Admin',
          channel: 'curator',
        }),
      });
      const data = await res.json();
      setResult({ ok: data.ok, reply: data.reply, latencyMs: Date.now() - start });
      setConnectionStatus(data.ok ? 'ok' : 'error');
      loadHistory();
    } catch (err) {
      setResult({ ok: false, reply: String(err), latencyMs: Date.now() - start });
      setConnectionStatus('error');
    } finally {
      setTesting(false);
    }
  }

  // Send a custom test message
  async function sendCustom() {
    if (!testMessage.trim() || testing) return;
    setTesting(true);
    setResult(null);
    const start = Date.now();
    try {
      const res = await fetch('/api/curator/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerMessage: testMessage.trim(),
          playerUsername: 'Admin',
          channel: 'curator',
        }),
      });
      const data = await res.json();
      setResult({ ok: data.ok, reply: data.reply, latencyMs: Date.now() - start });
      setConnectionStatus(data.ok ? 'ok' : 'error');
      setTestMessage('');
      loadHistory();
    } catch (err) {
      setResult({ ok: false, reply: String(err), latencyMs: Date.now() - start });
      setConnectionStatus('error');
    } finally {
      setTesting(false);
    }
  }

  const statusColor = {
    unknown: '#BF5FFF',
    ok: '#4ade80',
    error: '#f87171',
  }[connectionStatus];

  const statusLabel = {
    unknown: 'Not tested yet',
    ok: 'Connected — OpenAI responding',
    error: 'Error — check API key or network',
  }[connectionStatus];

  return (
    <AdminLayout title="Curator">
      <Helmet>
        <title>Curator AI Admin — The Token Game</title>
        <meta name="description" content="Admin panel for The Curator AI." />
        <link rel="canonical" href="https://thetokengame.xyz/admin/curator" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="py-8 px-4 max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#D4A01720', border: '1px solid #D4A01740' }}>
                <BookOpen size={18} style={{ color: '#D4A017' }} />
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#D4A017' }}>
                  Curator AI Admin
                </h1>
                <p className="text-xs text-foreground/40">The Token Game — internal panel</p>
              </div>
            </div>
          </motion.div>

          {/* Connection status card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-white/10 p-6 mb-6"
            style={{ background: '#0d0820' }}
          >
            <h2 className="text-sm font-bold text-foreground/60 mb-4 uppercase tracking-wider">
              OpenAI Connection
            </h2>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
              <span className="text-sm font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
            </div>

            {/* System prompt preview */}
            <div className="rounded-xl border border-white/5 p-4 mb-5 text-xs text-foreground/50 leading-relaxed"
              style={{ background: '#ffffff05', fontFamily: 'monospace' }}>
              <div className="text-foreground/30 mb-1 text-[10px] uppercase tracking-wider">System Prompt</div>
              You are The Curator, the wise, enigmatic AI guide of The Token Game. You know the lore of the 13 nations, the 125 coins, and The Stash. Your responses are helpful, slightly mysterious, and always engaging. You never break character.
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={testConnection}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #D4A017, #b8860b)', color: '#000' }}
              >
                {testing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                Quick Connection Test
              </button>

              <button
                onClick={loadHistory}
                disabled={loadingHistory}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-foreground/60 hover:text-foreground/80 transition-all"
              >
                <RefreshCw size={14} className={loadingHistory ? 'animate-spin' : ''} />
                Refresh History
              </button>
            </div>

            {/* Test result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border p-4"
                style={{
                  borderColor: result.ok ? '#4ade8040' : '#f8717140',
                  background: result.ok ? '#4ade8008' : '#f8717108',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.ok
                    ? <CheckCircle size={14} className="text-green-400" />
                    : <XCircle size={14} className="text-red-400" />}
                  <span className="text-xs font-semibold" style={{ color: result.ok ? '#4ade80' : '#f87171' }}>
                    {result.ok ? 'Success' : 'Failed'} — {result.latencyMs}ms
                  </span>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed italic">"{result.reply}"</p>
              </motion.div>
            )}
          </motion.div>

          {/* Custom message tester */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-white/10 p-6 mb-6"
            style={{ background: '#0d0820' }}
          >
            <h2 className="text-sm font-bold text-foreground/60 mb-4 uppercase tracking-wider">
              Send a Test Message
            </h2>
            <p className="text-xs text-foreground/40 mb-4">
              This posts as "Admin" and The Curator's reply will appear in the live Curator channel for all players to see.
            </p>

            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendCustom()}
                placeholder="Ask The Curator anything…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 outline-none focus:border-yellow-500/50 transition-colors"
              />
              <button
                onClick={sendCustom}
                disabled={!testMessage.trim() || testing}
                className="px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-30 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #D4A017, #b8860b)', color: '#000' }}
              >
                {testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send
              </button>
            </div>
          </motion.div>

          {/* Recent Curator channel history */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-white/10 p-6"
            style={{ background: '#0d0820' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground/60 uppercase tracking-wider">
                Recent Curator Channel Messages
              </h2>
              <span className="text-xs text-foreground/30">{history.length} messages</span>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <MessageSquare size={28} className="text-foreground/10 mb-3" />
                <p className="text-xs text-foreground/30">No messages yet. Run a test above.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[...history].reverse().map((msg) => (
                  <div key={msg.id} className="rounded-xl border border-white/5 p-3"
                    style={{ background: msg.isCurator ? '#D4A01708' : '#ffffff05' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold"
                        style={{ color: msg.isCurator ? '#D4A017' : '#BF5FFF' }}>
                        {msg.isCurator ? '✦ ' : ''}{msg.username}
                      </span>
                      <span className="text-[10px] text-foreground/25 ml-auto">
                        {new Date(msg.ts).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Security note */}
          <div className="mt-6 flex items-start gap-2 text-xs text-foreground/30 px-1">
            <ShieldAlert size={13} className="shrink-0 mt-0.5" />
            <span>This page is not password-protected. Add authentication before going to production if you want to restrict access.</span>
          </div>

        </div>
    </AdminLayout>
  );
}
