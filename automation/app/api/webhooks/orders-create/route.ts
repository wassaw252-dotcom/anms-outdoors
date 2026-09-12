import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function validHmac(rawBody: string, received: string | null, secret: string) {
  if (!received) return false;
  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  const a = Buffer.from(digest);
  const b = Buffer.from(received);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!secret) return NextResponse.json({ error: 'Shopify client secret not configured' }, { status: 503 });

  const rawBody = await request.text();
  const hmac = request.headers.get('x-shopify-hmac-sha256');

  if (!validHmac(rawBody, hmac, secret)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  const order = JSON.parse(rawBody);
  console.log('[orders/create]', {
    id: order.id,
    name: order.name,
    created_at: order.created_at,
    line_items: Array.isArray(order.line_items)
      ? order.line_items.map((item: any) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          title: item.title,
          variant_title: item.variant_title,
          quantity: item.quantity,
        }))
      : [],
  });

  return NextResponse.json({ ok: true });
}
