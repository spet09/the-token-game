import type { Request, Response } from 'express';
import { sendEmail } from '../../../email.js';
import { getSecret } from '#airo/secrets';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default async function handler(req: Request, res: Response) {
  const { email } = req.body as { email?: string };

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const trimmed = email.trim().toLowerCase();
  const recipient = getSecret('NEWSLETTER_RECIPIENT_EMAIL') as string;

  if (!recipient) {
    console.error('newsletter.subscribe: NEWSLETTER_RECIPIENT_EMAIL not configured');
    return res.status(500).json({ error: 'Newsletter not configured.' });
  }

  try {
    await sendEmail({
      to: recipient,
      replyTo: trimmed,
      subject: `🎮 New Token Game signup: ${trimmed}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#0F0A1A;color:#fff;padding:32px;border-radius:12px;border:1px solid #BF5FFF44;">
          <h2 style="color:#BF5FFF;margin:0 0 16px;">New Newsletter Signup</h2>
          <p style="margin:0 0 8px;color:#ccc;">Someone just signed up for The Token Game newsletter:</p>
          <p style="font-size:20px;font-weight:bold;color:#9fff5f;margin:16px 0;">${trimmed}</p>
          <hr style="border:none;border-top:1px solid #ffffff18;margin:24px 0;"/>
          <p style="font-size:12px;color:#666;margin:0;">Sent from thetokengame.xyz</p>
        </div>
      `,
      text: `New Token Game newsletter signup: ${trimmed}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('newsletter.subscribe: email send failed', err);
    return res.status(500).json({ error: 'Failed to process signup. Please try again.' });
  }
}
