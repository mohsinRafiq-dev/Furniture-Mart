import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  icon: string;
  thumbnail: string;
  slug?: string;
}

interface CategoryListProps {
  categories?: Category[];
  isLoading?: boolean;
  animationsReady?: boolean;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Living Room",
    icon: "🛋️",
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    slug: "living-room",
  },
  {
    id: "2",
    name: "Bedroom",
    icon: "🛏️",
    thumbnail:
      "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=300&fit=crop",
    slug: "bedroom",
  },
  {
    id: "3",
    name: "Kitchen",
    icon: "🪑",
    thumbnail:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
    slug: "kitchen",
  },
  {
    id: "4",
    name: "Dining",
    icon: "🍽️",
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    slug: "dining",
  },
  {
    id: "5",
    name: "Office",
    icon: "💼",
    thumbnail:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop",
    slug: "office",
  },
  {
    id: "6",
    name: "Outdoor",
    icon: "🌳",
    thumbnail:
      "https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400&h=300&fit=crop",
    slug: "outdoor",
  },
  {
    id: "7",
    name: "Storage",
    icon: "🗄️",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    slug: "storage",
  },
  {
    id: "8",
    name: "Lighting",
    icon: "💡",
    thumbnail:
      "https://images.unsplash.com/photo-1565636192335-14c08cf17855?w=400&h=300&fit=crop",
    slug: "lighting",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  scroll: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const skeletonVariants = {
  loading: {
    opacity: [0.6, 0.9, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/categories/${
        category.slug || category.name.toLowerCase().replace(/\s+/g, "-")
      }`}
    >
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        transition={{
          duration: 0.6,
          delay: index * 0.08,
          ease: "easeOut",
        }}
        whileHover={{ y: -16, scale: 1.08 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex-shrink-0 w-56 h-72 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50/80 border border-amber-100/50 snap-center"
      >
        {/* Thumbnail Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-300 to-gray-200">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20" />

          <motion.img
            src={category.thumbnail}
            alt={category.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Animated Overlay on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-end justify-end p-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-right"
                >
                  <p className="text-white text-lg font-bold flex items-center gap-2 justify-end">
                    Explore
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </p>
                  <p className="text-amber-300 text-sm font-semibold mt-1">
                    Browse collection →
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Left Accent Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute top-0 left-0 h-1 w-1/3 bg-gradient-to-r from-amber-400 to-transparent origin-left"
          />
        </div>

        {/* Content Section */}
        <div className="px-5 py-5 h-24 flex flex-col justify-between">
          {/* Category Name */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
              {category.name}
            </h3>
          </motion.div>

          {/* Animated Bottom Border */}
          <motion.div
            className="flex gap-1 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileHover={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-amber-600 origin-left rounded-full"
            />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-1.5 h-1.5 bg-amber-500 rounded-full"
            />
          </motion.div>
        </div>

        {/* Bottom Gradient Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-transparent" />
      </motion.div>
    </Link>
  );
};

const CategorySkeleton = () => (
  <motion.div
    variants={itemVariants}
    className="flex-shrink-0 w-48 h-56 rounded-xl overflow-hidden bg-gray-200"
  >
    <motion.div
      variants={skeletonVariants}
      className="w-full h-40 bg-gray-300"
    />
    <div className="p-4 space-y-3">
      <motion.div
        variants={skeletonVariants}
        className="h-4 bg-gray-300 rounded"
      />
      <motion.div
        variants={skeletonVariants}
        className="h-3 bg-gray-300 rounded w-2/3"
      />
    </div>
  </motion.div>
);

const CategoryList = ({
  categories = DEFAULT_CATEGORIES,
  isLoading = false,
  animationsReady = true,
}: CategoryListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate={animationsReady ? "visible" : "hidden"}
      className="relative w-full py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 overflow-hidden"
    >
      {/* Premium Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Right Large Gradient Orb */}
        <motion.div
          className="absolute -top-56 -right-56 w-96 h-96 bg-gradient-to-b from-amber-300/40 via-amber-200/30 to-transparent rounded-full opacity-50 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom Left Large Gradient Orb */}
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

        {/* Center Glow Effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-transparent rounded-full opacity-40 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dynamic Animated Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(217,119,6,0.3) 1px, transparent 1px), linear-gradient(-45deg, rgba(217,119,6,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(217,119,6,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,119,6,0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(217,119,6,0.15) 0%, transparent 50%)",
          }}
        />

        {/* Subtle Mesh Gradient */}
        <div
          className="absolute inset-0 bg-gradient-mesh opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(135deg, transparent 0%, rgba(217,119,6,0.05) 25%, transparent 50%),
              linear-gradient(225deg, transparent 0%, rgba(217,119,6,0.05) 25%, transparent 50%)
            `,
          }}
        />

        {/* Floating Accent Dots - Hidden on Mobile */}
        {typeof window !== "undefined" &&
          window.innerWidth >= 640 &&
          [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-40"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

        {/* Top Border Accent Line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Bottom Border Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Premium Design */}
        <div className="flex items-center justify-between mb-12 sm:mb-16 flex-col sm:flex-row gap-6 sm:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-2 sm:space-y-4 flex-1 w-full sm:w-auto"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-full backdrop-blur-sm text-xs sm:text-sm"
            >
              <span className="text-amber-600 font-semibold uppercase tracking-widest">
                ✨ Browse
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
            >
              Shop by
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Category
              </motion.span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-xl"
            >
              Explore our diverse range of curated collections tailored to
              transform every room in your home
            </motion.p>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              viewport={{ once: true }}
              className="h-1 w-12 sm:w-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full origin-left mt-3 sm:mt-4"
            />
          </motion.div>

          {/* Scroll Buttons */}
          <div className="hidden md:flex gap-3">
            <motion.button
              whileHover={{
                scale: 1.15,
                boxShadow: "0 10px 30px rgba(217,119,6,0.3)",
              }}
              whileTap={{ scale: 0.85 }}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative p-3 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.15,
                boxShadow: "0 10px 30px rgba(217,119,6,0.3)",
              }}
              whileTap={{ scale: 0.85 }}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative p-3 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Horizontally Scrollable Container */}
        <motion.div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex gap-3 sm:gap-6 overflow-x-auto pb-2 sm:pb-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))
            : categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
        </motion.div>

        {/* Scroll Hint for Mobile */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
          className="md:hidden text-center text-sm text-gray-500 mt-6"
        >
          ← Scroll to explore more categories →
        </motion.p>
      </div>
    </motion.section>
  );
};

export default CategoryList;
