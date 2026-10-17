/**
 * BuyWithUSGC
 *
 * A "Buy with USGC" button + flow for a single purchasable item.
 * Handles the full lifecycle: connect prompt → approve → confirm on-chain → grant.
 *
 * Props:
 *   treasuryAddress  — The Token Game's Solana treasury wallet
 *   priceUSGC        — Item price in USGC
 *   itemName         — Human-readable item name (shown in wallet popup)
 *   onSuccess        — Called with the confirmed tx signature after on-chain confirmation
 *   disabled         — Optionally disable the button externally
 */

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTienkoWallet, parseTienkoError } from '@/lib/tienko-wallet';

const REGISTER_URL = 'https://tienkowallet.io/register';
const SOLANA_EXPLORER = 'https://solscan.io/tx';

// Minimal on-chain confirmation poll — checks Solscan's public API
async function confirmTransaction(signature: string, maxAttempts = 20): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(
        `https://api.mainnet-beta.solana.com`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getSignatureStatuses',
            params: [[signature], { searchTransactionHistory: true }],
          }),
        },
      );
      const json = await res.json() as {
        result?: { value?: Array<{ confirmationStatus?: string } | null> };
      };
      const status = json?.result?.value?.[0];
      if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
        return true;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

type Phase = 'idle' | 'approving' | 'confirming' | 'success' | 'error';

interface Props {
  treasuryAddress: string;
  priceUSGC: number;
  itemName: string;
  onSuccess?: (signature: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function BuyWithUSGC({
  treasuryAddress,
  priceUSGC,
  itemName,
  onSuccess,
  disabled = false,
  className = '',
}: Props) {
  const { connected, usgcBalance, connect, buyWithUSGC, connecting } = useTienkoWallet();
  const [phase, setPhase] = useState<Phase>('idle');
  const [txSig, setTxSig] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<{ message: string; needsRegister: boolean } | null>(null);

  const hasEnoughBalance = usgcBalance !== null && usgcBalance >= priceUSGC;

  async function handleClick() {
    setErrorInfo(null);

    // Step 1: ensure connected
    if (!connected) {
      try {
        await connect();
      } catch (err) {
        setErrorInfo(parseTienkoError(err));
        setPhase('error');
        return;
      }
      // After connect, user can click again to purchase
      return;
    }

    // Step 2: approve in wallet popup
    setPhase('approving');
    let signature: string;
    try {
      signature = await buyWithUSGC(treasuryAddress, priceUSGC, itemName);
    } catch (err) {
      setErrorInfo(parseTienkoError(err));
      setPhase('error');
      return;
    }

    // Step 3: wait for on-chain confirmation before granting item
    setPhase('confirming');
    setTxSig(signature);
    const confirmed = await confirmTransaction(signature);
    if (!confirmed) {
      setErrorInfo({
        message: 'Transaction submitted but could not be confirmed. Check Solscan for status.',
        needsRegister: false,
      });
      setPhase('error');
      return;
    }

    // Step 4: grant item
    setPhase('success');
    onSuccess?.(signature);
  }

  function reset() {
    setPhase('idle');
    setTxSig(null);
    setErrorInfo(null);
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (phase === 'success' && txSig) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-accent font-semibold">
          <CheckCircle size={15} />
          Purchase confirmed!
        </div>
        <a
          href={`${SOLANA_EXPLORER}/${txSig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink size={11} />
          View on Solscan
        </a>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (phase === 'error' && errorInfo) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <span>
            {errorInfo.message}
            {errorInfo.needsRegister && (
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
            {txSig && (
              <>
                {' '}
                <a
                  href={`${SOLANA_EXPLORER}/${txSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-muted-foreground"
                >
                  View tx
                </a>
              </>
            )}
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={reset} className="w-fit text-xs">
          Try again
        </Button>
      </div>
    );
  }

  // ── In-flight ────────────────────────────────────────────────────────────
  const inFlight = phase === 'approving' || phase === 'confirming' || connecting;
  const label = !connected
    ? `Connect & Buy — ${priceUSGC.toLocaleString()} USGC`
    : phase === 'approving'
    ? 'Approve in wallet…'
    : phase === 'confirming'
    ? 'Confirming on-chain…'
    : `Buy with USGC — ${priceUSGC.toLocaleString()}`;

  const insufficientFunds = connected && usgcBalance !== null && !hasEnoughBalance;

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        onClick={handleClick}
        disabled={disabled || inFlight || insufficientFunds}
        className={`font-semibold gap-2 bg-accent/15 text-accent border border-accent/40 hover:bg-accent/25 ${className}`}
      >
        {inFlight && <Loader2 size={13} className="animate-spin" />}
        {label}
      </Button>
      {insufficientFunds && (
        <p className="text-xs text-destructive">
          Insufficient USGC balance ({usgcBalance?.toLocaleString()} / {priceUSGC.toLocaleString()} needed)
        </p>
      )}
    </div>
  );
}
