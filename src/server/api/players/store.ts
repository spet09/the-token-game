// ─── In-memory player presence store ─────────────────────────────────────────
// Players are tracked by a random sessionId. Each entry expires after
// SESSION_TTL_MS of inactivity (no heartbeat). A lightweight setInterval
// sweeps expired sessions every SWEEP_INTERVAL_MS.

const SESSION_TTL_MS = 5 * 60 * 1000;   // 5 minutes idle → gone
const SWEEP_INTERVAL_MS = 60 * 1000;     // sweep every 60 s

export type PlayerEntry = {
  sessionId: string;
  ip: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  lastSeen: number; // Date.now()
};

const sessions = new Map<string, PlayerEntry>();

function randomId(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function sweep() {
  const now = Date.now();
  for (const [id, entry] of sessions) {
    if (now - entry.lastSeen > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

// Start the sweep interval (only in server context)
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(sweep, SWEEP_INTERVAL_MS);
  // Don't block process exit
  if (timer && typeof timer.unref === 'function') timer.unref();
}

export const playerStore = {
  checkin(data: Omit<PlayerEntry, 'sessionId' | 'lastSeen'>): string {
    const sessionId = randomId();
    sessions.set(sessionId, { ...data, sessionId, lastSeen: Date.now() });
    return sessionId;
  },

  heartbeat(sessionId: string): boolean {
    const entry = sessions.get(sessionId);
    if (!entry) return false;
    entry.lastSeen = Date.now();
    return true;
  },

  checkout(sessionId: string): void {
    sessions.delete(sessionId);
  },

  getOnline(): PlayerEntry[] {
    sweep(); // always fresh before returning
    return Array.from(sessions.values());
  },

  getCountryCounts(): Record<string, { count: number; country: string; lat: number; lng: number }> {
    const online = this.getOnline();
    const map: Record<string, { count: number; country: string; lat: number; lng: number }> = {};
    for (const p of online) {
      if (!map[p.countryCode]) {
        map[p.countryCode] = { count: 0, country: p.country, lat: p.lat, lng: p.lng };
      }
      map[p.countryCode].count++;
    }
    return map;
  },
};
