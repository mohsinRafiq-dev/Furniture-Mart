# React Query Configuration & API Service

Comprehensive guide for using the React Query setup with environment variables and wrapper functions.

## Environment Configuration

### Setup `.env.local`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

The API client will use `VITE_API_URL` if available, otherwise construct it from `VITE_API_BASE_URL`.

**For Production:**
```env
VITE_API_BASE_URL=https://api.furniture-mart.com
VITE_API_URL=https://api.furniture-mart.com/api
```

## Query Service Wrapper Functions

The `queryService.ts` file provides convenient wrapper functions for common operations.

### Product Queries

#### Get all products with pagination
```typescript
import { useGetProducts } from '@/services/api';

function ProductList() {
  const { data, isLoading, error } = useGetProducts(1, 12);
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### Get product by slug (URL-friendly)
```typescript
import { useGetProductBySlug } from '@/services/api';

function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading } = useGetProductBySlug(slug);
  
  return <div>{product?.name}</div>;
}
```

#### Get product by ID
```typescript
import { useGetProductById } from '@/services/api';

function ProductById({ id }: { id: string }) {
  const { data: product } = useGetProductById(id);
  return <div>{product?.name}</div>;
}
```

#### Advanced product filtering
```typescript
import { useGetProductsFiltered, buildProductFilters } from '@/services/api';

function ProductFiltering() {
  const filters = buildProductFilters({
    search: 'sofa',
    category: 'living-room',
    priceRange: [200, 1000],
    featured: true,
    minRating: 4,
    inStock: true,
    sortBy: 'price-asc',
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useGetProductsFiltered(filters);
  
  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Search products
```typescript
import { useSearchProductsByQuery } from '@/services/api';

function SearchResults({ query }: { query: string }) {
  const { data, isLoading } = useSearchProductsByQuery(query, {
    page: 1,
    limit: 20,
  });
  
  return <div>{data?.products.length} results found</div>;
}
```

### Category Queries

#### Get all categories
```typescript
import { useGetCategories } from '@/services/api';

function CategoryMenu() {
  const { data: categories, isLoading } = useGetCategories();
  
  return (
    <ul>
      {categories?.map(cat => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
}
```

#### Get category by slug
```typescript
import { useGetCategoryBySlug } from '@/services/api';

function CategoryPage({ slug }: { slug: string }) {
  const { data: category } = useGetCategoryBySlug(slug);
  return <h1>{category?.name}</h1>;
}
```

#### Get categories and featured products together
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
        {featuredProducts.data?.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
```

## Admin Mutations

### Product Management

#### Create a product
```typescript
import { useCreateProductMutation } from '@/services/api';

function CreateProductForm() {
  const createProduct = useCreateProductMutation();
  
  const handleSubmit = async (formData: any) => {
    try {
      await createProduct(formData);
      // Success! Products will auto-refetch
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### Update a product
```typescript
import { useUpdateProductMutation } from '@/services/api';

function EditProductForm({ productId }: { productId: string }) {
  const updateProduct = useUpdateProductMutation();
  
  const handleSubmit = async (formData: any) => {
    try {
      await updateProduct(productId, formData);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### Delete a product
```typescript
import { useDeleteProductMutation } from '@/services/api';

function ProductActions({ productId }: { productId: string }) {
  const deleteProduct = useDeleteProductMutation();
  
  const handleDelete = async () => {
    if (confirm('Delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };
  
  return <button onClick={handleDelete}>Delete</button>;
}
```

#### Bulk delete products
```typescript
import { useBulkDeleteProductsMutation } from '@/services/api';

function ProductList() {
  const bulkDelete = useBulkDeleteProductsMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const handleBulkDelete = async () => {
    try {
      await bulkDelete(selectedIds);
      setSelectedIds([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };
  
  return (
    <div>
      {/* checkboxes for selection */}
      <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
        Delete Selected ({selectedIds.length})
      </button>
    </div>
  );
}
```

### Category Management

#### Create a category
```typescript
import { useCreateCategoryMutation } from '@/services/api';

function CreateCategoryForm() {
  const createCategory = useCreateCategoryMutation();
  
  const handleSubmit = async (formData: any) => {
    try {
      await createCategory(formData);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### Update a category
```typescript
import { useUpdateCategoryMutation } from '@/services/api';

function EditCategoryForm({ categoryId }: { categoryId: string }) {
  const updateCategory = useUpdateCategoryMutation();
  
  const handleSubmit = async (formData: any) => {
    try {
      await updateCategory(categoryId, formData);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### Delete a category
```typescript
import { useDeleteCategoryMutation } from '@/services/api';

function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const deleteCategory = useDeleteCategoryMutation();
  
  const handleDelete = async () => {
    if (confirm('Delete this category?')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };
  
  return <button onClick={handleDelete}>Delete</button>;
}
```

## Order Operations

### Query Orders

#### Get current user's orders
```typescript
import { useGetMyOrders } from '@/services/api';

function MyOrdersPage() {
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

### Create Order

```typescript
import { useCreateOrderMutation } from '@/services/api';

function CheckoutForm() {
  const createOrder = useCreateOrderMutation();
  
  const handleCheckout = async (orderData: any) => {
    try {
      const newOrder = await createOrder(orderData);
      // Redirect to order confirmation
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };
  
  return <form onSubmit={handleCheckout}>{/* checkout fields */}</form>;
}
```

## Advanced Patterns

### Query Cache Keys

For custom cache invalidation:

```typescript
import { queryKeys, useQueryClient } from '@/services/api';

function MyComponent() {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    // Invalidate all products
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.products.all 
    });
    
    // Invalidate specific product
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.products.detail('sofa-slug') 
    });
    
    // Invalidate categories
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.categories.all 
    });
  };
  
  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

### Prefetching for Better UX

Prefetch data before navigation:

```typescript
import { prefetchProductBySlug, queryClient } from '@/services/api';

function ProductLink({ slug }: { slug: string }) {
  const handleMouseEnter = async () => {
    await prefetchProductBySlug(slug, queryClient);
  };
  
  return (
    <Link to={`/products/${slug}`} onMouseEnter={handleMouseEnter}>
      View Product
    </Link>
  );
}
```

## API Configuration

Edit `src/config/api.ts` to customize:

- Base URLs
- Timeout values
- Retry settings
- Pagination defaults
- Cache times
- Storage keys
- Filter options
- Feature flags

Example configuration:

```typescript
import { apiConfig } from '@/config/api';

// Use configuration
const pageSize = apiConfig.pagination.defaultLimit; // 12
const cacheTime = apiConfig.cache.products.staleTime; // 5 minutes
const sortOptions = apiConfig.filters.sortOptions;
```

## Error Handling

All mutations include automatic error handling:

```typescript
function ProductForm() {
  const createProduct = useCreateProductMutation();
  const [error, setError] = useState<string>('');
  
  const handleSubmit = async (data: any) => {
    try {
      setError('');
      await createProduct(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };
  
  return (
    <div>
      {error && <ErrorAlert message={error} />}
      {/* form */}
    </div>
  );
}
```

## Testing

Using React Query's testing utilities:

```typescript
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

test('useGetProducts fetches products', async () => {
  const queryClient = new QueryClient();
  
  const { result } = renderHook(
    () => useGetProducts(1, 12),
    { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )}
  );
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  
  expect(result.current.data?.products.length).toBeGreaterThan(0);
});
```

## Next Steps

1. Test the API client with `npm run dev`
2. Navigate to product pages to test slug-based queries
3. Use admin panel to test mutations
4. Monitor network requests in DevTools to verify API calls
5. Check browser DevTools → Application → Storage for auth tokens
