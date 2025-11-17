// Export all API services and hooks
export { apiClient } from "./client";

// Types
export type {
  Product,
  ProductsResponse,
  CreateProductInput,
  UpdateProductInput,
  Category,
  CategoriesResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
  Order,
  OrderItem,
  Address,
  PaginationParams,
  ApiResponse,
  ApiError,
} from "./types";

// API endpoints
export { productApi } from "./productApi";
export type { AdvancedProductParams } from "./productApi";
export { categoryApi } from "./categoryApi";
export { orderApi } from "./orderApi";
export type { CreateOrderInput, UpdateOrderStatusInput } from "./orderApi";

// Hooks and Query Client
export { queryClient } from "./hooks";

// Product hooks
export {
  useProducts,
  useProductsAdvanced,
  useProduct,
  useProductById,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useBulkDeleteProducts,
  useSearchProducts,
} from "./hooks";

// Category hooks
export {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./hooks";

// Order hooks
export {
  useOrders,
  useMyOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
  useDeleteOrder,
} from "./hooks";

// Query Service - Wrapper functions
export {
  useGetProducts,
  useGetProductsFiltered,
  useGetProductBySlug,
  useGetProductById,
  useSearchProductsByQuery,
  buildProductFilters,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkDeleteProductsMutation,
  useGetCategories,
  useGetCategoryBySlug,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetMyOrders,
  useCreateOrderMutation,
  useGetCategoriesAndFeaturedProducts,
  queryKeys,
  prefetchProductBySlug,
  prefetchCategories,
} from "./queryService";
