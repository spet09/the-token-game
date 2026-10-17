/**
 * Alert Email Service
 *
 * Sends operator email alerts when coin delivery fails.
 * Uses the Airo email gateway (same as the email skill).
 *
 * The recipient is the NEWSLETTER_RECIPIENT_EMAIL secret,
 * which is the operator's notification address.
 */
import { getSecret } from '#airo/secrets';

export interface AlertEmailPayload {
  stripeEventId: string;
  sessionId:     string | null;
  accountKey:    string | null;
  coinsAwarded:  number | null;
  amountPaid:    number | null;
  failureReason: string;
  alertId:       number;
}

export async function sendAlertEmail(payload: AlertEmailPayload): Promise<void> {
  const recipientEmail = getSecret('NEWSLETTER_RECIPIENT_EMAIL');
  if (!recipientEmail) {
    console.warn('alert-email: NEWSLETTER_RECIPIENT_EMAIL not set — skipping alert email');
    return;
  }

  const amountStr = payload.amountPaid != null
    ? `$${(payload.amountPaid / 100).toFixed(2)}`
    : 'unknown';

  const coinsStr = payload.coinsAwarded != null
    ? payload.coinsAwarded.toLocaleString()
    : 'unknown';

  const subject = `🚨 Coin Delivery Failed — ${payload.stripeEventId}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d0d1a; color: #e9d5ff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
    .header { background: #7c3aed; border-radius: 12px 12px 0 0; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: #fff; }
    .body { background: #1a0a2e; border: 1px solid #7c3aed33; border-top: none; border-radius: 0 0 12px 12px; padding: 24px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a78bfa; margin-bottom: 4px; }
    .value { font-size: 14px; color: #e9d5ff; background: #0d0d1a; border-radius: 6px; padding: 8px 12px; word-break: break-all; }
    .error { background: #3b0a0a; border: 1px solid #ef4444; border-radius: 6px; padding: 12px; color: #fca5a5; font-size: 13px; }
    .actions { margin-top: 24px; text-align: center; }
    .btn { display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin: 0 8px; }
    .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Coin Delivery Failed</h1>
      <p style="margin:8px 0 0;color:#ddd6fe;font-size:13px;">Alert #${payload.alertId} — The Token Game</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Stripe Event ID</div>
        <div class="value">${payload.stripeEventId}</div>
      </div>
      ${payload.sessionId ? `
      <div class="field">
        <div class="label">Checkout Session</div>
        <div class="value">${payload.sessionId}</div>
      </div>` : ''}
      ${payload.accountKey ? `
      <div class="field">
        <div class="label">Account (email or wallet)</div>
        <div class="value">${payload.accountKey}</div>
      </div>` : ''}
      <div class="field">
        <div class="label">Coins Owed</div>
        <div class="value">🪙 ${coinsStr} coins (${amountStr} paid)</div>
      </div>
      <div class="field">
        <div class="label">Failure Reason</div>
        <div class="error">${payload.failureReason}</div>
      </div>
      <div class="field">
        <div class="label">Time</div>
        <div class="value">${new Date().toISOString()}</div>
      </div>

      <div class="actions">
        <a href="https://thetokengame.xyz/admin/webhook-monitor" class="btn">View Monitor Dashboard</a>
        <a href="https://dashboard.stripe.com/payments" class="btn" style="background:#1a1a2e;border:1px solid #7c3aed;">Stripe Dashboard</a>
      </div>

      <p style="margin-top:24px;font-size:13px;color:#a78bfa;">
        To manually credit coins, use the admin credit endpoint:<br>
        <code style="background:#0d0d1a;padding:4px 8px;border-radius:4px;font-size:12px;">
          POST /api/admin/credit-coins<br>
          { "walletAddress": "${payload.accountKey ?? 'ACCOUNT_KEY'}", "coins": ${coinsStr}, "reason": "Manual fix for ${payload.stripeEventId}" }
        </code>
      </p>
    </div>
    <div class="footer">
      Sent by The Token Game webhook monitor · thetokengame.xyz
    </div>
  </div>
</body>
</html>`;

  const text = `COIN DELIVERY FAILED — Alert #${payload.alertId}

Stripe Event: ${payload.stripeEventId}
Session: ${payload.sessionId ?? 'N/A'}
Account: ${payload.accountKey ?? 'N/A'}
Coins Owed: ${coinsStr} (${amountStr} paid)
Failure: ${payload.failureReason}
Time: ${new Date().toISOString()}

Manual fix: POST /api/admin/credit-coins
{ "walletAddress": "${payload.accountKey ?? 'ACCOUNT_KEY'}", "coins": ${coinsStr} }

Monitor: https://thetokengame.xyz/admin/webhook-monitor`;

  try {
    const { sendEmail } = await import('../email.js');
    await sendEmail({
      to:      recipientEmail as string,
      subject,
      html,
      text,
    });
    console.log(`alert-email: ✅ sent alert for event=${payload.stripeEventId} to ${recipientEmail}`);
  } catch (err) {
    console.error('alert-email: failed to send', err);
    throw err;
  }
}
