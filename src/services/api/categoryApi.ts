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
  getAll: () =>
    apiClient.get<ApiResponse<CategoriesResponse>>("/categories"),

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
