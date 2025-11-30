import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlistStore } from "../store/wishlistStore";
import { useToastStore } from "./Toast";

interface WishlistButtonProps {
  id: string;
  name: string;
  price: number;
  image: string;
  className?: string;
}

export const WishlistButton = ({
  id,
  name,
  price,
  image,
  className = "",
}: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { addToast } = useToastStore();
  const inWishlist = isInWishlist(id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
      addToast(`${name} removed from wishlist`, "info");
    } else {
      addToWishlist({ id, name, price, image, addedAt: Date.now() });
      addToast(`${name} added to wishlist!`, "success");
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all ${
        inWishlist
          ? "bg-red-500 text-white shadow-lg"
          : "bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
      } ${className}`}
    >
      <Heart
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill={inWishlist ? "currentColor" : "none"}
      />
    </motion.button>
  );
};
