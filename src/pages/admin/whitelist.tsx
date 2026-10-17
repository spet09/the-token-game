/**
 * /admin/whitelist — Whitelist Admin Panel
 *
 * View all registered wallets, approve or reject them,
 * and manage per-coin whitelist entries.
 */

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import AdminLayout from '@/layouts/AdminLayout';

interface WhitelistEntry {
  id: number;
  walletAddress: string;
  registeredAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  updatedAt: string | null;
}

interface Counts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminWhitelistPage() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/whitelist/admin' : `/api/whitelist/admin?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setEntries(data.entries ?? []);
      setCounts(data.counts ?? { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function updateStatus(walletAddress: string, status: 'approved' | 'rejected') {
    setActionLoading(walletAddress);
    try {
      const res = await fetch('/api/whitelist/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          status,
          notes: notesMap[walletAddress] ?? null,
        }),
      });
      if (res.ok) {
        await fetchEntries();
      }
    } finally {
      setActionLoading(null);
    }
  }

  const statusColors: Record<WhitelistEntry['status'], string> = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    approved: 'text-green-400 bg-green-400/10 border-green-400/30',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.total },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'approved', label: 'Approved', count: counts.approved },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
  ];

  return (
    <AdminLayout title="Whitelist">
      <Helmet>
        <title>Whitelist Admin — The Token Game</title>
        <meta name="description" content="Admin panel for managing wallet whitelist registrations on The Token Game." />
        <link rel="canonical" href="https://thetokengame.xyz/admin/whitelist" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="text-foreground p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#BF5FFF] animate-pulse" />
              <span className="text-xs text-[#BF5FFF] uppercase tracking-widest font-semibold">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">Whitelist Management</h1>
            <p className="text-white/40 mt-1 text-sm">
              Review and approve wallet registrations for early coin sale access.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: counts.total, color: '#BF5FFF' },
              { label: 'Pending', value: counts.pending, color: '#facc15' },
              { label: 'Approved', value: counts.approved, color: '#4ade80' },
              { label: 'Rejected', value: counts.rejected, color: '#f87171' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/3 p-4 text-center"
              >
                <div className="text-2xl font-black" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  filter === tab.key
                    ? 'bg-[#BF5FFF]/20 border-[#BF5FFF]/50 text-[#BF5FFF]'
                    : 'bg-white/3 border-white/10 text-white/50 hover:text-white/80'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-60">({tab.count})</span>
              </button>
            ))}
            <button
              onClick={fetchEntries}
              className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-white/50 hover:text-white/80 transition-all"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-[#BF5FFF] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <div className="text-4xl mb-3">📋</div>
                <p>No registrations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Wallet Address</th>
                      <th className="text-left px-5 py-3">Registered</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Notes</th>
                      <th className="text-right px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        {/* Wallet */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-white/70 break-all">
                            {entry.walletAddress.slice(0, 8)}…{entry.walletAddress.slice(-8)}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(entry.walletAddress)}
                            className="ml-2 text-white/20 hover:text-white/60 transition-colors text-xs"
                            title="Copy full address"
                          >
                            ⧉
                          </button>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-white/40 text-xs whitespace-nowrap">
                          {new Date(entry.registeredAt).toLocaleDateString()}{' '}
                          <span className="text-white/20">
                            {new Date(entry.registeredAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[entry.status]}`}
                          >
                            {entry.status}
                          </span>
                        </td>

                        {/* Notes input */}
                        <td className="px-5 py-4">
                          <input
                            type="text"
                            placeholder="Add note…"
                            value={notesMap[entry.walletAddress] ?? entry.notes ?? ''}
                            onChange={(e) =>
                              setNotesMap((prev) => ({
                                ...prev,
                                [entry.walletAddress]: e.target.value,
                              }))
                            }
                            className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 placeholder-white/20 focus:outline-none focus:border-[#BF5FFF]/50 w-36"
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            {entry.status !== 'approved' && (
                              <button
                                onClick={() => updateStatus(entry.walletAddress, 'approved')}
                                disabled={actionLoading === entry.walletAddress}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 transition-all disabled:opacity-50"
                              >
                                {actionLoading === entry.walletAddress ? '…' : 'Approve'}
                              </button>
                            )}
                            {entry.status !== 'rejected' && (
                              <button
                                onClick={() => updateStatus(entry.walletAddress, 'rejected')}
                                disabled={actionLoading === entry.walletAddress}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 transition-all disabled:opacity-50"
                              >
                                {actionLoading === entry.walletAddress ? '…' : 'Reject'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-white/20 text-xs mt-4 text-center">
            Approved wallets gain a 1-hour exclusive minting window on new coin sales.
          </p>
        </div>
    </AdminLayout>
  );
}
