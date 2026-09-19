import { Link } from "@/lib/router";
import { useState } from "react";
import { Check, ChevronRight, Favorite, FavoriteBorder, LocationOn, Inventory2, ShoppingCartOutlined, Verified, VerifiedUser, Lock, LocalShipping, Notifications } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addresses, getProduct, getWholesaler, money, orders, products, type Order } from "@/data/mock";
import { useStore } from "@/state/store";
import { CartItem, EmptyState, OrderCard, ProductGrid, SectionHeading, StatusBadge } from "./primitives";

function getFallbackOrder(): Order { const order = orders[0]; if (!order) throw new Error("Mock order data is empty"); return order; }
function getPrimaryAddress(): (typeof addresses)[number] { const address = addresses[0]; if (!address) throw new Error("Mock address data is empty"); return address; }
const fallbackOrder: Order = getFallbackOrder();
const primaryAddress = getPrimaryAddress();

export function DashboardPage() {
  const { cart, wishlist, relationships } = useStore();
  const connectedProducts = products.filter((p) => relationships[p.wholesalerId] === "Connected");
  return <main className="shell py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Retailer workspace</p><h1 className="mt-2 text-3xl font-extrabold text-ink">Good morning, Amit</h1><p className="mt-2 text-muted-foreground">Your store is ready for its next restock.</p></div><Button asChild><Link to="/products">Continue shopping</Link></Button></div><div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Active orders", orders.filter(o=>!["Delivered","Cancelled"].includes(o.status)).length,"/orders"],["Pending orders",orders.filter(o=>o.status==="Pending").length,"/orders"],["Connected wholesalers",Object.values(relationships).filter(r=>r==="Connected").length,"/wholesalers"],["Wishlist items",wishlist.length,"/wishlist"]].map(([label,value,to])=><Link key={label} to={to as "/orders"|"/wholesalers"|"/wishlist"} className="border bg-card p-5 interactive"><span className="text-sm text-muted-foreground">{label}</span><strong className="mt-2 block text-3xl text-ink">{value}</strong></Link>)}</div><div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]"><section><SectionHeading title="Recent orders" subtitle="Track your latest replenishment activity" href="/orders"/><div className="grid gap-3">{orders.slice(0,3).map(order=><OrderCard key={order.id} order={order}/>)}</div></section><section><SectionHeading title="Quick actions"/><div className="grid gap-3">{[["Find wholesalers","Compare suppliers and grow your network","/wholesalers"],["Review wishlist","Return to products you saved","/wishlist"],["Manage delivery addresses","Keep your store details ready","/addresses"]].map(([title,body,to])=><Link key={title} to={to as "/wholesalers"|"/wishlist"|"/addresses"} className="flex items-center justify-between border bg-card p-5 interactive"><div><b>{title}</b><p className="mt-1 text-sm text-muted-foreground">{body}</p></div><ChevronRight className="size-5 text-primary"/></Link>)}</div></section></div><section className="mt-12"><SectionHeading title="Recommended for your store" subtitle="Popular trade-ready products" href="/products"/><ProductGrid products={connectedProducts.slice(0,4)}/></section></main>
}

export function OrdersPage() { return <main className="shell py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Order history</p><h1 className="mt-2 text-3xl font-extrabold text-ink">Your orders</h1><p className="mt-2 text-muted-foreground">Every wholesale order, in one place.</p></div><Button asChild variant="outline"><Link to="/products">Shop products</Link></Button></div><div className="mt-8 flex flex-wrap gap-2 border-b pb-3">{["All orders","Pending","Confirmed","Processing","Shipped","Delivered","Cancelled"].map((tab,i)=><Button key={tab} variant={i===0?"secondary":"ghost"} size="sm">{tab}</Button>)}</div><div className="mt-6 grid gap-3">{orders.map(order=><OrderCard key={order.id} order={order}/>)}</div></main> }

export function OrderDetailsPage({ orderId }: { orderId: string }) { const order=orders.find(o=>o.id===orderId) ?? fallbackOrder; const wholesaler=getWholesaler(order.wholesalerId); return <main className="shell py-10"><Link to="/orders" className="text-sm text-muted-foreground hover:text-primary">← Back to orders</Link><div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-muted-foreground">Order {order.id} · {order.date}</p><h1 className="mt-2 text-3xl font-extrabold text-ink">{wholesaler.name}</h1></div><StatusBadge status={order.status}/></div><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]"><section className="border bg-card p-6"><h2 className="text-xl font-bold">Order timeline</h2><div className="mt-6 grid gap-5">{["Order placed","Confirmed","Processing","Packed","Shipped","Delivered"].map((step,i)=><div key={step} className="flex items-center gap-4"><span className={`grid size-8 place-items-center border ${i<3?"border-primary bg-primary text-primary-foreground":"text-muted-foreground"}`}>{i<3?<Check className="size-4"/>:i+1}</span><div><b>{step}</b><p className="text-xs text-muted-foreground">{i<3?"Completed":"Awaiting update"}</p></div></div>)}</div></section><aside className="space-y-4"><div className="border bg-card p-5"><h2 className="font-bold">Order summary</h2><div className="mt-4 flex justify-between text-sm"><span>{order.items.length} products</span><b>{money(order.total)}</b></div><Button className="mt-5 w-full" variant="outline">Download invoice</Button></div><div className="border bg-card p-5"><h2 className="flex items-center gap-2 font-bold"><LocationOn className="size-4 text-primary"/>Delivery address</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{primaryAddress.name}<br/>{primaryAddress.line}<br/>{primaryAddress.phone}</p></div></aside></div><section className="mt-8 border bg-card p-6"><h2 className="text-xl font-bold">Products in this order</h2><div className="mt-4 divide-y">{order.items.map(item=>{const p=getProduct(item.productId);return <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-4"><div><b>{p.name}</b><p className="mt-1 text-sm text-muted-foreground">{item.quantity} units · {money(p.price)} each</p></div><strong className="text-primary sm:text-ink">{money(p.price*item.quantity)}</strong></div>})}</div></section></main> }

export function CartPage() {
  const { cart } = useStore();

  const groups = cart.reduce<Record<string, typeof cart>>((result, line) => {
    const wholesalerId = getWholesaler(getProduct(line.productId).wholesalerId).id;
    const current = result[wholesalerId] ?? [];
    result[wholesalerId] = [...current, line];
    return result;
  }, {});

  const total = cart.reduce(
    (sum, line) => sum + getProduct(line.productId).price * line.quantity,
    0
  );
  const savings = cart.reduce((sum, line) => {
    const product = getProduct(line.productId);
    return sum + Math.max(0, product.mrp - product.price) * line.quantity;
  }, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const wholesalerCount = Object.keys(groups).length;

  return (
    <main className="pb-16 sm:pb-20">
      {/* Banner Header */}
      <section className="border-b border-primary/10 bg-gradient-to-br from-canvas via-background to-primary/[0.045] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2">
        <div className="shell py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                YOUR CART
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black text-ink sm:text-4xl tracking-tight">
                  Shopping Cart
                </h1>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground border border-border/80">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-2.5 text-base text-muted-foreground">
                Review your items before checkout. Orders are split per wholesaler for direct fulfillment.
              </p>

              {/* Informative summary stat inline inside banner */}
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

            {/* Reassurance / Trust Badge Strip */}
            <div className="grid gap-2.5 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs shrink-0 max-w-xs text-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="size-4 text-primary shrink-0" />
                <span className="font-bold text-ink">Secure wholesale checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <VerifiedUser className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
        {/* Empty Cart State or Cart Items Grid */}
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
                <Button asChild size="lg" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-bold shadow-md transition-all hover:-translate-y-0.5">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl px-6 font-semibold">
                  <Link to="/wholesalers">View Wholesalers</Link>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)] lg:gap-10">
            {/* LEFT column (~65%): Cart items list grouped by wholesaler */}
            <section className="space-y-8">
              {Object.entries(groups).map(([wholesalerId, lines]) => {
                const wholesaler = getWholesaler(wholesalerId);
                const groupTotal = lines.reduce(
                  (sum, line) => sum + getProduct(line.productId).price * line.quantity,
                  0
                );

                return (
                  <article
                    key={wholesalerId}
                    className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    {/* Wholesaler Group Header */}
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-canvas/50 px-6 py-4.5 sm:px-7">
                      <div className="flex items-center gap-3.5">
                        <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-ink/20 text-sm font-black text-primary border border-primary/20 shadow-2xs">
                          {wholesaler.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              to="/wholesalers/$wholesalerId"
                              params={{ wholesalerId: wholesaler.id }}
                              className="font-black text-ink transition-colors hover:text-primary sm:text-lg"
                            >
                              {wholesaler.name}
                            </Link>
                            {wholesaler.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                <Verified className="size-3 text-emerald-600 dark:text-emerald-400" />
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
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-bold text-secondary-foreground border border-border/60">
                          {lines.length} {lines.length === 1 ? "item" : "items"} ({money(groupTotal)})
                        </span>
                      </div>
                    </header>

                    {/* Wholesaler Items List */}
                    <div className="px-6 sm:px-7">
                      {lines.map((line) => (
                        <CartItem
                          key={line.productId}
                          product={getProduct(line.productId)}
                          quantity={line.quantity}
                        />
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>

            {/* RIGHT column (~35%): Order Summary Card */}
            <aside className="h-fit rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm lg:sticky lg:top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-ink">Order summary</h2>
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                    {wholesalerCount} {wholesalerCount === 1 ? "Wholesaler" : "Wholesalers"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Orders are split per wholesaler for direct fulfillment
                </p>
              </div>

              <div className="space-y-4 text-sm border-t border-border/70 pt-5">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <b className="font-bold text-ink">{money(total)}</b>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Estimated delivery</span>
                  <span className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    Confirmed by each wholesaler
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Taxes & GST</span>
                  <span className="text-foreground/80 font-medium">Included where applicable</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-600 text-white font-black text-xs shrink-0">
                    %
                  </span>
                  <span>You’re saving {money(savings)} on this order</span>
                </div>
              )}

              <div className="border-t border-border/80 pt-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-ink block">Total</span>
                    <span className="text-xs text-muted-foreground">All items & taxes included</span>
                  </div>
                  <strong className="text-2xl sm:text-3xl font-black text-primary tracking-tight transition-all">
                    {money(total)}
                  </strong>
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg h-12 text-base font-extrabold transition-all duration-200 active:scale-[0.98]"
                size="lg"
              >
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                </Link>
              </Button>

              <div className="rounded-xl bg-canvas/80 border border-border/60 p-3.5 text-center">
                <p className="flex items-start justify-center gap-2 text-xs leading-relaxed text-muted-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <strong>Secure checkout</strong> · Prices confirmed after wholesaler approval
                  </span>
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export function CheckoutPage() { const { cart }=useStore(); const [placed,setPlaced]=useState(false); const total=cart.reduce((sum,line)=>sum+getProduct(line.productId).price*line.quantity,0); if(placed)return <main className="shell py-16"><div className="mx-auto max-w-xl border bg-card p-8 text-center"><span className="mx-auto grid size-14 place-items-center bg-success text-success-foreground"><Check/></span><h1 className="mt-5 text-3xl font-extrabold text-ink">Order placed successfully</h1><p className="mt-3 text-muted-foreground">Your order has been split into separate requests for each wholesaler.</p><div className="mt-6 grid gap-2 text-left">{[...new Set(cart.map(line=>getWholesaler(getProduct(line.productId).wholesalerId).name))].map((name,i)=><div key={name} className="flex justify-between border p-3 text-sm"><span>{name}</span><b>NX-2609{18+i}</b></div>)}</div><Button asChild className="mt-6"><Link to="/orders">View orders</Link></Button></div></main>; return <main className="shell py-10"><h1 className="text-3xl font-extrabold text-ink">Checkout</h1><p className="mt-2 text-muted-foreground">Complete your delivery details and review the separated wholesaler orders.</p><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"><section className="space-y-5"><div className="border bg-card p-6"><h2 className="text-xl font-bold">Delivery address</h2><div className="mt-4 border border-primary bg-brand-soft p-4"><b>{primaryAddress.name}</b><p className="mt-1 text-sm text-muted-foreground">{primaryAddress.line}<br/>{primaryAddress.phone}</p></div><Button variant="outline" className="mt-4">Choose another address</Button></div><div className="border bg-card p-6"><h2 className="text-xl font-bold">Payment method</h2><label className="mt-4 flex items-start gap-3 border p-4"><input type="radio" defaultChecked name="payment"/><span><b>Pay on delivery</b><span className="mt-1 block text-sm text-muted-foreground">Available for approved retailer accounts</span></span></label><label className="mt-3 flex items-start gap-3 border p-4"><input type="radio" name="payment"/><span><b>Bank transfer</b><span className="mt-1 block text-sm text-muted-foreground">Instructions will be shared after confirmation</span></span></label></div></section><aside className="h-fit border bg-card p-6"><h2 className="text-xl font-bold">Order summary</h2><div className="mt-5 space-y-3">{cart.map(line=>{const p=getProduct(line.productId);return <div key={line.productId} className="flex justify-between gap-4 text-sm"><span>{p.name} × {line.quantity}</span><b>{money(p.price*line.quantity)}</b></div>})}</div><div className="mt-5 flex justify-between border-t pt-5 text-lg"><b>Total</b><strong>{money(total)}</strong></div><Button className="mt-6 w-full" size="lg" onClick={()=>setPlaced(true)}>Place order</Button><p className="mt-3 text-center text-xs text-muted-foreground">Each wholesaler will confirm and fulfil their part separately.</p></aside></div></main> }

export function WishlistPage() {
  const { wishlist } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));
  const totalValue = saved.reduce((sum, p) => sum + p.price, 0);

  return (
    <main className="pb-16 sm:pb-20">
      {/* Banner Header */}
      <section className="border-b border-primary/10 bg-gradient-to-br from-canvas via-background to-primary/[0.045] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2">
        <div className="shell py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                SAVED FOR LATER
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black text-ink sm:text-4xl tracking-tight">
                  Your Wishlist
                </h1>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground border border-border/80">
                  {saved.length} {saved.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-2.5 text-base text-muted-foreground">
                Products saved for your next store restock. Access pricing and stock anytime.
              </p>

              {/* Highlighted Stat: Total estimated value */}
              {saved.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-card border border-border/80 px-4 py-2 text-xs shadow-2xs">
                    <span className="text-muted-foreground font-medium">Total estimated value:</span>
                    <strong className="text-sm font-black text-primary">{money(totalValue)}</strong>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Inclusive of applicable wholesale trade rates
                  </span>
                </div>
              )}
            </div>

            {/* Stylized Icon Graphic */}
            <div className="hidden md:grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-ink/10 text-primary border border-primary/20 shadow-xs">
              <Favorite className="size-12 fill-primary text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="shell mt-10">
        {saved.length ? (
          <ProductGrid products={saved} premium />
        ) : (
          <section className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-border/80 bg-canvas/60 p-8 text-center shadow-2xs">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
                <FavoriteBorder className="size-8" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold text-ink">Your wishlist is empty</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
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
  const { markRead, unread } = useStore();
  const notificationsList = [
    { title: "Order NX-240902 has shipped", body: "Gupta Wholesale Co. expects delivery by 20 Sep.", time: "12 min ago", unread: true },
    { title: "Access request approved", body: "You can now shop the full Paperlane Supply House catalogue.", time: "2 hours ago", unread: true },
    { title: "Price drop on your wishlist", body: "Classic Electric Kettle is now ₹899 per unit.", time: "Yesterday", unread: true },
    { title: "Order delivered", body: "Your Metro Cash Network order was delivered successfully.", time: "2 days ago", unread: false },
  ];

  return (
    <main className="pb-16 sm:pb-20">
      {/* Banner Header */}
      <section className="border-b border-primary/10 bg-gradient-to-br from-canvas via-background to-primary/[0.045] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2">
        <div className="shell py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                NOTIFICATIONS
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black text-ink sm:text-4xl tracking-tight">
                  Stay Updated
                </h1>
                {unread > 0 && (
                  <span className="rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-extrabold shadow-2xs">
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

            {/* Stylized Bell Icon Graphic */}
            <div className="hidden md:grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-ink/10 text-primary border border-primary/20 shadow-xs">
              <Notifications className="size-12 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <div className="shell mt-8">
        <div className="grid gap-3 max-w-3xl">
          {notificationsList.map((n) => (
            <div
              key={n.title}
              className={`flex gap-4 rounded-2xl border p-5 transition-all ${
                n.unread ? "bg-card border-primary/30 shadow-2xs" : "bg-canvas/60 border-border/70"
              }`}
            >
              <span
                className={`mt-1.5 size-2.5 shrink-0 rounded-full ${
                  n.unread ? "bg-primary shadow-2xs" : "bg-muted-foreground/30"
                }`}
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
                  <b className="font-extrabold text-ink text-base">{n.title}</b>
                  <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function ProfilePage() { return <main className="shell py-10"><h1 className="text-3xl font-extrabold text-ink">Business profile</h1><p className="mt-2 text-muted-foreground">Keep your retailer details ready for every wholesale order.</p><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]"><section className="border bg-card p-6"><h2 className="text-xl font-bold">Business information</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Business name<Input className="mt-2" defaultValue="Kapoor General Store"/></label><label className="text-sm font-semibold">GST number<Input className="mt-2" defaultValue="06AABCK1234M1ZP"/></label><label className="text-sm font-semibold">Business type<Input className="mt-2" defaultValue="Independent retailer"/></label><label className="text-sm font-semibold">Owner name<Input className="mt-2" defaultValue="Amit Kapoor"/></label><label className="text-sm font-semibold sm:col-span-2">Email address<Input className="mt-2" defaultValue="amit@kapoorgeneral.example"/></label></div><Button className="mt-6">Save changes</Button></section><aside className="border bg-card p-6"><VerifiedUser className="size-7 text-success"/><h2 className="mt-4 font-bold">Verified retailer account</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your business information is ready to share with connected wholesalers.</p></aside></div></main> }

export function AddressesPage() { return <main className="shell py-10"><div className="flex items-end justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-ink">Delivery addresses</h1><p className="mt-2 text-muted-foreground">Choose where your wholesale orders should arrive.</p></div><Button>Add address</Button></div><div className="mt-8 grid gap-4 md:grid-cols-2">{addresses.map(address=><div key={address.id} className="border bg-card p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2 font-bold"><LocationOn className="size-4 text-primary"/>{address.label}</div>{address.primary&&<Badge variant="secondary">Primary</Badge>}</div><h2 className="mt-5 font-bold">{address.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{address.line}<br/>{address.phone}</p><div className="mt-5 flex gap-2"><Button variant="outline" size="sm">Edit</Button><Button variant="ghost" size="sm">Remove</Button></div></div>)}</div></main> }

export function SettingsPage() { return <main className="shell py-10"><h1 className="text-3xl font-extrabold text-ink">Settings</h1><p className="mt-2 text-muted-foreground">Manage how NEXORA keeps you updated.</p><div className="mt-8 max-w-2xl border bg-card p-6"><h2 className="text-xl font-bold">Notifications</h2>{[["Order updates","Get shipping and delivery updates"],["Price alerts","Know when saved products change price"],["Wholesaler messages","Receive catalogue and access updates"]].map(([title,body],i)=><label key={title} className="flex items-center justify-between gap-4 border-b py-5 last:border-0"><span><b>{title}</b><span className="mt-1 block text-sm text-muted-foreground">{body}</span></span><input type="checkbox" defaultChecked={i<2}/></label>)}<Button className="mt-5">Save preferences</Button></div></main> }

export function AuthPage({ mode }: { mode: "login" | "register" | "forgot" }) { const title=mode==="login"?"Welcome back":mode==="register"?"Create your retailer account":"Reset your password"; return <main className="grid min-h-[calc(100vh-120px)] place-items-center bg-canvas px-4 py-12"><section className="w-full max-w-md border bg-card p-7 shadow-sm"><div className="text-center"><span className="mx-auto grid size-11 place-items-center bg-primary font-extrabold text-primary-foreground">N</span><h1 className="mt-5 text-2xl font-extrabold text-ink">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{mode==="register"?"Join thousands of retailers sourcing better.":mode==="forgot"?"We’ll send a reset link to your account email.":"Sign in to your NEXORA shopping workspace."}</p></div><form className="mt-7 grid gap-4" onSubmit={e=>e.preventDefault()}>{mode==="register"&&<label className="text-sm font-semibold">Business name<Input className="mt-2" placeholder="Your store name"/></label>}<label className="text-sm font-semibold">Email address<Input className="mt-2" type="email" placeholder="you@business.com"/></label>{mode!=="forgot"&&<label className="text-sm font-semibold">Password<Input className="mt-2" type="password" placeholder="Enter your password"/></label>}<Button type="submit" size="lg" className="mt-2">{mode==="login"?"Sign in":mode==="register"?"Create account":"Send reset link"}</Button></form><div className="mt-6 text-center text-sm text-muted-foreground">{mode==="login"?<><Link className="text-primary hover:underline" to="/forgot-password">Forgot password?</Link><p className="mt-3">New to NEXORA? <Link className="font-semibold text-primary" to="/register">Create an account</Link></p></>:<Link className="text-primary hover:underline" to="/login">Back to sign in</Link>}</div></section></main> }
