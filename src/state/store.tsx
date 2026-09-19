import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products, wholesalers, orders as initialOrders, getWholesaler, type Order, type Relationship, type RetailerProfile, type Wholesaler } from "@/data/mock";

export type NotificationItem = { id: string; title: string; body: string; time: string; unread: boolean };
export type CartLine = { productId: string; quantity: number };

export type UserSession = {
  id: string;
  email: string;
};

export type UserData = {
  linkedWholesalerId: string;
  profile: RetailerProfile;
  relationships: Record<string, "Connected">;
  orders: Order[];
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  notifications: NotificationItem[];
};

export type Store = {
  currentUser: UserSession | null;
  isLoggedIn: boolean;
  linkedWholesalerId: string;
  linkedWholesaler: Wholesaler;
  connectedWholesalers: Wholesaler[];
  cart: CartLine[];
  wishlist: string[];
  relationships: Record<string, "Connected">;
  orders: Order[];
  retailerProfile: RetailerProfile;
  unread: number;
  notifications: NotificationItem[];
  recentlyViewed: string[];
  login: (email: string, password?: string, targetWholesalerId?: string) => void;
  logout: () => void;
  connectWholesaler: (wholesalerId: string, showToast?: boolean) => void;
  registerWithWholesaler: (profile: RetailerProfile, wholesalerId: string) => void;
  addToCart: (id: string, q?: number) => void;
  setQuantity: (id: string, q: number) => void;
  removeCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  saveProfile: (profile: RetailerProfile) => void;
  placeOrder: () => Order[];
  markRead: () => void;
  addRecentlyViewed: (id: string) => void;
};

const StoreContext = createContext<Store | undefined>(undefined);

// Pre-configured templates for seamless testing
const userAProfile: RetailerProfile = {
  businessName: "Kapoor General Store",
  ownerName: "Amit Kapoor",
  phone: "+91 98765 43210",
  email: "amit@kapoorgeneral.example",
  gstRegistered: true,
  gstNumber: "06AABCK1234M1ZP",
  businessType: "Independent retailer",
  category: "Grocery & Staples",
  address: "18 Market Road",
  city: "Gurugram",
  state: "Haryana",
  pincode: "122001",
};

const userATemplate: UserData = {
  linkedWholesalerId: "sharma",
  profile: userAProfile,
  relationships: {
    sharma: "Connected",
    gupta: "Connected",
    paperlane: "Connected",
    metro: "Connected",
  },
  orders: initialOrders,
  cart: [
    { productId: "p2", quantity: 6 },
    { productId: "p7", quantity: 5 },
    { productId: "p11", quantity: 6 },
  ],
  wishlist: ["p1", "p3", "p17", "p23"],
  recentlyViewed: ["p2", "p7", "p11", "p6"],
  notifications: [
    { id: "n1", title: "Order NX-240902 has shipped", body: "Gupta Wholesale Co. expects delivery by 20 Sep.", time: "12 min ago", unread: true },
    { id: "n2", title: "Connected with Paperlane Supply", body: "You can now shop the full Paperlane Supply House catalogue.", time: "2 hours ago", unread: true },
    { id: "n3", title: "Price drop on your wishlist", body: "Classic Electric Kettle is now ₹899 per unit.", time: "Yesterday", unread: true },
    { id: "n4", title: "Order delivered", body: "Your Metro Cash Network order was delivered successfully.", time: "2 days ago", unread: false },
  ],
};

const userBProfile: RetailerProfile = {
  businessName: "Singh & Verma Supermarket",
  ownerName: "Rajesh Verma",
  phone: "+91 98123 45678",
  email: "verma@singh-traders.example",
  gstRegistered: true,
  gstNumber: "07AAACV9876L1Z4",
  businessType: "Supermarket / mini-mart",
  category: "Beverages",
  address: "45 Station Road, Connaught Place",
  city: "New Delhi",
  state: "Delhi",
  pincode: "110001",
};

const userBTemplate: UserData = {
  linkedWholesalerId: "orbit",
  profile: userBProfile,
  relationships: {
    orbit: "Connected",
    sunrise: "Connected",
  },
  orders: [
    {
      id: "NX-9901",
      date: "17 Sep 2026",
      status: "Processing",
      wholesalerId: "orbit",
      total: 14200,
      items: [{ productId: "p1", quantity: 10 }, { productId: "p5", quantity: 8 }],
    },
    {
      id: "NX-9902",
      date: "10 Sep 2026",
      status: "Delivered",
      wholesalerId: "sunrise",
      total: 8900,
      items: [{ productId: "p9", quantity: 15 }],
    },
  ],
  cart: [{ productId: "p1", quantity: 4 }],
  wishlist: ["p9", "p10", "p27"],
  recentlyViewed: ["p9", "p10"],
  notifications: [
    { id: "nb1", title: "Order NX-9901 confirmed by Orbit", body: "Orbit Trade Links has packed your items.", time: "1 hour ago", unread: true },
  ],
};

export function resolveWholesalerId(input?: string | null): string {
  if (!input) return "sharma";
  const clean = input.trim().toLowerCase();
  if (clean === "wh-0001" || clean === "sharma" || clean === "sharma-distributors") return "sharma";
  if (clean === "wh-0002" || clean === "gupta" || clean === "gupta-wholesale") return "gupta";
  if (clean === "wh-0003" || clean === "orbit" || clean === "orbit-trade") return "orbit";
  if (clean === "wh-0004" || clean === "sunrise" || clean === "sunrise-foods") return "sunrise";
  if (clean === "wh-0005" || clean === "paperlane") return "paperlane";
  if (clean === "wh-0006" || clean === "greenway") return "greenway";
  if (clean === "wh-0007" || clean === "metro") return "metro";
  if (clean === "wh-0008" || clean === "northstar") return "northstar";
  const match = wholesalers.find((w) => w.id.toLowerCase() === clean || w.name.toLowerCase().includes(clean));
  return match?.id || "sharma";
}

function getNewUserTemplate(email: string, profileInput?: Partial<RetailerProfile>, targetWholesalerId = "sharma"): UserData {
  const cleanName = email.split("@")[0] ?? "New User";
  const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  const wId = resolveWholesalerId(targetWholesalerId);
  const wObj = getWholesaler(wId);

  return {
    linkedWholesalerId: wId,
    profile: {
      businessName: profileInput?.businessName || `${formattedName}'s Retail Store`,
      ownerName: profileInput?.ownerName || formattedName,
      phone: profileInput?.phone || "+91 90000 00000",
      email: email,
      gstRegistered: profileInput?.gstRegistered ?? false,
      gstNumber: profileInput?.gstNumber || "",
      businessType: profileInput?.businessType || "Independent retailer",
      category: profileInput?.category || "Grocery & Staples",
      address: profileInput?.address || "Main Market Road",
      city: profileInput?.city || "New Delhi",
      state: profileInput?.state || "Delhi",
      pincode: profileInput?.pincode || "110001",
    },
    relationships: {
      [wId]: "Connected",
    },
    orders: [],
    cart: [],
    wishlist: [],
    recentlyViewed: [],
    notifications: [
      {
        id: "new1",
        title: `Welcome! Connected with ${wObj.name}`,
        body: `You have direct wholesale trade access to ${wObj.name}. Start exploring trade products now.`,
        time: "Just now",
        unread: true,
      },
    ],
  };
}

function resolveUserTemplate(userId: string, email: string): UserData {
  const saved = window.localStorage.getItem(`nexora-user-data_${userId}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as UserData;
      if (!parsed.linkedWholesalerId) parsed.linkedWholesalerId = "sharma";
      return parsed;
    } catch {}
  }
  if (userId === "user-amit" || email.toLowerCase().includes("amit")) {
    return userATemplate;
  }
  if (userId === "user-verma" || email.toLowerCase().includes("verma")) {
    return userBTemplate;
  }
  return getNewUserTemplate(email);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return window.localStorage.getItem("nexora-active-user-id") || "user-amit";
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const savedEmail = window.localStorage.getItem(`nexora-user-email_${activeUserId}`);
    if (activeUserId === "user-amit") return { id: "user-amit", email: "amit@kapoorgeneral.example" };
    if (activeUserId === "user-verma") return { id: "user-verma", email: "verma@singh-traders.example" };
    return { id: activeUserId, email: savedEmail || `${activeUserId}@retailer.example` };
  });

  const [userData, setUserData] = useState<UserData>(() => {
    return resolveUserTemplate(activeUserId, currentUser?.email || "amit@kapoorgeneral.example");
  });

  // Sync current user data to localStorage
  useEffect(() => {
    if (!activeUserId) return;
    window.localStorage.setItem(`nexora-user-data_${activeUserId}`, JSON.stringify(userData));
  }, [activeUserId, userData]);

  const switchUser = (userId: string, email: string, profileInput?: Partial<RetailerProfile>) => {
    let resolved = resolveUserTemplate(userId, email);
    if (profileInput) {
      resolved = { ...resolved, profile: { ...resolved.profile, ...profileInput } };
    }
    setActiveUserId(userId);
    setCurrentUser({ id: userId, email });
    setUserData(resolved);

    window.localStorage.setItem("nexora-active-user-id", userId);
    window.localStorage.setItem(`nexora-user-email_${userId}`, email);
    window.localStorage.setItem(`nexora-user-data_${userId}`, JSON.stringify(resolved));
  };

  const { cart, wishlist, relationships, orders, profile: retailerProfile, recentlyViewed, notifications, linkedWholesalerId = "sharma" } = userData;

  const linkedWholesaler = useMemo(() => getWholesaler(linkedWholesalerId), [linkedWholesalerId]);

  const connectedWholesalers = useMemo(() => {
    return wholesalers.filter((w) => relationships[w.id] === "Connected");
  }, [relationships]);

  const connectWholesaler = (wholesalerId: string, showToast = true) => {
    const targetWId = resolveWholesalerId(wholesalerId);
    const wObj = getWholesaler(targetWId);

    setUserData((prev) => {
      if (prev.relationships[targetWId] === "Connected") {
        return { ...prev, linkedWholesalerId: targetWId };
      }
      const nextRelationships = { ...prev.relationships, [targetWId]: "Connected" as const };
      const nextNotifications: NotificationItem[] = [
        {
          id: `conn-${Date.now()}`,
          title: `Connected with ${wObj.name}`,
          body: `You now have direct wholesale trade access to ${wObj.name}.`,
          time: "Just now",
          unread: true,
        },
        ...prev.notifications,
      ];
      return {
        ...prev,
        relationships: nextRelationships,
        notifications: nextNotifications,
        linkedWholesalerId: targetWId,
      };
    });

    if (showToast) {
      toast.success(`You're now connected with ${wObj.name}`);
    }
  };

  // Auto-connect if URL contains ?wholesaler=... when logged in
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wParam = params.get("wholesaler") || params.get("w");
    if (wParam && currentUser && !activeUserId.startsWith("guest-")) {
      const targetId = resolveWholesalerId(wParam);
      if (relationships[targetId] !== "Connected") {
        connectWholesaler(targetId, true);
      }
    }
  }, [activeUserId, currentUser, relationships]);

  const setCart = (updater: CartLine[] | ((prev: CartLine[]) => CartLine[])) => {
    setUserData((prev) => ({
      ...prev,
      cart: typeof updater === "function" ? updater(prev.cart) : updater,
    }));
  };

  const setWishlist = (updater: string[] | ((prev: string[]) => string[])) => {
    setUserData((prev) => ({
      ...prev,
      wishlist: typeof updater === "function" ? updater(prev.wishlist) : updater,
    }));
  };

  const setOrders = (updater: Order[] | ((prev: Order[]) => Order[])) => {
    setUserData((prev) => ({
      ...prev,
      orders: typeof updater === "function" ? updater(prev.orders) : updater,
    }));
  };

  const setRecentlyViewed = (updater: string[] | ((prev: string[]) => string[])) => {
    setUserData((prev) => ({
      ...prev,
      recentlyViewed: typeof updater === "function" ? updater(prev.recentlyViewed) : updater,
    }));
  };

  const setNotifications = (updater: NotificationItem[] | ((prev: NotificationItem[]) => NotificationItem[])) => {
    setUserData((prev) => ({
      ...prev,
      notifications: typeof updater === "function" ? updater(prev.notifications) : updater,
    }));
  };

  const unread = notifications.filter((n) => n.unread).length;

  const login = (email: string, _password?: string, targetWholesalerId?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    let userId = `user-${cleanEmail.replace(/[^a-z0-9]/g, "")}`;
    if (cleanEmail.includes("amit")) userId = "user-amit";
    else if (cleanEmail.includes("verma")) userId = "user-verma";

    switchUser(userId, cleanEmail);
    const resolved = resolveUserTemplate(userId, cleanEmail);
    toast.success(`Signed in as ${resolved.profile.ownerName}`);

    if (targetWholesalerId) {
      connectWholesaler(targetWholesalerId, true);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("nexora-active-user-id");
    const guestId = "guest-" + Date.now();
    setActiveUserId(guestId);
    setCurrentUser(null);
    setUserData(getNewUserTemplate("guest@retailer.example"));
    toast.success("Signed out successfully");
  };

  const saveProfile = (profileInput: RetailerProfile) => {
    let userId = activeUserId;
    if (!currentUser || activeUserId.startsWith("guest-")) {
      userId = `user-${profileInput.email.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    }
    switchUser(userId, profileInput.email, profileInput);
    toast.success("Retailer profile saved");
  };

  const registerWithWholesaler = (profileInput: RetailerProfile, targetWholesalerId: string) => {
    const cleanEmail = profileInput.email.trim().toLowerCase();
    const userId = `user-${cleanEmail.replace(/[^a-z0-9]/g, "")}`;
    const targetWId = resolveWholesalerId(targetWholesalerId);
    const newTemplate = getNewUserTemplate(cleanEmail, profileInput, targetWId);

    setActiveUserId(userId);
    setCurrentUser({ id: userId, email: cleanEmail });
    setUserData(newTemplate);

    window.localStorage.setItem("nexora-active-user-id", userId);
    window.localStorage.setItem(`nexora-user-email_${userId}`, cleanEmail);
    window.localStorage.setItem(`nexora-user-data_${userId}`, JSON.stringify(newTemplate));

    const wObj = getWholesaler(targetWId);
    toast.success(`Registered & connected with ${wObj.name}`);
  };

  const value = useMemo<Store>(
    () => ({
      currentUser,
      isLoggedIn: currentUser !== null && !activeUserId.startsWith("guest-"),
      linkedWholesalerId,
      linkedWholesaler,
      connectedWholesalers,
      cart,
      wishlist,
      relationships,
      orders,
      retailerProfile,
      unread,
      notifications,
      recentlyViewed,
      login,
      logout,
      connectWholesaler,
      registerWithWholesaler,
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
      saveProfile,
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
      markRead: () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))),
      addRecentlyViewed: (id) => {
        setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12));
      },
    }),
    [currentUser, activeUserId, linkedWholesalerId, linkedWholesaler, connectedWholesalers, cart, wishlist, relationships, orders, retailerProfile, unread, notifications, recentlyViewed]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider missing");
  return value;
};

