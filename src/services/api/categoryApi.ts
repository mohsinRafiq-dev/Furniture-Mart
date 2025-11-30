import { apiClient } from "./client";
import {
  Category,
  CategoriesResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
  ApiResponse,
} from "./types";

// Category Endpoints
export const categoryApi = {
  // Get all categories
  getAll: async () => {
    console.log("[CATEGORY API] Fetching all categories...");
    try {
      const response = await apiClient.get<ApiResponse<CategoriesResponse>>("/categories");
      console.log("[CATEGORY API] ✅ Success - Categories fetched:", response.data.data.categories.length);
      return response;
    } catch (err: any) {
      console.error("[CATEGORY API] ❌ Failed to fetch categories:", {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
      });
      throw err;
    }
  },

  // Get single category by slug
  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${slug}`),

  // Get single category by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/id/${id}`),

  // Create category (admin)
  create: (data: CreateCategoryInput) =>
    apiClient.post<ApiResponse<Category>>("/categories", data),

  // Update category (admin)
  update: (id: string, data: UpdateCategoryInput) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data),

  // Delete category (admin)
  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ id: string }>>(`/categories/${id}`),
};
