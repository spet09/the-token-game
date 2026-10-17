import { useState, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { CheckCircle, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { GLOBAL_SEASONAL_IMAGES } from '@/data/editionCoins';
import { SEASONAL_YEAR_ONE, YEAR_TWO_GROUPS, FINALE_COINS } from '@/data/coins';
import AdminLayout from '@/layouts/AdminLayout';

// ─── Build the full ordered list of Global seasonal coins ─────────────────────
type CoinEntry = { ticker: string; name: string; slotPath: string; group: string };

function buildGlobalCoinList(): CoinEntry[] {
  const entries: CoinEntry[] = [];

  // Year 1
  for (const group of SEASONAL_YEAR_ONE) {
    for (const coin of group.coins) {
      const key = coin.ticker.replace('$', '');
      const slotPath = GLOBAL_SEASONAL_IMAGES[key] ?? `/airo-assets/images/coins/global/${key.toLowerCase()}`;
      entries.push({ ticker: coin.ticker, name: coin.name, slotPath, group: `${group.label} — Year 1` });
    }
  }

  // Finale Year 1
  for (const coin of FINALE_COINS) {
    const key = coin.ticker.replace('$', '');
    const slotPath = GLOBAL_SEASONAL_IMAGES[key] ?? `/airo-assets/images/coins/global/${key.toLowerCase()}`;
    entries.push({ ticker: coin.ticker, name: coin.name, slotPath, group: 'Finale — Year 1' });
  }

  // Year 2
  for (const group of YEAR_TWO_GROUPS) {
    for (const coin of group.coins) {
      const key = coin.ticker.replace('$', '');
      const slotPath = GLOBAL_SEASONAL_IMAGES[key] ?? `/airo-assets/images/coins/global/${key.toLowerCase()}`;
      entries.push({ ticker: coin.ticker, name: coin.name, slotPath, group: `${group.label} — Year 2` });
    }
  }

  return entries;
}

const ALL_COINS = buildGlobalCoinList();

// ─── Single coin upload row ───────────────────────────────────────────────────
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

function CoinRow({ coin }: { coin: CoinEntry }) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus('uploading');
    setErrorMsg('');

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    // Extract the slot portion from the full slot path
    // coin.slotPath is like /airo-assets/images/coins/global/irs
    // API expects slot like coins/global/irs
    const slotMatch = coin.slotPath.match(/\/coins\/(.+)$/);
    const slot = slotMatch ? `coins/${slotMatch[1]}` : '';

    if (!slot) {
      setStatus('error');
      setErrorMsg('Invalid slot path');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slot', slot);

      const res = await fetch('/api/upload-coin', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
      style={{
        borderColor: status === 'done' ? '#4ade8060' : status === 'error' ? '#f8717160' : '#BF5FFF30',
        background: status === 'done' ? '#4ade8008' : status === 'error' ? '#f8717108' : 'rgba(255,255,255,0.02)',
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Preview / placeholder */}
      <div
        className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-mono"
        style={{ background: '#0a0a12', border: '1px solid #BF5FFF30' }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={coin.name} className="w-full h-full object-cover" />
        ) : (
          <span style={{ color: '#BF5FFF60', fontSize: '9px' }}>{coin.ticker.replace('$', '')}</span>
        )}
      </div>

      {/* Coin info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-mono" style={{ color: '#BF5FFF' }}>{coin.ticker}</p>
        <p className="text-xs text-white/40 truncate">{coin.name}</p>
        <p className="text-[10px] text-white/20 truncate font-mono">{coin.slotPath}</p>
      </div>

      {/* Status / action */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {status === 'uploading' && (
          <Loader2 size={18} className="animate-spin" style={{ color: '#BF5FFF' }} />
        )}
        {status === 'done' && (
          <CheckCircle size={18} style={{ color: '#4ade80' }} />
        )}
        {status === 'error' && (
          <div className="flex items-center gap-1">
            <AlertCircle size={16} style={{ color: '#f87171' }} />
            <span className="text-xs" style={{ color: '#f87171' }}>{errorMsg}</span>
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={status === 'uploading'}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ background: status === 'done' ? '#4ade8030' : '#BF5FFF30', color: status === 'done' ? '#4ade80' : '#BF5FFF', border: `1px solid ${status === 'done' ? '#4ade8060' : '#BF5FFF60'}` }}
        >
          <Upload size={12} />
          {status === 'done' ? 'Replace' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GlobalUploadPage() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');

  // Get unique groups in order
  const groups = ['all', ...Array.from(new Set(ALL_COINS.map((c) => c.group)))];

  const filtered = ALL_COINS.filter((c) => {
    const matchesSearch =
      !search ||
      c.ticker.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = activeGroup === 'all' || c.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  // Group filtered coins by their group label
  const grouped = filtered.reduce<Record<string, CoinEntry[]>>((acc, coin) => {
    if (!acc[coin.group]) acc[coin.group] = [];
    acc[coin.group].push(coin);
    return acc;
  }, {});

  return (
    <AdminLayout title="Global Upload">
      <Helmet>
        <title>Global Upload — Admin</title>
        <meta name="description" content="Admin tool for uploading global coin images." />
        <link rel="canonical" href="https://thetokengame.xyz/admin/global-upload" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-mono mb-1" style={{ color: '#BF5FFF80' }}>ADMIN</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#BF5FFF', fontFamily: 'var(--font-heading)' }}>
              Global Edition — Image Upload
            </h1>
            <p className="text-white/40 text-sm">
              Upload pixel-art PNGs for each Global seasonal coin. Drag & drop or click Upload on any row.
              Images save directly to the slot — no renaming needed.
            </p>
            <div className="mt-3 text-xs font-mono" style={{ color: '#BF5FFF60' }}>
              {ALL_COINS.length} coins total
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-white/5 border text-white placeholder-white/30 outline-none focus:border-purple-500"
              style={{ borderColor: '#BF5FFF40' }}
            />
            <select
              value={activeGroup}
              onChange={(e) => setActiveGroup(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm bg-white/5 border text-white outline-none focus:border-purple-500"
              style={{ borderColor: '#BF5FFF40', background: '#1a0f2e' }}
            >
              {groups.map((g) => (
                <option key={g} value={g} style={{ background: '#1a0f2e' }}>
                  {g === 'all' ? 'All Groups' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Coin list grouped */}
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([groupLabel, coins]) => (
              <div key={groupLabel}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#BF5FFF', boxShadow: '0 0 8px #BF5FFF' }} />
                  <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: '#BF5FFF', fontFamily: 'var(--font-heading)' }}>
                    {groupLabel}
                  </h2>
                  <div className="h-px flex-1" style={{ background: '#BF5FFF20' }} />
                  <span className="text-xs" style={{ color: '#BF5FFF40' }}>{coins.length} coins</span>
                </div>
                <div className="flex flex-col gap-2">
                  {coins.map((coin) => (
                    <CoinRow key={coin.ticker} coin={coin} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              No coins match your search.
            </div>
          )}

        </div>
    </AdminLayout>
  );
}
