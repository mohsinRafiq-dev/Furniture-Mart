import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartDrawer from "../components/CartDrawer";
import { useCartStore } from "../store/cartStore";
import { Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";

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
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-white to-amber-50 shadow-lg border-b-2 border-amber-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 group">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-12 h-12 transform group-hover:scale-110 transition-transform duration-300">
                {/* Premium Ashraf Furnitures Logo */}
                <svg
                  viewBox="0 0 48 48"
                  className="w-full h-full"
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
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent hidden sm:inline hover:from-amber-700 hover:to-amber-800 transition-all">
                Ashraf Furnitures
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium"
            >
              About
            </Link>
            <Link
              to="/categories"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium"
            >
              Categories
            </Link>
            <Link
              to="/search"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium"
            >
              Search
            </Link>
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCartClick}
              className="relative p-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform"
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
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                  {cartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-3 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all"
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
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/categories"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>
          </div>
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
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white mt-20 border-t-2 border-amber-500/30 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-b from-amber-600/30 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-t from-orange-600/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
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
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              About Ashraf
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Your trusted destination for premium furniture and home décor. We
              craft spaces into sanctuaries of style and comfort.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/50 transition-shadow"
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/50 transition-shadow"
              >
                <Instagram className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/50 transition-shadow"
              >
                <Twitter className="w-5 h-5 text-white" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Search
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  FAQ
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300 hover:text-amber-400 transition">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>info@ashraff.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-300 hover:text-amber-400 transition">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>1-800-FURNITURE</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p>24/7 Service</p>
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
          className="border-t border-gradient-to-r from-transparent via-amber-500/50 to-transparent py-8 origin-center"
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
            className="text-gray-400 text-sm font-medium"
          >
            &copy; {currentYear}{" "}
            <span className="text-amber-400">Ashraf Furnitures</span>. All
            rights reserved.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-8 justify-center"
          >
            <a
              href="#"
              className="text-gray-400 hover:text-amber-400 transition text-sm font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-amber-400 transition text-sm font-medium"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-amber-400 transition text-sm font-medium"
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
          className="mt-8 pt-8 border-t border-gray-700 text-center"
        >
          <p className="text-gray-400 text-sm italic">
            Transforming houses into homes with premium furniture and
            exceptional service
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
