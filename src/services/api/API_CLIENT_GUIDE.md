# API Client Setup Guide

## Installation

First, install the required dependencies:

```bash
npm install axios @tanstack/react-query
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## File Structure

```
src/services/api/
├── client.ts           # Axios client with interceptors
├── types.ts            # TypeScript interfaces
├── productApi.ts       # Product endpoints
├── categoryApi.ts      # Category endpoints
├── orderApi.ts         # Order endpoints
├── hooks.ts            # React Query hooks
└── index.ts            # Barrel exports
```

## Usage

### Setup QueryClientProvider

Wrap your app in `App.tsx`:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/services/api";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app routes */}
    </QueryClientProvider>
  );
}
```

### Using Product Hooks

```tsx
import { useProducts, useProduct, useCreateProduct } from "@/services/api";

function ProductList() {
  // Fetch all products
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

function CreateProduct() {
  const { mutate, isPending } = useCreateProduct();

  const handleCreate = async (formData) => {
    mutate(formData, {
      onSuccess: (data) => {
        console.log("Product created:", data);
      },
      onError: (error) => {
        console.error("Error:", error);
      },
    });
  };

  return <button onClick={() => handleCreate(data)}>Create</button>;
}
```

### Using Category Hooks

```tsx
import { useCategories, useCategory } from "@/services/api";

function Categories() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      {categories?.map((cat) => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

### Using Order Hooks

```tsx
import { useMyOrders, useCreateOrder } from "@/services/api";

function MyOrders() {
  const { data, isLoading } = useMyOrders();

  return (
    <div>
      {data?.orders.map((order) => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}

function Checkout() {
  const { mutate: createOrder, isPending } = useCreateOrder();

  const handleCheckout = (orderData) => {
    createOrder(orderData, {
      onSuccess: (order) => {
        console.log("Order created:", order);
      },
    });
  };

  return <button onClick={() => handleCheckout(data)}>Place Order</button>;
}
```

## API Endpoints

### Products

- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/id/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/bulk-delete` - Bulk delete products (admin)
- `GET /api/products/search?q=query` - Search products

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `GET /api/categories/id/:id` - Get category by ID
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders

- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (admin)
- `PATCH /api/orders/:id/cancel` - Cancel order
- `DELETE /api/orders/:id` - Delete order (admin)

## Authentication

The API client automatically includes the JWT token from localStorage:

```tsx
// Store token after login
localStorage.setItem("authToken", token);

// Token is automatically sent with every request
// Authorization: Bearer <token>

// On 401, token is cleared and user is redirected to login
```

## Query Caching

- Stale time: 5 minutes
- Cache time: 10 minutes
- Queries are automatically invalidated after mutations

## Error Handling

```tsx
import { useProducts } from "@/services/api";

function MyComponent() {
  const { data, error, isLoading, isError } = useProducts();

  if (isLoading) return <Skeleton.SkeletonCard count={3} />;
  if (isError) return <div>Error: {error.message}</div>;

  return <div>{/* render data */}</div>;
}
```

## Pagination

```tsx
import { useProducts } from "@/services/api";

function Products() {
  const { data } = useProducts({ page: 1, limit: 20 });

  return (
    <div>
      <div>{/* render products */}</div>
      <p>Total: {data?.total}</p>
    </div>
  );
}
```

## Search

```tsx
import { useSearchProducts } from "@/services/api";

function Search({ query }) {
  const { data, isLoading } = useSearchProducts(query);

  return <div>{/* render results */}</div>;
}
```

## Mutations

```tsx
import { useUpdateProduct, useDeleteProduct } from "@/services/api"

function ProductActions({ productId }) {
  const update = useUpdateProduct()
  const delete_ = useDeleteProduct()

  return (
    <div>
      <button onClick={() => update.mutate({ id: productId, data: {...} })}>
        {update.isPending ? "Saving..." : "Save"}
      </button>
      <button onClick={() => delete_.mutate(productId)}>
        {delete_.isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  )
}
```
