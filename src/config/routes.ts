/**
 * Router Configuration
 * 
 * This file defines all application routes with metadata for lazy loading,
 * access control, and breadcrumbs.
 */

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: 'Home',
    breadcrumb: 'Home',
  },
  {
    path: '/categories',
    name: 'Categories',
    component: 'Categories',
    breadcrumb: 'Categories',
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: 'Product',
    breadcrumb: 'Product',
  },
  {
    path: '/search',
    name: 'Search',
    component: 'Search',
    breadcrumb: 'Search Results',
  },
  {
    path: '/cart',
    name: 'Cart',
    component: 'Cart',
    breadcrumb: 'Shopping Cart',
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: 'Checkout',
    breadcrumb: 'Checkout',
  },
  {
    path: '/admin',
    name: 'Admin',
    component: 'Admin',
    breadcrumb: 'Admin Panel',
    requiresAuth: true,
    requiresAdmin: true,
  },
]

export const getRouteByPath = (path: string) => {
  return routes.find((route) => route.path === path)
}

export const getRouteByName = (name: string) => {
  return routes.find((route) => route.name === name)
}
