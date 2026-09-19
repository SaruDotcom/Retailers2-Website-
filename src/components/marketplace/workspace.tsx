import { Link, useNavigate } from "@/lib/router";
import { useState, useEffect } from "react";
import { Check, ChevronRight, Favorite, FavoriteBorder, LocationOn, Inventory2, ShoppingCartOutlined, Verified, VerifiedUser, Lock, LocalShipping, Notifications } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProduct, getWholesaler, money, products, type Order, type RetailerProfile } from "@/data/mock";
import { useStore } from "@/state/store";
import { CartItem, EmptyState, OrderCard, ProductGrid, SectionHeading, StatusBadge } from "./primitives";

export function DashboardPage() {
  const { wishlist, orders, retailerProfile, linkedWholesalerId, linkedWholesaler } = useStore();
  const connectedProducts = products.filter((p) => p.wholesalerId === linkedWholesalerId);
  const firstName = retailerProfile.ownerName.trim().split(" ")[0] || "Retailer";

  return (
    <main className="shell py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">Retailer workspace</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">Good morning, {firstName}</h1>
          <p className="mt-2 text-muted-foreground">{retailerProfile.businessName} is linked with <strong className="text-ink">{linkedWholesaler.name}</strong>.</p>
        </div>
        <Button asChild><Link to="/products">Continue shopping</Link></Button>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Active orders", orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length, "/orders"],
          ["Pending orders", orders.filter(o => o.status === "Pending").length, "/orders"],
          ["Linked Supplier", linkedWholesaler.name, "/products"],
          ["Wishlist items", wishlist.length, "/wishlist"],
        ].map(([label, value, to]) => (
          <Link key={label as string} to={to as "/orders" | "/products" | "/wishlist"} className="border bg-card p-5 interactive rounded-2xl">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <strong className="mt-2 block text-xl sm:text-2xl text-ink font-black truncate">{value}</strong>
          </Link>
        ))}
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionHeading title="Recent orders" subtitle="Track your latest replenishment activity" href="/orders" />
          {orders.length > 0 ? (
            <div className="grid gap-3">
              {orders.slice(0, 3).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-sm text-muted-foreground bg-card">
              No orders placed yet. Explore trade products to start ordering.
            </div>
          )}
        </section>
        <section>
          <SectionHeading title="Quick actions" />
          <div className="grid gap-3">
            {[
              [`Browse ${linkedWholesaler.name}`, "Shop trade catalog and place bulk orders", "/products"],
              ["Review wishlist", "Return to products you saved", "/wishlist"],
              ["Manage delivery addresses", "Keep your store details ready", "/addresses"],
            ].map(([t, d, to]) => (
              <Link key={t} to={to as "/products" | "/wishlist" | "/addresses"} className="flex items-center justify-between border bg-card p-4 interactive rounded-xl">
                <div>
                  <b className="block text-ink text-sm font-extrabold">{t}</b>
                  <span className="text-xs text-muted-foreground">{d}</span>
                </div>
                <ChevronRight className="size-4 text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-14">
        <SectionHeading title={`Catalogue from ${linkedWholesaler.name}`} subtitle="Direct wholesale trade catalog" href="/products" />
        <ProductGrid products={connectedProducts.slice(0, 4)} />
      </section>
    </main>
  );
}

export function OrdersPage() {
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState("All orders");

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "All orders") return true;
    return o.status === activeTab;
  });

  return (
    <main className="shell py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">Order history</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">Your orders</h1>
          <p className="mt-2 text-muted-foreground">Every wholesale order, in one place.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/products">Shop products</Link>
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap gap-2 border-b pb-3">
        {["All orders", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      {filteredOrders.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid min-h-64 place-items-center rounded-2xl border border-dashed bg-card p-8 text-center">
          <div>
            <Inventory2 className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-3 font-bold text-ink">No orders found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === "All orders" ? "You haven't placed any wholesale orders yet." : `No orders with status "${activeTab}".`}
            </p>
            <Button asChild className="mt-5 rounded-xl font-bold">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

export function OrderDetailsPage({ orderId }: { orderId: string }) {
  const { orders, retailerProfile } = useStore();
  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  if (!order) {
    return (
      <main className="shell py-16 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Button asChild className="mt-4"><Link to="/orders">Back to orders</Link></Button>
      </main>
    );
  }

  const wholesaler = getWholesaler(order.wholesalerId);

  return (
    <main className="shell py-10">
      <Link to="/orders" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to orders
      </Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Order {order.id} · {order.date}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">{wholesaler.name}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="border bg-card p-6">
          <h2 className="text-xl font-bold">Order timeline</h2>
          <div className="mt-6 grid gap-5">
            {["Order placed", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <span className={`grid size-8 place-items-center border ${i < 3 ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {i < 3 ? <Check className="size-4" /> : i + 1}
                </span>
                <div>
                  <b>{step}</b>
                  <p className="text-xs text-muted-foreground">{i < 3 ? "Completed" : "Awaiting update"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="border bg-card p-5">
            <h2 className="font-bold">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>{order.items.length} products</span>
              <b>{money(order.total)}</b>
            </div>
            <Button className="mt-5 w-full" variant="outline">Download invoice</Button>
          </div>
          <div className="border bg-card p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <LocationOn className="size-4 text-primary" />
              Delivery address
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              <strong>{retailerProfile.businessName}</strong> ({retailerProfile.ownerName})<br />
              {retailerProfile.address}, {retailerProfile.city}, {retailerProfile.state} {retailerProfile.pincode}<br />
              {retailerProfile.phone}
            </p>
          </div>
        </aside>
      </div>
      <section className="mt-8 border bg-card p-6">
        <h2 className="text-xl font-bold">Products in this order</h2>
        <div className="mt-4 divide-y">
          {order.items.map((item) => {
            const p = getProduct(item.productId);
            return (
              <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-4">
                <div>
                  <b>{p.name}</b>
                  <p className="mt-1 text-sm text-muted-foreground">{item.quantity} units · {money(p.price)} each</p>
                </div>
                <strong className="text-primary sm:text-ink">{money(p.price * item.quantity)}</strong>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export function CartPage() {
  const { cart } = useStore();

  const groups = cart.reduce<Record<string, typeof cart>>((result, line) => {
    const wholesalerId = getWholesaler(getProduct(line.productId).wholesalerId).id;
    const current = result[wholesalerId] ?? [];
    result[wholesalerId] = [...current, line];
    return result;
  }, {});

  const total = cart.reduce((sum, line) => sum + getProduct(line.productId).price * line.quantity, 0);
  const savings = cart.reduce((sum, line) => {
    const product = getProduct(line.productId);
    return sum + Math.max(0, product.mrp - product.price) * line.quantity;
  }, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const wholesalerCount = Object.keys(groups).length;

  return (
    <main className="pb-16 sm:pb-20">
      <section className="border-b border-primary/10 bg-gradient-to-br from-canvas via-background to-primary/[0.045]">
        <div className="shell py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                YOUR CART
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black text-ink sm:text-4xl tracking-tight">Shopping Cart</h1>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground border border-border/80">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-2.5 text-base text-muted-foreground">
                Review your items before checkout. Orders are split per wholesaler for direct fulfillment.
              </p>
              {cart.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border/80 px-3.5 py-2 font-bold text-ink shadow-2xs">
                    <span className="text-primary font-black">{wholesalerCount}</span> {wholesalerCount === 1 ? "Wholesaler" : "Wholesalers"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border/80 px-3.5 py-2 font-bold text-ink shadow-2xs">
                    <span className="text-primary font-black">{itemCount}</span> Total Items
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border/80 px-3.5 py-2 font-bold text-ink shadow-2xs">
                    <span className="text-primary font-black">{money(total)}</span> Subtotal
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-2.5 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs shrink-0 max-w-xs text-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="size-4 text-primary shrink-0" />
                <span className="font-bold text-ink">Secure wholesale checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <VerifiedUser className="size-4 text-emerald-600 shrink-0" />
                <span className="text-muted-foreground">Verified suppliers only</span>
              </div>
              <div className="flex items-center gap-2.5">
                <LocalShipping className="size-4 text-primary shrink-0" />
                <span className="text-muted-foreground">Prices & SLA confirmed on approval</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shell">
        {cart.length === 0 ? (
          <section className="mt-10 grid min-h-[420px] place-items-center rounded-2xl border border-dashed border-border/80 bg-card/60 p-8 text-center shadow-xs">
            <div className="max-w-md">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10 text-primary shadow-inner">
                <ShoppingCartOutlined className="size-10" />
              </span>
              <h2 className="mt-6 text-2xl font-black text-ink sm:text-3xl">Your cart is empty</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Add products from your connected wholesalers to get started.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="rounded-xl bg-primary font-bold shadow-md">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl font-semibold">
                  <Link to="/wholesalers">View Wholesalers</Link>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)] lg:gap-10">
            <section className="space-y-8">
              {Object.entries(groups).map(([wholesalerId, lines]) => {
                const wholesaler = getWholesaler(wholesalerId);
                const groupTotal = lines.reduce((sum, line) => sum + getProduct(line.productId).price * line.quantity, 0);

                return (
                  <article key={wholesalerId} className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-canvas/50 px-6 py-4.5 sm:px-7">
                      <div className="flex items-center gap-3.5">
                        <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-ink/20 text-sm font-black text-primary border border-primary/20">
                          {wholesaler.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link to="/wholesalers/$wholesalerId" params={{ wholesalerId: wholesaler.id }} className="font-black text-ink hover:text-primary sm:text-lg">
                              {wholesaler.name}
                            </Link>
                            {wholesaler.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                <Verified className="size-3 text-emerald-600" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2">
                            <span>Orders fulfilled separately</span>
                            <span>•</span>
                            <span className="font-semibold text-foreground/80">{wholesaler.delivery}</span>
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-bold text-secondary-foreground border border-border/60">
                        {lines.length} {lines.length === 1 ? "item" : "items"} ({money(groupTotal)})
                      </span>
                    </header>

                    <div className="px-6 sm:px-7">
                      {lines.map((line) => (
                        <CartItem key={line.productId} product={getProduct(line.productId)} quantity={line.quantity} />
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm lg:sticky lg:top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-ink">Order summary</h2>
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                    {wholesalerCount} {wholesalerCount === 1 ? "Wholesaler" : "Wholesalers"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Orders are split per wholesaler for direct fulfillment</p>
              </div>

              <div className="space-y-4 text-sm border-t border-border/70 pt-5">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <b className="font-bold text-ink">{money(total)}</b>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Estimated delivery</span>
                  <span className="text-right font-semibold text-emerald-600">Confirmed by each wholesaler</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 text-sm font-bold text-emerald-700 flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-600 text-white font-black text-xs shrink-0">%</span>
                  <span>You’re saving {money(savings)} on this order</span>
                </div>
              )}

              <div className="border-t border-border/80 pt-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-ink block">Total</span>
                    <span className="text-xs text-muted-foreground">All items & taxes included</span>
                  </div>
                  <strong className="text-2xl sm:text-3xl font-black text-primary">{money(total)}</strong>
                </div>
              </div>

              <Button asChild className="w-full rounded-xl bg-primary text-primary-foreground h-12 text-base font-extrabold" size="lg">
                <Link to="/checkout" className="flex items-center justify-center gap-2">Proceed to Checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export function CheckoutPage() {
  const { cart, retailerProfile, placeOrder } = useStore();
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((sum, line) => sum + getProduct(line.productId).price * line.quantity, 0);

  if (placed) {
    return (
      <main className="shell py-16">
        <div className="mx-auto max-w-xl border bg-card p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center bg-success text-success-foreground"><Check /></span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink">Order placed successfully</h1>
          <p className="mt-3 text-muted-foreground">Your order has been split into separate requests for each wholesaler.</p>
          <Button asChild className="mt-6"><Link to="/orders">View orders</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="shell py-10">
      <h1 className="text-3xl font-extrabold text-ink">Checkout</h1>
      <p className="mt-2 text-muted-foreground">Complete your delivery details and review the separated wholesaler orders.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="border bg-card p-6">
            <h2 className="text-xl font-bold">Delivery address</h2>
            <div className="mt-4 border border-primary bg-brand-soft p-4">
              <b>{retailerProfile.businessName}</b>
              <p className="mt-1 text-sm text-muted-foreground">
                {retailerProfile.ownerName}<br />
                {retailerProfile.address}, {retailerProfile.city}, {retailerProfile.state} {retailerProfile.pincode}<br />
                {retailerProfile.phone}
              </p>
            </div>
          </div>
          <div className="border bg-card p-6">
            <h2 className="text-xl font-bold">Payment method</h2>
            <label className="mt-4 flex items-start gap-3 border p-4">
              <input type="radio" defaultChecked name="payment" />
              <span>
                <b>Pay on delivery</b>
                <span className="mt-1 block text-sm text-muted-foreground">Available for approved retailer accounts</span>
              </span>
            </label>
          </div>
        </section>
        <aside className="h-fit border bg-card p-6">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-5 space-y-3">
            {cart.map((line) => {
              const p = getProduct(line.productId);
              return (
                <div key={line.productId} className="flex justify-between gap-4 text-sm">
                  <span>{p.name} × {line.quantity}</span>
                  <b>{money(p.price * line.quantity)}</b>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex justify-between border-t pt-5 text-lg">
            <b>Total</b>
            <strong>{money(total)}</strong>
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={() => { placeOrder(); setPlaced(true); }}>
            Place order
          </Button>
        </aside>
      </div>
    </main>
  );
}

export function WishlistPage() {
  const { wishlist } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));
  const totalValue = saved.reduce((sum, p) => sum + p.price, 0);

  return (
    <main className="pb-16 sm:pb-20">
      <section className="border-b border-primary/10 bg-gradient-to-br from-canvas via-background to-primary/[0.045]">
        <div className="shell py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                SAVED FOR LATER
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black text-ink sm:text-4xl tracking-tight">Your Wishlist</h1>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground border border-border/80">
                  {saved.length} {saved.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-2.5 text-base text-muted-foreground">
                Products saved for your next store restock. Access pricing and stock anytime.
              </p>
              {saved.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-card border border-border/80 px-4 py-2 text-xs">
                    <span className="text-muted-foreground font-medium">Total estimated value:</span>
                    <strong className="text-sm font-black text-primary">{money(totalValue)}</strong>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-ink/10 text-primary border border-primary/20">
              <Favorite className="size-12 fill-primary text-primary" />
            </div>
          </div>
        </div>
      </section>

      <div className="shell mt-10">
        {saved.length ? (
          <ProductGrid products={saved} premium />
        ) : (
          <section className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-border/80 bg-canvas/60 p-8 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
                <FavoriteBorder className="size-8" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold text-ink">Your wishlist is empty</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Save products you want to reorder later by clicking the heart icon on any product card.
              </p>
              <Button asChild className="mt-6 rounded-xl font-bold">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export function NotificationsPage() {
  const { notifications, markRead, unread } = useStore();

  return (
    <main className="pb-16 sm:pb-20">
      <section className="border-b border-primary/10 bg-gradient-to-br from-canvas via-background to-primary/[0.045]">
        <div className="shell py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                NOTIFICATIONS
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black text-ink sm:text-4xl tracking-tight">Stay Updated</h1>
                {unread > 0 && (
                  <span className="rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-extrabold">
                    {unread} new {unread === 1 ? "notification" : "notifications"}
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-base text-muted-foreground">
                Updates about orders, connection access requests, price drops and trade terms.
              </p>
              <div className="mt-5">
                <Button variant="outline" size="sm" onClick={markRead} className="rounded-xl font-bold border-border">
                  Mark all as read
                </Button>
              </div>
            </div>

            <div className="hidden md:grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-ink/10 text-primary border border-primary/20">
              <Notifications className="size-12 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <div className="shell mt-8">
        <div className="grid gap-3 max-w-3xl">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-4 rounded-2xl border p-5 transition-all ${
                  n.unread ? "bg-card border-primary/30 shadow-2xs" : "bg-canvas/60 border-border/70"
                }`}
              >
                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
                    <b className="font-extrabold text-ink text-base">{n.title}</b>
                    <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-2xl">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function ProfilePage() {
  const { retailerProfile, saveProfile } = useStore();
  const [form, setForm] = useState<RetailerProfile>(retailerProfile);

  useEffect(() => {
    setForm(retailerProfile);
  }, [retailerProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
  };

  return (
    <main className="shell py-10">
      <h1 className="text-3xl font-extrabold text-ink">Business profile</h1>
      <p className="mt-2 text-muted-foreground">Keep your retailer details ready for every wholesale order.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section className="border bg-card p-6">
          <h2 className="text-xl font-bold">Business information</h2>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-semibold">
              Business name
              <Input
                className="mt-2"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              GST number
              <Input
                className="mt-2"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              Business type
              <Input
                className="mt-2"
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              Owner name
              <Input
                className="mt-2"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Email address
              <Input
                className="mt-2"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              Mobile number
              <Input
                className="mt-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              City
              <Input
                className="mt-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Shop / Godown address
              <Input
                className="mt-2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" className="mt-2">Save changes</Button>
            </div>
          </form>
        </section>
        <aside className="border bg-card p-6">
          <VerifiedUser className="size-7 text-success" />
          <h2 className="mt-4 font-bold">Verified retailer account</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your business information is ready to share with connected wholesalers.
          </p>
        </aside>
      </div>
    </main>
  );
}

export function AddressesPage() {
  const { retailerProfile } = useStore();

  return (
    <main className="shell py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Delivery addresses</h1>
          <p className="mt-2 text-muted-foreground">Choose where your wholesale orders should arrive.</p>
        </div>
        <Button>Add address</Button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <LocationOn className="size-4 text-primary" /> Main Store Address
            </div>
            <Badge variant="secondary">Primary</Badge>
          </div>
          <h2 className="mt-5 font-bold">{retailerProfile.businessName}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {retailerProfile.address}, {retailerProfile.city}, {retailerProfile.state} {retailerProfile.pincode}<br />
            Phone: {retailerProfile.phone}
          </p>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export function SettingsPage() {
  return (
    <main className="shell py-10">
      <h1 className="text-3xl font-extrabold text-ink">Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage how NEXORA keeps you updated.</p>
      <div className="mt-8 max-w-2xl border bg-card p-6">
        <h2 className="text-xl font-bold">Notifications</h2>
        {[
          ["Order updates", "Get shipping and delivery updates"],
          ["Price alerts", "Know when saved products change price"],
          ["Wholesaler messages", "Receive catalogue and access updates"],
        ].map(([title, body], i) => (
          <label key={title} className="flex items-center justify-between gap-4 border-b py-5 last:border-0">
            <span>
              <b>{title}</b>
              <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
            </span>
            <input type="checkbox" defaultChecked={i < 2} />
          </label>
        ))}
        <Button className="mt-5">Save preferences</Button>
      </div>
    </main>
  );
}

export function AuthPage({ mode }: { mode: "login" | "register" | "forgot" }) {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = mode === "login" ? "Welcome back" : mode === "register" ? "Create your retailer account" : "Reset your password";

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login(email || "amit@kapoorgeneral.example");
      navigate({ to: "/dashboard" });
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    login(demoEmail);
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="grid min-h-[calc(100vh-120px)] place-items-center bg-canvas px-4 py-12">
      <section className="w-full max-w-md border bg-card p-7 shadow-sm rounded-2xl">
        <div className="text-center">
          <span className="mx-auto grid size-11 place-items-center bg-primary font-extrabold text-primary-foreground rounded-xl">
            N
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "register" ? "Join thousands of retailers sourcing better." : mode === "forgot" ? "We’ll send a reset link to your account email." : "Sign in to your NEXORA shopping workspace."}
          </p>
        </div>

        <form className="mt-7 grid gap-4" onSubmit={handleAuthSubmit}>
          <label className="text-sm font-semibold">
            Email address
            <Input
              className="mt-2"
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {mode !== "forgot" && (
            <label className="text-sm font-semibold">
              Password
              <Input
                className="mt-2"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          )}
          <Button type="submit" size="lg" className="mt-2 rounded-xl font-extrabold">
            {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
          </Button>
        </form>

        {mode === "login" && (
          <div className="mt-6 border-t pt-5 space-y-3">
            <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Quick Test Account Login
            </p>
            <div className="grid gap-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("amit@kapoorgeneral.example")}
                className="justify-between text-left rounded-xl h-auto py-2.5 px-3"
              >
                <div>
                  <b className="block text-ink">Retailer A (Amit Kapoor)</b>
                  <span className="text-muted-foreground text-[11px]">4 Connected Wholesalers · 9 Orders</span>
                </div>
                <ChevronRight className="size-4 text-primary" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("verma@singh-traders.example")}
                className="justify-between text-left rounded-xl h-auto py-2.5 px-3"
              >
                <div>
                  <b className="block text-ink">Retailer B (Rajesh Verma)</b>
                  <span className="text-muted-foreground text-[11px]">2 Connected Wholesalers · 2 Orders</span>
                </div>
                <ChevronRight className="size-4 text-primary" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              <Link className="text-primary hover:underline" to="/forgot-password">Forgot password?</Link>
              <p className="mt-3">New to NEXORA? <Link className="font-semibold text-primary" to="/register">Create an account</Link></p>
            </>
          ) : (
            <Link className="text-primary hover:underline" to="/login">Back to sign in</Link>
          )}
        </div>
      </section>
    </main>
  );
}
