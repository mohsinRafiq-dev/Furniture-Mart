import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import { ArrowRight, Sparkles } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Modern Leather Sofa",
    price: 899,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 324,
    inStock: true,
  },
  {
    id: "2",
    name: "Minimalist Dining Table",
    price: 599,
    originalPrice: 799,
    image:
      "https://images.unsplash.com/photo-1559707264-cd4628902d4a?w=500&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
  },
  {
    id: "3",
    name: "Rustic Wooden Desk",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: "4",
    name: "Luxury Bed Frame",
    price: 1299,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 512,
    inStock: true,
  },
  {
    id: "5",
    name: "Contemporary Armchair",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 203,
    inStock: false,
  },
  {
    id: "6",
    name: "Industrial Bookshelf",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1572496750584-5020b9d1e18d?w=500&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 134,
    inStock: true,
  },
  {
    id: "7",
    name: "Scandinavian Coffee Table",
    price: 349,
    originalPrice: 449,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 278,
    inStock: true,
  },
  {
    id: "8",
    name: "Premium Office Chair",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1574180273156-78191ba9b88f?w=500&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 445,
    inStock: true,
  },
];

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Category List Section */}
      <CategoryList />

      {/* Featured Products Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-amber-50/50 to-orange-50/30"
      >
        {/* Rich Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top Right Accent */}
          <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-b from-amber-200/60 via-amber-100/40 to-transparent rounded-full opacity-50 blur-3xl" />

          {/* Bottom Left Accent */}
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-100/50 via-amber-100/30 to-transparent rounded-full opacity-45 blur-3xl" />

          {/* Center Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/30 via-orange-100/20 to-transparent rounded-full opacity-40 blur-3xl" />

          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ backgroundPosition: ["0 0", "50px 50px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(217,119,6,0.5) 25%, transparent 25%, transparent 75%, rgba(217,119,6,0.5) 75%, rgba(217,119,6,0.5)), linear-gradient(45deg, rgba(217,119,6,0.5) 25%, transparent 25%, transparent 75%, rgba(217,119,6,0.5) 75%, rgba(217,119,6,0.5))",
              backgroundSize: "50px 50px",
              backgroundPosition: "0 0",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Premium Badge */}
          <motion.div variants={sectionHeaderVariants} className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
              </motion.div>
              <span className="text-sm font-semibold text-amber-600 uppercase tracking-widest">
                Curated Selection
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Featured Collection
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                Discover handpicked furniture and decor pieces selected by our
                design experts to elevate your living space.
              </p>
            </div>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 w-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-6 origin-left"
            />
          </motion.div>

          {/* Product Grid */}
          <motion.div variants={containerVariants}>
            <ProductGrid products={FEATURED_PRODUCTS} columns={4} gap="lg" />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={sectionHeaderVariants}
            className="mt-16 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 text-lg font-bold text-white overflow-hidden rounded-xl transition-all"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl opacity-0 group-hover:opacity-75 blur transition-all -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.75 }}
              />

              {/* Content */}
              <motion.div
                className="relative flex items-center gap-2"
                variants={{
                  hover: { transition: { staggerChildren: 0.05 } },
                }}
                whileHover="hover"
              >
                <span>View All Products</span>
                <motion.div
                  variants={{
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(217,119,6,0.1) 25%, transparent 25%, transparent 75%, rgba(217,119,6,0.1) 75%, rgba(217,119,6,0.1))",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Stay Updated with New Arrivals
            </h3>
            <p className="text-lg text-gray-300">
              Subscribe to our newsletter and get exclusive offers, design tips,
              and early access to new collections.
            </p>

            <motion.form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-3 font-bold text-white overflow-hidden rounded-lg whitespace-nowrap"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600" />
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg opacity-0 group-hover:opacity-75 blur -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.75 }}
                />
                <span className="relative">Subscribe</span>
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
