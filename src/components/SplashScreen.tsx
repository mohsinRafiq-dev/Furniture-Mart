import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  offsetX: number;
  offsetY: number;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0);
  const [particles] = useState<Particle[]>(() =>
    [...Array(6)].map((_, i) => ({
      id: i,
      size: Math.random() * 250 + 40,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 1.5,
      offsetX: Math.random() * 80 - 40,
      offsetY: Math.random() * 80 - 40,
    }))
  );

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 300);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 2200);
    const completeTimer = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 will-change-transform">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-amber-500 to-orange-600 opacity-15"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              filter: "blur(50px)",
              willChange: "transform, opacity",
            }}
            animate={{
              x: [0, particle.offsetX],
              y: [0, particle.offsetY],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Animated logo container */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={
            step >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Concentric circles animation */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-3 border-amber-600 will-change-transform"
              animate={{
                rotate: [0, 360],
                opacity: [0.9, 0.4, 0.9],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                opacity: { duration: 4, ease: "easeInOut" },
              }}
            />

            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-orange-500 will-change-transform"
              animate={{
                rotate: [360, 0],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                opacity: { duration: 6, ease: "easeInOut", delay: 0.3 },
              }}
            />

            {/* Inner ring */}
            <motion.div
              className="absolute inset-4 rounded-full border border-amber-400 will-change-transform"
              animate={{
                rotate: [0, 360],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                opacity: { duration: 3, ease: "easeInOut", delay: 0.6 },
              }}
            />

            {/* Center logo element */}
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 rounded-full shadow-xl flex items-center justify-center will-change-transform"
              style={{ willChange: "box-shadow" }}
              animate={{
                boxShadow: [
                  "0 0 15px rgba(217,119,6,0.4)",
                  "0 0 40px rgba(217,119,6,0.9)",
                  "0 0 15px rgba(217,119,6,0.4)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-3xl font-black text-white drop-shadow-lg">
                AF
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Title animation */}
        {step >= 2 && (
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 bg-clip-text text-transparent"
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "0em", opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              ASHRAF
            </motion.h1>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-amber-700"
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "0em", opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              FURNITURES
            </motion.h2>

            {/* Animated line */}
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent max-w-xs mx-auto mt-3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Tagline */}
            <motion.p
              className="text-amber-700 text-base md:text-lg font-medium tracking-widest mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Premium Comfort
            </motion.p>
          </motion.div>
        )}

        {/* Quote that appears at the end */}
        {step >= 2 && (
          <motion.div
            className="absolute bottom-32 md:bottom-24 text-center max-w-sm px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-amber-900 text-sm md:text-base font-medium italic">
              Quality Furniture, Beautiful Living
            </p>
          </motion.div>
        )}

        {/* Floating dots indicator */}
        {step >= 3 && (
          <motion.div
            className="absolute bottom-8 md:bottom-16 flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 will-change-transform"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: i * 0.12,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
