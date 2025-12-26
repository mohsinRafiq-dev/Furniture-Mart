import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import { ToastContainer } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SplashProvider, useSplash } from "./context/SplashContext";
import { useAuthStore } from "./store/authStore";
import { trackVisitorSession } from "./services/analytics";

// Lazy load page components
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Products = React.lazy(() => import("./pages/Products"));
const Categories = React.lazy(() => import("./pages/Categories"));
const CategoryDetail = React.lazy(() => import("./pages/CategoryDetail"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Product = React.lazy(() => import("./pages/Product"));
const Search = React.lazy(() => import("./pages/Search"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminPortal = React.lazy(() => import("./pages/AdminPortal"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

function AppContent() {
  const { initializeAuth } = useAuthStore();
  const { showSplash, completeSplash } = useSplash();

  // Initialize authentication on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Track visitor session on app load
  useEffect(() => {
    trackVisitorSession();
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={completeSplash} />}
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/categories/:categorySlug"
                element={<CategoryDetail />}
              />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/product-old/:slug" element={<Product />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />

              {/* Hidden Admin Portal Route - Requires JWT Auth */}
              <Route
                path="/admin/px9a-portal"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard Route - Requires JWT Auth */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </Router>
      <ToastContainer />
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SplashProvider>
        <AppContent />
      </SplashProvider>
    </ErrorBoundary>
  );
}
