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
  Menu as MenuIcon,
  ChevronRight,
} from "@mui/icons-material";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
    <div className={cn("relative w-full", hero && "home-search mx-auto max-w-3xl")}>
      <form
        action="/products"
        className={cn(
          "mx-auto flex h-11 sm:h-12 w-full items-center overflow-hidden rounded-xl bg-card border border-border/80 shadow-2xs transition-shadow focus-within:ring-4 focus-within:ring-primary/10",
          hero && "h-13 sm:h-14 rounded-2xl shadow-md border-border",
        )}
      >
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands or categories"
          className={cn(
            "h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm text-ink outline-none placeholder:text-muted-foreground",
            hero && "text-sm sm:text-base px-4",
          )}
        />
        <button
          type="submit"
          aria-label="Search products"
          className="grid h-full min-h-[44px] w-12 sm:w-14 shrink-0 place-items-center text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
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
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-accent min-h-[44px]"
              onClick={() => setQuery("")}
            >
              <span>
                <b>{p.name}</b>
                <small className="ml-2 text-muted-foreground">{p.brand}</small>
              </span>
              <span className="text-xs text-primary font-bold">View</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <img
        src="/favicon.jpeg"
        alt="NEXORA"
        className="size-9 sm:size-10 object-contain"
      />
      <span className="text-lg sm:text-xl font-black tracking-tight text-current">
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
      className="group relative grid size-10 place-items-center rounded-xl text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 min-h-[44px] min-w-[44px]"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (auth) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Banner */}
      <div className="bg-ink py-2 px-4 text-center text-xs font-semibold text-primary-foreground">
        Free delivery from select wholesalers on orders above ₹15,000
      </div>

      {/* Header */}
      <header className="premium-header sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="shell flex h-16 sm:h-18 items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-3 lg:gap-6">
            <Logo />
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex shrink-0 items-center gap-1">
              {primary.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: "bg-accent text-primary" }}
                  className="rounded-lg px-3 py-2 text-sm font-extrabold transition-colors hover:bg-accent hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block min-w-0 flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Header Action Icons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <IconLink to="/wishlist" label="Wishlist" hoverChildren={<Favorite />}>
              <FavoriteBorder />
            </IconLink>
            <IconLink to="/notifications" label="Notifications" hoverChildren={<Notifications />}>
              <NotificationsNone />
            </IconLink>
            <IconLink to="/cart" label="Cart" hoverChildren={<ShoppingCart />}>
              <ShoppingCartOutlined />
            </IconLink>

            {/* Desktop Profile Dropdown */}
            <div className="group relative hidden lg:block">
              <Button
                variant="ghost"
                className="min-h-[44px] gap-2 rounded-xl px-2 transition-colors duration-200 hover:bg-secondary hover:text-primary"
              >
                <span className="grid size-8 place-items-center rounded-lg border border-border bg-secondary text-xs font-black">
                  AK
                </span>
                <KeyboardArrowDown className="size-4 text-muted-foreground" />
              </Button>
              <div className="invisible absolute right-0 top-full w-56 translate-y-1 border rounded-2xl bg-popover p-2 opacity-0 elevated transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 shadow-lg">
                {account.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-accent min-h-[44px]"
                  >
                    <item.icon className="size-4 text-primary" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="mt-1 flex items-center gap-3 rounded-xl border-t px-3 py-2.5 text-sm font-bold text-primary hover:bg-accent min-h-[44px]"
                >
                  <Logout className="size-4" />
                  Sign out
                </Link>
              </div>
            </div>

            {/* Mobile / Tablet Hamburger Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden size-11 rounded-xl min-h-[44px] min-w-[44px]"
                  aria-label="Open mobile menu"
                >
                  <MenuIcon className="size-6 text-ink" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-6 overflow-y-auto">
                <SheetHeader className="text-left border-b pb-4">
                  <SheetTitle className="flex items-center justify-between">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Search in Drawer */}
                  <SearchBar />

                  {/* Main Nav Links */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
                      Navigation
                    </h3>
                    <div className="grid gap-1">
                      <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-extrabold text-ink hover:bg-accent min-h-[44px]"
                      >
                        <span>Home</span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                      {primary.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-extrabold text-ink hover:bg-accent min-h-[44px]"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Account Links */}
                  <div className="border-t pt-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
                      My Retailer Account
                    </h3>
                    <div className="grid gap-1">
                      {account.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent min-h-[44px]"
                        >
                          <item.icon className="size-4 text-primary" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 text-sm font-extrabold text-primary hover:bg-primary/10 min-h-[44px]"
                      >
                        <Logout className="size-4" />
                        <span>Sign out</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Sub-Header Search Bar (visible on mobile screens when drawer is closed) */}
        <div className="shell pb-3 lg:hidden">
          <SearchBar />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="mt-16 border-t bg-ink text-primary-foreground pb-16 md:pb-0">
        <div className="shell grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 sm:py-14">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-primary-foreground/75 leading-relaxed">
              The professional marketplace connecting independent retailers with verified wholesalers across India.
            </p>
          </div>
          <FooterGroup
            title="Marketplace"
            links={[
              { label: "Products", to: "/products" },
              { label: "Categories", to: "/categories" },
              { label: "Wholesalers", to: "/wholesalers" },
              { label: "Orders", to: "/orders" },
            ]}
          />
          <FooterGroup
            title="Account"
            links={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Profile", to: "/profile" },
              { label: "Addresses", to: "/addresses" },
              { label: "Settings", to: "/settings" },
            ]}
          />
          <div>
            <h3 className="font-extrabold text-base text-primary-foreground">Retailer support</h3>
            <p className="mt-3 text-sm text-primary-foreground/75">
              Monday–Saturday, 9am–7pm
            </p>
            <p className="mt-2 text-sm font-bold text-primary">care@nexora.example</p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/50 px-4">
          © 2026 NEXORA Commerce. Built for growing retailers.
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/80 bg-background/95 backdrop-blur p-1 md:hidden shadow-lg">
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
            className="flex flex-col items-center justify-center gap-1 py-1.5 text-[10px] font-bold min-h-[44px]"
            activeProps={{ className: "text-primary" }}
          >
            <i.icon className="size-5" />
            <span>{i.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function FooterGroup({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h3 className="font-extrabold text-base text-primary-foreground">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm text-primary-foreground/75">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to as "/products"} className="hover:text-primary transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
