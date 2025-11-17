import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { useCartStore } from "../store";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  onAddToCart?: (productId: string) => void;
  onClick?: () => void;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  inStock,
  onAddToCart,
  onClick,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      addToCart({
        productId: id,
        name,
        price,
        image,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        quantity: 1,
      });

      if (onAddToCart) {
        onAddToCart(id);
      }

      // Reset button state after animation
      setTimeout(() => setIsAdding(false), 500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsAdding(false);
    }
  };

  const renderRating = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`text-sm ${
                i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"
              }`}
            >
              ★
            </motion.span>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
    >
      {/* Image Container */}
      <motion.div
        className="relative w-full h-56 bg-gray-200 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Image */}
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.15 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="absolute top-3 left-3"
          >
            <Badge variant="danger" className="text-xs font-bold px-2 py-1">
              -{discount}%
            </Badge>
          </motion.div>
        )}

        {/* Stock Status Badge */}
        {!inStock && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-white font-semibold text-lg">
              Out of Stock
            </span>
          </motion.div>
        )}

        {/* Quick View Overlay */}
        {isHovered && inStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 flex items-end justify-center p-4 backdrop-blur-sm"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Quick View
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Content Container */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Product Name */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors">
            {name}
          </h3>
        </motion.div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-3"
        >
          {renderRating()}
        </motion.div>

        {/* Price Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex items-baseline gap-2"
        >
          <span className="text-xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </motion.div>

        {/* Add to Cart Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4"
        >
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            variant={inStock ? "primary" : "secondary"}
            className="w-full"
            size="sm"
          >
            {isAdding ? (
              <motion.span
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Adding...
              </motion.span>
            ) : inStock ? (
              "🛒 Add to Cart"
            ) : (
              "Out of Stock"
            )}
          </Button>
        </motion.div>
      </div>

      {/* In Stock Indicator */}
      {inStock && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-amber-400 to-amber-600 origin-left"
        />
      )}
    </motion.div>
  );
};

export default ProductCard;
