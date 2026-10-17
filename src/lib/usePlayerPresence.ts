// ─── Player presence hook ─────────────────────────────────────────────────────
// Checks the player in on mount, sends heartbeats every 90 s, and checks out
// on unmount / page unload. Returns the live online data polled every 15 s.

import { useEffect, useRef, useState } from 'react';

export type CountryData = {
  count: number;
  country: string;
  lat: number;
  lng: number;
};

export type OnlineData = {
  total: number;
  countries: Record<string, CountryData>;
};

const HEARTBEAT_INTERVAL_MS = 90_000;  // 90 s
const POLL_INTERVAL_MS = 15_000;       // refresh map every 15 s

export function usePlayerPresence() {
  const sessionIdRef = useRef<string | null>(null);
  const [online, setOnline] = useState<OnlineData>({ total: 0, countries: {} });
  const [loading, setLoading] = useState(true);

  // ── Check in ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function checkin() {
      try {
        const res = await fetch('/api/players/checkin', { method: 'POST' });
        if (!res.ok) return;
        const data = await res.json() as { sessionId: string; countryCode: string };
        if (mounted) {
          sessionIdRef.current = data.sessionId;
          // Store country code so ChatPanel can use it
          if (data.countryCode && typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('ttg_country_code', data.countryCode);
          }
        }
      } catch {
        // silently ignore — map still works without presence
      }
    }

    checkin();

    return () => {
      mounted = false;
    };
  }, []);

  // ── Heartbeat ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(async () => {
      if (!sessionIdRef.current) return;
      try {
        await fetch('/api/players/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });
      } catch { /* ignore */ }
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  // ── Checkout on unmount / tab close ──────────────────────────────────────
  useEffect(() => {
    function checkout() {
      if (!sessionIdRef.current) return;
      // Use sendBeacon so it fires even during page unload
      navigator.sendBeacon(
        '/api/players/checkout',
        JSON.stringify({ sessionId: sessionIdRef.current }),
      );
    }

    window.addEventListener('beforeunload', checkout);
    return () => {
      window.removeEventListener('beforeunload', checkout);
      checkout();
    };
  }, []);

  // ── Poll online data ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchOnline() {
      try {
        const res = await fetch('/api/players/online');
        if (!res.ok) return;
        const data = await res.json() as OnlineData;
        setOnline(data);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    }

    fetchOnline();
    const timer = setInterval(fetchOnline, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return { online, loading };
}
