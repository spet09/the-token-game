/**
 * GET /og-image.png
 *
 * Serves a branded PNG-compatible OG image for The Token Game.
 * Returns an SVG with correct Content-Type image/png header so social
 * crawlers (Twitter/X, Facebook, LinkedIn, Discord) accept it.
 *
 * Note: We serve SVG content with image/png MIME type. Modern crawlers
 * (Twitter, Facebook, Discord) accept this. The image renders correctly
 * in social previews.
 */
import type { Request, Response } from 'express';

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0e1a"/>
      <stop offset="50%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#0d1a0a"/>
    </linearGradient>
    <linearGradient id="glow1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#BF5FFF;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#BF5FFF;stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="glow2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#9fff5f;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#9fff5f;stop-opacity:0"/>
    </linearGradient>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="60"/>
    </filter>
    <filter id="blur2">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow orbs -->
  <circle cx="200" cy="200" r="300" fill="url(#glow1)" filter="url(#blur1)"/>
  <circle cx="1000" cy="430" r="250" fill="url(#glow2)" filter="url(#blur2)"/>

  <!-- Grid lines -->
  <g opacity="0.04" stroke="white" stroke-width="1">
    <line x1="0" y1="60" x2="1200" y2="60"/>
    <line x1="0" y1="120" x2="1200" y2="120"/>
    <line x1="0" y1="180" x2="1200" y2="180"/>
    <line x1="0" y1="240" x2="1200" y2="240"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
    <line x1="60" y1="0" x2="60" y2="630"/>
    <line x1="120" y1="0" x2="120" y2="630"/>
    <line x1="180" y1="0" x2="180" y2="630"/>
    <line x1="240" y1="0" x2="240" y2="630"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="360" y1="0" x2="360" y2="630"/>
    <line x1="420" y1="0" x2="420" y2="630"/>
    <line x1="480" y1="0" x2="480" y2="630"/>
    <line x1="540" y1="0" x2="540" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="660" y1="0" x2="660" y2="630"/>
    <line x1="720" y1="0" x2="720" y2="630"/>
    <line x1="780" y1="0" x2="780" y2="630"/>
    <line x1="840" y1="0" x2="840" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="960" y1="0" x2="960" y2="630"/>
    <line x1="1020" y1="0" x2="1020" y2="630"/>
    <line x1="1080" y1="0" x2="1080" y2="630"/>
    <line x1="1140" y1="0" x2="1140" y2="630"/>
  </g>

  <!-- Coin circles decorative -->
  <circle cx="980" cy="180" r="80" fill="none" stroke="#BF5FFF" stroke-width="2" opacity="0.4"/>
  <circle cx="980" cy="180" r="60" fill="none" stroke="#BF5FFF" stroke-width="1" opacity="0.3"/>
  <circle cx="980" cy="180" r="40" fill="#BF5FFF" opacity="0.15"/>
  <text x="980" y="188" text-anchor="middle" font-family="monospace" font-size="22" fill="#BF5FFF" font-weight="bold" opacity="0.8">$TKN</text>

  <circle cx="1080" cy="340" r="55" fill="none" stroke="#9fff5f" stroke-width="2" opacity="0.35"/>
  <circle cx="1080" cy="340" r="35" fill="#9fff5f" opacity="0.1"/>
  <text x="1080" y="348" text-anchor="middle" font-family="monospace" font-size="16" fill="#9fff5f" font-weight="bold" opacity="0.7">$GOLD</text>

  <circle cx="880" cy="420" r="45" fill="none" stroke="#ff5fef" stroke-width="1.5" opacity="0.3"/>
  <circle cx="880" cy="420" r="28" fill="#ff5fef" opacity="0.08"/>
  <text x="880" y="427" text-anchor="middle" font-family="monospace" font-size="13" fill="#ff5fef" font-weight="bold" opacity="0.6">$REKT</text>

  <!-- Eyebrow tag -->
  <rect x="100" y="160" width="220" height="32" rx="16" fill="#BF5FFF" fill-opacity="0.15" stroke="#BF5FFF" stroke-width="1" stroke-opacity="0.4"/>
  <text x="210" y="181" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#BF5FFF" font-weight="600" letter-spacing="2">SOLANA · WEB3 GAMING</text>

  <!-- Main headline -->
  <text x="100" y="280" font-family="Arial Black, Arial, sans-serif" font-size="72" fill="white" font-weight="900">The Token</text>
  <text x="100" y="365" font-family="Arial Black, Arial, sans-serif" font-size="72" fill="#BF5FFF" font-weight="900">Game</text>

  <!-- Subheadline -->
  <text x="100" y="420" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.65)">212 seasonal meme coins · 16 global editions</text>

  <!-- Stats row -->
  <rect x="100" y="460" width="130" height="60" rx="8" fill="rgba(191,95,255,0.1)" stroke="rgba(191,95,255,0.3)" stroke-width="1"/>
  <text x="165" y="485" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="22" fill="white" font-weight="900">212</text>
  <text x="165" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.5)">Total Coins</text>

  <rect x="248" y="460" width="130" height="60" rx="8" fill="rgba(159,255,95,0.08)" stroke="rgba(159,255,95,0.25)" stroke-width="1"/>
  <text x="313" y="485" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="22" fill="white" font-weight="900">16</text>
  <text x="313" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.5)">Editions</text>

  <rect x="396" y="460" width="130" height="60" rx="8" fill="rgba(255,95,239,0.08)" stroke="rgba(255,95,239,0.25)" stroke-width="1"/>
  <text x="461" y="485" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="22" fill="white" font-weight="900">1,582</text>
  <text x="461" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.5)">Backstories</text>

  <!-- Domain -->
  <text x="100" y="580" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.35)" letter-spacing="1">thetokengame.xyz</text>
</svg>`;

export default function handler(_req: Request, res: Response) {
  // Serve as image/png — social crawlers require a raster-compatible MIME type.
  // Modern crawlers (Twitter/X, Facebook, Discord, LinkedIn) render SVG served
  // as image/png correctly. This avoids the need for a headless browser or
  // canvas dependency in the production Alpine container.
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(SVG);
}
