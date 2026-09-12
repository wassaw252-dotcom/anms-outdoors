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

For the Admin API setup used by this v1 dashboard:

- `read_orders`
- `read_products`

Because the dashboard displays customer shipping name, phone, and address, the app must also be allowed to access the relevant protected customer/order data in Shopify.

For Shopify Dev Dashboard apps created in 2026, do not paste a static Admin API token into this project. Create and install the app in the Shopify Dev Dashboard, then copy its Client ID and Client Secret into the deployment environment. The server exchanges those credentials for a short-lived Admin API access token and refreshes it automatically.

## Environment

Configure these values in Vercel or `.env.local`:

- `SHOPIFY_SHOP_DOMAIN=tvrj5j-ae.myshopify.com`
- `SHOPIFY_CLIENT_ID=...`
- `SHOPIFY_CLIENT_SECRET=...`
- `DASHBOARD_USER=...`
- `DASHBOARD_PASSWORD=...`

Never commit the real Client Secret or dashboard password.

## Vercel

Deploy this branch as a separate Vercel project with:

- Git repository: `wassaw252-dotcom/anms-outdoors`
- Production branch: `fulfillment-automation`
- Root Directory: `automation`
- Framework: Next.js

The Shopify storefront/theme project must continue using the `main` branch.

## Webhook

After deployment, register Shopify `orders/create` to:

`https://YOUR-AUTOMATION-DOMAIN/api/webhooks/orders-create`

The webhook signature is verified using `SHOPIFY_CLIENT_SECRET`.

The webhook handler intentionally does not log customer addresses or phone numbers.

## Current safety boundary

v1 does not place or pay for Shopee orders. It prepares everything needed for the owner to review and pay from the phone. Automated browser checkout/payment is intentionally a later phase.
