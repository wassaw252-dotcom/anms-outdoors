const API_VERSION = '2026-07';

export type FulfillmentLine = {
  id: string;
  name: string;
  quantity: number;
  variantTitle?: string | null;
  sku?: string | null;
  shopeeUrl?: string | null;
  shopeeVariant?: string | null;
  supplierCost?: string | null;
};

export type FulfillmentOrder = {
  id: string;
  name: string;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  customerName: string;
  address: string;
  phone: string;
  lines: FulfillmentLine[];
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function shopDomain() {
  return required('SHOPIFY_SHOP_DOMAIN')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

type CachedToken = {
  value: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;

async function getAdminAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const shop = shopDomain();
  const clientId = required('SHOPIFY_CLIENT_ID');
  const clientSecret = required('SHOPIFY_CLIENT_SECRET');

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  const json = await response.json();

  if (!response.ok || !json.access_token) {
    throw new Error(`Unable to get Shopify access token: ${JSON.stringify(json)}`);
  }

  const expiresIn = Number(json.expires_in || 86399);
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + Math.max(expiresIn - 300, 60) * 1000,
  };

  return cachedToken.value;
}

export async function shopifyGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const shop = shopDomain();
  const token = await getAdminAccessToken();

  const response = await fetch(`https://${shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors || json, null, 2));
  }
  return json.data as T;
}

export async function getOpenOrders(): Promise<FulfillmentOrder[]> {
  const query = `#graphql
    query OpenOrders {
      orders(first: 25, reverse: true, sortKey: CREATED_AT, query: "fulfillment_status:unfulfilled") {
        nodes {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          shippingAddress {
            name
            address1
            address2
            city
            province
            zip
            country
            phone
          }
          lineItems(first: 50) {
            nodes {
              id
              name
              quantity
              variant {
                id
                title
                sku
                shopeeUrl: metafield(namespace: "anms", key: "shopee_url") { value }
                shopeeVariant: metafield(namespace: "anms", key: "shopee_variant") { value }
                supplierCost: metafield(namespace: "anms", key: "supplier_cost") { value }
              }
            }
          }
        }
      }
    }
  `;

  type Raw = {
    orders: {
      nodes: Array<{
        id: string;
        name: string;
        createdAt: string;
        displayFinancialStatus: string;
        displayFulfillmentStatus: string;
        shippingAddress?: {
          name?: string | null;
          address1?: string | null;
          address2?: string | null;
          city?: string | null;
          province?: string | null;
          zip?: string | null;
          country?: string | null;
          phone?: string | null;
        } | null;
        lineItems: {
          nodes: Array<{
            id: string;
            name: string;
            quantity: number;
            variant?: {
              title?: string | null;
              sku?: string | null;
              shopeeUrl?: { value: string } | null;
              shopeeVariant?: { value: string } | null;
              supplierCost?: { value: string } | null;
            } | null;
          }>;
        };
      }>;
    };
  };

  const data = await shopifyGraphQL<Raw>(query);

  return data.orders.nodes.map((order) => {
    const a = order.shippingAddress;
    const address = [a?.address1, a?.address2, a?.city, a?.province, a?.zip, a?.country]
      .filter(Boolean)
      .join(', ');

    return {
      id: order.id,
      name: order.name,
      createdAt: order.createdAt,
      financialStatus: order.displayFinancialStatus,
      fulfillmentStatus: order.displayFulfillmentStatus,
      customerName: a?.name || 'No shipping name',
      address: address || 'No shipping address',
      phone: a?.phone || '',
      lines: order.lineItems.nodes.map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        variantTitle: line.variant?.title,
        sku: line.variant?.sku,
        shopeeUrl: line.variant?.shopeeUrl?.value,
        shopeeVariant: line.variant?.shopeeVariant?.value,
        supplierCost: line.variant?.supplierCost?.value,
      })),
    };
  });
}
