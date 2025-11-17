import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput, { MOCK_SUGGESTIONS } from "../components/SearchInput";
import ProductGrid, { Product } from "../components/ProductGrid";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category";
  icon?: string;
}

// Mock API fetch function - Replace with actual API calls
const fetchSearchResults = async (query: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock results based on query
  const allProducts: Product[] = [
    {
      id: "1",
      name: "Modern Leather Sofa",
      price: 899,
      originalPrice: 1299,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 324,
      inStock: true,
    },
    {
      id: "2",
      name: "Minimalist Dining Table",
      price: 599,
      originalPrice: 799,
      image:
        "https://images.unsplash.com/photo-1559707264-cd4628902d4a?w=500&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 156,
      inStock: true,
    },
    {
      id: "3",
      name: "Rustic Wooden Desk",
      price: 449,
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop",
      rating: 4.7,
      reviewCount: 89,
      inStock: true,
    },
    {
      id: "4",
      name: "Luxury Bed Frame",
      price: 1299,
      originalPrice: 1699,
      image:
        "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&h=400&fit=crop",
      rating: 4.9,
      reviewCount: 512,
      inStock: true,
    },
    {
      id: "5",
      name: "Contemporary Armchair",
      price: 549,
      image:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=400&fit=crop",
      rating: 4.5,
      reviewCount: 203,
      inStock: false,
    },
    {
      id: "6",
      name: "Industrial Bookshelf",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1572496750584-5020b9d1e18d?w=500&h=400&fit=crop",
      rating: 4.4,
      reviewCount: 134,
      inStock: true,
    },
    {
      id: "7",
      name: "Scandinavian Coffee Table",
      price: 349,
      originalPrice: 449,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
      rating: 4.7,
      reviewCount: 278,
      inStock: true,
    },
    {
      id: "8",
      name: "Premium Office Chair",
      price: 699,
      image:
        "https://images.unsplash.com/photo-1574180273156-78191ba9b88f?w=500&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 445,
      inStock: true,
    },
  ];

  if (!query.trim()) {
    return allProducts;
  }

  const lowerQuery = query.toLowerCase();
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.id.toLowerCase().includes(lowerQuery)
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // React Query for fetching search results
  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: debouncedQuery.length > 0, // Only fetch when there's a query
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSuggestionSelect = (suggestion: {
    type: string;
    text: string;
  }) => {
    setSearchQuery(suggestion.text);
  };

  const resultCount = results.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Furniture
          </h1>
          <p className="text-xl text-gray-600">
            Search through our extensive collection of quality furniture and
            home decor
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-12">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            suggestions={MOCK_SUGGESTIONS}
            isLoading={isLoading}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg text-gray-700">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin">⟳</span>
                    Searching...
                  </span>
                ) : isError ? (
                  <span className="text-red-600">Error loading results</span>
                ) : resultCount === 0 ? (
                  <span className="text-gray-600">
                    No products found matching "{searchQuery}"
                  </span>
                ) : (
                  <span>
                    Found{" "}
                    <span className="font-bold text-amber-600">
                      {resultCount}
                    </span>{" "}
                    product
                    {resultCount !== 1 ? "s" : ""} for "{searchQuery}"
                  </span>
                )}
              </p>
            </div>

            {/* Sort/Filter Options (Placeholder) */}
            {resultCount > 0 && (
              <div className="mt-4 sm:mt-0 flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:border-amber-500 cursor-pointer">
                  <option value="">Sort by</option>
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Results Grid */}
        <div>
          {searchQuery && isLoading ? (
            <ProductGrid products={[]} isLoading={true} columns={4} />
          ) : searchQuery && isError ? (
            <div className="text-center py-16">
              <p className="text-xl text-red-600 mb-4">
                Error loading search results
              </p>
              <p className="text-gray-600">{error?.message}</p>
            </div>
          ) : searchQuery && resultCount > 0 ? (
            <ProductGrid
              products={results}
              columns={4}
              onProductClick={(productId) => {
                console.log("Clicked product:", productId);
              }}
            />
          ) : searchQuery ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400 mb-4">🔍</p>
              <p className="text-xl text-gray-600 mb-2">No products found</p>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400 mb-4">🛋️</p>
              <p className="text-xl text-gray-600 mb-2">Start searching</p>
              <p className="text-gray-500">
                Type in the search box above to find furniture
              </p>
            </div>
          )}
        </div>

        {/* Featured Categories (When no search) */}
        {!searchQuery && !isLoading && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Living Room", "Bedroom", "Kitchen", "Office"].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => handleSearch(category)}
                    className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all font-medium text-gray-900"
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
