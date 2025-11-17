import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import ProductForm, { Product } from "../components/admin/ProductForm";

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Modern Leather Sofa",
      category: "Sofas",
      price: 1299,
      description: "Premium leather sofa with modern design",
      image: "🛋️",
      stock: 12,
      featured: true,
      sku: "SOFA-001",
    },
    {
      id: "2",
      name: "Wooden Dining Chair",
      category: "Chairs",
      price: 249,
      description: "Classic wooden dining chair",
      image: "🪑",
      stock: 45,
      featured: false,
      sku: "CHAIR-001",
    },
    {
      id: "3",
      name: "Platform Bed Frame",
      category: "Beds",
      price: 699,
      description: "Contemporary platform bed",
      image: "🛏️",
      stock: 8,
      featured: false,
      sku: "BED-001",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = [
    "All",
    "Sofas",
    "Beds",
    "Chairs",
    "Desks",
    "Tables",
    "Outdoor",
    "Lighting",
    "Storage",
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (product: Product) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? product : p))
      );
    } else {
      setProducts((prev) => [product, ...prev]);
    }
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">
            Manage {filteredProducts.length} product(s)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingProduct(undefined);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-700"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-700/50 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          <div className="text-sm font-semibold text-gray-400">Product</div>
          <div className="text-sm font-semibold text-gray-400">Category</div>
          <div className="text-sm font-semibold text-gray-400">Price</div>
          <div className="text-sm font-semibold text-gray-400">Stock</div>
          <div className="text-sm font-semibold text-gray-400">Status</div>
          <div className="text-sm font-semibold text-gray-400">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700/30">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-center hover:bg-gray-800/30 transition-colors"
              >
                {/* Product */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{product.image}</span>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                </div>

                {/* Category */}
                <span className="text-gray-300">{product.category}</span>

                {/* Price */}
                <span className="text-white font-semibold">
                  ${product.price}
                </span>

                {/* Stock */}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 10
                      ? "bg-green-500/10 text-green-400"
                      : product.stock > 0
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {product.stock}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    product.featured
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                      : "bg-gray-700/50 text-gray-400 border border-gray-700"
                  }`}
                >
                  {product.featured ? "Featured" : "Regular"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditProduct(product)}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">No products found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories.filter((c) => c !== "All")}
            onSubmit={handleAddProduct}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(undefined);
            }}
          />
        )}
      </AnimatePresence>

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
              className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Delete Product?
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteProduct(deleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-colors font-semibold"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsManagement;
