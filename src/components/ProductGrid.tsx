import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

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

  return (
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
              />
            </motion.div>
          ))}
    </motion.div>
  );
};

export default ProductGrid;
