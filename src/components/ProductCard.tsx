import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { useCartStore } from "../store";
import { WishlistButton } from "./WishlistButton";
import { Eye, ShoppingCart } from "lucide-react";

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
  product?: any; // Full product object for quick view
  onQuickView?: (product: any) => void; // Callback for quick view
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
  product,
  onQuickView,
}: ProductCardProps) => {
  const navigate = useNavigate();
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
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col group hover:scale-[1.02] hover:-translate-y-1.5"
    >
      {/* Image Container */}
      <motion.div
        className="relative w-full h-64 bg-gray-200 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Image */}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop";
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <WishlistButton
          id={id}
          name={name}
          price={price}
          image={image}
          className="absolute top-3 left-3 z-20"
        />

        {/* Stock Status Badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Modern Hover Overlay - Stacked Layout */}
        {isHovered && inStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end gap-3 p-4 backdrop-blur-sm"
          >
            <motion.button
              onClick={() => onQuickView?.(product)}
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
              onClick={() => navigate(`/product/${id}`)}
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
      </motion.div>

      {/* Content Container */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Product Name */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
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
          >
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              variant={inStock ? "primary" : "secondary"}
              className="w-full py-2.5 rounded-xl font-semibold transition-all duration-200"
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
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </span>
              ) : (
                "Out of Stock"
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* In Stock Indicator */}
      {inStock && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 origin-left"
        />
      )}
    </div>
  );
};

export default ProductCard;
