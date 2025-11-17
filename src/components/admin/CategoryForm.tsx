import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, AlertCircle, CheckCircle } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  productCount: number;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Category) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const ICON_OPTIONS = [
  "🛋️",
  "🛏️",
  "🪑",
  "🍽️",
  "💼",
  "🌳",
  "🗄️",
  "💡",
  "🪞",
  "📚",
  "🎨",
  "🏺",
  "🪑",
  "⏰",
  "🧸",
  "📦",
];

const COLOR_OPTIONS = [
  { name: "Rose", value: "from-rose-500 to-pink-500" },
  { name: "Blue", value: "from-blue-500 to-cyan-500" },
  { name: "Yellow", value: "from-yellow-500 to-orange-500" },
  { name: "Green", value: "from-green-500 to-emerald-500" },
  { name: "Purple", value: "from-purple-500 to-violet-500" },
  { name: "Amber", value: "from-amber-500 to-orange-500" },
  { name: "Indigo", value: "from-indigo-500 to-blue-500" },
  { name: "Slate", value: "from-slate-500 to-gray-600" },
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Category>(
    category || {
      id: Date.now().toString(),
      name: "",
      description: "",
      icon: "🛋️",
      color: "from-amber-500 to-orange-500",
      productCount: 0,
    }
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData((prev) => ({
      ...prev,
      icon,
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("Category name is required");
        return;
      }

      if (formData.name.length < 2) {
        setError("Category name must be at least 2 characters");
        return;
      }

      if (formData.name.length > 50) {
        setError("Category name must be less than 50 characters");
        return;
      }

      if (formData.description.length > 200) {
        setError("Description must be less than 200 characters");
        return;
      }

      await onSubmit(formData);
      setSuccess("Category saved successfully!");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save category. Please try again."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Category Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              maxLength={50}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              placeholder="e.g., Modern Sofas"
            />
            <p className="text-xs text-gray-500">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              maxLength={200}
              rows={3}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 resize-none"
              placeholder="Describe this category..."
            />
            <p className="text-xs text-gray-500">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">
              Category Icon
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {ICON_OPTIONS.map((icon) => (
                <motion.button
                  key={icon}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleIconSelect(icon)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg text-2xl transition-all ${
                    formData.icon === icon
                      ? "bg-amber-500/30 border-2 border-amber-500 ring-2 ring-amber-500/30"
                      : "bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50"
                  } disabled:opacity-50`}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">
              Category Color
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {COLOR_OPTIONS.map((colorOption) => (
                <motion.button
                  key={colorOption.value}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(colorOption.value)}
                  disabled={isLoading}
                  title={colorOption.name}
                  className={`p-4 rounded-lg transition-all ${
                    formData.color === colorOption.value
                      ? "ring-2 ring-white scale-110"
                      : "hover:scale-105"
                  } disabled:opacity-50`}
                >
                  <div
                    className={`w-full h-full rounded bg-gradient-to-br ${colorOption.value}`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Preview
            </label>
            <div
              className={`p-6 rounded-xl bg-gradient-to-br ${formData.color} flex items-center gap-3`}
            >
              <span className="text-4xl">{formData.icon}</span>
              <div>
                <p className="text-lg font-bold text-white">{formData.name}</p>
                <p className="text-sm text-white/80">
                  {formData.description || "No description"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-700/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : category
                ? "Update Category"
                : "Add Category"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategoryForm;
