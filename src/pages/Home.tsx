import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import { ArrowRight, Sparkles } from "lucide-react";
import { apiClient } from "../services/api/client";
import { useSplash } from "../context/SplashContext";

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
  const navigate = useNavigate();
  const { splashComplete } = useSplash();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await apiClient.get<any>("/categories");
      const apiCategories = res.data?.data?.categories || [];

      // Transform API categories to match CategoryList component format
      const transformedCategories = apiCategories.map((cat: any) => ({
        id: cat._id,
        name: cat.name,
        icon: "🛋️", // You can add icon mapping if needed
        thumbnail: cat.image,
        slug: cat.slug,
      }));

      setCategories(transformedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await apiClient.get<any>("/products?limit=8");
      const apiProducts = (res as any).data?.data?.products || [];

      // Transform API products to match ProductGrid component format
      const transformedProducts = apiProducts.map((product: any) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        image:
          product.images && product.images.length > 0
            ? product.images.find((img: any) => img.isPrimary)?.url ||
              product.images[0]?.url
            : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
        rating: product.rating || 4.5,
        reviewCount: product.reviews || 0,
        inStock: product.stock > 0,
        images: product.images || [], // Include full images array for quick view
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection animationsReady={splashComplete} />

      {/* Category List Section */}
      <CategoryList
        categories={categories}
        isLoading={loadingCategories}
        animationsReady={splashComplete}
      />

      {/* Featured Products Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={splashComplete ? "visible" : "hidden"}
        className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-amber-50/50 to-orange-50/30"
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
          <motion.div
            variants={sectionHeaderVariants}
            className="mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500" />
              </motion.div>
              <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
                Curated Selection
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Featured Collection
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl">
                Discover handpicked furniture and decor pieces selected by our
                design experts to elevate your living space.
              </p>
            </div>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 w-16 sm:w-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-4 sm:mt-6 origin-left"
            />
          </motion.div>

          {/* Product Grid */}
          <motion.div variants={containerVariants}>
            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 text-sm sm:text-base">
                  Loading products...
                </div>
              </div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} columns={4} gap="lg" />
            ) : (
              <div className="text-center text-gray-500 py-12 text-sm sm:text-base">
                No products available
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={sectionHeaderVariants}
            className="mt-8 sm:mt-12 lg:mt-16 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="group relative px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold text-white overflow-hidden rounded-lg sm:rounded-xl transition-all"
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
                className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-75 blur transition-all -z-10"
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
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
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
        className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 overflow-hidden"
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
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
              Stay Updated with New Arrivals
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300">
              Subscribe to our newsletter and get exclusive offers, design tips,
              and early access to new collections.
            </p>

            <motion.form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-lg mx-auto mt-6 sm:mt-8"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-l-lg text-sm sm:text-base text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white overflow-hidden rounded-lg sm:rounded-r-lg whitespace-nowrap"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600" />
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg sm:rounded-r-lg opacity-0 group-hover:opacity-75 blur -z-10"
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
