import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "../components/SearchInput";
import ProductGrid, { Product } from "../components/ProductGrid";
import SearchStats from "../components/SearchStats";
import { Filter, ChevronRight, Sparkles, X, TrendingUp } from "lucide-react";
import { apiClient } from "../services/api/client";
import { useDebounce } from "../hooks/useDebounce";
import { rankProducts, analyzeSearchResults } from "../utils/searchEngine";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category";
  icon?: string;
  image?: string;
}

// Fetch search results with advanced filtering and intelligent ranking
const fetchSearchResults = async (
  query: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string
): Promise<Product[]> => {
  try {
    const params: any = {
      limit: 100,
    };

    // Use category filter if provided (from clicking category card)
    if (category && category.trim()) {
      params.category = category;
    } else if (query && query.trim()) {
      // Use text search if provided
      params.search = query;
    } else {
      return [];
    }

    // Add price filters
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    // Add sorting
    if (sortBy) params.sort = sortBy;

    const response = await apiClient.get<any>("/products/search/advanced", {
      params,
    });

    const products = response.data?.data?.products || [];

    // Transform API products to match Product interface
    const transformedProducts: Product[] = Array.isArray(products)
      ? products.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image:
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
          rating: product.rating || 4.5,
          reviewCount: product.reviews?.length || 0,
          inStock: product.inStock !== false,
          featured: product.featured || false,
          category: product.category,
          description: product.description,
        }))
      : [];

    // Apply intelligent ranking with the advanced search engine
    // Only apply custom ranking if no specific sort is requested or if it's the default "newest"
    if (!sortBy || sortBy === "newest") {
      if (query && query.trim()) {
        // Use intelligent relevance ranking for text queries
        const rankedResults = rankProducts(
          transformedProducts,
          query,
          minPrice,
          maxPrice
        );
        return rankedResults.map((r) => r.product);
      }
    }

    return transformedProducts;
  } catch (error) {
    return [];
  }
};

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const response = await apiClient.get<any>("/categories");
    const categories = response.data?.data?.categories || [];
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch suggestions (categories + featured products)
const fetchSuggestions = async (): Promise<SearchSuggestion[]> => {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      apiClient.get<any>("/categories"),
      apiClient.get<any>("/products/search/advanced", {
        params: { limit: 20 }, // Get all products for filtering
      }),
    ]);

    const suggestions: SearchSuggestion[] = [];

    // Add ALL products as suggestions (let frontend filter)
    const products = productsRes.data?.data?.products || [];
    if (Array.isArray(products)) {
      products.forEach((prod: any) => {
        suggestions.push({
          id: `prod-${prod._id}`,
          text: prod.name,
          type: "product",
          image:
            prod.images?.[0] ||
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
        });
      });
    }

    // Then add all categories
    const categories = categoriesRes.data?.data?.categories || [];
    if (Array.isArray(categories)) {
      categories.forEach((cat: any) => {
        suggestions.push({
          id: `cat-${cat._id}`,
          text: cat.name,
          type: "category",
          image:
            cat.image ||
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
        });
      });
    }

    return suggestions;
  } catch (error) {
    return [];
  }
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [searchAnalytics, setSearchAnalytics] = useState<any>(null);
  const [liveResults, setLiveResults] = useState<any[]>([]);

  // Debounce search query using custom hook - 300ms for optimal UX
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch live results immediately as user types (without debounce)
  useEffect(() => {
    const fetchLiveResults = async () => {
      if (searchQuery.length > 0 && !selectedCategory) {
        try {
          const results = await fetchSearchResults(
            searchQuery,
            "",
            minPrice,
            maxPrice,
            sortBy
          );
          setLiveResults(results);
        } catch (error) {
          setLiveResults([]);
        }
      } else {
        setLiveResults([]);
      }
    };

    fetchLiveResults();
  }, [searchQuery, minPrice, maxPrice, sortBy]);

  // React Query for fetching search results (optimized queries with debounce)
  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "search",
      debouncedQuery,
      selectedCategory,
      minPrice,
      maxPrice,
      sortBy,
    ],
    queryFn: () =>
      fetchSearchResults(
        debouncedQuery,
        selectedCategory,
        minPrice,
        maxPrice,
        sortBy
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: debouncedQuery.length > 0 || selectedCategory.length > 0,
  });

  // React Query for fetching categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // React Query for fetching suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestions"],
    queryFn: fetchSuggestions,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Restore scroll position when component mounts and enable scrolling
  useEffect(() => {
    // Enable scrolling
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    // Scroll to top on page mount/navigation back
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Calculate search analytics when results change
  useEffect(() => {
    if (results.length > 0 && debouncedQuery) {
      const rankedResults = rankProducts(
        results,
        debouncedQuery,
        minPrice,
        maxPrice
      );
      const analytics = analyzeSearchResults(rankedResults);
      setSearchAnalytics(analytics);
    } else {
      setSearchAnalytics(null);
    }
  }, [results, debouncedQuery, minPrice, maxPrice]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(""); // Clear category filter when doing text search
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(""); // Clear text search
    setSelectedCategory(categoryName); // Set category filter
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuggestionSelect = (suggestion: {
    type: string;
    text: string;
  }) => {
    if (suggestion.type === "category") {
      setSearchQuery("");
      setSelectedCategory(suggestion.text);
    } else {
      setSearchQuery(suggestion.text);
      setSelectedCategory("");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");

    setSelectedCategory("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy("newest");
  };

  // Use liveResults for real-time display, fallback to optimized results
  const displayResults = liveResults.length > 0 ? liveResults : results;
  const resultCount = displayResults.length;
  const hasActiveFilters =
    searchQuery || selectedCategory || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Animated Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap"
          >
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
              Find Your Perfect Match
            </span>
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 flex-shrink-0" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2 sm:px-0"
          >
            Discover Your Ideal
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Furniture & Decor
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-4"
          >
            Explore our extensive collection of premium furniture and home decor
            pieces
          </motion.p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <SearchInput
            value={searchQuery || selectedCategory}
            onChange={(value) => {
              setSearchQuery(value);
              setSelectedCategory(""); // Clear category filter when user types
            }}
            onSearch={handleSearch}
            suggestions={suggestions}
            isLoading={isLoading}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </motion.div>

        {/* Advanced Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-amber-200 rounded-lg hover:border-amber-500 transition-all text-sm sm:text-base"
            >
              <Filter className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-600 flex-shrink-0" />
              <span className="font-semibold text-gray-700 hidden sm:inline">
                Filters
              </span>
              <span className="font-semibold text-gray-700 sm:hidden">
                Filter
              </span>
              {hasActiveFilters && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full"
                >
                  {
                    [selectedCategory, minPrice, maxPrice].filter(Boolean)
                      .length
                  }
                </motion.span>
              )}
            </button>

            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={clearFilters}
                className="flex items-center gap-1 sm:gap-2 text-amber-600 hover:text-amber-700 font-medium text-xs sm:text-sm"
              >
                <X className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Clear filters</span>
                <span className="sm:hidden">Clear</span>
              </motion.button>
            )}
          </div>

          {/* Filters Panel */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showFilters ? 1 : 0,
              height: showFilters ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-amber-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSearchQuery("");
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={minPrice ?? ""}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="0"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={maxPrice ?? ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="10000"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs sm:text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results Info - Animated */}
        {(searchQuery || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                {isLoading ? (
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full animate-pulse" />
                    <p className="text-xs sm:text-base lg:text-lg text-gray-700 font-medium">
                      Searching...
                    </p>
                  </motion.div>
                ) : isError ? (
                  <p className="text-red-600 font-medium text-xs sm:text-sm">
                    Error loading results
                  </p>
                ) : resultCount === 0 ? (
                  <p className="text-gray-600 text-xs sm:text-sm">
                    No products found
                    {selectedCategory && (
                      <>
                        {" "}
                        in{" "}
                        <span className="font-bold text-gray-900">
                          {selectedCategory}
                        </span>
                      </>
                    )}
                    {searchQuery && (
                      <>
                        {" "}
                        matching{" "}
                        <span className="font-bold text-gray-900">
                          "{searchQuery}"
                        </span>
                      </>
                    )}
                  </p>
                ) : (
                  <div>
                    <p className="text-gray-700">
                      Found{" "}
                      <span className="font-bold text-amber-600 text-lg">
                        {resultCount}
                      </span>{" "}
                      <span className="font-medium">
                        product{resultCount !== 1 ? "s" : ""}
                      </span>
                      {selectedCategory && (
                        <>
                          {" "}
                          in{" "}
                          <span className="font-bold">{selectedCategory}</span>
                        </>
                      )}
                      {searchQuery && (
                        <>
                          {" "}
                          matching{" "}
                          <span className="font-bold">"{searchQuery}"</span>
                        </>
                      )}
                    </p>
                    {/* Search Quality Indicator */}
                    {searchAnalytics && resultCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 flex items-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          Best matches ranked by{" "}
                          <span className="font-semibold">relevance</span>
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Grid - Animated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {(searchQuery || selectedCategory) && isLoading ? (
            <ProductGrid products={[]} isLoading={true} columns={4} />
          ) : (searchQuery || selectedCategory) && isError ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <p className="text-xl text-red-600 mb-4 font-medium">
                Error loading search results
              </p>
              <p className="text-gray-600">{error?.message}</p>
            </motion.div>
          ) : (searchQuery || selectedCategory) && resultCount > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search Quality Stats */}
              {debouncedQuery && searchAnalytics && (
                <SearchStats
                  query={debouncedQuery}
                  resultCount={resultCount}
                  topFactors={searchAnalytics.topFactors}
                />
              )}

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <ProductGrid
                  products={displayResults}
                  columns={4}
                  onProductClick={() => {}}
                />
              </motion.div>
            </motion.div>
          ) : searchQuery || selectedCategory ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🔍
              </motion.div>
              <p className="text-2xl text-gray-700 mb-2 font-semibold">
                No products found
              </p>
              <p className="text-gray-600 mb-8">
                Try adjusting your search terms or browse categories
              </p>

              {/* Search Suggestions Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Try searching for:
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.slice(0, 4).map((cat: any) => (
                    <motion.button
                      key={cat._id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-medium rounded-full hover:shadow-md transition-shadow"
                    >
                      {cat.name}
                    </motion.button>
                  ))}
                </div>

                {/* Helpful Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block"
                >
                  <p className="text-sm text-blue-700 font-medium">
                    💡 Tip: Try using specific keywords, brands, or furniture
                    types
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🛋️
              </motion.div>
              <p className="text-2xl text-gray-700 mb-2 font-semibold">
                Start Your Search
              </p>
              <p className="text-gray-600">
                Type in the search box above to find your perfect furniture
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Categories - Animated */}
        {!searchQuery && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-20 pt-16 border-t-2 border-amber-100"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mb-12"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Filter className="w-6 h-6 text-amber-500" />
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Browse by Category
              </h2>
            </motion.div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-amber-500"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category: any, index: number) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <motion.div
                      whileHover={{
                        y: -8,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      className="relative bg-white rounded-3xl overflow-hidden border border-amber-100/50 shadow-xl transition-all duration-300 h-full flex flex-col"
                    >
                      {/* Top Accent Line */}
                      <div className="h-1 w-1/3 bg-gradient-to-r from-amber-400 to-orange-400" />

                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                        {category.image ? (
                          <motion.img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🛋️
                          </div>
                        )}

                        {/* Blur Overlay - Appears on Hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                        >
                          <div className="text-center">
                            <p className="text-white font-semibold mb-3">
                              Explore
                            </p>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronRight className="w-6 h-6 text-white mx-auto" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <div className="px-6 py-5 flex-1 flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {category.name}
                        </h3>

                        {/* Product Count Badge */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="inline-flex items-center justify-center bg-gradient-to-r from-amber-100/80 to-orange-100/80 text-amber-700 font-semibold text-sm px-4 py-2 rounded-full w-fit"
                        >
                          <motion.span
                            key={category.productCount}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                          >
                            {category.productCount || 0}
                          </motion.span>
                          <span className="ml-1">items</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Call to Action Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-12"
            >
              <p className="text-gray-600 text-base">
                Can't find what you're looking for?{" "}
                <span className="font-semibold text-amber-600 cursor-pointer hover:text-amber-700 transition-colors">
                  Contact our team
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
