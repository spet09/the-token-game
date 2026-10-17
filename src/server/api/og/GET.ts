import type { Request, Response } from 'express';

/**
 * Dynamic Open Graph image generator.
 * Returns an SVG-based OG image (1200×630) for social sharing.
 * Usage: /api/og?title=Page+Title&description=Some+description&coin=$RESO
 */
export default function handler(req: Request, res: Response) {
  const title = String(req.query.title || 'The Token Game');
  const description = String(req.query.description || '108 coins. 365 days. One rule: easy in, easy out.');
  const coin = String(req.query.coin || '$RESO');

  // Escape XML special chars
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Word-wrap helper — splits text into lines of max `maxLen` chars
  function wrap(text: string, maxLen: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      if ((current + ' ' + word).trim().length > maxLen) {
        if (current) lines.push(current.trim());
        current = word;
      } else {
        current = (current + ' ' + word).trim();
      }
    }
    if (current) lines.push(current.trim());
    return lines;
  }

  const titleLines = wrap(esc(title), 28);
  const descLines = wrap(esc(description), 52);

  const titleSvg = titleLines
    .map((line, i) => `<text x="80" y="${200 + i * 72}" font-size="64" font-weight="bold" fill="white" font-family="system-ui,sans-serif">${line}</text>`)
    .join('\n');

  const descSvg = descLines
    .slice(0, 3)
    .map((line, i) => `<text x="80" y="${200 + titleLines.length * 72 + 20 + i * 40}" font-size="32" fill="#a78bfa" font-family="system-ui,sans-serif">${line}</text>`)
    .join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F0A1A"/>
      <stop offset="100%" style="stop-color:#1a0a2e"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#BF5FFF;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#ff5fef;stop-opacity:0.1"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow circle top-right -->
  <circle cx="1050" cy="80" r="300" fill="url(#glow)"/>
  <circle cx="150" cy="550" r="200" fill="#9fff5f" opacity="0.05"/>

  <!-- Grid lines -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105"/>
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="525" x2="1200" y2="525"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- Top label -->
  <rect x="80" y="60" width="220" height="40" rx="20" fill="#BF5FFF" opacity="0.2"/>
  <rect x="80" y="60" width="220" height="40" rx="20" fill="none" stroke="#BF5FFF" stroke-width="1" opacity="0.5"/>
  <text x="190" y="86" text-anchor="middle" font-size="18" fill="#BF5FFF" font-family="system-ui,sans-serif" font-weight="600">THE TOKEN GAME</text>

  <!-- Coin badge -->
  <rect x="960" y="220" width="180" height="180" rx="24" fill="#BF5FFF" opacity="0.15"/>
  <rect x="960" y="220" width="180" height="180" rx="24" fill="none" stroke="#BF5FFF" stroke-width="2" opacity="0.4"/>
  <text x="1050" y="330" text-anchor="middle" font-size="48" font-weight="bold" fill="#BF5FFF" font-family="system-ui,sans-serif">${esc(coin)}</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Description -->
  ${descSvg}

  <!-- Bottom bar -->
  <rect x="0" y="580" width="1200" height="50" fill="#BF5FFF" opacity="0.08"/>
  <text x="80" y="612" font-size="22" fill="#BF5FFF" font-family="system-ui,sans-serif" opacity="0.7">thetokengame.xyz</text>
  <text x="1120" y="612" text-anchor="end" font-size="22" fill="#9fff5f" font-family="system-ui,sans-serif" opacity="0.7">☕ raydium.io</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.send(svg);
}
