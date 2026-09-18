import { Link, useRouterState } from "@/lib/router";
import {
  Search,
  Favorite,
  FavoriteBorder,
  Notifications,
  NotificationsNone,
  ShoppingCart,
  ShoppingCartOutlined,
  Person,
  Dashboard,
  Inventory2,
  Store,
  Assignment,
  LocationOn,
  Settings,
  Logout,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mock";
import { cn } from "@/lib/utils";

const primary = [
  { to: "/products" as const, label: "Products" },
  { to: "/categories" as const, label: "Categories" },
  { to: "/wholesalers" as const, label: "Wholesalers" },
  { to: "/orders" as const, label: "Orders" },
];
const account = [
  { to: "/dashboard" as const, label: "Dashboard", icon: Dashboard },
  { to: "/orders" as const, label: "Orders", icon: Assignment },
  { to: "/wishlist" as const, label: "Wishlist", icon: Favorite },
  {
    to: "/notifications" as const,
    label: "Notifications",
    icon: Notifications,
  },
  { to: "/profile" as const, label: "Business profile", icon: Person },
  { to: "/addresses" as const, label: "Addresses", icon: LocationOn },
  { to: "/settings" as const, label: "Settings", icon: Settings },
];
export function SearchBar({ hero = false }: { hero?: boolean }) {
  const [query, setQuery] = useState("");
  const hits =
    query.length > 1
      ? products
          .filter((p) =>
            `${p.name} ${p.brand} ${p.category}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .slice(0, 5)
      : [];
  return (
    <div className={cn("relative", hero && "home-search mx-auto max-w-3xl")}>
      <form
        action="/products"
        className={cn(
          "mx-auto flex h-12 w-full items-center overflow-hidden rounded-xl bg-card shadow-sm transition-shadow focus-within:ring-4 focus-within:ring-primary/10",
          hero && "h-14 rounded-2xl shadow-md",
        )}
      >
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands or categories"
          className={cn(
            "h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted-foreground",
            hero && "text-base",
          )}
        />
        <button
          type="submit"
          aria-label="Search products"
          className="grid h-full w-14 shrink-0 place-items-center text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <Search className="size-5" />
        </button>
      </form>
      {hits.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-2 elevated">
          {hits.map((p) => (
            <Link
              key={p.id}
              to="/products/$productId"
              params={{ productId: p.id }}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
              onClick={() => setQuery("")}
            >
              <span>
                <b>{p.name}</b>
                <small className="ml-2 text-muted-foreground">{p.brand}</small>
              </span>
              <span className="text-xs text-primary">View</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <img
        src="/favicon.jpeg"
        alt="NEXORA"
        className="size-10 object-contain"
      />
      <span className="text-xl font-extrabold tracking-tight text-current">
        NEXORA
      </span>
    </Link>
  );
}
function IconLink({
  to,
  label,
  children,
  hoverChildren,
}: {
  to: "/wishlist" | "/notifications" | "/cart" | "/profile";
  label: string;
  children: React.ReactNode;
  hoverChildren: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="group relative grid size-10 place-items-center rounded-lg text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:size-11 [&_svg]:size-5.25 sm:[&_svg]:size-5.5"
    >
      <span className="transition-opacity duration-200 group-hover:opacity-0">
        {children}
      </span>
      <span className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {hoverChildren}
      </span>
    </Link>
  );
}
export function MarketplaceShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const auth = ["/login", "/register", "/forgot-password"].includes(path);
  if (auth) return <>{children}</>;
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-ink py-2 text-center text-xs font-semibold text-primary-foreground">
        Free delivery from select wholesalers on orders above ₹15,000
      </div>
      <header className="premium-header sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="shell flex h-18 items-center gap-5 lg:gap-8">
          <Logo />
          <nav className="flex shrink-0 items-center gap-1">
            {primary.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-accent text-primary" }}
                className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <IconLink
              to="/wishlist"
              label="Wishlist"
              hoverChildren={<Favorite />}
            >
              <FavoriteBorder />
            </IconLink>
            <IconLink
              to="/notifications"
              label="Notifications"
              hoverChildren={<Notifications />}
            >
              <NotificationsNone />
            </IconLink>
            <IconLink to="/cart" label="Cart" hoverChildren={<ShoppingCart />}>
              <ShoppingCartOutlined />
            </IconLink>
            <div className="group relative hidden md:block">
              <Button
                variant="ghost"
                className="min-h-11 gap-2 rounded-lg px-1.5 transition-colors duration-200 hover:bg-secondary hover:text-primary"
              >
                <span className="grid size-8 place-items-center rounded-md border border-border bg-secondary text-xs font-bold">
                  AK
                </span>
                <KeyboardArrowDown />
              </Button>
              <div className="invisible absolute right-0 top-full w-56 translate-y-1 border bg-popover p-2 opacity-0 elevated transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {account.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="mt-1 flex items-center gap-3 border-t px-3 py-2 text-sm text-primary hover:bg-accent"
                >
                  <Logout className="size-4" />
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="shell pb-3 md:hidden">
          <SearchBar />
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t bg-ink text-primary-foreground">
        <div className="shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-primary-foreground/65">
              The professional marketplace connecting independent retailers with
              verified wholesalers across India.
            </p>
          </div>
          <FooterGroup
            title="Marketplace"
            links={["Products", "Categories", "Wholesalers", "Orders"]}
          />
          <FooterGroup
            title="Account"
            links={["Dashboard", "Profile", "Addresses", "Settings"]}
          />
          <div>
            <h3 className="font-bold">Retailer support</h3>
            <p className="mt-3 text-sm text-primary-foreground/65">
              Monday–Saturday, 9am–7pm
            </p>
            <p className="mt-2 text-sm">care@nexora.example</p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/50">
          © 2026 NEXORA Commerce. Built for growing retailers.
        </div>
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background p-1 md:hidden">
        {[
          { to: "/" as const, label: "Home", icon: Store },
          { to: "/products" as const, label: "Products", icon: Inventory2 },
          { to: "/cart" as const, label: "Cart", icon: ShoppingCart },
          { to: "/orders" as const, label: "Orders", icon: Assignment },
          { to: "/dashboard" as const, label: "Account", icon: Person },
        ].map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className="flex flex-col items-center gap-1 py-2 text-[10px]"
            activeProps={{ className: "text-primary" }}
          >
            <i.icon className="size-5" />
            {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm text-primary-foreground/65">
        {links.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
