import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { productApi } from "./productApi";
import { categoryApi } from "./categoryApi";
import { orderApi } from "./orderApi";
import {
  PaginationParams,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./types";
import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "./orderApi";

// ============ Query Client Setup ============
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ============ Product Queries ============
export const useProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await productApi.getAll(params);
      return response.data.data;
    },
  });
};

export const useProductsAdvanced = (params?: any) => {
  return useQuery({
    queryKey: ["products", "advanced", params],
    queryFn: async () => {
      const response = await productApi.getAdvanced(params);
      return response.data.data;
    },
    enabled: !!params,
  });
};

export const useProduct = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await productApi.getBySlug(slug);
      return response.data.data;
    },
    enabled,
  });
};

export const useProductById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productApi.getById(id);
      return response.data.data;
    },
    enabled,
  });
};

// ============ Product Mutations (Admin) ============
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await productApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductInput;
    }) => {
      const response = await productApi.update(id, data);
      return response.data.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.setQueryData(["product", data.id], data);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await productApi.delete(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await productApi.bulkDelete(ids);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useSearchProducts = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ["products", "search", query, params],
    queryFn: async () => {
      const response = await productApi.search(query, params);
      return response.data.data;
    },
    enabled: !!query,
  });
};

// ============ Category Queries ============
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data.data.categories;
    },
  });
};

export const useCategory = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await categoryApi.getBySlug(slug);
      return response.data.data;
    },
    enabled,
  });
};

// ============ Category Mutations (Admin) ============
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await categoryApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryInput;
    }) => {
      const response = await categoryApi.update(id, data);
      return response.data.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.setQueryData(["category", data.id], data);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await categoryApi.delete(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// ============ Order Queries ============
export const useOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await orderApi.getAll(params);
      return response.data.data;
    },
  });
};

export const useMyOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["orders", "my", params],
    queryFn: async () => {
      const response = await orderApi.getMyOrders(params);
      return response.data.data;
    },
  });
};

export const useOrder = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await orderApi.getById(id);
      return response.data.data;
    },
    enabled,
  });
};

// ============ Order Mutations ============
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const response = await orderApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderStatusInput;
    }) => {
      const response = await orderApi.updateStatus(id, data);
      return response.data.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["order", data.id], data);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await orderApi.cancel(id);
      return response.data.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      queryClient.setQueryData(["order", data.id], data);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await orderApi.delete(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
