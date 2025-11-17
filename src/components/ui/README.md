# Reusable UI Components Guide

This directory contains a collection of reusable, composable UI components built with React and Tailwind CSS. All components are fully typed with TypeScript and support various variants and configurations.

## Components Overview

### Button

A versatile button component with multiple variants and sizes.

**File:** `Button.tsx`

**Props:**

- `variant` - `"primary"` | `"secondary"` | `"danger"` | `"outline"` (default: `"primary"`)
- `size` - `"sm"` | `"md"` | `"lg"` (default: `"md"`)
- `fullWidth` - `boolean` (default: `false`)
- `loading` - `boolean` (default: `false`)
- `disabled` - `boolean`
- All standard HTML button attributes

**Usage:**

```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md">Click me</Button>
<Button variant="danger" loading>Loading...</Button>
<Button variant="outline" fullWidth>Full width button</Button>
```

**Variants:**

- `primary` - Amber background, primary action
- `secondary` - Gray background, secondary action
- `danger` - Red background, destructive action
- `outline` - Bordered amber style, tertiary action

---

### Input

A flexible input component with labels, error handling, and helper text.

**File:** `Input.tsx`

**Props:**

- `label` - `string` (optional)
- `error` - `string` (optional, displays error message)
- `helperText` - `string` (optional, displays below input)
- `fullWidth` - `boolean` (default: `true`)
- All standard HTML input attributes

**Usage:**

```tsx
import { Input } from '@/components/ui'

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  helperText="We'll never share your email"
/>

<Input
  label="Password"
  type="password"
  error="Password is required"
/>
```

---

### Modal

A customizable modal dialog component with title, content, and footer sections.

**File:** `Modal.tsx`

**Props:**

- `isOpen` - `boolean` (controls visibility)
- `onClose` - `() => void` (callback when closing)
- `title` - `string` (optional)
- `children` - React content
- `footer` - React content (optional)
- `size` - `"sm"` | `"md"` | `"lg"` | `"xl"` (default: `"md"`)

**Usage:**

```tsx
import { Modal, Button } from "@/components/ui";
import { useState } from "react";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

---

### Card

A container component for organizing content with optional header, body, and footer sections.

**File:** `Card.tsx`

**Main Component Props:**

- `children` - React content
- `hoverable` - `boolean` (adds hover effect)
- `onClick` - `() => void` (optional click handler)
- `className` - `string` (additional classes)

**Sub-components:**

- `CardHeader` - Top section with border
- `CardBody` - Main content area
- `CardFooter` - Bottom section with gray background

**Usage:**

```tsx
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@/components/ui";

<Card hoverable>
  <CardHeader>
    <h3 className="font-bold">Product Name</h3>
  </CardHeader>
  <CardBody>
    <p>Product description goes here...</p>
  </CardBody>
  <CardFooter>
    <Button variant="primary" fullWidth>
      Add to Cart
    </Button>
  </CardFooter>
</Card>;
```

---

### Badge

A small label component for categorization and status indication.

**File:** `Badge.tsx`

**Props:**

- `variant` - `"primary"` | `"secondary"` | `"success"` | `"danger"` | `"warning"` | `"info"` (default: `"primary"`)
- `size` - `"sm"` | `"md"` | `"lg"` (default: `"md"`)
- `children` - React content
- `className` - `string`

**Usage:**

```tsx
import { Badge } from '@/components/ui'

<Badge variant="success">In Stock</Badge>
<Badge variant="danger" size="sm">Sale</Badge>
<Badge variant="info">New</Badge>
<Badge variant="warning">Limited</Badge>
```

**Variants:**

- `primary` - Amber background
- `secondary` - Gray background
- `success` - Green background
- `danger` - Red background
- `warning` - Yellow background
- `info` - Blue background

---

### Skeleton

Loading placeholder components that animate while content is loading.

**File:** `Skeleton.tsx`

**Skeleton Props:**

- `width` - `string` (default: `"100%"`)
- `height` - `string` (default: `"1rem"`)
- `count` - `number` (default: `1`) - renders multiple skeletons
- `circle` - `boolean` (default: `false`) - renders circular skeleton
- `className` - `string`

**SkeletonCard Props:**

- `count` - `number` (default: `1`) - renders multiple card skeletons

**Usage:**

```tsx
import { Skeleton, SkeletonCard } from '@/components/ui'

// Loading text lines
<Skeleton height="1.5rem" />
<Skeleton height="1rem" width="80%" />

// Multiple skeletons
<Skeleton height="1rem" count={3} />

// Circular skeleton (for avatars)
<Skeleton width="50px" height="50px" circle />

// Product card skeleton
<SkeletonCard count={3} />
```

---

## Import Guide

### Individual imports:

```tsx
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
```

### Barrel import (recommended):

```tsx
import {
  Button,
  Input,
  Modal,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Skeleton,
  SkeletonCard,
} from "@/components/ui";
```

---

## Design System

### Color Palette

- **Primary:** Amber (#b45309)
- **Secondary:** Gray (#6b7280)
- **Success:** Green (#10b981)
- **Danger:** Red (#ef4444)
- **Warning:** Yellow (#eab308)
- **Info:** Blue (#3b82f6)

### Spacing

- `sm`: 0.375rem
- `md`: 0.5rem
- `lg`: 0.75rem
- Standard padding: 1rem (16px)

### Border Radius

- Small: 0.375rem
- Medium: 0.5rem
- Large: 0.75rem

### Animations

- Transition duration: 200ms
- Loading spinner: infinite spin animation
- Skeleton: infinite pulse animation

---

## Best Practices

1. **Use forwardRef:** Button and Input components support ref forwarding for direct DOM access when needed.

2. **Combine Components:** Stack components together for complex layouts:

   ```tsx
   <Modal isOpen={isOpen} onClose={onClose} title="Create Product">
     <Input label="Name" placeholder="Product name" />
     <Input label="Price" type="number" />
     <Modal footer={
       <Button>Cancel</Button>
       <Button variant="primary">Create</Button>
     } />
   </Modal>
   ```

3. **Responsive Design:** All components are mobile-first and responsive by default using Tailwind's breakpoints.

4. **Accessibility:** Components follow semantic HTML and ARIA best practices.

5. **TypeScript:** All components are fully typed for better IDE support and type safety.

---

## Component Size Reference

| Size | Padding          | Font Size |
| ---- | ---------------- | --------- |
| sm   | 0.375rem 0.75rem | 0.875rem  |
| md   | 0.5rem 1rem      | 1rem      |
| lg   | 0.75rem 1.5rem   | 1.125rem  |

---

## Customization

All components accept a `className` prop for additional Tailwind classes:

```tsx
<Button className="shadow-lg rounded-full">Custom Button</Button>
<Badge className="font-extrabold uppercase">Custom Badge</Badge>
```

This allows for project-specific customizations while maintaining component structure and logic.
