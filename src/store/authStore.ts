import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  storeTokenInBoth,
  clearTokenFromBoth,
  getStoredToken,
  isTokenExpired,
  decodeJWT,
} from "../utils/jwtUtils";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  initializeAuth: () => void;
  validateToken: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setToken: (token) => {
        set({ token });
        if (token) {
          // Store in both localStorage and cookie for maximum compatibility
          storeTokenInBoth(token, 86400); // 24 hours
        } else {
          clearTokenFromBoth();
        }
      },

      login: async (email: string, _password: string) => {
        try {
          // In production, this would call actual API
          // const response = await loginApi(email, _password)
          // set({ user: response.user, token: response.token })

          // Demo implementation - replace with real API call
          const user: User = {
            id: "1",
            email,
            name: "Admin User",
            role: "admin",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              "Admin User"
            )}&background=f59e0b&color=fff`,
          };

          // Generate mock JWT token
          const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiIke2VtYWlsfSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6JHtNYXRoLmZsb29yKERhdGUubm93KCkvMTAwMCl9LCJleHAiOiR7TWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApKzg2NDAwfX0.fake_signature_${Date.now()}`;

          set({
            user,
            token,
            isAuthenticated: true,
          });

          // Store token in both localStorage and cookie
          storeTokenInBoth(token, 86400);
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        clearTokenFromBoth();
      },

      isAdmin: () => {
        const role = get().user?.role;
        return role === "admin" || role === "editor";
      },

      initializeAuth: () => {
        // Try to restore token from storage on app initialization
        const storedToken = getStoredToken();
        if (storedToken && !isTokenExpired(storedToken)) {
          const payload = decodeJWT(storedToken);
          if (payload) {
            const user: User = {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              role: (payload.role as "admin" | "editor" | "viewer") || "viewer",
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                payload.name
              )}&background=f59e0b&color=fff`,
            };

            set({
              user,
              token: storedToken,
              isAuthenticated: true,
            });
          }
        } else if (storedToken) {
          // Token is expired, clear it
          clearTokenFromBoth();
        }
      },

      validateToken: () => {
        const token = get().token;
        if (!token) return false;
        return !isTokenExpired(token);
      },
    }),
    {
      name: "furniture-auth-store",
      version: 2,
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
