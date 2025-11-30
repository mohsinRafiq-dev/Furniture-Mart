import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (item: WishlistItem) => {
        set((state) => {
          // Check if already in wishlist
          if (state.items.find((i) => i.id === item.id)) {
            return state;
          }
          return {
            items: [
              ...state.items,
              { ...item, addedAt: Date.now() },
            ],
          };
        });
      },
      removeFromWishlist: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      isInWishlist: (id: string) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => {
        set({ items: [] });
      },
      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist-storage",
      version: 1,
    }
  )
);
