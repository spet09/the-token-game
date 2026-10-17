/**
 * TienkoWalletButton
 *
 * A self-contained Connect / Connected button for the Tienko Wallet.
 * Shows the wallet address + live USGC balance when connected.
 * Handles the 4030 (needs registration) error with a visible link.
 */

import { useState } from 'react';
import { Wallet, LogOut, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTienkoWallet, parseTienkoError } from '@/lib/tienko-wallet';

const REGISTER_URL = 'https://tienkowallet.io/register';

interface Props {
  /** Extra className on the trigger button */
  className?: string;
  /** Size variant forwarded to shadcn Button */
  size?: 'sm' | 'default' | 'lg';
}

export default function TienkoWalletButton({ className = '', size = 'sm' }: Props) {
  const {
    sdkReady,
    connected,
    shortAddress,
    address,
    usgcBalance,
    balanceLoading,
    connecting,
    connect,
    disconnect,
    refreshBalance,
  } = useTienkoWallet();

  const [error, setError] = useState<{ message: string; needsRegister: boolean } | null>(null);

  async function handleConnect() {
    setError(null);
    try {
      await connect();
    } catch (err) {
      setError(parseTienkoError(err));
    }
  }

  // ── Connected state ──────────────────────────────────────────────────────
  if (connected && shortAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            className={`font-semibold gap-2 bg-accent/10 text-accent border border-accent/35 hover:bg-accent/20 ${className}`}
          >
            {/* Tienko "T" avatar */}
            <span className="w-5 h-5 rounded-full bg-accent/25 text-accent flex items-center justify-center text-[9px] font-bold shrink-0">
              T
            </span>
            <span className="font-mono">{shortAddress}</span>
            {usgcBalance !== null && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-mono bg-accent/15 text-accent/85">
                {balanceLoading ? '…' : `${usgcBalance.toLocaleString()} USGC`}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 bg-card border-border/20">
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                T
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground/70">Tienko Wallet</p>
                <p className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
                  {address}
                </p>
              </div>
            </div>

            {/* USGC balance row */}
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-accent/8">
              <span className="text-xs text-muted-foreground">USGC Balance</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold font-mono text-accent">
                  {balanceLoading
                    ? '…'
                    : usgcBalance !== null
                    ? usgcBalance.toLocaleString()
                    : '—'}
                </span>
                <button
                  onClick={refreshBalance}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Refresh USGC balance"
                >
                  <RefreshCw size={11} className={balanceLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-border/20" />

          <DropdownMenuItem asChild>
            <a
              href="https://tienkowallet.io"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground focus:text-foreground flex items-center"
            >
              <ExternalLink size={14} />
              Tienko Wallet Dashboard
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={disconnect}
            className="gap-2 cursor-pointer text-sm text-destructive hover:text-destructive/80 focus:text-destructive/80"
          >
            <LogOut size={14} />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // ── Disconnected / error state ───────────────────────────────────────────
  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size={size}
        onClick={handleConnect}
        disabled={connecting || !sdkReady}
        className={`font-semibold gap-2 bg-accent/15 text-accent border border-accent/40 hover:bg-accent/25 ${className}`}
        title={!sdkReady ? 'Tienko Wallet SDK loading…' : undefined}
      >
        <Wallet size={14} />
        {connecting ? 'Connecting…' : !sdkReady ? 'Loading…' : 'Connect Tienko'}
      </Button>

      {error && (
        <div className="text-xs text-right max-w-[220px] text-destructive">
          {error.message}
          {error.needsRegister && (
            <>
              {' '}
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-accent"
              >
                Register here
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
