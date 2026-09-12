import { getOpenOrders } from '../lib/shopify';

export const dynamic = 'force-dynamic';

function money(v?: string | null) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? `RM${n.toFixed(2)}` : v;
}

export default async function Home() {
  let orders = [] as Awaited<ReturnType<typeof getOpenOrders>>;
  let error = '';

  try {
    orders = await getOpenOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unable to load Shopify orders';
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ANM&apos;s OUTDOORS</p>
          <h1>Shopee Fulfillment</h1>
        </div>
        <a className="refresh" href="/">Refresh</a>
      </header>

      <section className="status">
        <span className="dot" />
        <span>{error ? 'Setup required' : `${orders.length} unfulfilled order${orders.length === 1 ? '' : 's'}`}</span>
      </section>

      {error ? (
        <section className="empty errorBox">
          <h2>Connect Shopify Admin API</h2>
          <p>The dashboard code is ready, but deployment needs the Shopify environment variables listed in <code>.env.example</code>.</p>
          <details>
            <summary>Technical detail</summary>
            <pre>{error}</pre>
          </details>
        </section>
      ) : orders.length === 0 ? (
        <section className="empty">
          <h2>No orders waiting</h2>
          <p>New unfulfilled Shopify orders will appear here.</p>
        </section>
      ) : (
        <section className="orders">
          {orders.map((order) => (
            <article className="orderCard" key={order.id}>
              <div className="orderHead">
                <div>
                  <p className="muted">ORDER</p>
                  <h2>{order.name}</h2>
                </div>
                <span className="badge">{order.financialStatus}</span>
              </div>

              <div className="customer">
                <strong>{order.customerName}</strong>
                <p>{order.address}</p>
                {order.phone && <p>{order.phone}</p>}
              </div>

              <div className="items">
                {order.lines.map((line) => (
                  <div className="item" key={line.id}>
                    <div className="itemTop">
                      <div>
                        <strong>{line.name}</strong>
                        <p className="muted">Qty {line.quantity}{line.shopeeVariant ? ` · ${line.shopeeVariant}` : ''}</p>
                      </div>
                      {line.supplierCost && <span>{money(line.supplierCost)}</span>}
                    </div>

                    {line.shopeeUrl ? (
                      <a className="buyButton" href={line.shopeeUrl} target="_blank" rel="noreferrer">
                        Open Shopee Supplier
                      </a>
                    ) : (
                      <div className="missing">Supplier link not assigned yet</div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}

      <footer>Review the variation and delivery details before paying in Shopee.</footer>
    </main>
  );
}
