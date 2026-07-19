import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Cart } from "@/types";

interface CartStore extends Cart {
  addItem: (product: Product, onAuthRequired?: () => void) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const checkAuth = (): boolean => {
  if (typeof window === "undefined") return false;
  // Check if user data exists
  return localStorage.getItem("user") !== null;
};

const getUserId = (): number | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  try {
    const user = JSON.parse(userData);
    return user.id;
  } catch {
    return null;
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product, onAuthRequired) => {
        // Check if user is authenticated
        if (!checkAuth()) {
          onAuthRequired?.();
          return;
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id,
          );

          let newItems;
          let newQuantity = 1;

          if (existingItem) {
            newQuantity = existingItem.quantity + 1;
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * item.product.price,
                  }
                : item,
            );
          } else {
            newItems = [
              ...state.items,
              {
                product,
                quantity: 1,
                subtotal: product.price,
              },
            ];
          }

          const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
          const itemCount = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          return { items: newItems, total, itemCount };
        });
      },

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product.id !== productId,
          );
          const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
          const itemCount = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          return { items: newItems, total, itemCount };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return (get().removeItem(productId), state);
          }

          const newItems = state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity,
                  subtotal: quantity * item.product.price,
                }
              : item,
          );

          const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
          const itemCount = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          return { items: newItems, total, itemCount };
        }),

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
