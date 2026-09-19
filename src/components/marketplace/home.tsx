import { Link } from "@/lib/router";
import {
  ArrowRight,
  VerifiedUser,
  LocalShipping,
  Refresh,
  Verified,
  AutoAwesome,
  ChevronRight,
} from "@mui/icons-material";
import hero from "@/assets/nexora-hero.jpg";
import { Button } from "@/components/ui/button";
import { categories, products, wholesalers } from "@/data/mock";
import { useStore } from "@/state/store";
import { ProductGrid, SectionHeading, WholesalerCard } from "./primitives";
import { categoryImages } from "./storefront";

const trustSignals: Array<[typeof VerifiedUser, string, string]> = [
  [VerifiedUser, "Verified sellers", "Every supplier reviewed"],
  [LocalShipping, "Reliable delivery", "Clear dispatch timelines"],
  [Refresh, "Easy reordering", "Repeat orders in moments"],
  [Verified, "Trade pricing", "Business-only wholesale rates"],
];

export function HomePage() {
  const { relationships, recentlyViewed } = useStore();

  const approvedWholesalers = wholesalers.filter(
    (w) => relationships[w.id] === "Connected"
  );
  const connectedProducts = products.filter(
    (p) => relationships[p.wholesalerId] === "Connected"
  );
  const recentlyViewedProducts = products.filter(
    (p) => recentlyViewed.includes(p.id) && relationships[p.wholesalerId] === "Connected"
  );

  const hasApprovedConnections = approvedWholesalers.length > 0;
  const topCategories = [...categories].sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] overflow-hidden bg-ink">
        <img
          src={hero}
          width={1600}
          height={900}
          alt="Independent retailer in a modern, fully stocked shop"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 sm:via-ink/75 to-ink/40 sm:to-transparent" />
        <div className="shell relative flex min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] items-center py-12 sm:py-20">
          <div className="max-w-2xl text-primary-foreground text-center sm:text-left mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-2 border border-primary-foreground/25 bg-ink/50 px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase backdrop-blur rounded-full">
              India’s retailer-first wholesale marketplace
            </span>
            <h1 className="mt-4 sm:mt-6 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl tracking-tight">
              Everything Your Store Needs. From Trusted Wholesalers.
            </h1>
            <p className="mt-4 sm:mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-lg mx-auto sm:mx-0">
              Compare wholesale pricing, manage supplier relationships and restock your business—all from one reliable workspace.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3">
              <Button asChild size="lg" className="rounded-xl min-h-[44px] font-extrabold shadow-md">
                <Link to="/products">
                  Explore products <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-xl min-h-[44px] font-bold">
                <Link to="/wholesalers">Find wholesalers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-b bg-card">
        <div className="shell grid grid-cols-2 gap-4 py-6 sm:gap-6 lg:grid-cols-4">
          {trustSignals.map(([I, t, b]) => (
            <div key={t} className="flex items-center gap-3">
              <I className="size-6 shrink-0 text-primary" />
              <div>
                <b className="block text-xs sm:text-sm font-bold text-ink">{t}</b>
                <span className="text-[11px] sm:text-xs text-muted-foreground">{b}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 1 — Popular Categories */}
      <section className="bg-canvas py-12 sm:py-16 lg:py-20">
        <div className="shell">
          <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                BROWSE
              </span>
              <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Popular Categories</h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Choose a category to discover wholesalers who specialise in it.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/10 hover:text-primary min-h-[44px]">
              <Link to="/categories" className="flex items-center gap-1">
                View all <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {topCategories.map((c, i) => {
              const lead = i === 0;
              return (
                <Link
                  key={c.id}
                  to="/wholesalers"
                  search={{ category: c.name }}
                  aria-label={`Find ${c.count} ${c.name} trade products`}
                  className="group relative flex h-full min-h-72 sm:min-h-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:shadow-xl focus-visible:outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="relative h-44 sm:h-52 shrink-0 overflow-hidden">
                    <img
                      src={categoryImages[c.name]}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                    {lead && (
                      <span className="absolute left-4 top-4 sm:left-5 sm:top-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
                        Popular
                      </span>
                    )}
                    <h3 className="absolute inset-x-5 bottom-4 text-xl sm:text-2xl font-extrabold leading-tight text-primary-foreground">
                      {c.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                    <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-xs sm:text-sm font-bold text-primary">
                      <span className="border-b border-primary/35 pb-0.5 transition-colors group-hover:border-primary">
                        Find {c.count} trade products
                      </span>
                      <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured from your connections */}
      {hasApprovedConnections && (
        <section className="border-t border-border/60 bg-card py-12 sm:py-16 lg:py-20">
          <div className="shell">
            <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                  YOUR NETWORK
                </span>
                <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
                  Featured from your connections
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Wholesalers you have an active approved connection with.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/10 hover:text-primary min-h-[44px]">
                <Link to="/wholesalers" className="flex items-center gap-1">
                  View all <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {approvedWholesalers.slice(0, 6).map((w, index) => (
                <div
                  key={w.id}
                  className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <WholesalerCard wholesaler={w} premium />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner ("Save up to 18%") */}
      <section className="shell py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-primary text-primary-foreground md:grid-cols-[1.5fr_1fr] shadow-md">
          <div className="p-6 sm:p-10 md:p-12 text-center sm:text-left">
            <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">Stock-up week</p>
            <h2 className="mt-3 text-2xl font-black sm:text-4xl leading-tight">
              Save up to 18% on everyday store essentials.
            </h2>
            <p className="mt-3 text-xs sm:text-base text-primary-foreground/85 leading-relaxed">
              Consolidate larger orders from verified partners and protect your margins.
            </p>
            <Button asChild variant="secondary" className="mt-6 rounded-xl font-extrabold min-h-[44px] shadow-sm">
              <Link to="/products">
                Shop trade offers <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid place-items-center bg-ink p-8 text-center border-t border-primary-foreground/10 md:border-t-0 md:border-l">
            <strong className="text-5xl sm:text-6xl font-black text-primary-foreground">18%</strong>
            <span className="mt-2 block text-xs sm:text-sm text-primary-foreground/70">
              select wholesale cases
            </span>
          </div>
        </div>
      </section>

      {/* Recommended from approved partners */}
      {hasApprovedConnections && connectedProducts.length > 0 && (
        <section className="border-t border-border/60 bg-card py-12 sm:py-16 lg:py-20">
          <div className="shell">
            <SectionHeading
              title="Recommended from approved partners"
              subtitle="Products from wholesalers you can currently shop"
              href="/products"
            />
            <ProductGrid products={connectedProducts.slice(0, 8)} />
          </div>
        </section>
      )}

      {/* Recently viewed from your network */}
      {hasApprovedConnections && recentlyViewedProducts.length > 0 && (
        <section className="bg-canvas py-12 sm:py-16 lg:py-20">
          <div className="shell">
            <SectionHeading title="Recently viewed from your network" subtitle="Items you recently viewed from approved partners" />
            <ProductGrid products={recentlyViewedProducts.slice(0, 4)} />
          </div>
        </section>
      )}
    </main>
  );
}
