import { useSyncExternalStore } from "react";
import { MarketplaceShell } from "@/components/marketplace/shell";
import { PortalPage } from "@/components/marketplace/portal-page";
import { HomePage } from "@/components/marketplace/home";
import {
  CategoriesPage,
  ProductDetailPage,
  ProductsPage,
  WholesalerCatalogPage,
  WholesalerProfilePage,
  WholesalersPage,
} from "@/components/marketplace/storefront";
import {
  AddressesPage,
  AuthPage,
  CartPage,
  CheckoutPage,
  DashboardPage,
  NotificationsPage,
  OrderDetailsPage,
  OrdersPage,
  ProfilePage,
  SettingsPage,
  WishlistPage,
} from "@/components/marketplace/workspace";
import { RegisterPage } from "@/components/marketplace/register";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getRouteSnapshot() {
  return window.location.href;
}

function RouterView() {
  const href = useSyncExternalStore(subscribe, getRouteSnapshot, () => "/");
  const url = new URL(href);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return <HomePage />;
  if (path === "/products") return <ProductsPage initialCategory={url.searchParams.get("category") ?? "All"} />;
  if (path.startsWith("/products/")) return <ProductDetailPage productId={decodeURIComponent(path.split("/")[2] ?? "")} />;
  if (path === "/categories") return <CategoriesPage />;
  if (path === "/wholesalers") return <WholesalersPage initialCategory={url.searchParams.get("category") ?? "All"} />;
  if (path.startsWith("/wholesalers/")) {
    const parts = path.split("/");
    if (parts.length >= 4 && parts[3] === "catalog") {
      return <WholesalerCatalogPage wholesalerId={decodeURIComponent(parts[2] ?? "")} />;
    }
    return <WholesalerProfilePage wholesalerId={decodeURIComponent(parts[2] ?? "")} />;
  }
  if (path === "/dashboard") return <DashboardPage />;
  if (path === "/orders") return <OrdersPage />;
  if (path.startsWith("/orders/")) return <OrderDetailsPage orderId={decodeURIComponent(path.split("/")[2] ?? "")} />;
  if (path === "/cart") return <CartPage />;
  if (path === "/checkout") return <CheckoutPage />;
  if (path === "/wishlist") return <WishlistPage />;
  if (path === "/notifications") return <NotificationsPage />;
  if (path === "/profile") return <ProfilePage />;
  if (path === "/addresses") return <AddressesPage />;
  if (path === "/settings") return <SettingsPage />;
  if (path === "/login") return <AuthPage mode="login" />;
  if (path === "/register") return <RegisterPage />;
  if (path === "/forgot-password") return <AuthPage mode="forgot" />;

  return <PortalPage title="Page not found" body="The page you are looking for does not exist or has moved." />;
}

export default function App() {
  return (
    <MarketplaceShell>
      <RouterView />
    </MarketplaceShell>
  );
}
