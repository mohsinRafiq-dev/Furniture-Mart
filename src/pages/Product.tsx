import { useState } from "react";
import { motion } from "framer-motion";
import ImageCarousel from "../components/ImageCarousel";
import VariantSelector, { ProductVariant } from "../components/VariantSelector";
import SpecsTable from "../components/SpecsTable";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useCartStore } from "../store";

// Mock product data - Replace with React Query fetch
const MOCK_PRODUCT = {
  id: "1",
  slug: "modern-leather-sofa",
  name: "Modern Leather Sofa",
  price: 899,
  originalPrice: 1299,
  rating: 4.8,
  reviewCount: 324,
  inStock: true,
  description:
    "Elevate your living space with our premium modern leather sofa. Crafted from genuine top-grain leather, this sophisticated piece combines comfort with contemporary design.",
  images: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1567909735382-4330f2e6fc4e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=800&fit=crop",
  ],
  variants: [
    {
      id: "color",
      name: "Color",
      value: "color",
      options: [
        { id: "black", label: "Black" },
        { id: "brown", label: "Brown" },
        { id: "gray", label: "Gray" },
        { id: "white", label: "White" },
      ],
    },
    {
      id: "size",
      name: "Size",
      value: "size",
      options: [
        { id: "small", label: '72"', priceModifier: 0 },
        { id: "large", label: '84"', priceModifier: 150 },
        { id: "xlarge", label: '96"', priceModifier: 300 },
      ],
    },
  ] as ProductVariant[],
  specs: [
    { name: "Material", value: "Top-grain leather" },
    { name: "Dimensions", value: '84" W x 40" D x 32" H' },
    { name: "Seating Capacity", value: "3-4 people" },
    { name: "Weight", value: "150 lbs" },
    { name: "Warranty", value: "5 years" },
    { name: "Legs", value: "Wooden with walnut finish" },
  ],
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Product() {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({
    color: "black",
    size: "large",
  });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const product = MOCK_PRODUCT; // Replace with React Query hook

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleVariantChange = (variantId: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: optionId,
    }));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      const variantString = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}:${value}`)
        .join(",");

      addToCart({
        productId: `${product.id}-${variantString}`,
        name: `${product.name} (${Object.values(selectedVariants).join(", ")})`,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
        quantity,
      });

      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        setIsAdding(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsAdding(false);
    }
  };

  const renderRating = () => {
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`text-lg ${
                i < Math.floor(product.rating)
                  ? "text-amber-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </motion.span>
          ))}
        </div>
        <span className="text-gray-600">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left: Image Carousel */}
          <motion.div variants={itemVariants}>
            <ImageCarousel images={product.images} altText={product.name} />
          </motion.div>

          {/* Right: Product Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-start"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                >
                  {product.name}
                </motion.h1>
                {discount > 0 && (
                  <Badge variant="danger" className="text-lg font-bold">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {renderRating()}
              </motion.div>
            </div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-8 pb-8 border-b border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium">
                {product.inStock ? "✓ In Stock" : "Out of Stock"}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 text-lg mb-8 leading-relaxed"
            >
              {product.description}
            </motion.p>

            {/* Variant Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-8 pb-8 border-b border-gray-200"
            >
              <VariantSelector
                variants={product.variants}
                selectedVariants={selectedVariants}
                onVariantChange={handleVariantChange}
              />
            </motion.div>

            {/* Quantity and Add to Cart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-900">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                  >
                    −
                  </motion.button>
                  <span className="px-6 py-2 font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.div
                animate={{
                  scale: addedSuccess ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  variant={product.inStock ? "primary" : "secondary"}
                  size="lg"
                  className="w-full text-lg font-semibold"
                >
                  {isAdding ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      Adding to Cart...
                    </motion.span>
                  ) : addedSuccess ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ✓ Added to Cart!
                    </motion.span>
                  ) : (
                    "🛒 Add to Cart"
                  )}
                </Button>
              </motion.div>

              {/* Wishlist Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg font-semibold"
              >
                ♡ Add to Wishlist
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="text-xl">🚚</span>
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="text-xl">🔒</span>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="text-xl">💯</span>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Specs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Specifications
          </h2>
          <SpecsTable specs={product.specs} />
        </motion.div>
      </motion.div>
    </div>
  );
}
