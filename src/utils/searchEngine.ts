/**
 * Advanced Search Engine Utility
 * Implements intelligent product matching with relevance scoring
 */

export interface SearchMatch {
  score: number;
  factors: {
    nameMatch: number;
    descriptionMatch: number;
    categoryMatch: number;
    categoryBoost: number;
    popularityBoost: number;
    ratingBoost: number;
    priceRelevance: number;
  };
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 * Used for typo tolerance and partial matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  if (aLower === bLower) return 0;
  if (aLower.length === 0) return bLower.length;
  if (bLower.length === 0) return aLower.length;

  const matrix: number[][] = Array(bLower.length + 1)
    .fill(null)
    .map(() => Array(aLower.length + 1).fill(0));

  for (let i = 0; i <= aLower.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= bLower.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= bLower.length; j++) {
    for (let i = 1; i <= aLower.length; i++) {
      const indicator = aLower[i - 1] === bLower[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[bLower.length][aLower.length];
}

/**
 * Calculate fuzzy match score (0-1)
 * Higher score = better match
 */
export function calculateFuzzyScore(query: string, text: string): number {
  const query_lower = query.toLowerCase().trim();
  const text_lower = text.toLowerCase().trim();

  // Exact match (highest priority)
  if (text_lower === query_lower) return 1;

  // Starts with match
  if (text_lower.startsWith(query_lower)) return 0.95;

  // Contains match
  if (text_lower.includes(query_lower)) return 0.85;

  // Word boundary match
  const words = text_lower.split(/\s+/);
  if (words.some((w) => w.startsWith(query_lower))) return 0.8;

  // Levenshtein-based fuzzy match
  const distance = levenshteinDistance(query_lower, text_lower);
  const maxLength = Math.max(query_lower.length, text_lower.length);
  const similarity = 1 - distance / maxLength;

  // Only consider if similarity > 60%
  return similarity > 0.6 ? similarity * 0.7 : 0;
}

/**
 * Calculate word overlap ratio
 * Useful for partial query matching
 */
export function calculateWordOverlap(query: string, text: string): number {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const textWords = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (queryWords.length === 0 || textWords.length === 0) return 0;

  const matches = queryWords.filter((qw) =>
    textWords.some((tw) => calculateFuzzyScore(qw, tw) > 0.8)
  ).length;

  return matches / queryWords.length;
}

/**
 * Calculate relevance score for a product
 * Combines multiple ranking factors
 */
export function calculateProductRelevance(
  query: string,
  product: {
    name: string;
    description?: string;
    category?: string;
    price?: number;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
    featured?: boolean;
  },
  minPrice?: number,
  maxPrice?: number
): SearchMatch {
  const queryLower = query.toLowerCase().trim();

  // Name matching (highest weight - 40%)
  const nameScore = calculateFuzzyScore(queryLower, product.name);
  const nameWordOverlap = calculateWordOverlap(queryLower, product.name);
  const nameMatch = Math.max(nameScore, nameWordOverlap * 0.9) * 40;

  // Description matching (20%)
  const descriptionScore = product.description
    ? calculateFuzzyScore(queryLower, product.description)
    : 0;
  const descriptionWordOverlap = product.description
    ? calculateWordOverlap(queryLower, product.description)
    : 0;
  const descriptionMatch =
    Math.max(descriptionScore * 0.8, descriptionWordOverlap * 0.9 * 0.8) * 20;

  // Category matching (15%)
  const categoryScore = product.category
    ? calculateFuzzyScore(queryLower, product.category)
    : 0;
  const categoryMatch = categoryScore * 15;

  // Category boost for category-focused searches
  const categoryBoost =
    product.category && queryLower.length > 0
      ? Math.min(10, queryLower.split(/\s+/).length)
      : 0;

  // Stock status boost
  const inStockBoost = product.inStock !== false ? 5 : 0;

  // Popularity boost (reviews + rating) - 10%
  const maxReviews = 500; // Normalization factor
  const reviewScore = Math.min((product.reviewCount || 0) / maxReviews, 1);
  const ratingScore = ((product.rating || 0) / 5) * 0.5; // Max 50% weight
  const popularityBoost = (reviewScore * 0.5 + ratingScore) * 10;

  // Featured product boost
  const featuredBoost = product.featured ? 8 : 0;

  // Price relevance scoring (if price range is specified)
  let priceRelevance = 0;
  if (minPrice !== undefined || maxPrice !== undefined) {
    const productPrice = product.price || 0;
    const inRange =
      (minPrice === undefined || productPrice >= minPrice) &&
      (maxPrice === undefined || productPrice <= maxPrice);
    priceRelevance = inRange ? 10 : -20; // Penalize out-of-range products
  }

  const totalScore =
    nameMatch +
    descriptionMatch +
    categoryMatch +
    categoryBoost +
    inStockBoost +
    popularityBoost +
    featuredBoost +
    priceRelevance;

  return {
    score: Math.max(0, totalScore),
    factors: {
      nameMatch: nameMatch / 40,
      descriptionMatch: descriptionMatch / 20,
      categoryMatch: categoryMatch / 15,
      categoryBoost: categoryBoost / 10,
      popularityBoost: popularityBoost / 10,
      ratingBoost: ratingScore,
      priceRelevance: priceRelevance / 10,
    },
  };
}

/**
 * Extract top keywords from query for better search
 * Useful for multi-word queries
 */
export function extractSearchKeywords(query: string): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "was",
  ]);

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

/**
 * Suggest corrections for misspelled queries
 */
export function suggestQueryCorrection(
  query: string,
  commonTerms: string[]
): string | null {
  const queryWords = query.toLowerCase().split(/\s+/);
  const corrections: string[] = [];
  let hasCorrection = false;

  for (const word of queryWords) {
    let bestMatch = word;
    let bestScore = 0.95; // Only suggest if confidence > 95%

    for (const term of commonTerms) {
      const score = calculateFuzzyScore(word, term);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = term;
        hasCorrection = true;
      }
    }

    corrections.push(bestMatch);
  }

  return hasCorrection ? corrections.join(" ") : null;
}

/**
 * Rank products based on relevance
 */
export function rankProducts(
  products: any[],
  query: string,
  minPrice?: number,
  maxPrice?: number
): { product: any; match: SearchMatch }[] {
  if (!query || query.trim().length === 0) {
    // If no query, sort by featured, rating, then review count
    return products
      .map((product) => ({
        product,
        match: calculateProductRelevance(query, product, minPrice, maxPrice),
      }))
      .sort((a, b) => {
        if (a.product.featured && !b.product.featured) return -1;
        if (!a.product.featured && b.product.featured) return 1;
        const ratingDiff =
          (b.product.rating || 0) - (a.product.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.product.reviewCount || 0) - (a.product.reviewCount || 0);
      });
  }

  return products
    .map((product) => ({
      product,
      match: calculateProductRelevance(query, product, minPrice, maxPrice),
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .filter((item) => item.match.score > 0);
}

/**
 * Generate search analytics
 */
export function analyzeSearchResults(
  results: { product: any; match: SearchMatch }[]
): {
  totalResults: number;
  averageScore: number;
  topFactors: string[];
  recommendedFilters: string[];
} {
  if (results.length === 0) {
    return {
      totalResults: 0,
      averageScore: 0,
      topFactors: [],
      recommendedFilters: [],
    };
  }

  const averageScore =
    results.reduce((sum, r) => sum + r.match.score, 0) / results.length;

  // Find most influential ranking factors
  const factorAverages = {
    nameMatch: 0,
    descriptionMatch: 0,
    categoryMatch: 0,
    categoryBoost: 0,
    popularityBoost: 0,
    ratingBoost: 0,
    priceRelevance: 0,
  };

  results.forEach((r) => {
    Object.keys(factorAverages).forEach((key) => {
      factorAverages[key as keyof typeof factorAverages] +=
        r.match.factors[key as keyof typeof factorAverages];
    });
  });

  const avgCount = results.length;
  Object.keys(factorAverages).forEach((key) => {
    factorAverages[key as keyof typeof factorAverages] /= avgCount;
  });

  const topFactors = Object.entries(factorAverages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key);

  return {
    totalResults: results.length,
    averageScore,
    topFactors,
    recommendedFilters: [
      ...new Set(results.map((r) => r.product.category).filter(Boolean)),
    ].slice(0, 5),
  };
}
