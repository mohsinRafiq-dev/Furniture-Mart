/**
 * Environment and API Configuration
 * Centralized configuration for the application
 */

export const apiConfig = {
  // Base URLs - use Railway in production, localhost in development
  baseURL: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? (import.meta.env.VITE_RAILWAY_API_URL || "https://furniture-mart-backend-production.up.railway.app/api")
      : "http://localhost:5000/api"),
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.PROD
      ? (import.meta.env.VITE_RAILWAY_API_BASE_URL || "https://furniture-mart-backend-production.up.railway.app")
      : "http://localhost:5000"),

  // API Timeouts
  timeout: 30000,
  
  // Retry Configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
  },

  // Pagination
  pagination: {
    defaultPage: 1,
    defaultLimit: 12,
    maxLimit: 100,
  },

  // Cache Configuration
  cache: {
    // React Query cache times (in milliseconds)
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    
    // Specific cache times for different data types
    products: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    categories: {
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    },
    user: {
      staleTime: 1 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },

  // Storage Keys
  storage: {
    authToken: "authToken",
    refreshToken: "refreshToken",
    userRole: "userRole",
    preferences: "userPreferences",
  },

  // API Endpoints
  endpoints: {
    products: "/products",
    categories: "/categories",
    orders: "/orders",
    auth: "/auth",
    admin: "/admin",
  },

  // Filter Options for Products
  filters: {
    sortOptions: [
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
      { value: "rating", label: "Highest Rated" },
      { value: "newest", label: "Newest" },
      { value: "oldest", label: "Oldest" },
      { value: "popular", label: "Most Popular" },
    ],
    priceRanges: [
      { label: "Under $200", min: 0, max: 200 },
      { label: "$200 - $500", min: 200, max: 500 },
      { label: "$500 - $1000", min: 500, max: 1000 },
      { label: "$1000 - $2000", min: 1000, max: 2000 },
      { label: "$2000+", min: 2000, max: Infinity },
    ],
    ratingFilter: [1, 2, 3, 4, 5],
  },

  // Role-based permissions
  roles: {
    admin: "admin",
    editor: "editor",
    viewer: "viewer",
    customer: "customer",
  },

  // Feature Flags
  features: {
    enableProductReviews: true,
    enableWishlist: true,
    enableComparison: true,
    enableAdvancedFiltering: true,
  },

  // Development
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Environment
  environment: import.meta.env.MODE,
};

export default apiConfig;
