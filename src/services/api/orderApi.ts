import { apiClient } from "./client";
import {
  Order,
  PaginationParams,
  ApiResponse,
} from "./types";

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface UpdateOrderStatusInput {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

// Order Endpoints
export const orderApi = {
  // Get all orders (admin)
  getAll: (params?: PaginationParams) =>
    apiClient.get<ApiResponse<{ orders: Order[]; total: number }>>("/orders", {
      params,
    }),

  // Get user's orders
  getMyOrders: (params?: PaginationParams) =>
    apiClient.get<ApiResponse<{ orders: Order[]; total: number }>>(
      "/orders/my",
      { params }
    ),

  // Get single order
  getById: (id: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

  // Create order
  create: (data: CreateOrderInput) =>
    apiClient.post<ApiResponse<Order>>("/orders", data),

  // Update order status (admin)
  updateStatus: (id: string, data: UpdateOrderStatusInput) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, data),

  // Cancel order
  cancel: (id: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/cancel`, {}),

  // Delete order (admin)
  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ id: string }>>(`/orders/${id}`),
};
