import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  onProductClick?: (productId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const ProductSkeleton = () => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-lg overflow-hidden shadow-md"
  >
    <div className="w-full h-56 bg-gray-300 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
    </div>
  </motion.div>
);

const ProductGrid = ({
  products,
  isLoading = false,
  columns = 4,
  gap = "md",
  onProductClick,
}: ProductGridProps) => {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quickViewZoom, setQuickViewZoom] = useState(1);

  // Responsive grid classes mapping
  const gridColsClass = {
    2: "sm:grid-cols-2 lg:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const gapClass = {
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
    setQuickViewImageIndex(0);
    setQuickViewZoom(1);
    // Disable scrolling on body
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    // Re-enable scrolling on body
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={`grid grid-cols-1 ${gridColsClass[columns]} ${gapClass[gap]}`}
      >
        {isLoading
          ? Array.from({ length: columns }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  inStock={product.inStock}
                  onClick={() => onProductClick?.(product.id)}
                  product={product}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))}
      </motion.div>

      {/* Quick View Modal - Rendered at top level */}
      <AnimatePresence>
        {quickViewProduct && quickViewProduct.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto pt-20"
            onClick={() => closeQuickView()}
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
                  onClick={() => closeQuickView()}
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
    </>
  );
};

export default ProductGrid;
