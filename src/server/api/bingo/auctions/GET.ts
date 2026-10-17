/**
 * GET /api/bingo/auctions
 * Returns mock auction listings.
 * TODO: replace with on-chain reads from TGAuction contract.
 */
import type { Request, Response } from 'express';
import { getRarity, RARITY_CONFIG } from '../../../../lib/wagmi-config.js';
import { COINS } from '../../../../data/coins.js';

export default async function handler(_req: Request, res: Response) {
  // Seed a stable set of 12 auction listings from the coin pool
  const seed = COINS.filter(c => c.image).slice(0, 60);
  const listings = seed
    .filter((_, i) => i % 5 === 0)
    .slice(0, 12)
    .map((coin, i) => {
      const rarity = getRarity(coin.ticker);
      const cfg = RARITY_CONFIG[rarity];
      const basePrice = cfg.multiplier * 0.05;
      const endsInHours = 2 + (i * 3) % 22;
      return {
        id: `auction-${i}`,
        coin: {
          ticker: coin.ticker,
          name: coin.name,
          image: coin.image,
          rarity,
          rarityLabel: cfg.label,
          color: cfg.color,
          multiplier: cfg.multiplier,
        },
        currentBid: parseFloat((basePrice + i * 0.01).toFixed(4)),
        minBid: parseFloat((basePrice + i * 0.01 + 0.001).toFixed(4)),
        bidCount: i * 2,
        endsAt: Date.now() + endsInHours * 3600 * 1000,
        seller: `0x${Math.random().toString(16).slice(2, 10)}...`,
        // TODO: wire to TGAuction.getAuction(id) on-chain
      };
    });

  res.json({ listings });
}
