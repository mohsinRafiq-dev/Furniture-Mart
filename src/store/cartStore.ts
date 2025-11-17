import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;

  // Actions
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
  getTotal: () => number;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId
          );

          let newItems: CartItem[];

          if (existingItem) {
            // Update quantity if item already exists
            newItems = state.items.map((cartItem) =>
              cartItem.productId === item.productId
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + (item.quantity || 1),
                  }
                : cartItem
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${item.productId}-${Date.now()}`,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity || 1,
              image: item.image,
              slug: item.slug,
            };
            newItems = [...state.items, newItem];
          }

          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.productId !== productId
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      getItem: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },

      getTotal: () => {
        return get().total;
      },

      getItemCount: () => {
        return get().itemCount;
      },

      getTotalPrice: () => {
        return get().total;
      },

      getTotalItems: () => {
        return get().itemCount;
      },
    }),
    {
      name: "furniture-cart-store",
      version: 1,
      // Optional: custom storage engine
      storage: {
        getItem: (key: string) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (key: string, value: unknown) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key: string) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
