import { ExternalLink, Wallet, X, Zap } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import type { WalletType } from '@/lib/wallet';

const WALLET_INFO: Record<
  WalletType,
  { description: string; color: string; bgColor: string }
> = {
  phantom: {
    description: 'The most popular Solana wallet',
    color: '#ab9ff2',
    bgColor: 'rgba(171,159,242,0.12)',
  },
  solflare: {
    description: 'Built for DeFi & NFTs on Solana',
    color: '#fc8c03',
    bgColor: 'rgba(252,140,3,0.12)',
  },
  backpack: {
    description: 'xNFT wallet by Coral',
    color: '#e33e3f',
    bgColor: 'rgba(227,62,63,0.12)',
  },
};

export default function WalletModal() {
  const { modalOpen, closeModal, connect, connecting, detectedWallets } = useWallet();

  if (!modalOpen) return null;

  const installedWallets = detectedWallets.filter((w) => w.installed);
  const notInstalledWallets = detectedWallets.filter((w) => !w.installed);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: 'hsl(222 47% 8%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(276 100% 69%), hsl(306 100% 69%))' }}
            >
              <Wallet size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Connect Wallet</p>
              <p className="text-xs text-foreground/40">Choose your Solana wallet</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-7 h-7 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          {/* Installed wallets */}
          {installedWallets.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-2 px-1">
                Detected
              </p>
              <div className="flex flex-col gap-2">
                {installedWallets.map((wallet) => {
                  const info = WALLET_INFO[wallet.type];
                  return (
                    <button
                      key={wallet.type}
                      onClick={() => connect(wallet.type)}
                      disabled={connecting}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-200 text-left group"
                      style={{
                        background: info.bgColor,
                        borderColor: `${info.color}30`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = `${info.color}70`;
                        (e.currentTarget as HTMLButtonElement).style.background = `${info.bgColor.replace('0.12', '0.2')}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = `${info.color}30`;
                        (e.currentTarget as HTMLButtonElement).style.background = info.bgColor;
                      }}
                    >
                      <span className="text-2xl leading-none">{wallet.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{wallet.label}</p>
                        <p className="text-xs text-foreground/50">{info.description}</p>
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                        style={{ background: `${info.color}20`, color: info.color }}
                      >
                        <Zap size={10} />
                        Connect
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Not installed wallets */}
          {notInstalledWallets.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-2 px-1">
                {installedWallets.length > 0 ? 'Not Installed' : 'Available Wallets'}
              </p>
              <div className="flex flex-col gap-2">
                {notInstalledWallets.map((wallet) => {
                  const info = WALLET_INFO[wallet.type];
                  return (
                    <a
                      key={wallet.type}
                      href={wallet.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all duration-200 text-left"
                    >
                      <span className="text-2xl leading-none opacity-50">{wallet.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground/60">{wallet.label}</p>
                        <p className="text-xs text-foreground/35">{info.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-foreground/35">
                        <ExternalLink size={11} />
                        Install
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* No wallets at all */}
          {installedWallets.length === 0 && notInstalledWallets.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-foreground/50">No Solana wallets detected.</p>
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Get Phantom →
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/8 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-xs text-foreground/35">
            Solana mainnet · Non-custodial · Your keys, your coins
          </p>
        </div>
      </div>
    </div>
  );
}
