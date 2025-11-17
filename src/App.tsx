import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load page components
const Home = React.lazy(() => import("./pages/Home"));
const Categories = React.lazy(() => import("./pages/Categories"));
const Product = React.lazy(() => import("./pages/Product"));
const Search = React.lazy(() => import("./pages/Search"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminPortal = React.lazy(() => import("./pages/AdminPortal"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
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
