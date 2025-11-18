import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../services/api/client";
import ProductCard from "../components/ProductCard";
import {
  ChevronDown,
  Filter,
  Star,
  X,
  ZoomIn,
  ZoomOut,
  Eye,
  ShoppingCart,
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

interface FilterOptions {
  priceRange: [number, number];
  sortBy: "newest" | "price-low" | "price-high" | "rating" | "popular";
  inStockOnly: boolean;
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
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.05,
    },
  }),
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quickViewZoom, setQuickViewZoom] = useState(1);

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    sortBy: "newest",
    inStockOnly: false,
  });

  const maxPrice = Math.max(
    5000,
    Math.max(...(products.map((p) => p.price) || [0]))
  );

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<any>("/products?limit=100");

      const allProducts = response.data?.data?.products || [];

      if (!allProducts || allProducts.length === 0) {
        setError("No products available at the moment.");
        setProducts([]);
        return;
      }

      const productsData = allProducts.map((p: any) => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        images: p.images || [],
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        stock: p.stock || 0,
        discount: p.discount || 0,
        createdAt: p.createdAt,
      }));

      setProducts(productsData);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Newest first
        });
    }

    setFilteredProducts(filtered);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
    setQuickViewImageIndex(0);
    setQuickViewZoom(1);
    document.body.style.overflow = "hidden";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 py-16"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Explore Our Collection
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-amber-50 max-w-2xl mx-auto"
          >
            Discover premium furniture pieces crafted with elegance and comfort
            in mind
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8 gap-4"
        >
          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            {filteredProducts.length < products.length && (
              <span className="ml-2 px-2 py-1 bg-amber-600 text-white text-xs rounded-full">
                {products.length - filteredProducts.length}
              </span>
            )}
          </motion.button>

          {/* Product Count */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-600 font-semibold hidden sm:block"
          >
            Showing{" "}
            <span className="text-amber-600">{filteredProducts.length}</span> of{" "}
            <span className="text-amber-600">{products.length}</span> products
          </motion.div>

          {/* Sort Dropdown */}
          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              <span className="hidden sm:inline">
                {sortOptions.find((s) => s.value === filters.sortBy)?.label}
              </span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showSortDropdown ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            {/* Sort Dropdown Menu */}
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
                >
                  {sortOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ backgroundColor: "#fef3c7" }}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: option.value as any,
                        }));
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 font-medium transition-colors ${
                        filters.sortBy === option.value
                          ? "bg-amber-100 text-amber-600"
                          : "text-gray-700 hover:text-amber-600"
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price Range */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-amber-600">
                        ${filters.priceRange[0]}
                      </span>
                      <span className="text-gray-400">-</span>
                      <span className="text-2xl font-bold text-amber-600">
                        ${filters.priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [
                            prev.priceRange[0],
                            Number(e.target.value),
                          ],
                        }))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="text-sm text-gray-500">
                      Max: ${maxPrice.toLocaleString()}
                    </div>
                  </div>
                </motion.div>

                {/* Stock Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-bold text-gray-900 mb-4">Availability</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <motion.input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          inStockOnly: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 accent-amber-600 cursor-pointer"
                    />
                    <span className="font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                      In Stock Only
                    </span>
                  </label>
                  <div className="mt-4 text-sm text-gray-500">
                    {products.filter((p) => p.stock > 0).length} products
                    available
                  </div>
                </motion.div>

                {/* Reset Filters */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFilters({
                        priceRange: [0, maxPrice],
                        sortBy: "newest",
                        inStockOnly: false,
                      });
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Reset Filters
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{error}</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchProducts}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={
                    product.images[0]?.url ||
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
                  }
                  rating={product.rating}
                  reviewCount={product.reviews}
                  inStock={product.stock > 0}
                  product={product}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or explore other categories
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFilters({
                  priceRange: [0, maxPrice],
                  sortBy: "newest",
                  inStockOnly: false,
                });
              }}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}

        {/* Quick View Modal */}
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
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Main Image with Zoom */}
                  <div className="mb-6 relative bg-gray-100 rounded-xl overflow-hidden h-96">
                    {quickViewProduct.images &&
                    quickViewProduct.images.length > 0 ? (
                      <>
                        <motion.img
                          key={quickViewImageIndex}
                          src={quickViewProduct.images[quickViewImageIndex].url}
                          alt={quickViewProduct.name}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          loading="lazy"
                          decoding="async"
                        />
                        <motion.div
                          className="absolute inset-0 bg-black/5"
                          animate={{ opacity: 1, scale: quickViewZoom }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Zoom Controls */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 rounded-lg p-2 backdrop-blur">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setQuickViewZoom(Math.max(1, quickViewZoom - 0.2))
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </motion.button>
                          <span className="text-sm font-semibold w-12 text-center">
                            {Math.round(quickViewZoom * 100)}%
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setQuickViewZoom(Math.min(3, quickViewZoom + 0.2))
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setQuickViewZoom(1)}
                            className="text-xs px-2 py-1 bg-amber-600 text-white rounded font-semibold"
                          >
                            Reset
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {quickViewProduct.images &&
                    quickViewProduct.images.length > 1 && (
                      <div className="mb-6 grid grid-cols-4 gap-2">
                        {quickViewProduct.images.map(
                          (img: any, index: number) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {
                                setQuickViewImageIndex(index);
                                setQuickViewZoom(1);
                              }}
                              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                quickViewImageIndex === index
                                  ? "border-amber-600 shadow-lg"
                                  : "border-gray-200 hover:border-amber-300"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={`${quickViewProduct.name} - ${index + 1}`}
                                className="w-full h-20 object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            </motion.button>
                          )
                        )}
                      </div>
                    )}

                  {/* Product Details */}
                  <div className="space-y-4 pb-4 border-t pt-4">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(quickViewProduct.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({quickViewProduct.reviews} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-amber-600">
                        ${quickViewProduct.price.toFixed(2)}
                      </span>
                      {quickViewProduct.originalPrice &&
                        quickViewProduct.originalPrice >
                          quickViewProduct.price && (
                          <span className="text-lg text-gray-500 line-through">
                            ${quickViewProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          quickViewProduct.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {quickViewProduct.stock > 0
                          ? `${quickViewProduct.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer - Buttons */}
                <div className="p-4 border-t border-gray-200 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-white border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 inline mr-2" />
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={quickViewProduct.stock === 0}
                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5 inline mr-2" />
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
