import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiClient } from "../services/api/client";
import { trackProductView } from "../services/analytics";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Loader,
  Heart,
  Share2,
  Check,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [productZoom, setProductZoom] = useState(1);

  useEffect(() => {
    fetchProduct();
    // Enable scrolling when component mounts
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<any>(`/products/${productId}`);
      const productData = res.data?.data?.product || res.data?.data;
      setProduct(productData);

      // Track product view
      if (productData && productId) {
        trackProductView(
          productId,
          productData.name || "Unknown Product",
          "view"
        );
      }

      // Set the primary image index if available
      if (productData?.images && productData.images.length > 0) {
        const primaryIdx = productData.images.findIndex(
          (img: any) => img.isPrimary === true
        );
        if (primaryIdx !== -1) {
          setCurrentImageIndex(primaryIdx);
        } else {
          setCurrentImageIndex(0);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-2xl text-gray-500 mb-6">Product not found</p>
        <motion.button
          onClick={() => navigate("/categories")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
        >
          Back to Categories
        </motion.button>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0 ? product.images : [];

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white overflow-auto">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 px-3 sm:px-6 lg:px-8 py-2 sm:py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-700 text-xs sm:text-base"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
          <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900 flex-1 text-center line-clamp-1">
            {product.name}
          </h1>
          <div className="w-8 sm:w-12"></div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            variants={itemVariants}
            className="space-y-2 sm:space-y-4"
          >
            {/* Main Image with Zoom */}
            <motion.div
              className="relative w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg"
              transition={{ duration: 0.3 }}
            >
              {currentImage ? (
                <motion.img
                  key={currentImageIndex}
                  src={currentImage.url}
                  alt={currentImage.alt || product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: productZoom }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🛋️
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    whileHover={{ scale: 1.1, x: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white text-amber-600 rounded-full shadow-md sm:shadow-lg transition-all z-10"
                  >
                    <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    whileHover={{ scale: 1.1, x: 3 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white text-amber-600 rounded-full shadow-md sm:shadow-lg transition-all z-10"
                  >
                    <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                  </motion.button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-2 sm:px-3 py-1 bg-black/70 text-white text-xs sm:text-sm rounded-full font-semibold"
                >
                  {currentImageIndex + 1} / {images.length}
                </motion.div>
              )}
            </motion.div>

            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto">
              <motion.button
                onClick={() => setProductZoom(Math.max(1, productZoom - 0.2))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors flex-shrink-0"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.button>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 w-12 sm:w-16 text-center flex-shrink-0">
                {Math.round(productZoom * 100)}%
              </span>
              <motion.button
                onClick={() => setProductZoom(Math.min(3, productZoom + 0.2))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 sm:p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex-shrink-0"
                title="Zoom In"
              >
                <ZoomIn className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.button>
              <motion.button
                onClick={() => setProductZoom(1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-1 sm:ml-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors flex-shrink-0"
                title="Reset Zoom"
              >
                Reset
              </motion.button>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3"
              >
                {images.map((img: any, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setProductZoom(1);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-amber-600 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-full object-cover"
                    />

                    {currentImageIndex === index && (
                      <motion.div
                        layoutId="activeImage"
                        className="absolute inset-0 border-2 border-amber-600 rounded-lg"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 sm:space-y-6"
          >
            {/* Category Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-semibold"
            >
              {product.category}
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            {/* Rating */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 sm:gap-4 flex-wrap"
            >
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              variants={itemVariants}
              className="flex items-baseline gap-2 sm:gap-4 py-3 sm:py-4 border-y border-gray-200"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-600">
                ${product.price.toFixed(2)}
              </p>
            </motion.div>

            {/* Stock Status */}
            <motion.div
              variants={itemVariants}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5" />
                  {product.stock} in stock
                </>
              ) : (
                <>
                  <span>Out of stock</span>
                </>
              )}
            </motion.div>

            {/* SKU */}
            <motion.div
              variants={itemVariants}
              className="p-3 sm:p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-xs sm:text-sm text-gray-600">
                SKU:{" "}
                <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">
                  {product.sku}
                </span>
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="space-y-2 sm:space-y-3"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Truck className="w-5 sm:w-6 h-5 sm:h-6 text-amber-600 flex-shrink-0" />
                <span className="text-xs sm:text-base text-gray-700 font-medium">
                  Free shipping on orders over $50
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <RefreshCw className="w-5 sm:w-6 h-5 sm:h-6 text-amber-600 flex-shrink-0" />
                <span className="text-xs sm:text-base text-gray-700 font-medium">
                  30-day returns
                </span>
              </div>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              variants={itemVariants}
              className="space-y-2 sm:space-y-3"
            >
              <label className="block text-xs sm:text-sm font-semibold text-gray-900">
                Quantity
              </label>
              <div className="flex items-center gap-2 sm:gap-4">
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold transition-colors text-sm sm:text-base"
                >
                  −
                </motion.button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-12 sm:w-16 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg text-center font-bold text-gray-900 focus:border-amber-600 focus:outline-none text-sm sm:text-base"
                />
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold transition-colors text-sm sm:text-base"
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 flex-col sm:flex-row"
            >
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  onClick={() => setLiked(!liked)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 border-2 border-gray-300 hover:border-amber-600 text-gray-900 hover:text-amber-600 rounded-lg transition-colors"
                >
                  <Heart
                    className={`w-5 sm:w-6 h-5 sm:h-6 ${
                      liked ? "fill-amber-600 text-amber-600" : ""
                    }`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 border-2 border-gray-300 hover:border-amber-600 text-gray-900 hover:text-amber-600 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 sm:w-6 h-5 sm:h-6" />
                </motion.button>
              </div>
              <motion.button
                onClick={() => {
                  // Track add to cart
                  trackProductView(
                    productId || "",
                    product.name,
                    "add_to_cart"
                  );
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={product.stock === 0}
                className="flex-1 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl text-xs sm:text-base"
              >
                <ShoppingCart className="w-4 sm:w-6 h-4 sm:h-6" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>({quantity})
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="pt-4 sm:pt-6 border-t border-gray-200 grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm text-gray-600"
            >
              <div>✓ 100% Authentic</div>
              <div>✓ Secure Checkout</div>
              <div>✓ Expert Support</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Related Products Section - Optional */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-10 lg:pt-12 border-t border-gray-200"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Similar Products
          </h2>
          <div className="text-center py-8 sm:py-12 text-gray-500 text-xs sm:text-base">
            <p>Similar products would appear here</p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
