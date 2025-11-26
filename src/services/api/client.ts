import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = 
  (import.meta.env.VITE_API_URL as string) ||
  `${(import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000"}/api`;

// Enable console logs only in development
const isDev = import.meta.env.DEV;
const log = (...args: any[]) => isDev && console.log(...args);
const error = (...args: any[]) => isDev && console.error(...args);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    log("[API Client] Initializing with baseURL:", API_BASE_URL);
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
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
        
        if (err.response?.status === 401) {
          // Handle unauthorized - clear token and redirect
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    );
  }

  // GET requests
  get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
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
}

export const apiClient = new ApiClient();
