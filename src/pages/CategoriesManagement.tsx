import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Search, AlertCircle } from "lucide-react";
import CategoryForm, { Category } from "../components/admin/CategoryForm";

// Demo initial categories
const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Sofas & Couches",
    description: "Modern and classic sofas for every space",
    icon: "🛋️",
    color: "from-rose-500 to-pink-500",
    productCount: 24,
  },
  {
    id: "cat-2",
    name: "Beds & Mattresses",
    description: "Comfortable beds and premium mattresses",
    icon: "🛏️",
    color: "from-blue-500 to-cyan-500",
    productCount: 18,
  },
  {
    id: "cat-3",
    name: "Chairs & Recliners",
    description: "Ergonomic and stylish chairs",
    icon: "🪑",
    color: "from-green-500 to-emerald-500",
    productCount: 32,
  },
  {
    id: "cat-4",
    name: "Tables & Desks",
    description: "Functional tables and work desks",
    icon: "💼",
    color: "from-purple-500 to-violet-500",
    productCount: 15,
  },
  {
    id: "cat-5",
    name: "Storage Solutions",
    description: "Cabinets, shelves, and organization",
    icon: "🗄️",
    color: "from-indigo-500 to-blue-500",
    productCount: 28,
  },
  {
    id: "cat-6",
    name: "Lighting",
    description: "Lamps, chandeliers, and ambient lighting",
    icon: "💡",
    color: "from-yellow-500 to-orange-500",
    productCount: 22,
  },
];

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Simulate React Query mutation for adding/updating category
  const handleAddCategory = async (category: Category) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingCategory) {
        // Update existing category
        setCategories((prev) =>
          prev.map((cat) => (cat.id === category.id ? category : cat))
        );
        setSuccessMessage("Category updated successfully");
      } else {
        // Add new category
        setCategories((prev) => [...prev, category]);
        setSuccessMessage("Category added successfully");
      }

      setEditingCategory(null);
      setShowForm(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate React Query mutation for deleting category
  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setSuccessMessage("Category deleted successfully");
      setDeleteConfirm(null);

      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleOpenForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">
            Manage product categories ({categories.length} total)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenForm}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </motion.button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-green-400 text-sm">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search categories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/10"
              >
                {/* Category Header with Gradient */}
                <div
                  className={`p-6 bg-gradient-to-br ${category.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-5xl">{category.icon}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditCategory(category)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setDeleteConfirm({
                            id: category.id,
                            name: category.name,
                          })
                        }
                        className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  {/* Product Count */}
                  <div className="pt-2 border-t border-gray-700/30">
                    <p className="text-xs text-gray-500">
                      <span className="text-amber-400 font-semibold">
                        {category.productCount}
                      </span>{" "}
                      product{category.productCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Stats Bar */}
                  <div className="w-full bg-gray-700/30 rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (category.productCount / 50) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            {searchQuery
              ? "No categories found matching your search."
              : "No categories yet."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-amber-500 hover:text-amber-400 mt-2 font-semibold"
            >
              Clear search
            </button>
          )}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700/50 rounded-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Category?
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-amber-400">
                  {deleteConfirm.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteCategory(deleteConfirm.id)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white font-semibold transition-all disabled:opacity-50"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CategoryForm
            category={editingCategory || undefined}
            onSubmit={handleAddCategory}
            onClose={handleCloseForm}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesManagement;
