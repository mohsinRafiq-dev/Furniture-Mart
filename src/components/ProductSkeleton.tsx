import { motion } from "framer-motion";

export const ProductSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md p-4 sm:p-5 flex flex-col h-full"
    >
      {/* Image Skeleton */}
      <div className="w-full h-40 sm:h-48 lg:h-56 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
          }}
          className="w-full h-full"
        />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-3 flex-1">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
          }}
          className="h-4 rounded w-3/4"
        />
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
          }}
          className="h-4 rounded w-1/2"
        />
      </div>

      {/* Price Skeleton */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          backgroundSize: "200% 100%",
          backgroundImage:
            "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
        }}
        className="h-6 rounded w-1/3 mt-3"
      />

      {/* Rating Skeleton */}
      <div className="flex gap-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              backgroundSize: "200% 100%",
              backgroundImage:
                "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
            }}
            className="w-4 h-4 rounded"
          />
        ))}
      </div>
    </motion.div>
  );
};

export const SkeletonGrid = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
