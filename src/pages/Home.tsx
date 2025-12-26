import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import {
  ArrowRight,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Award,
  Truck,
} from "lucide-react";
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

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    content:
      "The quality of furniture from Furniture Mart is exceptional. Every piece I've purchased has been delivered on time and in perfect condition. Highly recommend!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Home Owner",
    content:
      "Amazing selection and great prices. The customer service team helped me find the perfect sofa for my living room. Will definitely shop here again!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Architect",
    content:
      "Best furniture store I've worked with. Their product range is diverse and the quality is consistently high. My clients love their purchases!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Business Owner",
    content:
      "Furnishing our office was seamless. Fast delivery, excellent build quality, and their team was very professional. Great investment!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { splashComplete } = useSplash();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
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
      const transformedProducts = apiProducts.map((product: any) => {
        // Get primary image or first image - optimized
        const primaryImage =
          product.images?.find((img: any) => img.isPrimary) ||
          product.images?.[0];

        return {
          id: product._id,
          name: product.name,
          price: product.price,
          image:
            primaryImage?.url ||
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
          rating: product.rating || 4.5,
          reviewCount: product.reviews || 0,
          inStock: product.stock > 0,
          images: [primaryImage].filter(Boolean), // Only primary image for quick view
        };
      });

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
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <CategoryList
          categories={categories}
          isLoading={loadingCategories}
          animationsReady={splashComplete}
        />
      </div>

      {/* Trust Section - Why Choose Us */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Free Shipping */}
            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-200/30 hover:border-amber-400/50 transition-all"
            >
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Free Shipping
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  On orders over $50
                </p>
              </div>
            </motion.div>

            {/* Quality Guarantee */}
            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-200/30 hover:border-amber-400/50 transition-all"
            >
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Quality Guarantee
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Premium materials guaranteed
                </p>
              </div>
            </motion.div>

            {/* Easy Returns */}
            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-200/30 hover:border-amber-400/50 transition-all"
            >
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                <Check className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Easy Returns
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  30-day return policy
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={splashComplete ? "visible" : "hidden"}
        className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
      >
        {/* Rich Background Decorations */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
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

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
      >
        {/* Background Orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-200/40 to-orange-200/20 rounded-full blur-3xl hidden sm:block"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            variants={sectionHeaderVariants}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-5 sm:w-6 h-5 sm:h-6 text-amber-500" />
              </motion.div>
              <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
                Customer Love
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their
              spaces with our furniture
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative">
            {/* Main Testimonial Card */}
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-amber-200/30 backdrop-blur-sm"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  )
                )}
              </div>

              {/* Testimonial Content */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-800 font-medium mb-6 sm:mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-300"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 sm:mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentTestimonial(
                    currentTestimonial === 0
                      ? testimonials.length - 1
                      : currentTestimonial - 1
                  )
                }
                className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 hover:shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    animate={{
                      scale: currentTestimonial === index ? 1.2 : 1,
                      backgroundColor:
                        currentTestimonial === index
                          ? "rgb(217, 119, 6)"
                          : "rgb(253, 224, 71)",
                    }}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-300 transition-all"
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentTestimonial(
                    currentTestimonial === testimonials.length - 1
                      ? 0
                      : currentTestimonial + 1
                  )
                }
                className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section - Premium Gradient */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-12 sm:py-16 lg:py-24 mb-20 sm:mb-28 lg:mb-40 px-3 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
      >
        {/* Animated Pattern Overlay - Enhanced */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(217,119,6,0.15) 25%, transparent 25%, transparent 75%, rgba(217,119,6,0.15) 75%, rgba(217,119,6,0.15))",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Gradient Orbs */}
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

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <motion.h3
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent"
            >
              Stay Updated with New Arrivals
            </motion.h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
              Subscribe to our newsletter and get exclusive offers, design tips,
              and early access to new collections.
            </p>

            <motion.form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 sm:gap-3 max-w-2xl mx-auto mt-8 sm:mt-10"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-lg text-sm sm:text-base text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-50 transition-all shadow-lg"
              />
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(217,119,6,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white overflow-hidden rounded-lg whitespace-nowrap shadow-xl hover:shadow-2xl transition-all"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 rounded-lg" />

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 blur-lg -z-10 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
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
