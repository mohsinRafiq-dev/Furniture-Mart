# Quick Reference: React Query & API Wrapper Functions

## Environment Setup

```env
# .env.local
VITE_API_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

## Most Common Patterns

### 1. Fetch All Products
```typescript
import { useGetProducts } from '@/services/api';

function ProductGrid() {
  const { data, isLoading, error } = useGetProducts(1, 12); // page 1, 12 items
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  
  return (
    <div className="grid">
      {data?.products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### 2. Get Single Product by Slug
```typescript
import { useGetProductBySlug } from '@/services/api';

function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading } = useGetProductBySlug(slug);
  
  if (isLoading) return <LoadingSpinner />;
  
  return <ProductDetail product={product} />;
}
```

### 3. Advanced Product Filtering
```typescript
import { useGetProductsFiltered, buildProductFilters } from '@/services/api';

function FilteredProducts() {
  const filters = buildProductFilters({
    search: 'sofa',
    category: 'sofas',
    priceRange: [200, 1000],
    minRating: 4,
    inStock: true,
    sortBy: 'price-asc',
  });
  
  const { data, isLoading } = useGetProductsFiltered(filters);
  
  return (
    <div>
      {data?.products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### 4. Get All Categories
```typescript
import { useGetCategories } from '@/services/api';

function CategoryMenu() {
  const { data: categories } = useGetCategories();
  
  return (
    <nav>
      {categories?.map(cat => (
        <a key={cat.id} href={`/category/${cat.slug}`}>
          {cat.name}
        </a>
      ))}
    </nav>
  );
}
```

### 5. Create Product (Admin)
```typescript
import { useCreateProductMutation } from '@/services/api';

function ProductForm() {
  const createProduct = useCreateProductMutation();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      await createProduct(formData);
      // Success! Products list will auto-refresh
      toast.success('Product created');
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 6. Update Product (Admin)
```typescript
import { useUpdateProductMutation } from '@/services/api';

function EditProductForm({ productId }: { productId: string }) {
  const updateProduct = useUpdateProductMutation();
  
  const handleSubmit = async (formData: any) => {
    try {
      await updateProduct(productId, formData);
      toast.success('Product updated');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 7. Delete Product (Admin)
```typescript
import { useDeleteProductMutation } from '@/services/api';

function ProductCard({ product }: { product: Product }) {
  const deleteProduct = useDeleteProductMutation();
  
  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };
  
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

### 8. Search Products
```typescript
import { useSearchProductsByQuery } from '@/services/api';

function SearchResults({ query }: { query: string }) {
  const { data, isLoading } = useSearchProductsByQuery(query, {
    page: 1,
    limit: 20,
  });
  
  return (
    <div>
      <p>Found {data?.total || 0} results</p>
      {data?.products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### 9. Get User's Orders
```typescript
import { useGetMyOrders } from '@/services/api';

function OrderHistory() {
  const { data, isLoading } = useGetMyOrders({ page: 1, limit: 10 });
  
  return (
    <div>
      {data?.orders.map(order => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### 10. Create Order
```typescript
import { useCreateOrderMutation } from '@/services/api';

function CheckoutForm() {
  const createOrder = useCreateOrderMutation();
  
  const handleCheckout = async (orderData: any) => {
    try {
      const newOrder = await createOrder(orderData);
      navigate(`/orders/${newOrder.id}`);
    } catch (error) {
      toast.error('Failed to create order');
    }
  };
  
  return <form onSubmit={handleCheckout}>...</form>;
}
```

### 11. Batch Operations (Multiple Queries)
```typescript
import { useGetCategoriesAndFeaturedProducts } from '@/services/api';

function HomePage() {
  const { categories, featuredProducts, isLoading } = 
    useGetCategoriesAndFeaturedProducts();
  
  return (
    <div>
      <section>
        {categories.data?.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </section>
      <section>
        {featuredProducts.data?.products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </div>
  );
}
```

## Filter Building Utility

```typescript
import { buildProductFilters } from '@/services/api';

// Build filter options programmatically
const filters = buildProductFilters({
  search: 'sofa',                    // Text search
  category: 'sofas',                 // Category filter
  priceRange: [200, 1000],          // Min and max price
  featured: true,                    // Only featured products
  minRating: 4,                      // Rating filter
  inStock: true,                     // Stock availability
  sortBy: 'price-asc',              // Sort: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'oldest' | 'popular'
  page: 1,                           // Pagination
  limit: 12,                         // Items per page
});
```

## Cache Invalidation

```typescript
import { queryKeys, queryClient } from '@/services/api';

// Invalidate all products
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

// Invalidate specific product
queryClient.invalidateQueries({ queryKey: queryKeys.products.detail('sofa-slug') });

// Invalidate categories
queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });

// Invalidate user's orders
queryClient.invalidateQueries({ queryKey: queryKeys.orders.my });
```

## API Configuration

All configuration is in `src/config/api.ts`:

```typescript
import { apiConfig } from '@/config/api';

// Access configuration
console.log(apiConfig.baseURL);              // 'http://localhost:5000/api'
console.log(apiConfig.pagination.defaultLimit); // 12
console.log(apiConfig.cache.staleTime);     // 5 minutes
console.log(apiConfig.filters.sortOptions); // Array of sort options
```

## Error Handling Pattern

```typescript
import { AxiosError } from 'axios';

async function handleMutation(mutationFn: any, data: any) {
  try {
    await mutationFn(data);
    toast.success('Success!');
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || 'Something went wrong';
    toast.error(message);
  }
}
```

## File Locations

- **Environment**: `frontend/.env.local`
- **API Client**: `frontend/src/services/api/client.ts`
- **API Wrappers**: `frontend/src/services/api/productApi.ts`
- **React Hooks**: `frontend/src/services/api/hooks.ts`
- **Query Service**: `frontend/src/services/api/queryService.ts` ← NEW
- **Config**: `frontend/src/config/api.ts` ← NEW
- **Exports**: `frontend/src/services/api/index.ts`
- **Documentation**: `frontend/API_QUERY_GUIDE.md` ← NEW

## Backend API Endpoints

```
POST   /api/auth/login              - Admin login
POST   /api/auth/refresh            - Refresh token
POST   /api/auth/logout             - Logout
GET    /api/auth/me                 - Get current user

GET    /api/products                - List products
GET    /api/products/search/advanced - Advanced search with filters
GET    /api/products/slug/:slug     - Get by slug (URL-friendly)
GET    /api/products/:id            - Get by ID
POST   /api/products                - Create product (admin)
PUT    /api/products/:id            - Update product (admin)
DELETE /api/products/:id            - Delete product (admin)

GET    /api/categories              - List categories
GET    /api/categories/slug/:slug   - Get by slug
GET    /api/categories/:id          - Get by ID
POST   /api/categories              - Create (admin)
PUT    /api/categories/:id          - Update (admin)
DELETE /api/categories/:id          - Delete (admin)

GET    /api/orders                  - List orders (admin)
GET    /api/orders/my               - My orders (customer)
POST   /api/orders                  - Create order
GET    /api/orders/:id              - Get order details
```

## Testing a Query

```typescript
// In any component
function TestComponent() {
  const { data, error, isLoading } = useGetProducts(1, 12);
  
  useEffect(() => {
    console.log('Data:', data);
    console.log('Loading:', isLoading);
    console.log('Error:', error);
  }, [data, isLoading, error]);
  
  return <div>Check console</div>;
}
```

## Next Steps

1. ✅ Environment variables configured
2. ✅ API wrapper functions created
3. ✅ React Query setup with sensible defaults
4. Next: Integrate wrapper functions in your components
5. Next: Test API calls and filtering
6. Next: Deploy with proper environment variables
