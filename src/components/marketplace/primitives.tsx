import { Link } from "@/lib/router";
import { useState } from "react";
import { Favorite, ShoppingCart, Star, LocationOn, Verified, Remove, Add, Inventory2, ArrowRight, LocalShipping, VerifiedUser, Delete, WarningAmber } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getWholesaler, money, type Product, type Wholesaler, type Order, getProduct } from "@/data/mock";
import { useStore } from "@/state/store";
import productSheet from "@/assets/product-sheet.jpg";

export function StatusBadge({ status }: { status: string }) {
  const good = ["Connected", "Delivered", "Confirmed", "In stock"].includes(status);
  const warn = ["Pending", "Processing", "Request Pending", "Shipped"].includes(status);
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-0 font-semibold",
        good && "bg-success/10 text-success",
        warn && "bg-warning/15 text-warning-foreground",
        !good && !warn && "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </Badge>
  );
}

export function SectionHeading({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: "/products" | "/wholesalers" | "/orders";
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Button asChild variant="ghost" size="sm">
          <Link to={href}>
            View all <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
}

export function ProductVisual({ index, name, className }: { index: number; name: string; className?: string }) {
  const x = (index % 3) * 33.333,
    y = Math.floor((index % 6) / 3) * 50;
  return (
    <div
      role="img"
      aria-label={name}
      className={cn("bg-canvas bg-[length:300%_200%]", className)}
      style={{
        backgroundImage: `url(${productSheet})`,
        backgroundPosition: `${x === 0 ? 0 : x === 33.333 ? 50 : 100}% ${y === 0 ? 0 : 100}%`,
      }}
    />
  );
}

export function ProductCard({
  product,
  list = false,
  premium = false,
}: {
  product: Product;
  list?: boolean;
  premium?: boolean;
}) {
  const { wishlist, toggleWishlist, addToCart, addRecentlyViewed } = useStore();
  const w = getWholesaler(product.wholesalerId);
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  if (premium)
    return (
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-lg">
        <Link to="/products/$productId" params={{ productId: product.id }} onClick={() => addRecentlyViewed(product.id)} className="block overflow-hidden">
          <ProductVisual index={product.image} name={product.name} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <Button
          aria-label="Remove from wishlist"
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 rounded-full bg-card/95 shadow-md transition-transform duration-200 active:scale-90"
          onClick={() => toggleWishlist(product.id)}
        >
          <Favorite className={cn("fill-primary text-primary")} />
        </Button>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-primary">
            {product.brand} · {product.category}
          </p>
          <Link to="/products/$productId" params={{ productId: product.id }} className="mt-2 block font-bold leading-snug text-ink transition-colors hover:text-primary">
            {product.name}
          </Link>
          <p className="mt-2 text-xs text-muted-foreground">Sold by {w.name}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <strong className="text-xl text-primary">{money(product.price)}</strong>
            <span className="text-xs text-muted-foreground line-through">{money(product.mrp)}</span>
            {discount >= 10 && <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">{discount}% off</span>}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">
              MOQ: <b className="text-foreground">{product.moq} units</b>
            </span>
            <span className={cn("rounded-full px-2 py-1 font-bold", product.stock > 20 ? "bg-success/10 text-success" : "bg-warning/15 text-warning-foreground")}>
              {product.stock > 20 ? "In stock" : "Low stock"}
            </span>
          </div>
        </div>
        <div className="px-5 pb-5">
          <Button className="w-full rounded-xl transition-all hover:shadow-md active:scale-95" onClick={() => addToCart(product.id)}>
            <ShoppingCart /> Add to cart
          </Button>
        </div>
      </article>
    );
  return (
    <article className={cn("group relative overflow-hidden border bg-card interactive", list && "sm:grid sm:grid-cols-[180px_1fr_auto]")}>
      <Link to="/products/$productId" params={{ productId: product.id }} onClick={() => addRecentlyViewed(product.id)} className="block">
        <ProductVisual index={product.image} name={product.name} className={cn("aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.02]", list && "sm:aspect-square sm:h-full")} />
      </Link>
      <Button aria-label="Toggle wishlist" variant="secondary" size="icon" className="absolute right-3 top-3 shadow-sm" onClick={() => toggleWishlist(product.id)}>
        <Favorite className={cn(wishlist.includes(product.id) && "fill-primary text-primary")} />
      </Button>
      <div className="p-4">
        <p className="text-xs font-semibold text-primary">
          {product.brand} · {product.category}
        </p>
        <Link to="/products/$productId" params={{ productId: product.id }} onClick={() => addRecentlyViewed(product.id)} className="mt-1 block font-bold leading-snug text-ink hover:text-primary">
          {product.name}
        </Link>
        <p className="mt-2 text-xs text-muted-foreground">Sold by {w.name}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="text-lg text-ink">{money(product.price)}</strong>
          <span className="text-xs text-muted-foreground line-through">{money(product.mrp)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span>
            MOQ: <b>{product.moq} units</b>
          </span>
          <span className={product.stock > 20 ? "text-success" : "text-warning-foreground"}>{product.stock > 20 ? "In stock" : "Low stock"}</span>
        </div>
      </div>
      <div className={cn("px-4 pb-4", list && "sm:flex sm:items-center sm:p-4")}>
        <Button className="w-full" onClick={() => addToCart(product.id)}>
          <ShoppingCart /> Add to cart
        </Button>
      </div>
    </article>
  );
}

export function ProductGrid({ products, list = false, premium = false }: { products: Product[]; list?: boolean; premium?: boolean }) {
  return (
    <div className={premium ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8" : cn(list ? "grid gap-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6")}>
      {products.map((p, index) =>
        premium ? (
          <div key={p.id} className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
            <ProductCard product={p} premium />
          </div>
        ) : (
          <ProductCard key={p.id} product={p} list={list} />
        )
      )}
    </div>
  );
}

export function WholesalerCard({ wholesaler, premium = false }: { wholesaler: Wholesaler; premium?: boolean }) {
  const { relationships, requestAccess } = useStore();
  const state = relationships[wholesaler.id] ?? wholesaler.relationship;
  if (!premium)
    return (
      <article className="group flex h-full flex-col border bg-card p-5 interactive">
        <div className="grid size-14 place-items-center bg-ink text-lg font-extrabold text-primary-foreground">{wholesaler.initials}</div>
        <Link to="/wholesalers/$wholesalerId" params={{ wholesalerId: wholesaler.id }} className="mt-5 flex items-center gap-1 text-lg font-extrabold text-ink group-hover:text-primary">
          {wholesaler.name}
          {wholesaler.verified && <Verified className="size-5 text-primary" />}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-warning text-warning" />
            <b className="text-foreground">{wholesaler.rating}</b> retailer rating
          </span>
          <span className="flex items-center gap-1">
            <LocationOn className="size-3.5" />
            {wholesaler.location}
          </span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{wholesaler.about}</p>
        <div className="mt-5 grid grid-cols-2 gap-2 border-y py-4 text-xs">
          <span className="flex items-center gap-2">
            <Inventory2 className="size-4 text-primary" />
            <span>
              <b className="block text-foreground">{wholesaler.products}+</b>Products
            </span>
          </span>
          <span className="flex items-center gap-2">
            <LocalShipping className="size-4 text-primary" />
            <span>
              <b className="block text-foreground">Reliable</b>
              {wholesaler.delivery}
            </span>
          </span>
        </div>
        <div className="mt-auto flex gap-2 pt-5">
          {state === "Connected" ? (
            <Button asChild variant="outline" className="flex-1">
              <Link to="/wholesalers/$wholesalerId" params={{ wholesalerId: wholesaler.id }}>
                Browse Catalog
              </Link>
            </Button>
          ) : state === "Request Access" ? (
            <Button className="flex-1" onClick={() => requestAccess(wholesaler.id)}>
              Request Connection
            </Button>
          ) : (
            <Button variant="secondary" disabled className="flex-1 opacity-80 cursor-not-allowed">
              Request Pending
            </Button>
          )}
          {state === "Connected" && (
            <span className="grid size-9 shrink-0 place-items-center bg-success/10 text-success" title="Verified connection">
              <VerifiedUser className="size-4" />
            </span>
          )}
        </div>
      </article>
    );
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-ink text-lg font-extrabold text-primary-foreground shadow-sm">
          <span>{wholesaler.initials}</span>
          {wholesaler.verified && (
            <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground" title="Verified partner">
              <Verified className="size-3.5" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link to="/wholesalers/$wholesalerId" params={{ wholesalerId: wholesaler.id }} className="block truncate text-lg font-extrabold text-ink transition-colors group-hover:text-primary">
            {wholesaler.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 font-bold text-warning-foreground">
              <Star className="size-3 fill-warning text-warning" />
              {wholesaler.rating}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <LocationOn className="size-3.5" />
              {wholesaler.location}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-5 line-clamp-2 text-sm leading-6 text-foreground/75">{wholesaler.about}</p>
      <div className="mt-5 grid grid-cols-2 rounded-xl bg-canvas p-3 text-xs">
        <span className="flex items-center gap-2 border-r border-border pr-3">
          <Inventory2 className="size-4 text-primary" />
          <span>
            <b className="block text-sm text-ink">{wholesaler.products}+</b>
            <span className="text-muted-foreground">Products</span>
          </span>
        </span>
        <span className="flex items-center gap-2 pl-3">
          <LocalShipping className="size-4 text-primary" />
          <span>
            <b className="block text-sm text-ink">Reliable</b>
            <span className="text-muted-foreground">{wholesaler.delivery}</span>
          </span>
        </span>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-6">
        {state === "Connected" ? (
          <Button asChild variant="outline" className="flex-1 rounded-xl border-primary/35 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            <Link to="/wholesalers/$wholesalerId" params={{ wholesalerId: wholesaler.id }}>
              Browse Catalog <ArrowRight />
            </Link>
          </Button>
        ) : state === "Request Access" ? (
          <Button className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => requestAccess(wholesaler.id)}>
            Request Connection
          </Button>
        ) : (
          <Button variant="secondary" disabled className="flex-1 rounded-xl opacity-80 cursor-not-allowed">
            Request Pending
          </Button>
        )}
        {state === "Connected" && (
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success" title="Verified Partner">
            <VerifiedUser className="size-4" />
          </span>
        )}
      </div>
    </article>
  );
}

export function CartItem({ product, quantity }: { product: Product; quantity: number }) {
  const { setQuantity, removeCart } = useStore();
  const [isRemoving, setIsRemoving] = useState(false);
  const belowMoq = quantity < product.moq;

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeCart(product.id);
    }, 220);
  };

  return (
    <div
      className={cn(
        "group relative grid grid-cols-[68px_minmax(0,1fr)] gap-3.5 py-5 transition-all duration-300 sm:grid-cols-[80px_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-6 border-b border-border/50 last:border-b-0",
        isRemoving && "opacity-0 -translate-x-4 scale-95 pointer-events-none max-h-0 py-0 my-0 overflow-hidden"
      )}
    >
      <Link to="/products/$productId" params={{ productId: product.id }} className="block shrink-0">
        <ProductVisual
          index={product.image}
          name={product.name}
          className="aspect-square w-17 sm:w-20 rounded-xl shadow-xs border border-border/60 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="min-w-0 pr-2 sm:pr-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80 block">
          {product.brand} · {product.category}
        </span>
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="font-extrabold text-ink transition-colors hover:text-primary leading-snug sm:text-base block mt-0.5"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-baseline gap-2 text-xs sm:text-sm">
          <span className="font-bold text-foreground">{money(product.price)}</span>
          <span className="text-muted-foreground">per unit</span>
          {product.mrp > product.price && (
            <span className="text-muted-foreground line-through text-xs ml-1">
              {money(product.mrp)}
            </span>
          )}
        </div>

        {belowMoq && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <WarningAmber className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>MOQ Warning: Below minimum order ({product.moq} units required)</span>
          </div>
        )}
      </div>

      <div className="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto">
        <div className="inline-flex h-9 items-center rounded-full border border-border/80 bg-canvas/90 p-0.5 shadow-xs transition-colors hover:border-primary/40">
          <Button
            type="button"
            aria-label="Decrease quantity"
            variant="ghost"
            size="icon"
            disabled={quantity <= 1}
            className="size-8 rounded-full text-muted-foreground transition-all duration-150 hover:bg-card hover:text-primary active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground cursor-pointer disabled:cursor-not-allowed"
            onClick={() => setQuantity(product.id, quantity - 1)}
          >
            <Remove className="size-3.5" />
          </Button>
          <span className="w-9 text-center text-sm font-extrabold text-ink select-none">
            {quantity}
          </span>
          <Button
            type="button"
            aria-label="Increase quantity"
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground transition-all duration-150 hover:bg-card hover:text-primary active:scale-90 cursor-pointer"
            onClick={() => setQuantity(product.id, quantity + 1)}
          >
            <Add className="size-3.5" />
          </Button>
        </div>

        <Button
          aria-label={`Remove ${product.name} from cart`}
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive active:scale-90"
          onClick={handleRemove}
        >
          <Delete className="size-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between col-span-2 sm:col-span-1 sm:block sm:text-right pt-2 sm:pt-0 border-t border-border/40 sm:border-t-0">
        <span className="text-xs font-semibold text-muted-foreground sm:hidden">Item Total:</span>
        <div>
          <b className="text-base font-extrabold text-ink sm:text-lg block transition-all">
            {money(product.price * quantity)}
          </b>
          <span className="text-[11px] text-muted-foreground hidden sm:block">
            {quantity} × {money(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OrderCard({ order }: { order: Order }) {
  const w = getWholesaler(order.wholesalerId);
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <article className="rounded-2xl border border-border/80 bg-card p-5 transition-all duration-200 hover:border-primary/40 shadow-xs">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{order.id}</p>
          <span className="text-xs font-medium text-muted-foreground">Placed {order.date}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 font-extrabold text-ink text-base sm:text-lg">
            {w.name}
            {w.verified && <Verified className="size-4 text-primary" />}
          </h3>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Separate fulfilment by this wholesaler</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4">
        <div className="flex -space-x-2 overflow-x-auto py-1">
          {order.items.map((i) => {
            const product = getProduct(i.productId);
            return <ProductVisual key={i.productId} index={product.image} name={product.name} className="size-11 sm:size-12 shrink-0 rounded-lg border-2 border-card shadow-xs" />;
          })}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {order.items.length} products · {units} units
          </p>
          <b className="mt-0.5 block text-base sm:text-lg font-black text-ink">{money(order.total)}</b>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <LocalShipping className="size-4 shrink-0 text-primary" />
          {order.status === "Delivered" ? "Delivered successfully" : order.status === "Cancelled" ? "Order closed" : "Tracking updates available"}
        </span>
        <Button asChild variant="outline" size="sm" className="rounded-xl font-bold min-h-[44px] sm:min-h-9">
          <Link to="/orders/$orderId" params={{ orderId: order.id }}>
            View details <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="grid min-h-72 place-items-center border border-dashed bg-card p-8 text-center">
      <div>
        <Inventory2 className="mx-auto size-10 text-muted-foreground" />
        <h3 className="mt-3 font-bold text-ink">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
