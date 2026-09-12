# ANM's OUTDOORS — Shopee Fulfillment Automation

This app is intentionally isolated in the `fulfillment-automation` branch and the `automation/` directory. The Shopify theme on `main` is untouched.

## What v1 does

- Reads recent unfulfilled Shopify orders.
- Shows customer shipping details on a mobile-friendly dashboard.
- Reads Shopee supplier metadata from Shopify variant metafields.
- Gives a direct `Open Shopee Supplier` button for each ordered variant.
- Provides one-tap copy for customer name, phone number, and delivery address.
- Receives and verifies Shopify `orders/create` webhooks for the next notification stage.
- Protects the dashboard with HTTP Basic Auth.

## Variant metafields

Namespace: `anms`

- `shopee_url` — supplier listing URL
- `shopee_variant` — supplier variation text
- `supplier_cost` — supplier cost in MYR

These fields are Admin API readable/writable but are not exposed to Storefront or Customer Account APIs.

## Required Shopify app scopes

For the direct Admin API setup used by this v1 dashboard:

- `read_orders`
- `read_products`

Because the dashboard displays customer shipping name, phone, and address, the app must also be allowed to access the relevant protected customer/order data in Shopify.

Create/install a Shopify custom app for the store, then copy its Admin API access token into the deployment environment as `SHOPIFY_ADMIN_ACCESS_TOKEN`.

## Environment

Copy `.env.example` to `.env.local` for local development, or configure the same values in Vercel.

Never commit the real Admin API token, app client secret, or dashboard password.

## Vercel

Deploy this branch as a separate Vercel project with Root Directory set to:

`automation`

The Shopify theme project must continue using the `main` branch.

## Webhook

After deployment, register Shopify `orders/create` to:

`https://YOUR-AUTOMATION-DOMAIN/api/webhooks/orders-create`

Set `SHOPIFY_WEBHOOK_SECRET` to the Shopify app secret used to verify the `X-Shopify-Hmac-SHA256` signature for the webhook request.

The webhook handler intentionally does not log customer addresses or phone numbers.

## Current safety boundary

v1 does not place or pay for Shopee orders. It prepares everything needed for the owner to review and pay from the phone. Automated browser checkout/payment is intentionally a later phase.
