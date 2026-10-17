/**
 * /whitelist — Wallet Whitelist Registration Page
 *
 * Players register their Solana wallet address to gain early access
 * to initial coin sales. Approved wallets can mint during the 1-hour
 * whitelist window before coins open to the public.
 */

import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useWallet } from '@/lib/wallet';

type RegistrationStatus = 'idle' | 'loading' | 'success' | 'error' | 'already_registered';
type WhitelistStatus = 'pending' | 'approved' | 'rejected' | null;

export default function WhitelistPage() {
  const { publicKey, connected, connect } = useWallet();

  const [status, setStatus] = useState<RegistrationStatus>('idle');
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [registeredAt, setRegisteredAt] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Auto-check status when wallet connects
  useEffect(() => {
    if (!connected || !publicKey) return;
    checkWalletStatus(publicKey);
  }, [connected, publicKey]);

  async function checkWalletStatus(address: string) {
    setCheckingStatus(true);
    try {
      const res = await fetch(`/api/whitelist/status?wallet=${encodeURIComponent(address)}`);
      if (res.status === 404) {
        setWhitelistStatus(null);
        return;
      }
      const data = await res.json();
      if (data.registered) {
        setWhitelistStatus(data.status);
        setRegisteredAt(data.registeredAt);
        setStatus('already_registered');
      }
    } catch {
      // silently ignore status check errors
    } finally {
      setCheckingStatus(false);
    }
  }

  async function handleRegister() {
    if (!connected || !publicKey) return;
    const address = publicKey;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/whitelist/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setWhitelistStatus(data.status);
        setRegisteredAt(data.registeredAt);
        setStatus('already_registered');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? 'Registration failed');
      }

      setWhitelistStatus('pending');
      setRegisteredAt(data.entry?.registeredAt ?? new Date().toISOString());
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  }

  const statusConfig: Record<
    NonNullable<WhitelistStatus>,
    { label: string; color: string; bg: string; border: string; icon: string; desc: string }
  > = {
    pending: {
      label: 'Pending Review',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      icon: '⏳',
      desc: 'Your wallet is in the queue. Admin review typically takes 24–48 hours.',
    },
    approved: {
      label: 'Approved',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
      icon: '✓',
      desc: 'Your wallet is approved. You can participate in initial coin sales.',
    },
    rejected: {
      label: 'Rejected',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      icon: '✕',
      desc: 'Your wallet was not approved for this round. Contact support for more information.',
    },
  };

  return (
    <>
      <Helmet>
        <title>Whitelist Registration — The Token Game</title>
        <meta
          name="description"
          content="Register your Solana wallet for early access to The Token Game coin sales. Approved wallets get a 1-hour head start before coins open to the public."
        />
        <link rel="canonical" href="https://thetokengame.xyz/whitelist" />
        <meta property="og:title" content="Whitelist Registration — The Token Game" />
        <meta property="og:description" content="Register your Solana wallet for early access to The Token Game coin sales." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/whitelist" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Whitelist Registration — The Token Game" />
        <meta name="twitter:description" content="Register your Solana wallet for early access to The Token Game coin sales." />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://thetokengame.xyz/whitelist#webpage',
          name: 'Whitelist Registration — The Token Game',
          url: 'https://thetokengame.xyz/whitelist',
          description: 'Register your Solana wallet for early access to The Token Game coin sales.',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a1a] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(191,95,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(191,95,255,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BF5FFF]/10 border border-[#BF5FFF]/30 text-[#BF5FFF] text-xs font-medium mb-6 uppercase tracking-widest">
              Early Access
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Whitelist{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF5FFF] to-[#ff5fef]">
                Registration
              </span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Register your wallet to get a{' '}
              <span className="text-[#BF5FFF] font-semibold">1-hour head start</span> on every new
              coin sale before it opens to the public.
            </p>
          </div>
        </section>

        {/* Why join — advantages */}
        <section className="max-w-3xl mx-auto px-6 pt-14 pb-2">
          <h2 className="text-2xl font-black text-white mb-2 text-center">
            Why Join the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF5FFF] to-[#ff5fef]">
              Whitelist?
            </span>
          </h2>
          <p className="text-white/50 text-center text-sm mb-8">
            Whitelisted wallets get real advantages — not just bragging rights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              {
                icon: '⏱',
                title: '1-Hour Early Access',
                desc: 'Mint any new coin a full hour before it opens to the public. Be first in — before the crowd drives up demand.',
                color: '#BF5FFF',
              },
              {
                icon: '💰',
                title: 'Lower Entry Price',
                desc: 'Early minting means you get in at the floor price. Public buyers always pay more once the market opens.',
                color: '#ff5fef',
              },
              {
                icon: '🏆',
                title: 'Stash Eligibility',
                desc: 'Whitelisted holders are eligible for The Stash — the monthly SOL distribution pool funded by a 1% fee on every transaction.',
                color: '#9fff5f',
              },
              {
                icon: '🌍',
                title: 'All 16 Editions',
                desc: 'Your whitelist approval covers every edition — Global, USA, Japan, Africa, and all 12 others. One registration, full access.',
                color: '#5fefff',
              },
              {
                icon: '🔒',
                title: 'Guaranteed Allocation',
                desc: 'Some coins have limited supply. Whitelisted wallets are guaranteed a mint slot during the early window — no competing with bots.',
                color: '#ffbf5f',
              },
              {
                icon: '⚡',
                title: 'Priority in Future Drops',
                desc: 'Approved wallets are automatically considered for special edition drops, seasonal events, and curator-curated releases.',
                color: '#BF5FFF',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/3 p-5 flex gap-4 items-start"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-white mb-1" style={{ color: item.color }}>
                    {item.title}
                  </div>
                  <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                step: '01',
                title: 'Register',
                desc: 'Connect your Solana wallet and submit your address for review.',
                color: '#BF5FFF',
              },
              {
                step: '02',
                title: 'Get Approved',
                desc: 'Admin reviews your wallet. Approval typically takes 24–48 hours.',
                color: '#ff5fef',
              },
              {
                step: '03',
                title: 'Mint Early',
                desc: 'Approved wallets get 1 hour of exclusive access before public sale.',
                color: '#9fff5f',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/10 bg-white/3 p-5 relative overflow-hidden"
              >
                <div
                  className="text-5xl font-black opacity-10 absolute top-3 right-4 leading-none"
                  style={{ color: item.color }}
                >
                  {item.step}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: item.color }}
                >
                  Step {item.step}
                </div>
                <div className="font-bold text-white mb-1">{item.title}</div>
                <div className="text-white/50 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Registration card */}
          <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#BF5FFF] animate-pulse" />
              <span className="text-sm font-semibold text-white/80">Wallet Registration</span>
            </div>

            <div className="p-6 md:p-8">
              {/* Not connected */}
              {!connected && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-4">🔐</div>
                  <p className="text-white/60 mb-6">
                    Connect your Solana wallet to register for the whitelist.
                  </p>
                  <button
                    onClick={() => connect()}
                    className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#BF5FFF] to-[#ff5fef] text-white hover:opacity-90 transition-opacity"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}

              {/* Connected — checking status */}
              {connected && checkingStatus && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-2 border-[#BF5FFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Checking whitelist status…</p>
                </div>
              )}

              {/* Connected — show wallet + status */}
              {connected && !checkingStatus && publicKey && (
                <div>
                  {/* Wallet address display */}
                  <div className="rounded-xl bg-black/30 border border-white/10 p-4 mb-6">
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">
                      Connected Wallet
                    </div>
                    <div className="font-mono text-sm text-white/80 break-all">
                      {publicKey}
                    </div>
                  </div>

                  {/* Current status badge */}
                  {whitelistStatus && (
                    <div
                      className={`rounded-xl border p-4 mb-6 ${statusConfig[whitelistStatus].bg} ${statusConfig[whitelistStatus].border}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{statusConfig[whitelistStatus].icon}</span>
                        <span
                          className={`font-bold ${statusConfig[whitelistStatus].color}`}
                        >
                          {statusConfig[whitelistStatus].label}
                        </span>
                        {registeredAt && (
                          <span className="text-white/30 text-xs ml-auto">
                            {new Date(registeredAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">
                        {statusConfig[whitelistStatus].desc}
                      </p>
                    </div>
                  )}

                  {/* Register button — only if not yet registered */}
                  {!whitelistStatus && (
                    <>
                      <p className="text-white/50 text-sm mb-6">
                        Your wallet is not yet registered. Submit it below to join the whitelist queue.
                      </p>
                      <button
                        onClick={handleRegister}
                        disabled={status === 'loading'}
                        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#BF5FFF] to-[#ff5fef] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Registering…
                          </>
                        ) : (
                          'Register for Whitelist'
                        )}
                      </button>
                    </>
                  )}

                  {/* Success message */}
                  {status === 'success' && (
                    <div className="mt-4 rounded-xl bg-green-400/10 border border-green-400/30 p-4 text-center">
                      <div className="text-green-400 font-bold mb-1">✓ Registration submitted!</div>
                      <p className="text-white/50 text-sm">
                        Your wallet is now pending review. Check back in 24–48 hours.
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {status === 'error' && (
                    <div className="mt-4 rounded-xl bg-red-400/10 border border-red-400/30 p-4">
                      <div className="text-red-400 font-bold mb-1">Registration failed</div>
                      <p className="text-white/50 text-sm">{errorMsg}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-10 space-y-4">
            <h2 className="text-lg font-bold text-white/80 mb-4">Frequently Asked Questions</h2>
            {[
              {
                q: 'What wallets are supported?',
                a: 'Phantom, Solflare, and Backpack — all Solana-compatible wallets.',
              },
              {
                q: 'How long does approval take?',
                a: 'Typically 24–48 hours. You can check your status anytime by reconnecting your wallet.',
              },
              {
                q: 'What happens after the 1-hour window?',
                a: 'The coin opens to all players. Whitelisted wallets have no special advantage after the cooldown expires.',
              },
              {
                q: 'Can I register multiple wallets?',
                a: 'Each wallet address is reviewed independently. Register each one separately.',
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-white/3 p-5"
              >
                <div className="font-semibold text-white/90 mb-1">{item.q}</div>
                <div className="text-white/50 text-sm">{item.a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
