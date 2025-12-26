import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../services/api/client";
import { OptimizedImage } from "../components/OptimizedImage";
import {
  ArrowLeft,
  Eye,
  Star,
  Loader,
  X,
  ShoppingCart,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function CategoryDetail() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quickViewZoom, setQuickViewZoom] = useState(1);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      // Fetch all categories to find the one with matching slug
      const categoriesRes = await apiClient.get<any>("/categories");
      const categories = categoriesRes.data?.data?.categories || [];
      const selectedCategory = categories.find(
        (cat: any) => cat.slug === categorySlug
      );

      if (!selectedCategory) {
        navigate("/categories");
        return;
      }

      setCategory(selectedCategory);

      // Fetch products for this category using category filter for better performance
      const productsRes = await apiClient.get<any>(
        `/products?category=${encodeURIComponent(
          selectedCategory.name
        )}&limit=100`
      );
      const categoryProducts = productsRes.data?.data?.products || [];

      setProducts(categoryProducts);
    } catch (error) {
      console.error("Error fetching category details:", error);
      navigate("/categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-amber-600" />
        </motion.div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-lg">Category not found</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60"
      >
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/categories")}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </motion.button>

          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-gray-600 max-w-2xl">
                {category.description}
              </p>
            )}
            <p className="text-amber-600 font-semibold">
              {products.length} {products.length === 1 ? "Product" : "Products"}{" "}
              Available
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col group"
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                      {product.images && product.images.length > 0 ? (
                        <motion.div
                          className="w-full h-full"
                          animate={{
                            scale: hoveredProductId === product._id ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <OptimizedImage
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🛋️
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discountPercent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            -{product.discountPercent}%
                          </div>
                        </motion.div>
                      )}

                      {/* Stock Status Badge */}
                      {product.stock === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
                        >
                          <span className="text-white font-bold text-lg">
                            Out of Stock
                          </span>
                        </motion.div>
                      )}

                      {/* Modern Hover Overlay - Stacked Layout */}
                      {hoveredProductId === product._id &&
                        product.images &&
                        product.images.length > 0 &&
                        product.stock > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end gap-3 p-4 backdrop-blur-sm z-30"
                          >
                            <motion.button
                              onClick={() => {
                                setQuickViewProduct(product);
                                setQuickViewImageIndex(0);
                                setQuickViewZoom(1);
                                setShowQuickView(true);
                                // Disable scrolling on body
                                document.body.style.overflow = "hidden";
                              }}
                              initial={{ scale: 0.8, opacity: 0, y: 10 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                            >
                              <Eye className="w-5 h-5" />
                              Quick View
                            </motion.button>
                            <motion.button
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                              initial={{ scale: 0.8, opacity: 0, y: 10 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              View Details
                            </motion.button>
                          </motion.div>
                        )}

                      {/* Featured Badge */}
                      {product.featured && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold z-20"
                        >
                          Featured
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      {/* Title */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </motion.div>

                      {/* Rating */}
                      {product.rating && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          viewport={{ once: true }}
                          className="mt-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {product.rating.toFixed(1)} ({product.reviews}{" "}
                              reviews)
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Price and Add to Cart - Modern Layout */}
                      <div className="mt-4 space-y-3">
                        {/* Price Section */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-baseline gap-2"
                        >
                          <span className="text-2xl font-bold text-amber-600">
                            ${product.price.toFixed(2)}
                          </span>
                        </motion.div>

                        {/* Stock Status */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          viewport={{ once: true }}
                        >
                          <span
                            className={`text-sm font-semibold ${
                              product.stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </motion.div>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={product.stock === 0}
                          className="w-full p-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
                        >
                          <ShoppingCart className="w-5 h-5 inline mr-2" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-transparent" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-2xl text-gray-500 mb-4">
                No products available in this category yet
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/categories")}
                className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                Browse Other Categories
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick View Modal - Image Gallery Only */}
      <AnimatePresence>
        {showQuickView && quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto pt-20"
            onClick={() => {
              setShowQuickView(false);
              document.body.style.overflow = "unset";
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                  {quickViewProduct.name}
                </h2>
                <motion.button
                  onClick={() => {
                    setShowQuickView(false);
                    document.body.style.overflow = "unset";
                  }}
                  whileHover={{ rotate: 90 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Image Gallery */}
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {quickViewProduct.images &&
                quickViewProduct.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image with Zoom Controls */}
                    <div className="space-y-3">
                      <motion.div
                        className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
                        transition={{ duration: 0.3 }}
                      >
                        <motion.img
                          key={quickViewImageIndex}
                          src={quickViewProduct.images[quickViewImageIndex].url}
                          alt={quickViewProduct.name}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: quickViewZoom }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>

                      {/* Zoom Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          onClick={() =>
                            setQuickViewZoom(Math.max(1, quickViewZoom - 0.2))
                          }
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-5 h-5" />
                        </motion.button>
                        <span className="text-sm font-semibold text-gray-700 w-16 text-center">
                          {Math.round(quickViewZoom * 100)}%
                        </span>
                        <motion.button
                          onClick={() =>
                            setQuickViewZoom(Math.min(3, quickViewZoom + 0.2))
                          }
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => setQuickViewZoom(1)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                          title="Reset Zoom"
                        >
                          Reset
                        </motion.button>
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {quickViewProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {quickViewProduct.images.map(
                          (img: any, index: number) => (
                            <motion.button
                              key={index}
                              onClick={() => {
                                setQuickViewImageIndex(index);
                                setQuickViewZoom(1);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                quickViewImageIndex === index
                                  ? "border-amber-600 shadow-md"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={`${quickViewProduct.name} - ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </motion.button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-6xl">
                    🛋️
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
