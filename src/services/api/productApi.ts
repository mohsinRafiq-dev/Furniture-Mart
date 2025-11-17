import { apiClient } from "./client";
import {
  Product,
  ProductsResponse,
  CreateProductInput,
  UpdateProductInput,
  PaginationParams,
  ApiResponse,
} from "./types";

// Product Endpoints
export const productApi = {
  // Get all products
  getAll: (params?: PaginationParams) =>
    apiClient.get<ApiResponse<ProductsResponse>>("/products", { params }),

  // Get single product by slug
  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${slug}`),

  // Get single product by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/id/${id}`),

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
