/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
  readonly VITE_APP_NAME: string
  readonly VITE_PUBLIC_URL: string
  readonly VITE_API_URL: string
  readonly VITE_ENABLE_SOURCE_MAPPING: string
  readonly VITE_ENABLE_SSR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  __airoEditModeActive?: boolean;
  TienkoWallet?: new (opts: { appName: string }) => {
    connect(): Promise<{ address: string }>;
    disconnect(): Promise<void>;
    getBalance(): Promise<{ usgc: number; sol?: number }>;
    buyWithUSGC(
      treasuryAddress: string,
      amount: number,
      itemName: string,
    ): Promise<{ signature: string }>;
  };
}

declare module 'virtual:format-overrides' {
  import type { FormatOverrideBundle } from '@/lib/format-overrides'

  const bundle: FormatOverrideBundle
  export default bundle
}
