import { world_map } from 'virtual:content';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Globe, Users, Radio, Shield, Wifi, MessageSquare } from 'lucide-react';
import { usePlayerPresence, type CountryData } from '@/lib/usePlayerPresence';
import ChatPanel from '@/components/ChatPanel';
import { useWallet } from '@/lib/wallet';

// ─── Map projection helpers ───────────────────────────────────────────────────
// Simple equirectangular: lat/lng → x/y on a 1000×500 canvas
const MAP_W = 1000;
const MAP_H = 500;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return { x, y };
}

// ─── Edition nation colours (approximate country codes) ───────────────────────
const NATION_COLORS: Record<string, string> = {
  AU: '#00C9FF', // Australia — cyan
  CN: '#FF4444', // China — red
  US: '#4488FF', // USA — blue
  GB: '#FF8844', // UK — orange
  IN: '#FF9933', // India — saffron
  JP: '#FF6688', // Japan — pink
  RU: '#4444FF', // Russia — blue
  BR: '#44FF88', // Brazil — green
  ZA: '#FFDD44', // South Africa — gold
  DE: '#FF8800', // Germany — amber
  FR: '#4466FF', // France — blue
  IT: '#44CC44', // Italy — green
  ES: '#FF4400', // Spain — red-orange
  MX: '#44AA44', // Mexico — green
  AR: '#44AAFF', // Argentina — sky
  NG: '#008800', // Nigeria — green
  KR: '#FF4488', // South Korea — pink
  TR: '#FF2200', // Turkey — red
};

function dotColor(countryCode: string): string {
  return NATION_COLORS[countryCode] ?? '#BF5FFF';
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
type TooltipState = {
  x: number;
  y: number;
  countryCode: string;
  data: CountryData;
} | null;

export default function WorldMapPage() {
  const { online, loading } = usePlayerPresence();
  const { publicKey } = useWallet();
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [chatOpen, setChatOpen] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Derive a display username from session (anonymous by default)
  const [username] = useState(() => `Player_${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
  const [userCountryCode, setUserCountryCode] = useState('XX');

  // Pulse the counter when total changes
  const prevTotal = useRef(online.total);
  useEffect(() => {
    if (online.total !== prevTotal.current) {
      setPulseKey((k) => k + 1);
      prevTotal.current = online.total;
    }
  }, [online.total]);

  // Detect user's own country from checkin response (stored in sessionStorage)
  useEffect(() => {
    const stored = sessionStorage.getItem('ttg_country_code');
    if (stored) setUserCountryCode(stored);
  }, []);

  const title = 'Global Command Center — The Token Game';
  const description =
    'Watch The Token Game community come alive in real time. See players from around the world light up the map as they join the game.';

  // Build dot list from country data
  const dots = Object.entries(online.countries).map(([code, data]) => {
    const { x, y } = project(data.lat, data.lng);
    return { code, data, x, y };
  });

  // Seed with demo dots when no real players yet (dev/preview mode)
  const demoDots = [
    { code: 'AU', data: { country: 'Australia', count: 3, lat: -25, lng: 133 } },
    { code: 'US', data: { country: 'United States', count: 8, lat: 38, lng: -97 } },
    { code: 'GB', data: { country: 'United Kingdom', count: 2, lat: 54, lng: -2 } },
    { code: 'JP', data: { country: 'Japan', count: 4, lat: 36, lng: 138 } },
    { code: 'BR', data: { country: 'Brazil', count: 2, lat: -15, lng: -47 } },
    { code: 'DE', data: { country: 'Germany', count: 1, lat: 51, lng: 10 } },
    { code: 'IN', data: { country: 'India', count: 5, lat: 20, lng: 77 } },
    { code: 'ZA', data: { country: 'South Africa', count: 1, lat: -29, lng: 25 } },
    { code: 'KR', data: { country: 'South Korea', count: 2, lat: 37, lng: 128 } },
    { code: 'MX', data: { country: 'Mexico', count: 1, lat: 23, lng: -102 } },
  ].map(({ code, data }) => {
    const { x, y } = project(data.lat, data.lng);
    return { code, data, x, y };
  });

  const displayDots = dots.length > 0 ? dots : demoDots;
  const displayTotal = online.total > 0 ? online.total : demoDots.reduce((s, d) => s + d.data.count, 0);
  const isDemo = dots.length === 0;

  function handleDotHover(
    e: React.MouseEvent<SVGCircleElement>,
    code: string,
    data: CountryData,
    x: number,
    y: number,
  ) {
    setTooltip({ x, y, countryCode: code, data });
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://thetokengame.xyz/world-map" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thetokengame.xyz/world-map" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url: 'https://thetokengame.xyz/world-map',
          isPartOf: { '@id': 'https://thetokengame.xyz/#website' },
          about: { '@id': 'https://thetokengame.xyz/#organization' },
        })}</script>
      </Helmet>

      {/* ── Page header ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px] opacity-10"
            style={{ background: '#BF5FFF' }} />
          <div className="absolute top-0 right-0 w-[400px] h-[200px] rounded-full blur-[100px] opacity-8"
            style={{ background: '#D4A017' }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{ background: '#BF5FFF18', color: '#BF5FFF', borderColor: '#BF5FFF40' }}>
              <Radio size={11} className="animate-pulse" />
              Live — updating every 15 seconds
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Global Command Center
            </h1>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
              Every glowing dot is a real player. Watch the community light up the world in real time.
            </p>
          </motion.div>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mt-10"
          >
            {[
              {
                icon: Users,
                label: 'Players Online',
                value: loading ? '—' : String(displayTotal),
                color: '#BF5FFF',
                pulse: true,
              },
              {
                icon: Globe,
                label: 'Countries Active',
                value: loading ? '—' : String(Object.keys(online.countries).length || demoDots.length),
                color: '#D4A017',
                pulse: false,
              },
              {
                icon: Wifi,
                label: 'Editions Live',
                value: '10',
                color: '#9fff5f',
                pulse: false,
              },
            ].map(({ icon: Icon, label, value, color, pulse }) => (
              <div key={label} className="text-center">
                <motion.div
                  key={pulse ? pulseKey : label}
                  initial={pulse ? { scale: 1.3 } : { scale: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' as const }}
                  className="text-3xl md:text-4xl font-black flex items-center justify-center gap-2"
                  style={{ color, fontFamily: 'var(--font-heading)' }}
                >
                  <Icon size={20} />
                  {value}
                </motion.div>
                <div className="text-xs text-foreground/40 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Map + Chat layout ── */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xl:flex-row gap-6 items-start">

            {/* ── Map column ── */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative rounded-3xl overflow-hidden border border-white/10"
                style={{
                  background: 'linear-gradient(160deg, #060412 0%, #0d0820 50%, #060412 100%)',
                  boxShadow: '0 0 80px #BF5FFF18, inset 0 0 80px #00000040',
                }}
              >
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage: 'linear-gradient(#BF5FFF 1px, transparent 1px), linear-gradient(90deg, #BF5FFF 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                  }} />

                {/* Corner decorations */}
                {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-6 h-6 pointer-events-none`}
                    style={{ border: '1px solid #BF5FFF40' }} />
                ))}

                {/* Scan line animation */}
                <motion.div
                  className="absolute inset-x-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, #BF5FFF60, transparent)' }}
                  animate={{ top: ['5%', '95%', '5%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />

                {/* SVG Map */}
                <div
                  className="relative w-full"
                  style={{ paddingBottom: `${(MAP_H / MAP_W) * 100}%` }}
                >
                  <svg
                    ref={svgRef}
                    viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ display: 'block' }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Ocean background */}
                    <rect width={MAP_W} height={MAP_H} fill="transparent" />

                    {/* Latitude grid lines */}
                    {[-60, -30, 0, 30, 60].map((lat) => {
                      const { y } = project(lat, 0);
                      return (
                        <line key={lat} x1={0} y1={y} x2={MAP_W} y2={y}
                          stroke="#BF5FFF" strokeWidth="0.3" strokeOpacity="0.15"
                          strokeDasharray={lat === 0 ? '4 4' : '2 8'} />
                      );
                    })}
                    {/* Longitude grid lines */}
                    {[-120, -60, 0, 60, 120].map((lng) => {
                      const { x } = project(0, lng);
                      return (
                        <line key={lng} x1={x} y1={0} x2={x} y2={MAP_H}
                          stroke="#BF5FFF" strokeWidth="0.3" strokeOpacity="0.15"
                          strokeDasharray="2 8" />
                      );
                    })}

                    {/* Landmasses */}
                    {world_map.WORLD_PATHS.map((p) => (
                      <path
                        key={p.id}
                        d={p.d}
                        fill="#1a1535"
                        stroke="#BF5FFF"
                        strokeWidth="0.8"
                        strokeOpacity="0.35"
                      />
                    ))}

                    {/* Player dots */}
                    {displayDots.map(({ code, data, x, y }) => {
                      const color = dotColor(code);
                      const size = Math.min(2 + data.count * 0.8, 8);
                      return (
                        <g key={code}>
                          {/* Outer pulse ring */}
                          <circle cx={x} cy={y} r={size + 4} fill="none"
                            stroke={color} strokeWidth="0.8" strokeOpacity="0.3">
                            <animate attributeName="r" values={`${size + 2};${size + 8};${size + 2}`}
                              dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="stroke-opacity" values="0.4;0;0.4"
                              dur="2.5s" repeatCount="indefinite" />
                          </circle>
                          {/* Core dot */}
                          <circle
                            cx={x} cy={y} r={size}
                            fill={color}
                            fillOpacity="0.9"
                            style={{ cursor: 'pointer', filter: `drop-shadow(0 0 ${size * 2}px ${color})` }}
                            onMouseEnter={(e) => handleDotHover(e, code, data, x, y)}
                            onMouseLeave={() => setTooltip(null)}
                          />
                          {/* Inner bright core */}
                          <circle cx={x} cy={y} r={size * 0.4} fill="white" fillOpacity="0.6" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {tooltip && (
                      <motion.div
                        key={tooltip.countryCode}
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="absolute pointer-events-none z-20 px-3 py-2 rounded-xl text-xs font-semibold border"
                        style={{
                          left: `${(tooltip.x / MAP_W) * 100}%`,
                          top: `${(tooltip.y / MAP_H) * 100}%`,
                          transform: 'translate(-50%, -130%)',
                          background: '#0d0820ee',
                          borderColor: dotColor(tooltip.countryCode) + '60',
                          color: dotColor(tooltip.countryCode),
                          backdropFilter: 'blur(8px)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div className="text-white/90 font-bold">{tooltip.data.country}</div>
                        <div className="text-foreground/60 font-normal">
                          {tooltip.data.count} player{tooltip.data.count !== 1 ? 's' : ''} online
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Demo mode badge */}
                {isDemo && !loading && (
                  <div className="absolute bottom-4 right-4 text-xs text-foreground/30 px-2 py-1 rounded border border-white/10">
                    Demo view — be the first to join!
                  </div>
                )}
              </motion.div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 mt-6"
              >
                {Object.entries(NATION_COLORS).slice(0, 9).map(([code, color]) => (
                  <div key={code} className="flex items-center gap-1.5 text-xs text-foreground/40">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                    {code}
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-xs text-foreground/40">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#BF5FFF', boxShadow: '0 0 6px #BF5FFF' }} />
                  Other
                </div>
              </motion.div>
            </div>

            {/* ── Chat sidebar ── */}
            <div className="w-full xl:w-80 shrink-0">
              <AnimatePresence mode="wait">
                {chatOpen ? (
                  <ChatPanel
                    key="chat"
                    username={username}
                    countryCode={userCountryCode}
                    walletAddress={publicKey ?? undefined}
                    onClose={() => setChatOpen(false)}
                  />
                ) : (
                  <motion.button
                    key="chat-open-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setChatOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 text-sm font-semibold text-foreground/50 hover:text-foreground/80 hover:border-primary/30 transition-all"
                    style={{ background: '#0d0820' }}
                  >
                    <MessageSquare size={15} style={{ color: '#BF5FFF' }} />
                    Open Live Chat
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── Country breakdown ── */}
      {Object.keys(online.countries).length > 0 && (
        <section className="py-10 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Active Countries
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {Object.entries(online.countries)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([code, data]) => (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-white/10 bg-card/40 p-3 text-center"
                    style={{ borderColor: dotColor(code) + '30' }}
                  >
                    <div className="text-lg font-black" style={{ color: dotColor(code), fontFamily: 'var(--font-heading)' }}>
                      {data.count}
                    </div>
                    <div className="text-xs text-foreground/50 truncate">{data.country}</div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Privacy note ── */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-card/30 p-6 text-center"
          >
            <Shield size={24} className="mx-auto mb-3 text-foreground/30" />
            <h3 className="text-sm font-bold text-foreground/60 mb-2">Privacy & Anonymity</h3>
            <p className="text-xs text-foreground/40 leading-relaxed">
              Location data is anonymised and only used to show the global reach of our community.
              Only your country or region is displayed — never your exact location, IP address,
              wallet address, or any personal information. Data is held in memory only and
              automatically cleared when you leave.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
