import { useState, useEffect, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import AdminLayout from '@/layouts/AdminLayout';
import { CheckCircle, XCircle, Search, RefreshCw, ExternalLink, Upload, AlertTriangle, Copy, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoinRow {
  ticker: string;
  name: string;
  pumpUrl: string;
  status: string;
  hasMint: boolean;
  mintAddress: string | null;
}

interface Summary {
  total: number;
  missing: number;
  live: number;
}

interface EditionOption {
  id: string;
  label: string;
}

type Filter = 'all' | 'missing' | 'live';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function isValidSolana(addr: string) {
  return SOLANA_RE.test(addr.trim());
}

// ─── Bulk paste parser ────────────────────────────────────────────────────────
// Accepts lines like:
//   $TICKER  <mintAddress>
//   TICKER: <mintAddress>
//   $TICKER,<mintAddress>
//   <mintAddress>  $TICKER
function parseBulkPaste(text: string): Array<{ ticker: string; mintAddress: string }> {
  const results: Array<{ ticker: string; mintAddress: string }> = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    // Try comma/tab/space separated
    const parts = line.split(/[\t,\s]+/).filter(Boolean);
    if (parts.length < 2) continue;
    // Find which part looks like a ticker ($XXX or XXX) and which is a Solana address
    let ticker = '';
    let mintAddress = '';
    for (const p of parts) {
      if (isValidSolana(p)) {
        mintAddress = p.trim();
      } else if (p.startsWith('$') || /^[A-Z0-9]{2,10}$/.test(p.replace(/[^A-Z0-9]/g, ''))) {
        ticker = p.startsWith('$') ? p : `$${p}`;
      }
    }
    if (ticker && mintAddress) results.push({ ticker: ticker.toUpperCase(), mintAddress });
  }
  return results;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PumpAddressesAdmin() {
  // Auth is now handled by AdminLayout / ProtectedRoute.
  // We still pass the NEBULA_SECRET_KEY via a server-side relay so the
  // existing API endpoints keep working without exposing the key to the client.
  const secret = '__relay__'; // placeholder — actual header injected by fetchCoins
  const authed = true;
  const authError = '';

  const [coins, setCoins] = useState<CoinRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState<Filter>('missing');
  const [edition, setEdition] = useState('');
  const [editions, setEditions] = useState<EditionOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Per-row edit state
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  // Bulk paste
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkParsed, setBulkParsed] = useState<Array<{ ticker: string; mintAddress: string }>>([]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ applied: string[]; notFound: string[] } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchCoins = useCallback(async (_sec: string, f: Filter, q: string, ed: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ path: 'pump-addresses', filter: f });
      if (q)  params.set('q', q);
      if (ed) params.set('edition', ed);
      const res = await fetch(`/api/admin/relay?${params}`);
      if (res.status === 401) { setError('Unauthorized.'); return; }
      if (!res.ok) { setError(`Server error: ${res.status}`); return; }
      const data = await res.json();
      setCoins(data.coins ?? []);
      setSummary(data.summary ?? null);
      if (data.editions && editions.length === 0) setEditions(data.editions);
    } catch (e) {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  }, [editions.length]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  // Auth is now handled by ProtectedRoute in AdminLayout — no manual gate needed.

  // ── Re-fetch on filter/search/edition change ──────────────────────────────

  useEffect(() => {
    const t = setTimeout(() => fetchCoins(secret, filter, search, edition), 300);
    return () => clearTimeout(t);
  }, [filter, search, edition, fetchCoins, secret]);

  // ── Per-row save ───────────────────────────────────────────────────────────

  async function saveRow(ticker: string) {
    const mintAddress = (edits[ticker] ?? '').trim();
    if (!mintAddress) { setRowErrors((p) => ({ ...p, [ticker]: 'Enter a mint address' })); return; }
    if (!isValidSolana(mintAddress)) { setRowErrors((p) => ({ ...p, [ticker]: 'Invalid Solana address' })); return; }
    setRowErrors((p) => ({ ...p, [ticker]: '' }));
    setSaving((p) => ({ ...p, [ticker]: true }));
    try {
      const res = await fetch('/api/admin/relay?path=pump-addresses', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ updates: [{ ticker, mintAddress }] }),
      });
      const data = await res.json();
      if (data.applied?.includes(ticker)) {
        setSaved((p) => ({ ...p, [ticker]: true }));
        setTimeout(() => setSaved((p) => ({ ...p, [ticker]: false })), 3000);
        // Update local state
        setCoins((prev) => prev.map((c) =>
          c.ticker === ticker
            ? { ...c, hasMint: true, mintAddress, pumpUrl: `https://raydium.io/swap/?inputMint=sol&outputMint=${mintAddress}` }
            : c
        ));
        setSummary((prev) => prev ? { ...prev, missing: prev.missing - 1, live: prev.live + 1 } : prev);
        setEdits((p) => { const n = { ...p }; delete n[ticker]; return n; });
      } else {
        setRowErrors((p) => ({ ...p, [ticker]: data.notFound?.[0] ?? 'Update failed' }));
      }
    } catch {
      setRowErrors((p) => ({ ...p, [ticker]: 'Network error' }));
    } finally {
      setSaving((p) => ({ ...p, [ticker]: false }));
    }
  }

  // ── Bulk paste ─────────────────────────────────────────────────────────────

  function handleBulkChange(text: string) {
    setBulkText(text);
    setBulkParsed(parseBulkPaste(text));
    setBulkResult(null);
  }

  async function saveBulk() {
    if (bulkParsed.length === 0) return;
    setBulkSaving(true);
    setBulkResult(null);
    try {
      const res = await fetch('/api/admin/relay?path=pump-addresses', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ updates: bulkParsed }),
      });
      const data = await res.json();
      setBulkResult({ applied: data.applied ?? [], notFound: data.notFound ?? [] });
      if ((data.applied ?? []).length > 0) {
        // Refresh the list
        await fetchCoins(secret, filter, search, edition);
        setBulkText('');
        setBulkParsed([]);
      }
    } catch {
      setBulkResult({ applied: [], notFound: ['Network error'] });
    } finally {
      setBulkSaving(false);
    }
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────

  const missingPct = summary ? Math.round((summary.missing / summary.total) * 100) : 0;
  const livePct    = summary ? Math.round((summary.live    / summary.total) * 100) : 0;

  return (
    <AdminLayout title="Coin Addresses">
      <Helmet>
        <title>Raydium Addresses Admin — Token Game</title>
        <meta name="description" content="Admin dashboard for managing Raydium mint addresses." />
        <link rel="canonical" href="https://thetokengame.xyz/admin/pump-addresses" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-foreground p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="sr-only">Raydium Address Manager</h1>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-3xl font-bold text-foreground">{summary.total}</div>
              <div className="text-sm text-muted-foreground mt-1">Total coins</div>
            </div>
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
              <div className="text-3xl font-bold text-destructive">{summary.missing}</div>
              <div className="text-sm text-muted-foreground mt-1">Missing mint address <span className="text-destructive font-medium">({missingPct}%)</span></div>
            </div>
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
              <div className="text-3xl font-bold text-green-400">{summary.live}</div>
              <div className="text-sm text-muted-foreground mt-1">Live on Raydium <span className="text-green-400 font-medium">({livePct}%)</span></div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {summary && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall completion</span>
              <span className="font-semibold">{livePct}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${livePct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{summary.live} addressed</span>
              <span>{summary.missing} remaining</span>
            </div>
          </div>
        )}

        {/* Bulk paste panel */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setBulkOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Bulk paste addresses</div>
                <div className="text-xs text-muted-foreground">Paste multiple ticker + address pairs at once</div>
              </div>
            </div>
            {bulkOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {bulkOpen && (
            <div className="border-t border-border p-5 space-y-4">
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="font-medium text-foreground">Accepted formats (one per line):</p>
                <p><code className="text-primary">$TICKER  mintAddress</code></p>
                <p><code className="text-primary">$TICKER, mintAddress</code></p>
                <p><code className="text-primary">TICKER: mintAddress</code></p>
              </div>
              <textarea
                rows={8}
                placeholder={"$DETOX  7S6AtpUs4b8oX3jz1Szs1Zm4biW7szEwFKJu2NqVpump\n$JANEND  AuDUQ88rH343wvE7DZ6d9mmqh1iidTVis6ERoR3Vpump\n..."}
                value={bulkText}
                onChange={(e) => handleBulkChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
              {bulkParsed.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Parsed <span className="text-foreground font-semibold">{bulkParsed.length}</span> valid entries:
                  <span className="ml-2 text-xs text-primary">{bulkParsed.slice(0, 5).map((p) => p.ticker).join(', ')}{bulkParsed.length > 5 ? ` +${bulkParsed.length - 5} more` : ''}</span>
                </div>
              )}
              {bulkResult && (
                <div className={`rounded-xl p-4 text-sm space-y-1 ${bulkResult.applied.length > 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                  {bulkResult.applied.length > 0 && (
                    <p className="text-green-400 font-medium">✓ Applied: {bulkResult.applied.join(', ')}</p>
                  )}
                  {bulkResult.notFound.length > 0 && (
                    <p className="text-destructive">✗ Skipped: {bulkResult.notFound.join(', ')}</p>
                  )}
                </div>
              )}
              <button
                onClick={saveBulk}
                disabled={bulkParsed.length === 0 || bulkSaving}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {bulkSaving ? 'Saving…' : `Save ${bulkParsed.length} address${bulkParsed.length !== 1 ? 'es' : ''}`}
              </button>
            </div>
          )}
        </div>

        {/* Filter + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Edition dropdown */}
          <select
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All editions</option>
            {editions.map((ed) => (
              <option key={ed.id} value={ed.id}>{ed.label}</option>
            ))}
          </select>

          <div className="flex rounded-xl border border-border bg-card overflow-hidden">
            {(['missing', 'live', 'all'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {f}
                {summary && f === 'missing' && <span className="ml-1.5 text-xs opacity-70">({summary.missing})</span>}
                {summary && f === 'live'    && <span className="ml-1.5 text-xs opacity-70">({summary.live})</span>}
                {summary && f === 'all'     && <span className="ml-1.5 text-xs opacity-70">({summary.total})</span>}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ticker or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Coin table */}
        {loading && coins.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">Loading…</div>
        ) : coins.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {filter === 'missing' ? '🎉 All coins have mint addresses!' : 'No coins found.'}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium w-8">#</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Ticker</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium min-w-[320px]">Mint Address</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin, idx) => (
                    <CoinRow
                      key={coin.ticker}
                      idx={idx + 1}
                      coin={coin}
                      editValue={edits[coin.ticker] ?? ''}
                      onEditChange={(v) => setEdits((p) => ({ ...p, [coin.ticker]: v }))}
                      onSave={() => saveRow(coin.ticker)}
                      saving={saving[coin.ticker] ?? false}
                      savedOk={saved[coin.ticker] ?? false}
                      rowError={rowErrors[coin.ticker] ?? ''}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              Showing {coins.length} coin{coins.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ─── CoinRow sub-component ────────────────────────────────────────────────────

function CoinRow({
  idx, coin, editValue, onEditChange, onSave, saving, savedOk, rowError,
}: {
  idx: number;
  coin: CoinRow;
  editValue: string;
  onEditChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  savedOk: boolean;
  rowError: string;
}) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    if (!coin.mintAddress) return;
    navigator.clipboard.writeText(coin.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <tr className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${savedOk ? 'bg-green-500/5' : ''}`}>
      <td className="px-4 py-3 text-muted-foreground">{idx}</td>
      <td className="px-4 py-3">
        <span className="font-mono font-semibold text-primary">{coin.ticker}</span>
      </td>
      <td className="px-4 py-3 text-foreground">{coin.name}</td>
      <td className="px-4 py-3">
        {coin.hasMint ? (
          <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-destructive text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" /> missing
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {coin.hasMint ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground truncate max-w-[220px]">{coin.mintAddress}</span>
            <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" title="Copy address">
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-xs text-green-400">Copied!</span>}
          </div>
        ) : (
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Paste Solana mint address…"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
              className={`w-full px-3 py-1.5 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary ${
                rowError ? 'border-destructive' : 'border-border'
              }`}
            />
            {rowError && <p className="text-destructive text-xs">{rowError}</p>}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {coin.hasMint ? (
            <a
              href={coin.pumpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Raydium <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <button
              onClick={onSave}
              disabled={saving || !editValue.trim()}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? '…' : savedOk ? '✓ Saved' : 'Save'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
