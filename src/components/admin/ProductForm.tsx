import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Upload, AlertCircle, CheckCircle } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  featured: boolean;
  sku: string;
}

interface ProductFormProps {
  product?: Product;
  categories: string[];
  onSubmit: (product: Product) => Promise<void>;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: Date.now().toString(),
      name: "",
      category: categories[0] || "",
      price: 0,
      description: "",
      image: "",
      stock: 0,
      featured: false,
      sku: "",
    }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setImagePreview(imageData);
        setFormData((prev) => ({
          ...prev,
          image: imageData,
        }));
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("Product name is required");
        return;
      }

      if (formData.price < 0) {
        setError("Price must be positive");
        return;
      }

      if (formData.stock < 0) {
        setError("Stock must be positive");
        return;
      }

      if (!formData.image) {
        setError("Product image is required");
        return;
      }

      if (!formData.sku.trim()) {
        setError("SKU is required");
        return;
      }

      await onSubmit(formData);
      setSuccess("Product saved successfully!");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product. Please try again."
      );
    } finally {
      setIsLoading(false);
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
            {product ? "Edit Product" : "Add New Product"}
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

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">
              Product Image
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="col-span-2 md:col-span-1 border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-amber-500 transition-colors cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2 group-hover:text-amber-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-amber-500" />
                  <span className="text-sm font-medium text-gray-400">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </span>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-2 md:col-span-1 bg-gray-800 rounded-lg p-4 flex items-center justify-center"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 rounded-lg object-cover"
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              placeholder="e.g., Modern Leather Sofa"
            />
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              SKU (Stock Keeping Unit) *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              placeholder="e.g., SOFA-001"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                disabled={isLoading}
                step="0.01"
                min="0"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              disabled={isLoading}
              min="0"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              placeholder="0"
            />
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
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 resize-none"
              placeholder="Describe the product features, materials, dimensions, etc."
            />
          </div>

          {/* Featured Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-amber-500 cursor-pointer disabled:opacity-50"
            />
            <span className="text-sm font-medium text-gray-300">
              Mark as featured product
            </span>
          </label>

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
                : product
                ? "Update Product"
                : "Add Product"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;
