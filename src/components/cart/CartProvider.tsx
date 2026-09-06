"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type CartContextValue = {
  itemCount: number;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue>({
  itemCount: 0,
  refresh: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [itemCount, setItemCount] = useState(0);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setItemCount(0);
      return;
    }

    const res = await fetch("/api/cart");
    if (!res.ok) {
      setItemCount(0);
      return;
    }

    const items = await res.json();
    if (!Array.isArray(items)) {
      setItemCount(0);
      return;
    }

    setItemCount(
      items.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity ?? 0), 0)
    );
  }, [status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return <CartContext.Provider value={{ itemCount, refresh }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
