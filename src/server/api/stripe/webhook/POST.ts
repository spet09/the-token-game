/**
 * Stripe Webhook Handler
 *
 * Receives Stripe events and processes:
 *   - checkout.session.completed → deliver coins to wallet
 *
 * IMPORTANT: This route must receive the RAW request body (not JSON-parsed)
 * so Stripe's signature verification works. Register it in entry.ts BEFORE
 * the global express.json() middleware, using express.raw().
 *
 * Setup: Register this webhook URL in your Stripe Dashboard:
 *   https://dashboard.stripe.com/webhooks
 *   URL: https://thetokengame.xyz/api/stripe/webhook
 *   Events: checkout.session.completed
 */
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { getSecret } from '#airo/secrets';
import { deliverCoins } from '../../../services/coin-delivery.js';

function getStripe(): Stripe {
  const secretKey = getSecret('STRIPE_SECRET_KEY');
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(secretKey as string);
}

export default async function handler(req: Request, res: Response) {
  const webhookSecret = getSecret('STRIPE_WEBHOOK_SECRET') as string | undefined;
  const stripe = getStripe();

  let event: Stripe.Event;

  // Verify signature if webhook secret is configured
  if (webhookSecret) {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      console.error('stripe.webhook: missing stripe-signature header');
      res.status(400).json({ error: 'Missing stripe-signature header' });
      return;
    }
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } catch (err) {
      console.error('stripe.webhook: signature verification failed', err);
      res.status(400).json({ error: 'Webhook signature verification failed' });
      return;
    }
  } else {
    // No secret configured — parse the raw body as JSON (dev/testing only)
    try {
      event = JSON.parse((req.body as Buffer).toString()) as Stripe.Event;
      console.warn('stripe.webhook: STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  }

  // Acknowledge receipt immediately — process async
  res.json({ received: true });

  // Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`stripe.webhook: checkout.session.completed — session=${session.id} event=${event.id}`);
        await deliverCoins(session, event.id);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`stripe.webhook: checkout.session.expired — session=${session.id}`);
        // No action needed — session expired before payment
        break;
      }
      default:
        console.log(`stripe.webhook: unhandled event type=${event.type}`);
    }
  } catch (err) {
    // Log but don't re-send a response (already sent 200)
    console.error('stripe.webhook: error processing event', event.type, err);
  }
}
