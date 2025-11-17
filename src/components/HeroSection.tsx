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

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Truck className="w-5 h-5" />, label: "Free Shipping" },
    { icon: <Shield className="w-5 h-5" />, label: "Secure Payment" },
    { icon: <Zap className="w-5 h-5" />, label: "Fast Delivery" },
  ];

  return (
    <div className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
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

      {/* Animated Particles/Sparkles */}
      {[...Array(15)].map((_, i) => (
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
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
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
        animate="visible"
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        {/* Top Badge */}
        <motion.div variants={itemVariants} className="inline-block mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-amber-400">
              ✨ Special Offer - Up to 50% Off
            </span>
          </div>
        </motion.div>

        {/* Headline with Character Animation */}
        <motion.div variants={headlineVariants} className="mb-6">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-4 leading-tight">
            Transform Your
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Living Space
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline with Line-by-line animation */}
        <motion.div variants={itemVariants} className="mb-10 max-w-2xl mx-auto">
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light">
            Discover curated premium furniture and home decor that transforms
            your house into a sanctuary of style and comfort.
          </p>
        </motion.div>

        {/* CTA Buttons with Enhanced Styling */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          {/* Explore Collection Button */}
          <Link to="/categories">
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.92 }}
              className="group relative px-12 py-4 text-lg font-bold text-white overflow-hidden rounded-xl transition-all duration-300"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700"
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
                className="relative flex items-center gap-3 justify-center"
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
                >
                  🛋️
                </motion.span>
                <span>Explore Collection</span>
                <motion.div
                  variants={{
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.button>
          </Link>

          {/* Search Products Button */}
          <Link to="/search">
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.92 }}
              className="group relative px-12 py-4 text-lg font-bold text-white overflow-hidden rounded-xl border-2 border-white transition-all duration-300 backdrop-blur-md"
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
                className="relative flex items-center gap-3 justify-center"
                variants={{
                  hover: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                whileHover="hover"
              >
                <motion.div
                  className="w-5 h-5 flex items-center justify-center"
                  variants={{
                    hover: { rotate: -15, scale: 1.2 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
                <span>Search Products</span>
                <motion.div
                  variants={{
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>

              {/* Border Animation on Hover */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-amber-400 opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature Badges with Icons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center items-center mb-6"
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
                className="flex items-center gap-3 px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 rounded-full transition-all"
              >
                <motion.div className="text-amber-400 group-hover:text-amber-300">
                  {feature.icon}
                </motion.div>
                <span className="text-sm font-semibold text-white/90 group-hover:text-white">
                  {feature.label}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="flex gap-8 justify-center items-center text-white/70"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">50K+</div>
            <div className="text-sm">Happy Customers</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">10K+</div>
            <div className="text-sm">Products</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">4.9★</div>
            <div className="text-sm">Rating</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/1 transform -translate-x-1/2 hidden md:block z-10 "
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/60 font-semibold tracking-widest">
            SCROLL
          </span>
          <ChevronDown className="w-6 h-6 text-amber-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
