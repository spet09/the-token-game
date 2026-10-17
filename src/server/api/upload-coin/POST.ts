import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const MEDIA_DIR = '/shared-storage/public/assets/media';

export default async function handler(req: Request, res: Response) {
  try {
    const file = (req as any).file;
    const slot = req.body?.slot as string;

    if (!file || !slot) {
      return res.status(400).json({ error: 'Missing file or slot' });
    }

    // Allow coins/<edition>/<ticker> paths
    if (!/^coins\/[a-z0-9-]+\/[a-z0-9-]+$/.test(slot)) {
      return res.status(400).json({ error: 'Invalid slot path' });
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Convert slot path to the flat filename prefix the slot system uses
    // e.g. coins/global/janend  →  coins-global-janend
    const slotKey = slot.replace(/\//g, '-');

    // Remove any existing files for this slot
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    const existing = await fs.readdir(MEDIA_DIR);
    for (const f of existing) {
      if (f.startsWith(slotKey + '-')) {
        await fs.unlink(path.join(MEDIA_DIR, f)).catch(() => {});
      }
    }

    // Write new file with a content hash suffix (same convention as the slot system)
    const hash = crypto.createHash('md5').update(file.buffer).digest('hex').slice(0, 8);
    const filename = `${slotKey}-${hash}${ext}`;
    await fs.writeFile(path.join(MEDIA_DIR, filename), file.buffer);

    // The slot URL the browser uses — same pattern as /airo-assets/images/coins/global/janend
    const url = `/airo-assets/images/${slot}`;
    res.json({ ok: true, url, slot });
  } catch (err) {
    console.error('upload-coin error:', err);
    res.status(500).json({ error: String(err) });
  }
}
