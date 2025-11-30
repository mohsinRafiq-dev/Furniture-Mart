import { apiClient } from "./client";
import {
  Product,
  ProductsResponse,
  CreateProductInput,
  UpdateProductInput,
  PaginationParams,
  ApiResponse,
} from "./types";

export interface AdvancedProductParams extends PaginationParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  rating?: number;
  inStock?: boolean;
  sort?: string;
}

// Product Endpoints
export const productApi = {
  // Get all products
  getAll: async (params?: PaginationParams) => {
    console.log("[PRODUCT API] Fetching all products...", params);
    try {
      const response = await apiClient.get<ApiResponse<ProductsResponse>>("/products", { params });
      console.log("[PRODUCT API] ✅ Success - Products fetched:", response.data.data.products.length);
      return response;
    } catch (err: any) {
      console.error("[PRODUCT API] ❌ Failed to fetch products:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
      });
      throw err;
    }
  },

  // Get products with advanced filtering
  getAdvanced: async (params?: AdvancedProductParams) => {
    console.log("[PRODUCT API] Fetching advanced products...", params);
    try {
      const response = await apiClient.get<ApiResponse<ProductsResponse>>("/products/search/advanced", { params });
      console.log("[PRODUCT API] ✅ Success - Advanced products fetched:", response.data.data.products.length);
      return response;
    } catch (err: any) {
      console.error("[PRODUCT API] ❌ Failed to fetch advanced products:", err.message);
      throw err;
    }
  },

  // Get single product by slug
  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`),

  // Get single product by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  // Create product (admin)
  create: (data: CreateProductInput) =>
    apiClient.post<ApiResponse<Product>>("/products", data),

  // Update product (admin)
  update: (id: string, data: UpdateProductInput) =>
    apiClient.put<ApiResponse<Product>>(`/products/${id}`, data),

  // Delete product (admin)
  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ id: string }>>(`/products/${id}`),

  // Bulk delete products (admin)
  bulkDelete: (ids: string[]) =>
    apiClient.post<ApiResponse<{ deleted: number }>>("/products/bulk-delete", {
      ids,
    }),

  // Search products
  search: (query: string, params?: PaginationParams) =>
    apiClient.get<ApiResponse<ProductsResponse>>("/products/search", {
      params: { q: query, ...params },
    }),
};
