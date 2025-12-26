import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api/client";
import { OptimizedImage } from "../components/OptimizedImage";
import { Loader, Sparkles } from "lucide-react";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/categories");
      // The API returns: { success: true, message: "...", data: { categories: [...] } }
      const apiCategories = response.data?.data?.categories || [];
      setCategories(Array.isArray(apiCategories) ? apiCategories : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //       delayChildren: 0.2,
  //     },
  //   },
  // };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60"
      >
        {/* Premium Animated Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top Right Large Gradient Orb */}
          <motion.div
            className="absolute -top-56 -right-56 w-96 h-96 bg-gradient-to-b from-amber-300/40 via-amber-200/30 to-transparent rounded-full opacity-50 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bottom Left Large Gradient Orb */}
          <motion.div
            className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-transparent rounded-full opacity-45 blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Center Glow Effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-transparent rounded-full opacity-40 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Dynamic Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(217,119,6,0.3) 1px, transparent 1px), linear-gradient(-45deg, rgba(217,119,6,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Radial Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(217,119,6,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,119,6,0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(217,119,6,0.15) 0%, transparent 50%)",
            }}
          />

          {/* Subtle Mesh Gradient */}
          <div
            className="absolute inset-0 bg-gradient-mesh opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(135deg, transparent 0%, rgba(217,119,6,0.05) 25%, transparent 50%),
                linear-gradient(225deg, transparent 0%, rgba(217,119,6,0.05) 25%, transparent 50%)
              `,
            }}
          />

          {/* Floating Accent Dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-40"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Top Border Accent Line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Bottom Border Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Premium Design */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12 lg:mb-16 text-center space-y-3 sm:space-y-4"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-full backdrop-blur-sm text-xs sm:text-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" />
              </motion.div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
                Explore
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
            >
              All{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Categories
              </motion.span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto px-2 sm:px-0"
            >
              Discover our complete range of curated furniture collections
              tailored to transform every room in your home
            </motion.p>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              viewport={{ once: true }}
              className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full origin-left mx-auto mt-4"
            />
          </motion.div>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-12 h-12 text-amber-600" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mt-4 text-lg"
              >
                Loading our amazing categories...
              </motion.p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-6 lg:px-8 w-full">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <motion.div
                    key={category._id || category.name}
                    variants={itemVariants}
                    className="group h-full"
                    onMouseEnter={() =>
                      setHoveredId(category._id || category.name)
                    }
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => navigate(`/categories/${category.slug}`)}
                  >
                    <motion.div
                      whileHover={{ y: -12, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="h-full bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col border border-amber-100/50"
                    >
                      {/* Image Container with Overlay */}
                      <div className="relative w-full h-40 sm:h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20 z-10" />

                        {category.image ? (
                          <motion.div
                            className="w-full h-full absolute inset-0"
                            animate={{
                              scale:
                                hoveredId === (category._id || category.name)
                                  ? 1.2
                                  : 1,
                              filter:
                                hoveredId === (category._id || category.name)
                                  ? "blur(4px)"
                                  : "blur(0px)",
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <OptimizedImage
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ) : (
                          <div className="text-4xl sm:text-5xl lg:text-6xl relative z-20">
                            🛋️
                          </div>
                        )}

                        {/* Blur Overlay on Hover */}
                        {hoveredId === (category._id || category.name) &&
                          category.image && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-30"
                            >
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-center px-2"
                              >
                                <p className="text-white text-sm sm:text-lg font-bold flex items-center gap-1 sm:gap-2 justify-center flex-wrap">
                                  Explore
                                  <motion.svg
                                    className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                    }}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </motion.svg>
                                </p>
                                <p className="text-amber-300 text-xs sm:text-sm font-semibold mt-1">
                                  Browse collection →
                                </p>
                              </motion.div>
                            </motion.div>
                          )}

                        {/* Top Left Accent Line */}
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="absolute top-0 left-0 h-1 w-1/3 bg-gradient-to-r from-amber-400 to-transparent origin-left z-20"
                        />
                      </div>

                      {/* Content Container */}
                      <div className="px-3 sm:px-6 py-4 sm:py-5 flex-1 flex flex-col bg-white">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          viewport={{ once: true }}
                        >
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                            {category.name}
                          </h3>
                        </motion.div>

                        {category.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        {/* Product Count Badge */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 8px 16px rgba(217, 119, 6, 0.2)",
                          }}
                          viewport={{ once: true }}
                          className="inline-flex items-center gap-2 mt-auto w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-lg border border-amber-200/50 cursor-pointer transition-all flex-wrap"
                        >
                          {/* Animated Count Number */}
                          <motion.span
                            className="text-amber-600 font-bold text-sm sm:text-base tabular-nums"
                            animate={{
                              scale: [1, 1.15, 1],
                              color: [
                                "rgb(217, 119, 6)",
                                "rgb(234, 88, 12)",
                                "rgb(217, 119, 6)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: 0.5,
                            }}
                          >
                            {category.productCount || 0}
                          </motion.span>
                          <span className="text-gray-700 text-xs sm:text-sm font-medium">
                            Products
                          </span>
                          {/* Animated Arrow */}
                          <motion.svg
                            className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600 ml-auto flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </motion.svg>
                        </motion.div>
                      </div>

                      {/* Bottom Gradient Accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-transparent" />
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full"
                >
                  <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-amber-50/50 rounded-2xl mx-2 sm:mx-0">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4"
                    >
                      📦
                    </motion.div>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-500 font-medium px-2 sm:px-0">
                      No categories available
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2 px-2 sm:px-0">
                      Check back soon for our amazing collection
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      {categories.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Animated Background Orbs */}
          <motion.div
            className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/40 to-orange-200/30 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
                  Explore More
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight"
            >
              Find Your Perfect
              <motion.span
                className="block bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Furniture
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 px-2 sm:px-0 max-w-2xl mx-auto font-medium"
            >
              Browse through our categories and discover pieces that match your
              style
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-2xl"
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative flex items-center gap-2 justify-center">
                  <span>Start Shopping</span>
                  <motion.div className="group-hover:translate-x-1 transition-transform">
                    →
                  </motion.div>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-10 py-3 sm:py-4 border-2 border-amber-600 text-amber-600 font-bold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-amber-600/10 transition-all"
              >
                Browse Products
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
