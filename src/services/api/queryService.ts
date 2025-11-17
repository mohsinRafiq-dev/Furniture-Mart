/**
 * Query Service - Wrapper functions for common API operations
 * Provides a clean abstraction layer for React Query operations
 */

import { useCallback } from "react";
import {
  useProducts,
  useProductsAdvanced,
  useProduct,
  useProductById,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useBulkDeleteProducts,
  useSearchProducts,
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateOrder,
  useMyOrders,
} from "./hooks";
import { PaginationParams } from "./types";
import { AdvancedProductParams } from "./productApi";

// ============ Product Query Wrappers ============

/**
 * Get all products with pagination
 */
export const useGetProducts = (page: number = 1, limit: number = 12) => {
  return useProducts({ page, limit });
};

/**
 * Get products with advanced filtering
 * @param filters - Advanced filter parameters
 * @param enabled - Enable/disable the query
 */
export const useGetProductsFiltered = (
  filters?: Partial<AdvancedProductParams>,
  enabled: boolean = true
) => {
  const query = useProductsAdvanced(filters && enabled ? filters : undefined);
  return query;
};

/**
 * Get product by slug
 * @param slug - Product slug for URL-friendly access
 * @param enabled - Enable/disable the query
 */
export const useGetProductBySlug = (slug: string, enabled: boolean = true) => {
  return useProduct(slug, enabled);
};

/**
 * Get product by ID
 * @param id - Product ID
 * @param enabled - Enable/disable the query
 */
export const useGetProductById = (id: string, enabled: boolean = true) => {
  return useProductById(id, enabled);
};

/**
 * Search products by query string
 * @param query - Search query
 * @param pagination - Pagination parameters
 */
export const useSearchProductsByQuery = (
  query: string,
  pagination?: PaginationParams
) => {
  return useSearchProducts(query, pagination);
};

// ============ Product Advanced Filters Helper ============

/**
 * Build advanced filter parameters
 */
export const buildProductFilters = (options: {
  search?: string;
  category?: string;
  priceRange?: [number, number];
  featured?: boolean;
  minRating?: number;
  inStock?: boolean;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "oldest" | "popular";
  page?: number;
  limit?: number;
}): AdvancedProductParams => {
  return {
    search: options.search,
    category: options.category,
    minPrice: options.priceRange?.[0],
    maxPrice: options.priceRange?.[1],
    featured: options.featured,
    rating: options.minRating,
    inStock: options.inStock,
    sort: options.sortBy,
    page: options.page,
    limit: options.limit,
  };
};

// ============ Product Mutation Wrappers ============

/**
 * Create a new product (admin only)
 */
export const useCreateProductMutation = () => {
  const mutation = useCreateProduct();

  return useCallback(
    (productData: any) => {
      return mutation.mutateAsync(productData);
    },
    [mutation]
  );
};

/**
 * Update an existing product (admin only)
 */
export const useUpdateProductMutation = () => {
  const mutation = useUpdateProduct();

  return useCallback(
    (id: string, productData: any) => {
      return mutation.mutateAsync({ id, data: productData });
    },
    [mutation]
  );
};

/**
 * Delete a product (admin only)
 */
export const useDeleteProductMutation = () => {
  const mutation = useDeleteProduct();

  return useCallback(
    (id: string) => {
      return mutation.mutateAsync(id);
    },
    [mutation]
  );
};

/**
 * Bulk delete products (admin only)
 */
export const useBulkDeleteProductsMutation = () => {
  const mutation = useBulkDeleteProducts();

  return useCallback(
    (ids: string[]) => {
      return mutation.mutateAsync(ids);
    },
    [mutation]
  );
};

// ============ Category Query Wrappers ============

/**
 * Get all categories
 */
export const useGetCategories = () => {
  return useCategories();
};

/**
 * Get category by slug
 * @param slug - Category slug
 * @param enabled - Enable/disable the query
 */
export const useGetCategoryBySlug = (slug: string, enabled: boolean = true) => {
  return useCategory(slug, enabled);
};

// ============ Category Mutation Wrappers ============

/**
 * Create a new category (admin only)
 */
export const useCreateCategoryMutation = () => {
  const mutation = useCreateCategory();

  return useCallback(
    (categoryData: any) => {
      return mutation.mutateAsync(categoryData);
    },
    [mutation]
  );
};

/**
 * Update an existing category (admin only)
 */
export const useUpdateCategoryMutation = () => {
  const mutation = useUpdateCategory();

  return useCallback(
    (id: string, categoryData: any) => {
      return mutation.mutateAsync({ id, data: categoryData });
    },
    [mutation]
  );
};

/**
 * Delete a category (admin only)
 */
export const useDeleteCategoryMutation = () => {
  const mutation = useDeleteCategory();

  return useCallback(
    (id: string) => {
      return mutation.mutateAsync(id);
    },
    [mutation]
  );
};

// ============ Order Query Wrappers ============

/**
 * Get current user's orders
 */
export const useGetMyOrders = (pagination?: PaginationParams) => {
  return useMyOrders(pagination);
};

// ============ Order Mutation Wrappers ============

/**
 * Create a new order
 */
export const useCreateOrderMutation = () => {
  const mutation = useCreateOrder();

  return useCallback(
    (orderData: any) => {
      return mutation.mutateAsync(orderData);
    },
    [mutation]
  );
};

// ============ Batch Query Utility ============

/**
 * Wrapper hook for multiple related queries
 * Useful when you need to fetch categories and featured products together
 */
export const useGetCategoriesAndFeaturedProducts = () => {
  const categories = useGetCategories();
  const featuredProducts = useGetProductsFiltered(
    { featured: true, limit: 8 },
    !categories.isLoading
  );

  return {
    categories,
    featuredProducts,
    isLoading: categories.isLoading || featuredProducts.isLoading,
    error: categories.error || featuredProducts.error,
  };
};

// ============ Cache Key Generators ============

/**
 * Generate query cache keys for consistency
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params?: PaginationParams) => [...queryKeys.products.all, "list", params] as const,
    advanced: (params?: AdvancedProductParams) =>
      [...queryKeys.products.all, "advanced", params] as const,
    detail: (slug: string) => [...queryKeys.products.all, "detail", slug] as const,
    byId: (id: string) => [...queryKeys.products.all, "byId", id] as const,
    search: (query: string) => [...queryKeys.products.all, "search", query] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (slug: string) => [...queryKeys.categories.all, "detail", slug] as const,
  },
  orders: {
    all: ["orders"] as const,
    my: ["orders", "my"] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },
};

// ============ Prefetch Utilities ============

/**
 * Prefetch product data for better UX
 * Use this before navigating to product detail page
 */
export const prefetchProductBySlug = async (
  slug: string,
  queryClient: any
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: async () => {
      // This will be called by the actual hook
      return null;
    },
  });
};

/**
 * Prefetch categories for better UX
 */
export const prefetchCategories = async (queryClient: any) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      return null;
    },
  });
};
