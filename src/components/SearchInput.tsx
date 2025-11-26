import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category";
  icon?: string;
  image?: string;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  isLoading?: boolean;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
}

const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: "1", text: "Modern Sofa", type: "product", icon: "🛋️" },
  { id: "2", text: "Dining Table", type: "product", icon: "🍽️" },
  { id: "3", text: "Office Chair", type: "product", icon: "💼" },
  { id: "4", text: "Bedroom Set", type: "product", icon: "🛏️" },
  { id: "5", text: "Living Room", type: "category", icon: "🏠" },
  { id: "6", text: "Kitchen Furniture", type: "category", icon: "🪑" },
];

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

const SearchInput = ({
  value,
  onChange,
  onSearch,
  suggestions,
  isLoading = false,
  onSuggestionSelect,
}: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions =
    value.length > 0
      ? suggestions.filter(
          (s) =>
            s.text.toLowerCase().includes(value.toLowerCase()) ||
            value.toLowerCase().includes(s.text.toLowerCase())
        )
      : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSuggestionSelect(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            // Auto-trigger search on text input (debounced by parent component)
            if (newValue.trim()) {
              onSearch(newValue);
            }
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search furniture, decor, and more..."
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white shadow-sm hover:shadow-md"
        />

        {/* Search Icon with Pulse */}
        <motion.div
          className="absolute left-4 top-5 text-gray-400 flex items-center justify-center pointer-events-none"
          animate={{
            scale: value ? 1.15 : 1,
            color: value ? "#d97706" : "#9ca3af",
          }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </motion.div>

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ scale: 1.1, color: "#dc2626" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="absolute right-4 top-5 text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Loading Spinner */}
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute right-4 top-5 text-amber-500"
          >
            <svg
              className="w-6 h-6"
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
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-amber-100 rounded-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto backdrop-blur-sm"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                variants={itemVariants}
                onClick={() => handleSelectSuggestion(suggestion)}
                whileHover={{
                  backgroundColor: "rgba(217, 119, 6, 0.05)",
                  x: 4,
                }}
                className={`w-full px-6 py-4 text-left flex items-center gap-4 transition-all ${
                  index === highlightedIndex
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500"
                    : ""
                } ${
                  index !== filteredSuggestions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                {suggestion.image ? (
                  <motion.img
                    src={suggestion.image}
                    alt={suggestion.text}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-amber-200"
                    animate={
                      index === highlightedIndex ? { scale: 1.1 } : { scale: 1 }
                    }
                  />
                ) : (
                  <motion.span
                    className="text-2xl flex-shrink-0"
                    animate={
                      index === highlightedIndex ? { scale: 1.2 } : { scale: 1 }
                    }
                  >
                    {suggestion.icon || "🔍"}
                  </motion.span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-base">
                    {suggestion.text}
                  </p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {suggestion.type === "category"
                      ? "📁 Category"
                      : "📦 Product"}
                  </p>
                </div>
                <motion.span
                  className="text-amber-500 text-lg flex-shrink-0 font-bold"
                  animate={index === highlightedIndex ? { x: 4 } : { x: 0 }}
                >
                  →
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { MOCK_SUGGESTIONS };
export default SearchInput;
