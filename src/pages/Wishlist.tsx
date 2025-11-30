import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlistStore } from "../store/wishlistStore";
import { Heart, ShoppingCart, ArrowLeft, X } from "lucide-react";
import { useToastStore } from "../components/Toast";
import { useCartStore } from "../store";

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  const { addItem: addToCart } = useCartStore((state) => state);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug || item.id,
      quantity: 1,
    });
    addToast(`${item.name} added to cart!`, "success");
  };

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromWishlist(id);
      addToast("Removed from wishlist", "info");
      setRemovingId(null);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-amber-600" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                clearWishlist();
                addToast("Wishlist cleared", "info");
              }}
              className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </motion.div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding your favorite furniture items to your wishlist
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Explore Products
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                exit="exit"
                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col ${
                  removingId === item.id ? "opacity-50" : ""
                }`}
              >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop";
                    }}
                  />
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {/* Heart Badge */}
                  <div className="absolute top-3 left-3 p-2 bg-red-500 text-white rounded-full">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto mb-4">
                    <div className="text-2xl font-bold text-amber-600">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Added{" "}
                      {new Date(item.addedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="flex-1 px-4 py-2 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
