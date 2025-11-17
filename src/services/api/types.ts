// Types for Products
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// Types for Categories
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

// Types for Orders
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Error response
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
