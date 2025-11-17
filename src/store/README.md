# Zustand Store Documentation

This directory contains Zustand stores for state management with localStorage persistence.

## Stores

### 1. Cart Store (`cartStore.ts`)

Manages shopping cart state with full CRUD operations and localStorage sync.

**State:**

```typescript
{
  items: CartItem[]        // Array of cart items
  total: number            // Total price
  itemCount: number        // Total quantity of items
}
```

**Actions:**

```typescript
addItem(item); // Add or increment item in cart
removeItem(productId); // Remove item from cart
updateQuantity(productId, quantity); // Update item quantity
clearCart(); // Clear all items
getItem(productId); // Get specific item
getTotal(); // Get total price
getItemCount(); // Get total quantity
```

**Usage:**

```tsx
import { useCartStore } from "@/store";

function ProductCard() {
  const { addItem, removeItem, items } = useCartStore();

  return (
    <>
      <button
        onClick={() =>
          addItem({
            productId: "123",
            name: "Sofa",
            price: 299.99,
            image: "/sofa.jpg",
            slug: "modern-sofa",
            quantity: 1,
          })
        }
      >
        Add to Cart
      </button>

      <div>Items in cart: {items.length}</div>
    </>
  );
}

function CartSummary() {
  const { total, itemCount, clearCart } = useCartStore();

  return (
    <div>
      <p>Total Items: {itemCount}</p>
      <p>Total Price: ${total.toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

---

### 2. Auth Store (`authStore.ts`)

Manages user authentication state with token and role management.

**State:**

```typescript
{
  user: User | null; // Current user
  token: string | null; // Auth token
  isAuthenticated: boolean; // Auth status
}
```

**Actions:**

```typescript
setUser(user); // Set user info
setToken(token); // Set auth token
login(email, password); // Login user
logout(); // Logout user
isAdmin(); // Check if user is admin
```

**Usage:**

```tsx
import { useAuthStore } from "@/store";

function LoginForm() {
  const { login } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      console.error("Login failed");
    }
  };

  return <form onSubmit={() => handleLogin("user@email.com", "password")} />;
}

function UserProfile() {
  const { user, logout, isAdmin } = useAuthStore();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.name}</p>
      {isAdmin() && <p>Admin Dashboard</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### 3. UI Store (`uiStore.ts`)

Manages UI state for modals, menus, and notifications.

**State:**

```typescript
{
  mobileMenuOpen: boolean; // Mobile menu visibility
  searchOpen: boolean; // Search bar visibility
  sidebarOpen: boolean; // Sidebar visibility
  notifications: Array; // Toast notifications
}
```

**Actions:**

```typescript
toggleMobileMenu(); // Toggle mobile menu
setMobileMenuOpen(open); // Set mobile menu state
toggleSearch(); // Toggle search
setSearchOpen(open); // Set search state
toggleSidebar(); // Toggle sidebar
setSidebarOpen(open); // Set sidebar state
addNotification(msg, type, duration); // Add notification
removeNotification(id); // Remove notification
clearNotifications(); // Clear all notifications
```

**Usage:**

```tsx
import { useUIStore } from "@/store";

function MobileNav() {
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore();

  return (
    <button onClick={toggleMobileMenu}>
      {mobileMenuOpen ? "Close" : "Menu"}
    </button>
  );
}

function NotificationCenter() {
  const { addNotification, removeNotification, notifications } = useUIStore();

  return (
    <div>
      <button onClick={() => addNotification("Item added to cart!", "success")}>
        Add Notification
      </button>

      {notifications.map((notif) => (
        <div key={notif.id} className={`notification ${notif.type}`}>
          {notif.message}
          <button onClick={() => removeNotification(notif.id)}>Close</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Features

✅ **localStorage Persistence** - State persists across page refreshes  
✅ **TypeScript Support** - Full type safety  
✅ **Minimal Bundle** - Zustand is very lightweight  
✅ **Devtools Support** - Can integrate with Redux DevTools  
✅ **No Boilerplate** - Simple, intuitive API  
✅ **Middleware Support** - Built-in persist middleware

---

## Installation

The stores are ready to use. Just import them:

```bash
# Dependencies already installed
npm list zustand
```

---

## Best Practices

1. **Use hooks directly in components:**

   ```tsx
   const { items, addItem } = useCartStore();
   ```

2. **Avoid unnecessary re-renders:**

   ```tsx
   // Good - only subscribe to needed state
   const items = useCartStore((state) => state.items);

   // Less efficient - subscribes to all state
   const store = useCartStore();
   ```

3. **Organize by feature:**

   - Cart store → cart operations
   - Auth store → authentication
   - UI store → UI state

4. **localStorage key naming:**
   - Format: `feature-name-store`
   - Example: `furniture-cart-store`

---

## localStorage Keys

- `furniture-cart-store` - Cart items, total, itemCount
- `furniture-auth-store` - User, token, isAuthenticated
- `authToken` - Auth token (also stored separately)

---

## Advanced Usage

### Subscriptions

```tsx
import { useCartStore } from "@/store";

// Subscribe to cart changes
const unsubscribe = useCartStore.subscribe(
  (state) => state.total,
  (total) => console.log("Cart total changed:", total)
);

// Cleanup
unsubscribe();
```

### Direct State Access

```tsx
import { useCartStore } from "@/store";

// Get state without rendering component
const state = useCartStore.getState();
console.log(state.items);

// Update state without rendering
useCartStore.setState({ items: [] });
```

### Persisting Custom Data

To add a new field to cart store:

1. Add to CartItem interface
2. Update addItem action
3. localStorage persists automatically

---

## Migration Guide

If migrating from Context API:

**Before (Context):**

```tsx
<CartProvider>
  <App />
</CartProvider>
```

**After (Zustand):**

```tsx
// Just use the hook directly
const { items } = useCartStore();
```

Much simpler! No Provider needed.

---

## Debugging

Enable Zustand debugging:

```tsx
import { useCartStore } from "@/store";

// Log all state changes
useCartStore.subscribe(
  (state) => state,
  (state) => console.log("Cart state:", state)
);
```
