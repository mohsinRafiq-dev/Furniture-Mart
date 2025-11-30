import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartDrawer from "../components/CartDrawer";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import {
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Home,
  Package,
  LayoutGrid,
  Search,
  Info,
  Heart,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onCartClick={() => setCartDrawerOpen(true)}
        cartItems={cartItemCount}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  cartItems: number;
  onCartClick: () => void;
}

function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  cartItems,
  onCartClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 shadow-xl border-b border-amber-100/30">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/20 via-white/10 to-orange-50/20 pointer-events-none" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 group">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="relative w-12 h-12 transform group-hover:scale-110 transition-transform duration-300">
                {/* Premium Ashraf Furnitures Logo */}
                <svg
                  viewBox="0 0 48 48"
                  className="w-full h-full drop-shadow-lg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="ashrafGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    <filter
                      id="ashrafShadow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.2"
                      />
                    </filter>
                  </defs>

                  {/* Elegant sofa shape */}
                  <g filter="url(#ashrafShadow)">
                    {/* Sofa back cushions */}
                    <rect
                      x="8"
                      y="10"
                      width="32"
                      height="12"
                      rx="4"
                      fill="url(#ashrafGradient)"
                      opacity="0.9"
                    />

                    {/* Sofa seat */}
                    <ellipse
                      cx="24"
                      cy="26"
                      rx="16"
                      ry="8"
                      fill="url(#ashrafGradient)"
                    />

                    {/* Left armrest */}
                    <rect
                      x="6"
                      y="20"
                      width="4"
                      height="12"
                      rx="2"
                      fill="url(#ashrafGradient)"
                      opacity="0.8"
                    />

                    {/* Right armrest */}
                    <rect
                      x="38"
                      y="20"
                      width="4"
                      height="12"
                      rx="2"
                      fill="url(#ashrafGradient)"
                      opacity="0.8"
                    />

                    {/* Decorative accent - stylized A */}
                    <text
                      x="24"
                      y="32"
                      fontSize="14"
                      fontWeight="bold"
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Arial, sans-serif"
                    >
                      A
                    </text>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col gap-0">
                <span className="text-xl font-bold bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 bg-clip-text text-transparent hover:from-amber-700 hover:via-amber-800 hover:to-orange-700 transition-all">
                  Ashraf Furnitures
                </span>
                <span className="text-xs text-amber-600/70 font-medium tracking-wide">
                  Premium Furniture
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Premium Style */}
          <div className="hidden md:flex items-center gap-0.5">
            {[
              { to: "/", label: "Home", icon: Home },
              { to: "/products", label: "Products", icon: Package },
              { to: "/categories", label: "Categories", icon: LayoutGrid },
              { to: "/search", label: "Search", icon: Search },
              { to: "/about", label: "About", icon: Info },
            ].map(({ to, label, icon: Icon }) => (
              <motion.div
                key={to}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={to}
                  className="group relative px-3.5 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
                  <span className="group-hover:text-amber-600 transition-colors">
                    {label}
                  </span>

                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-full" />

                  {/* Background glow on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-100/40 to-orange-100/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <Link to="/wishlist">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 text-gray-700 group transition-all duration-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <Heart className="w-6 h-6 text-amber-600 group-hover:text-red-500 transition-colors relative z-10" />
                <WishlistBadge />
              </motion.button>
            </Link>

            {/* Cart Button - Premium Style */}
            <motion.button
              onClick={onCartClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 text-gray-700 group transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <svg
                className="w-6 h-6 text-amber-600 group-hover:text-amber-700 transition-colors relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg"
                >
                  {cartItems}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2.5 text-gray-700 group transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <svg
                className="h-6 w-6 text-amber-600 group-hover:text-amber-700 transition-colors relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between h-16">
          {/* Mobile Logo with Text */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative w-11 h-11 transform">
                <svg
                  viewBox="0 0 48 48"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="ashrafGradientMobile"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    <filter
                      id="ashrafShadowMobile"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.2"
                      />
                    </filter>
                  </defs>
                  <g filter="url(#ashrafShadowMobile)">
                    <rect
                      x="8"
                      y="10"
                      width="32"
                      height="12"
                      rx="4"
                      fill="url(#ashrafGradientMobile)"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="24"
                      cy="26"
                      rx="16"
                      ry="8"
                      fill="url(#ashrafGradientMobile)"
                    />
                    <rect
                      x="6"
                      y="20"
                      width="4"
                      height="12"
                      rx="2"
                      fill="url(#ashrafGradientMobile)"
                      opacity="0.8"
                    />
                    <rect
                      x="38"
                      y="20"
                      width="4"
                      height="12"
                      rx="2"
                      fill="url(#ashrafGradientMobile)"
                      opacity="0.8"
                    />
                    <text
                      x="24"
                      y="32"
                      fontSize="14"
                      fontWeight="bold"
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Arial, sans-serif"
                    >
                      A
                    </text>
                  </g>
                </svg>
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent whitespace-nowrap">
                Ashraf Furnitures
              </span>
            </Link>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                  {cartItems}
                </span>
              )}
            </button>

            {/* Mobile Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <WishlistBadge />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden pb-4 border-t-2 border-amber-200 bg-gradient-to-b from-white via-amber-50 to-orange-50"
          >
            {/* Menu Items */}
            <div className="space-y-1 px-2">
              {/* Home Link */}
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                  <Home className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                </div>
                <span className="font-semibold text-sm">Home</span>
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Products Link */}
              <Link
                to="/products"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                  <Package className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                </div>
                <span className="font-semibold text-sm">Products</span>
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Categories Link */}
              <Link
                to="/categories"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                  <LayoutGrid className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                </div>
                <span className="font-semibold text-sm">Categories</span>
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Search Link */}
              <Link
                to="/search"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                  <Search className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                </div>
                <span className="font-semibold text-sm">Search</span>
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* About Link */}
              <Link
                to="/about"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                  <Info className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                </div>
                <span className="font-semibold text-sm">About</span>
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        {/* Animated floating elements */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* About */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              About Ashraf
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed max-w-xs font-medium">
              Your trusted destination for premium furniture and home décor. We
              craft spaces into sanctuaries of style and comfort.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/50 transition-shadow text-white"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/50 transition-shadow text-white"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/50 transition-shadow text-white"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-amber-700">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Cart
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-amber-700">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-amber-600 transition flex items-center gap-2 text-sm font-semibold group"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-125 transition-transform" />
                  FAQ
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-amber-700">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-700 hover:text-amber-600 transition group">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 group-hover:text-orange-600 transition-colors" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="font-medium">info@ashraff.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-700 hover:text-amber-600 transition group">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 group-hover:text-orange-600 transition-colors" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="font-medium">1-800-FURNITURE</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-700 group">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 group-hover:text-orange-600 transition-colors" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="font-medium">24/7 Service</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-gradient-to-r from-transparent via-amber-400 to-transparent py-8 origin-center"
        />

        {/* Bottom Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <motion.p
            variants={itemVariants}
            className="text-gray-700 text-sm font-semibold"
          >
            &copy; {currentYear}{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-bold">
              Ashraf Furnitures
            </span>
            . All rights reserved.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-8 justify-center"
          >
            <a
              href="#"
              className="text-gray-700 hover:text-amber-600 transition text-sm font-semibold"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-amber-600 transition text-sm font-semibold"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-amber-600 transition text-sm font-semibold"
            >
              Cookie Policy
            </a>
          </motion.div>
        </motion.div>

        {/* Brand Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-amber-300 text-center"
        >
          <p className="text-gray-700 text-sm italic font-medium bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
            Transforming houses into homes with premium furniture and
            exceptional service
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function WishlistBadge() {
  const { getWishlistCount } = useWishlistStore();
  const count = getWishlistCount();

  return (
    <>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg"
        >
          {count}
        </motion.span>
      )}
    </>
  );
}
