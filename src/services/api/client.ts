import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = 
  (import.meta.env.VITE_API_URL as string) ||
  (import.meta.env.VITE_API_BASE_URL as string) ||
  (import.meta.env.PROD 
    ? "https://furniture-mart-backend-production.up.railway.app/api"  // Production fallback
    : "http://localhost:5000/api"); // Development

// Enable console logs only in development
const isDev = import.meta.env.DEV;
const log = (...args: any[]) => isDev && console.log(...args);
const error = (...args: any[]) => isDev && console.error(...args);

// Only log in development for debugging
if (isDev) {
  console.log("[API Client DEBUG] VITE_API_URL env:", import.meta.env.VITE_API_URL);
  console.log("[API Client DEBUG] VITE_API_BASE_URL env:", import.meta.env.VITE_API_BASE_URL);
  console.log("[API Client DEBUG] Environment PROD:", import.meta.env.PROD);
  console.log("[API Client DEBUG] Final API_BASE_URL:", API_BASE_URL);
}

class ApiClient {
  private client: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    if (isDev) {
      console.log("[API Client] Initializing with baseURL:", API_BASE_URL);
    }
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // Increased to 30s for slow mobile networks
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      log("[API Request]", config.method?.toUpperCase(), config.url);
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        log("[API Response] Success:", response.status);
        return response;
      },
      (err: AxiosError) => {
        error("[API Error]", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          message: err.message,
          url: err.config?.url,
          code: err.code,
        });
        
        // Log network errors specifically for mobile debugging
        if (!err.response) {
          console.error(
            "[API NETWORK ERROR] Failed to connect to backend. Check if:",
            {
              backendURL: API_BASE_URL,
              networkType: (navigator as any).connection?.effectiveType,
              message: err.message,
              code: err.code,
            }
          );
        }
        
        if (err.response?.status === 401) {
          // Handle unauthorized - clear token and redirect
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    );
  }

  // GET requests with retry logic and caching for mobile networks
  async get<T>(url: string, config: any = {}, retries = 3) {
    // Check cache first for cacheable requests (products list and categories)
    const useCache = config.cache !== false && (url.includes('/products') || url.includes('/categories'));
    const cacheKey = `${url}`;
    
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        log(`[API CACHE HIT] ${url}`);
        return { data: cached.data } as any;
      }
    }
    
    let lastError: any;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        log(`[API GET] Attempt ${attempt}/${retries} for ${url}`);
        const response = await this.client.get<T>(url, config);
        log(`[API GET SUCCESS] ${url} on attempt ${attempt}`);
        
        // Cache successful responses
        if (useCache && response.data) {
          this.cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
          });
        }
        
        return response;
      } catch (err: any) {
        lastError = err;
        console.warn(`[API GET FAILED] Attempt ${attempt}/${retries} for ${url}:`, {
          code: err.code,
          message: err.message,
          status: err.response?.status,
        });
        
        // Only retry on network errors, not on 4xx/5xx responses
        if (err.response || attempt === retries) {
          break;
        }
        
        // Wait before retrying (exponential backoff: 500ms, 1s, 2s)
        const delay = 500 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  // POST requests
  post<T>(url: string, data?: any, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  // PUT requests
  put<T>(url: string, data?: any, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  // DELETE requests
  delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }

  // PATCH requests
  patch<T>(url: string, data?: any, config = {}) {
    return this.client.patch<T>(url, data, config);
  }

  // Clear cache utility method
  clearCache(pattern?: string) {
    if (pattern) {
      const keys = Array.from(this.cache.keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    } else {
      this.cache.clear();
    }
  }
}

export const apiClient = new ApiClient();
