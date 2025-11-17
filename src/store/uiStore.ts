import { create } from "zustand";

export interface UIState {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>;

  // Actions
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  sidebarOpen: false,
  notifications: [],

  toggleMobileMenu: () => {
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
    }));
  },

  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open });
  },

  toggleSearch: () => {
    set((state) => ({
      searchOpen: !state.searchOpen,
    }));
  },

  setSearchOpen: (open) => {
    set({ searchOpen: open });
  },

  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  addNotification: (message, type = "info", duration = 3000) => {
    const id = `notification-${Date.now()}`;

    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id,
          type,
          message,
        },
      ],
    }));

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
