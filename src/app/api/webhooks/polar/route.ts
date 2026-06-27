import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. Get raw request body for signature verification
    const rawBody = await request.text();

    // 2. Read headers required by Standard Webhooks spec
    const webhookId = request.headers.get('webhook-id');
    const webhookTimestamp = request.headers.get('webhook-timestamp');
    const webhookSignature = request.headers.get('webhook-signature');

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      console.error('Missing standard webhook headers.');
      return NextResponse.json({ error: 'Missing webhook headers.' }, { status: 400 });
    }

    // 3. Verify Signature
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) {
      console.warn('[POLAR WEBHOOK] POLAR_WEBHOOK_SECRET is not configured in .env. Skipping signature verification.');
    } else {
      // Decode secret (supporting standard base64 and whsec_ prefix)
      const cleanedSecret = secret.startsWith('whsec_') ? secret.substring(6) : secret;
      const secretKey = Buffer.from(cleanedSecret, 'base64');

      // Verify timestamp tolerance (prevent replay attacks - 5 minutes window)
      const now = Math.floor(Date.now() / 1000);
      const timestamp = parseInt(webhookTimestamp, 10);
      if (isNaN(timestamp) || Math.abs(now - timestamp) > 5 * 60) {
        console.error('Webhook timestamp expired or invalid:', webhookTimestamp);
        return NextResponse.json({ error: 'Webhook timestamp expired.' }, { status: 400 });
      }

      // Reconstruct signed payload
      const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

      // Calculate HMAC-SHA256 signature
      const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(signedContent)
        .digest('base64');

      // Extract v1 signature from header
      const signaturePart = webhookSignature.split(' ').find((sig) => sig.startsWith('v1,'));
      if (!signaturePart) {
        console.error('Invalid signature format in headers.');
        return NextResponse.json({ error: 'Invalid signature format.' }, { status: 400 });
      }
      const actualSignature = signaturePart.substring(3); // Remove 'v1,'

      // Cryptographically secure constant-time comparison
      const expectedBuffer = Buffer.from(expectedSignature, 'base64');
      const actualBuffer = Buffer.from(actualSignature, 'base64');

      if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
        console.error('Webhook signature verification failed.');
        return NextResponse.json({ error: 'Signature verification failed.' }, { status: 403 });
      }
    }

    // 4. Parse the payload
    const payload = JSON.parse(rawBody);
    console.log(`[POLAR WEBHOOK] Event received: ${payload.type}`);

    // We only process order.created events
    if (payload.type !== 'order.created') {
      return NextResponse.json({ success: true, message: 'Event ignored.' });
    }

    const order = payload.data;
    if (!order) {
      return NextResponse.json({ error: 'Missing order data.' }, { status: 400 });
    }

    // Extract buyer contact details (defensively handling various schema formats)
    const customer = order.customer;
    const email = (customer?.email || order.customer_email || order.billing_email || '').toLowerCase();
    const name = customer?.name || order.customer_name || order.billing_name || null;

    if (!email) {
      console.error('[POLAR WEBHOOK] No customer email found in payload:', order);
      return NextResponse.json({ error: 'No customer email found.' }, { status: 400 });
    }

    const orderId = order.id;
    // Polar amounts are in cents, so we divide by 100
    const rawAmount = order.total_amount || order.subtotal_amount || 0;
    const amount = Number(rawAmount) / 100;
    const currency = order.currency?.toUpperCase() || 'USD';
    const isPaid = order.paid ?? true; // Default to completed if paid flag not present
    const paymentStatus = isPaid ? 'completed' : 'pending';

    // Generate unique secure download token (UUID)
    const downloadToken = crypto.randomUUID();

    // 5. Database Ops: Save purchase and update subscriber list
    // Upsert the purchase record to prevent duplicates if webhook retries
    const purchase = await prisma.purchase.upsert({
      where: { gatewayOrderId: orderId },
      update: {
        paymentStatus,
        amount,
        currency,
      },
      create: {
        email,
        name,
        productSlug: 'geo-playbook',
        amount,
        currency,
        paymentStatus,
        paymentGateway: 'polar',
        gatewayOrderId: orderId,
        downloadToken,
      },
    });

    // Also add them as a subscriber in PostgreSQL
    await prisma.subscriber.upsert({
      where: { email },
      update: {
        name,
        leadMagnet: 'geo-playbook',
      },
      create: {
        email,
        name,
        leadMagnet: 'geo-playbook',
      },
    });

    // 6. Integrate with ConvertKit (Kit) API
    const convertKitApiKey = process.env.CONVERTKIT_API_KEY;
    const convertKitFormId = process.env.CONVERTKIT_FORM_ID;
    const convertKitTagId = process.env.CONVERTKIT_PLAYBOOK_TAG_ID; // Optional tag for purchases

    if (convertKitApiKey) {
      try {
        // Subscribe to general list
        if (convertKitFormId) {
          await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: convertKitApiKey,
              email,
              first_name: name || undefined,
            }),
          });
        }

        // Apply product tag in ConvertKit
        if (convertKitTagId) {
          await fetch(`https://api.convertkit.com/v3/tags/${convertKitTagId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: convertKitApiKey,
              email,
              first_name: name || undefined,
            }),
          });
        }
        console.log(`[POLAR WEBHOOK] Added subscriber ${email} to ConvertKit.`);
      } catch (ckErr) {
        console.error('[POLAR WEBHOOK] Failed to update ConvertKit list:', ckErr);
      }
    }

    // 7. Send Delivery Email with secure download link via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && isPaid) {
      const downloadUrl = `${process.env.NEXTAUTH_URL || 'https://omnirank.web.id'}/api/download?token=${downloadToken}`;
      const fromEmail = process.env.FROM_EMAIL || 'OmniRank <noreply@omnirank.web.id>';

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: '🔑 Your GEO Action Pack & Template Library Access Link',
            html: `
              <div style="font-family: sans-serif; padding: 24px; max-width: 600px; color: #1e293b;">
                <h2 style="color: #4f46e5; margin-bottom: 16px;">Thank you for your purchase!</h2>
                <p>Hi ${name || 'there'},</p>
                <p>We've successfully received your payment for <strong>The GEO Action Pack & Template Library 2026</strong>.</p>
                <p>Here is your secure, private link to duplicate the premium Notion templates and guides:</p>
                
                <div style="margin: 28px 0;">
                  <a href="${downloadUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Access Notion Templates & Guide
                  </a>
                </div>
                
                <p style="color: #64748b; font-size: 12px;">
                  Note: This link is unique to your email address and can be accessed up to 10 times. Please do not share this link with anyone else.
                </p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="font-size: 14px; color: #475569;">Best regards,<br/><strong>The OmniRank Team</strong></p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errText = await emailResponse.text();
          console.error('[POLAR WEBHOOK] Resend API Error Response:', errText);
        } else {
          console.log(`[POLAR WEBHOOK] Successfully sent delivery email to ${email}`);
        }
      } catch (emailErr) {
        console.error('[POLAR WEBHOOK] Failed to send email via Resend:', emailErr);
      }
    } else {
      console.warn(`[POLAR WEBHOOK] Resend API Key is missing or payment is not completed. Email delivery skipped for ${email}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully.',
    });
  } catch (error: any) {
    console.error('[POLAR WEBHOOK] Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
