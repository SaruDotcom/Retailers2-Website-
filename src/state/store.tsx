import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { defaultRetailerProfile, products, wholesalers, orders as initialOrders, type Order, type Relationship, type RetailerProfile } from "@/data/mock";

type CartLine = { productId: string; quantity: number };
type Store = {
  cart: CartLine[];
  wishlist: string[];
  relationships: Record<string, Relationship>;
  orders: Order[];
  retailerProfile: RetailerProfile;
  unread: number;
  recentlyViewed: string[];
  addToCart: (id: string, q?: number) => void;
  setQuantity: (id: string, q: number) => void;
  removeCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  requestAccess: (id: string) => void;
  approveRequest: (id: string) => void;
  saveProfile: (profile: RetailerProfile) => void;
  placeOrder: () => Order[];
  markRead: () => void;
  addRecentlyViewed: (id: string) => void;
};

const StoreContext = createContext<Store | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([
    { productId: "p2", quantity: 6 },
    { productId: "p7", quantity: 5 },
    { productId: "p11", quantity: 6 },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(["p1", "p3", "p17", "p23"]);
  const [relationships, setRelationships] = useState<Record<string, Relationship>>(() =>
    Object.fromEntries(wholesalers.map((w) => [w.id, w.relationship]))
  );
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [retailerProfile, setRetailerProfile] = useState<RetailerProfile>(defaultRetailerProfile);
  const [unread, setUnread] = useState(3);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(["p2", "p7", "p11", "p6"]);

  useEffect(() => {
    const raw = window.localStorage.getItem("nexora-store");
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Partial<{
          cart: CartLine[];
          wishlist: string[];
          relationships: Record<string, Relationship>;
          orders: Order[];
          retailerProfile: RetailerProfile;
          recentlyViewed: string[];
        }>;
        if (Array.isArray(saved.cart)) setCart(saved.cart);
        if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
        if (saved.relationships) setRelationships(saved.relationships);
        if (Array.isArray(saved.orders)) setOrders(saved.orders);
        if (saved.retailerProfile) setRetailerProfile(saved.retailerProfile);
        if (Array.isArray(saved.recentlyViewed)) setRecentlyViewed(saved.recentlyViewed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "nexora-store",
      JSON.stringify({ cart, wishlist, relationships, orders, retailerProfile, recentlyViewed })
    );
  }, [cart, wishlist, relationships, orders, retailerProfile, recentlyViewed]);

  const value = useMemo<Store>(
    () => ({
      cart,
      wishlist,
      relationships,
      orders,
      retailerProfile,
      unread,
      recentlyViewed,
      addToCart: (id, q) => {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        const qty = Math.max(q ?? p.moq, p.moq);
        setCart((c) =>
          c.some((x) => x.productId === id)
            ? c.map((x) => (x.productId === id ? { ...x, quantity: x.quantity + qty } : x))
            : [...c, { productId: id, quantity: qty }]
        );
        toast.success(`${p.name} added to cart`);
      },
      setQuantity: (id, q) => {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        setCart((c) => c.map((x) => (x.productId === id ? { ...x, quantity: Math.max(1, q) } : x)));
      },
      removeCart: (id) => setCart((c) => c.filter((x) => x.productId !== id)),
      toggleWishlist: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
      requestAccess: (id) => {
        setRelationships((r) => ({ ...r, [id]: "Request Pending" }));
        toast.success("Access request sent");
      },
      approveRequest: (id) => {
        setRelationships((r) => ({ ...r, [id]: "Connected" }));
        toast.success("Wholesaler connection approved");
      },
      saveProfile: (profile) => {
        setRetailerProfile(profile);
        toast.success("Retailer profile saved");
      },
      placeOrder: () => {
        const grouped = cart.reduce<Record<string, CartLine[]>>((result, line) => {
          const product = products.find((item) => item.id === line.productId);
          if (!product) return result;
          const current = result[product.wholesalerId] ?? [];
          result[product.wholesalerId] = [...current, line];
          return result;
        }, {});
        const created = Object.entries(grouped).map(([wholesalerId, items], index) => ({
          id: `NX-${String(Date.now()).slice(-6)}-${index + 1}`,
          date: "Today",
          status: "Pending" as const,
          wholesalerId,
          total: items.reduce((sum, line) => {
            const product = products.find((item) => item.id === line.productId);
            return sum + (product?.price ?? 0) * line.quantity;
          }, 0),
          items,
        }));
        setOrders((current) => [...created, ...current]);
        setCart([]);
        toast.success(`${created.length} wholesaler order${created.length === 1 ? "" : "s"} placed`);
        return created;
      },
      markRead: () => setUnread(0),
      addRecentlyViewed: (id) => {
        setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12));
      },
    }),
    [cart, wishlist, relationships, orders, retailerProfile, unread, recentlyViewed]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider missing");
  return value;
};
