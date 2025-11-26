import { motion } from "framer-motion";
import { TrendingUp, Brain, Zap } from "lucide-react";

interface SearchStatsProps {
  query: string;
  resultCount: number;
  topFactors?: string[];
}

/**
 * Component to display search quality and matching information
 */
export default function SearchStats({
  query,
  resultCount,
  topFactors = [],
}: SearchStatsProps) {
  if (!query || resultCount === 0) return null;

  const factorLabels: Record<string, string> = {
    nameMatch: "Name Relevance",
    descriptionMatch: "Description Match",
    categoryMatch: "Category Match",
    categoryBoost: "Category Boost",
    popularityBoost: "Popularity",
    ratingBoost: "Rating Score",
    priceRelevance: "Price Match",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg"
    >
      <div className="flex items-start gap-4">
        {/* Left Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-1"
        >
          <Brain className="w-5 h-5 text-amber-600" />
        </motion.div>

        <div className="flex-1">
          {/* Matching Factors */}
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">
              Top Matching Factors:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {topFactors.length > 0 ? (
              topFactors.map((factor) => (
                <motion.span
                  key={factor}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="px-2 py-1 bg-white text-xs font-medium text-amber-700 border border-amber-300 rounded-full"
                >
                  {factorLabels[factor] || factor}
                </motion.span>
              ))
            ) : (
              <span className="text-xs text-gray-600">
                Results optimized for relevance
              </span>
            )}
          </div>

          {/* Results Optimization Note */}
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-700">
              <span className="font-semibold">{resultCount} results</span>{" "}
              ranked by relevance and popularity
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
