# React Router Setup Documentation

## Overview

This project uses React Router v6 with lazy-loaded components for optimal code splitting and performance. All routes are centrally configured and managed.

## Route Structure

### Core Routes

| Route          | Component  | Purpose                             | Auth Required | Admin Required |
| -------------- | ---------- | ----------------------------------- | ------------- | -------------- |
| `/`            | Home       | Landing page with featured products | No            | No             |
| `/categories`  | Categories | Browse furniture categories         | No            | No             |
| `/product/:id` | Product    | Detailed product view               | No            | No             |
| `/search`      | Search     | Search results page                 | No            | No             |
| `/cart`        | Cart       | Shopping cart management            | No            | No             |
| `/checkout`    | Checkout   | Order checkout flow                 | No            | No             |
| `/admin`       | Admin      | Admin dashboard and controls        | Yes           | Yes            |

## Implementation Details

### Lazy Loading

All page components are lazy-loaded using React's `React.lazy()` and wrapped with `Suspense`:

```typescript
const Home = React.lazy(() => import("./pages/Home"));
const Categories = React.lazy(() => import("./pages/Categories"));
// ... etc
```

This ensures that each route's code is only loaded when needed, reducing the initial bundle size.

### Fallback Component

While lazy-loaded components are being loaded, a `LoadingSpinner` component is displayed:

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <Routes>{/* Route definitions */}</Routes>
</Suspense>
```

### Layout Wrapper

All routes are wrapped in a `Layout` component that provides:

- Navigation Header
- Footer
- Consistent styling across pages

```typescript
<Router>
  <Layout>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>{/* All routes */}</Routes>
    </Suspense>
  </Layout>
</Router>
```

### 404 Handling

A catch-all route displays a 404 page for undefined routes:

```typescript
<Route path="*" element={<NotFound />} />
```

## File Structure

```
src/
├── App.tsx                 # Main Router setup
├── config/
│   └── routes.ts          # Route configuration metadata
├── layouts/
│   └── Layout.tsx         # Header, Footer, Main Layout
├── components/
│   └── LoadingSpinner.tsx # Lazy loading fallback
└── pages/
    ├── Home.tsx
    ├── Categories.tsx
    ├── Product.tsx
    ├── Search.tsx
    ├── Cart.tsx
    ├── Checkout.tsx
    └── Admin.tsx
```

## Navigation

### Using Links

Use React Router's `Link` and `useNavigate` for client-side navigation:

```typescript
import { Link, useNavigate } from "react-router-dom";

// Using Link
<Link to="/categories">Categories</Link>;

// Using useNavigate hook
const navigate = useNavigate();
navigate("/product/123");
```

### Using Search Parameters

For pages like Search that use query parameters:

```typescript
import { useSearchParams } from "react-router-dom";

const [searchParams] = useSearchParams();
const query = searchParams.get("q");
```

### Using Path Parameters

For dynamic routes like Product details:

```typescript
import { useParams } from "react-router-dom";

const { id } = useParams();
```

## Route Configuration

Route metadata is defined in `src/config/routes.ts`:

```typescript
export const routes = [
  {
    path: "/",
    name: "Home",
    component: "Home",
    breadcrumb: "Home",
  },
  // ... more routes
];
```

This allows for:

- Centralized route definitions
- Breadcrumb generation
- Access control checks
- Dynamic navigation building

## Best Practices

### 1. Code Splitting

- Always lazy-load page components for better performance
- Use `Suspense` for loading states

### 2. Error Handling

- Implement error boundaries for route components
- Display meaningful 404 pages
- Handle route transitions gracefully

### 3. Navigation Patterns

- Use `Link` for internal navigation (preserves scroll position)
- Use `useNavigate` for programmatic navigation
- Provide breadcrumbs for complex navigation flows

### 4. Performance

- Lazy load route components
- Implement route-based code splitting
- Cache API responses when appropriate
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders

### 5. Accessibility

- Ensure proper heading hierarchy in page components
- Use semantic HTML elements
- Implement ARIA labels for navigation
- Focus management on route changes

## Adding New Routes

To add a new route:

1. Create a new page component in `src/pages/`
2. Add the route to `src/config/routes.ts`
3. Add lazy loading in `src/App.tsx`:
   ```typescript
   const NewPage = React.lazy(() => import("./pages/NewPage"));
   ```
4. Add the route definition:
   ```typescript
   <Route path="/new-route" element={<NewPage />} />
   ```
5. Update navigation components as needed

## Testing Routes

### Manual Testing

1. Run `npm run dev`
2. Navigate to each route
3. Verify lazy loading fallback appears briefly
4. Check console for errors

### Automated Testing

Use React Router's testing utilities:

```typescript
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

test("renders Home page", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/Welcome to Furniture Mart/i)).toBeInTheDocument();
});
```

## Troubleshooting

### Routes not rendering

- Verify route paths match exactly
- Check that components are exported as default
- Ensure Suspense wrapper is in place

### Lazy loading not working

- Confirm import paths are correct
- Check that components are code-split properly
- Verify webpack/Vite is configured for code splitting

### Navigation not working

- Use `useNavigate` hook instead of direct URL changes
- Ensure Router is at the root of the component tree
- Check browser console for routing errors
