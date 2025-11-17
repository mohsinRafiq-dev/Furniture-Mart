import { motion } from "framer-motion";

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  options: Array<{
    id: string;
    label: string;
    priceModifier?: number;
  }>;
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariants: Record<string, string>;
  onVariantChange: (variantId: string, optionId: string) => void;
}

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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const VariantSelector = ({
  variants,
  selectedVariants,
  onVariantChange,
}: VariantSelectorProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {variants.map((variant) => (
        <motion.div key={variant.id} variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {variant.name}
          </label>

          <div className="flex flex-wrap gap-3">
            {variant.options.map((option) => {
              const isSelected = selectedVariants[variant.id] === option.id;

              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVariantChange(variant.id, option.id)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-900 shadow-md"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {option.label}
                  {option.priceModifier ? (
                    <span className="text-xs ml-1 opacity-70">
                      {option.priceModifier > 0 ? "+" : ""}$
                      {option.priceModifier.toFixed(2)}
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VariantSelector;
