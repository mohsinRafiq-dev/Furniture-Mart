import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiClient } from "../services/api/client";
import { SkeletonGrid } from "../components/ProductSkeleton";
import { WishlistButton } from "../components/WishlistButton";
import { OptimizedImage } from "../components/OptimizedImage";
import {
  Star,
  X,
  ZoomIn,
  ZoomOut,
  Eye,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; isPrimary: boolean; alt: string }>;
  rating: number;
  reviews: number;
  stock: number;
  discount?: number;
  createdAt?: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quickViewZoom, setQuickViewZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const productsPerPage = 12;

  // Detect mobile on mount and resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation variants for product cards - optimized for performance
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch first page with 12 products
        const response = await apiClient.get(
          `/products?limit=${productsPerPage}&page=1`
        );

        // Backend returns: { success, message, data: { products, pagination } }
        const productsData = (response.data as any)?.data?.products || [];
        const paginationData = (response.data as any)?.data?.pagination || {};

        setProducts(productsData);
        setTotalProducts(paginationData.totalCount || 0);
        setHasMoreProducts(paginationData.hasNextPage || false);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch next page of products
  const loadMoreProducts = async () => {
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await apiClient.get(
        `/products?limit=${productsPerPage}&page=${nextPage}`
      );

      const productsData = (response.data as any)?.data?.products || [];
      const paginationData = (response.data as any)?.data?.pagination || {};

      // Append new products to existing ones
      setProducts((prev) => [...prev, ...productsData]);
      setCurrentPage(nextPage);
      setHasMoreProducts(paginationData.hasNextPage || false);
    } catch (err: any) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100/60 via-white to-orange-100/60 overflow-hidden">
      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8"
      >
        {/* Premium Animated Background Decorations - Skip on Mobile */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top Right Large Gradient Orb - Hidden on Mobile */}
          {!isMobile && (
            <motion.div
              className="absolute -top-56 -right-56 w-96 h-96 bg-gradient-to-b from-amber-300/40 via-amber-200/30 to-transparent rounded-full opacity-50 blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Bottom Left Large Gradient Orb - Hidden on Mobile */}
          {!isMobile && (
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
          )}

          {/* Center Glow Effect - Subtle on Mobile */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-transparent rounded-full opacity-40 blur-3xl"
            animate={
              isMobile
                ? {}
                : {
                    scale: [1, 1.1, 1],
                  }
            }
            transition={
              isMobile
                ? {}
                : { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Premium Design */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-2 sm:mb-3 lg:mb-4 text-center space-y-1 sm:space-y-2"
          >
            {/* Premium Badge with Spinning Icon */}
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
                <Sparkles className="w-4 h-4 text-amber-600" />
              </motion.div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
                Explore
              </span>
            </motion.div>

            {/* Main Heading with Gradient Animation */}
            <motion.h1
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
                Products
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto px-2 sm:px-0"
            >
              Discover our complete collection of premium furniture pieces
            </motion.p>

            {/* Products Count */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm lg:text-base text-amber-600 font-semibold"
            >
              {products.length} {products.length === 1 ? "Product" : "Products"}{" "}
              Available
            </motion.p>

            {/* Accent Line Animation */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              viewport={{ once: true }}
              className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full origin-left mx-auto mt-4"
            />

            {/* Loading State - Show Skeleton Grid */}
            {loading && <SkeletonGrid count={12} />}
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="w-full pb-12 sm:pb-16 lg:pb-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="text-center py-12 sm:py-16 lg:py-24">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                ⚠️
              </div>
              <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mb-2 px-2 sm:px-0">
                {error}
              </h3>
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Display all loaded products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.1,
                      margin: "0px 0px -50px 0px",
                    }}
                    onMouseEnter={() => setHoveredProductId(product._id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    className="group"
                  >
                    <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col group hover:-translate-y-2">
                      {/* Image Container */}
                      <div className="relative w-full h-40 sm:h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                        {/* Wishlist Button - Outside overlay so it stays visible */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-40 pointer-events-auto">
                          <WishlistButton
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            image={product.images?.[0]?.url || ""}
                          />
                        </div>

                        {product.images && product.images.length > 0 ? (
                          <OptimizedImage
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              hoveredProductId === product._id
                                ? "scale-110"
                                : "scale-100"
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🛋️
                          </div>
                        )}

                        {/* Discount Badge */}
                        {product.discount && (
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                            <div className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                              -{product.discount}%
                            </div>
                          </div>
                        )}

                        {/* Stock Status Badge */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Modern Hover Overlay - Stacked Layout */}
                        {hoveredProductId === product._id &&
                          product.images &&
                          product.images.length > 0 &&
                          product.stock > 0 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end gap-3 p-4 backdrop-blur-sm z-30">
                              <button
                                onClick={() => {
                                  setQuickViewProduct(product);
                                  setQuickViewImageIndex(0);
                                  setQuickViewZoom(1);
                                  setShowQuickView(true);
                                  document.body.style.overflow = "hidden";
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                              >
                                <Eye className="w-5 h-5" />
                                Quick View
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/product/${product._id}`)
                                }
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                              >
                                <ShoppingCart className="w-5 h-5" />
                                View Details
                              </button>
                            </div>
                          )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between">
                        {/* Title */}
                        <div>
                          <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating */}
                        {product.rating && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 sm:w-4 h-3 sm:h-4 ${
                                      i < Math.floor(product.rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600">
                                {product.rating.toFixed(1)} ({product.reviews}{" "}
                                reviews)
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Price and Add to Cart - Modern Layout */}
                        <div className="mt-4 space-y-3">
                          {/* Price Section */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-bold text-amber-600">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Stock Status */}
                          <div>
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                product.stock > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            disabled={product.stock === 0}
                            className="w-full p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
                          >
                            <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      {/* Bottom Accent */}
                      <div className="h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-transparent" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `Load More Products (${products.length}/${totalProducts})`
                    )}
                  </motion.button>
                </div>
              )}
            </>
          ) : !loading && products.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <p className="text-base sm:text-lg lg:text-2xl text-gray-500 mb-4 px-2 sm:px-0">
                No products found
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Quick View Modal - Image Gallery Only */}
      {showQuickView && quickViewProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto pt-20"
          onClick={() => {
            setShowQuickView(false);
            document.body.style.overflow = "unset";
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                {quickViewProduct.name}
              </h2>
              <button
                onClick={() => {
                  setShowQuickView(false);
                  document.body.style.overflow = "unset";
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2 hover:rotate-90"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image with Zoom Controls */}
                  <div className="space-y-3">
                    <div className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
                      <img
                        key={quickViewImageIndex}
                        src={quickViewProduct.images[quickViewImageIndex].url}
                        alt={quickViewProduct.name}
                        className="w-full h-full object-cover"
                        style={{ transform: `scale(${quickViewZoom})` }}
                      />
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setQuickViewZoom(Math.max(1, quickViewZoom - 0.2))
                        }
                        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors hover:scale-110 active:scale-95"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-semibold text-gray-700 w-16 text-center">
                        {Math.round(quickViewZoom * 100)}%
                      </span>
                      <button
                        onClick={() =>
                          setQuickViewZoom(Math.min(3, quickViewZoom + 0.2))
                        }
                        className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors hover:scale-110 active:scale-95"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setQuickViewZoom(1)}
                        className="ml-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors hover:scale-105 active:scale-95"
                        title="Reset Zoom"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {quickViewProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {quickViewProduct.images.map(
                        (img: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => {
                              setQuickViewImageIndex(index);
                              setQuickViewZoom(1);
                            }}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
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
                          </button>
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
          </div>
        </div>
      )}
    </div>
  );
}
