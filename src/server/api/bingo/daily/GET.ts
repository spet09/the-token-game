/**
 * GET /api/bingo/daily?date=YYYY-MM-DD&wallet=optional
 * Returns today's card + draw order.
 */
import type { Request, Response } from 'express';
import { generateDailyCard, generateDailyDraw, todayDateStr } from '../../../../lib/bingo-engine.js';

export default async function handler(req: Request, res: Response) {
  const date = (req.query.date as string) || todayDateStr();
  const wallet = (req.query.wallet as string) || '';

  const card = generateDailyCard(date, wallet);
  const draw = generateDailyDraw(date);

  res.json({ card, draw, date });
}
