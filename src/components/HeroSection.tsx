import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Zap,
  Shield,
  Truck,
  ArrowRight,
  Search,
} from "lucide-react";

interface HeroSectionProps {
  animationsReady?: boolean;
}

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1579428018ba4-e8a0e346e773?w=1200&h=600&fit=crop",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const headlineVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

const floatingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
    },
  }),
};

const backgroundVariants = {
  enter: { opacity: 0, scale: 1.1 },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.8,
      ease: "easeIn",
    },
  },
};

const badgeVariants = {
  hover: {
    scale: 1.15,
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: {
    scale: 0.95,
  },
};

const HeroSection = ({ animationsReady = true }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const particleCount = isMobile ? 8 : 15;

  const features = [
    { icon: <Truck className="w-5 h-5" />, label: "Free Shipping" },
    { icon: <Shield className="w-5 h-5" />, label: "Secure Payment" },
    { icon: <Zap className="w-5 h-5" />, label: "Fast Delivery" },
  ];

  return (
    <div className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated Background Images - Always animate, independent of content */}
      <AnimatePresence mode="wait" key="bg-carousel">
        <motion.div
          key={`bg-${currentImageIndex}`}
          variants={backgroundVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={BACKGROUND_IMAGES[currentImageIndex]}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

      {/* Animated Particles/Sparkles - Hidden on Mobile & Respects Motion Preference */}
      {!prefersReducedMotion &&
        !isMobile &&
        [...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0, 1, 0],
              y: [0, -30, -60],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

      {/* Background Image Indicators */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {BACKGROUND_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all rounded-full ${
              index === currentImageIndex
                ? "bg-amber-500 w-8 h-2"
                : "bg-white/40 w-2 h-2 hover:bg-white/60"
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.85 }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={animationsReady ? "visible" : "hidden"}
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        {/* Top Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-block mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500/20 border border-amber-500/50 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-amber-400">
              ✨ Special Offer - Up to 50% Off
            </span>
          </div>
        </motion.div>

        {/* Headline with Character Animation */}
        <motion.div variants={headlineVariants} className="mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            Find Your Perfect
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 pb-[10px]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Furniture
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline with Line-by-line animation */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0"
        >
          <p className="text-xs sm:text-base lg:text-lg xl:text-2xl text-gray-200 leading-relaxed font-light">
            Browse through our categories and discover pieces that match your
            style
          </p>
        </motion.div>

        {/* CTA Buttons with Enhanced Styling */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-8 sm:mb-12"
        >
          {/* Start Shopping Button */}
          <Link to="/categories">
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.92 }}
              className="group relative px-6 sm:px-12 py-2.5 sm:py-4 text-sm sm:text-lg font-bold text-white overflow-hidden rounded-lg sm:rounded-xl transition-all duration-300 w-full sm:w-auto"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />

              {/* Glow Effect on Hover */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl opacity-0 group-hover:opacity-75 blur transition-all duration-300 -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.75 }}
              />

              {/* Button Content */}
              <motion.div
                className="relative flex items-center gap-2 sm:gap-3 justify-center"
                variants={{
                  hover: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                whileHover="hover"
              >
                <motion.span
                  variants={{
                    hover: { rotate: 15, scale: 1.2 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="hidden sm:inline"
                >
                  🛍️
                </motion.span>
                <span className="hidden sm:inline">Start Shopping</span>
                <span className="sm:hidden">Shop Now</span>
                <motion.div
                  variants={{
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.div>
              </motion.div>
            </motion.button>
          </Link>

          {/* Search Products Button */}
          <Link to="/search">
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.92 }}
              className="group relative px-6 sm:px-12 py-2.5 sm:py-4 text-sm sm:text-lg font-bold text-amber-600 overflow-hidden rounded-lg sm:rounded-xl border-2 border-amber-400 transition-all duration-300 backdrop-blur-md w-full sm:w-auto hover:bg-amber-400/10"
            >
              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/50 to-amber-400/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />

              {/* Background Hover State */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              {/* Button Content */}
              <motion.div
                className="relative flex items-center gap-2 sm:gap-3 justify-center"
                variants={{
                  hover: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                whileHover="hover"
              >
                <motion.div
                  className="w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center"
                  variants={{
                    hover: { rotate: -15, scale: 1.2 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Search className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.div>
                <span className="hidden sm:inline">Search Products</span>
                <span className="sm:hidden">Search</span>
                <motion.div
                  variants={{
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.div>
              </motion.div>

              {/* Border Animation on Hover */}
              <motion.div
                className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-amber-400 opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature Badges with Icons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2 sm:gap-4 justify-center items-center mb-4 sm:mb-6 px-2"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={floatingVariants}
              whileHover="hover"
              whileTap="tap"
              initial="hidden"
              animate="visible"
              className="group"
            >
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-3 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 rounded-full transition-all text-xs sm:text-sm"
              >
                <motion.div className="text-amber-400 group-hover:text-amber-300 w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                  {feature.icon}
                </motion.div>
                <span className="font-semibold text-white/90 group-hover:text-white">
                  {feature.label}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="flex gap-3 sm:gap-8 justify-center items-center text-white/70 px-2 flex-wrap"
        >
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-amber-400">
              50K+
            </div>
            <div className="text-xs sm:text-sm">Happy Customers</div>
          </div>
          <div className="w-px h-6 sm:h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-amber-400">
              10K+
            </div>
            <div className="text-xs sm:text-sm">Products</div>
          </div>
          <div className="w-px h-6 sm:h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-amber-400">
              4.9★
            </div>
            <div className="text-xs sm:text-sm">Rating</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator - Respects Motion Preference */}
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, 12, 0] }}
        transition={
          prefersReducedMotion
            ? {}
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex z-10"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={
            prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }
          }
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xs text-white/60 font-semibold tracking-widest">
            SCROLL
          </span>
          <ChevronDown className="w-5 h-5 text-amber-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
