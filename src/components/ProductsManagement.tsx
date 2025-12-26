import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  Search,
  Filter,
  ImagePlus,
  Package,
} from "lucide-react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { apiClient } from "../services/api/client";

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  featured: boolean;
  images: ProductImage[];
  rating: number;
  reviews: number;
}

interface ProductsManagementProps {
  products: Product[];
  categories: any[];
  onProductsUpdate: () => void;
}

export default function ProductsManagement({
  products,
  categories,
  onProductsUpdate,
}: ProductsManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [currentProductImages, setCurrentProductImages] = useState<
    ProductImage[]
  >([]);
  const [imageGridZoom, setImageGridZoom] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    sku: "",
    featured: false,
    images: [] as ProductImage[],
    rating: 0,
    reviews: 0,
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCropImage(base64String);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (
    url: string,
    pixelCrop: any
  ): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
        }

        resolve(canvas);
      });
      image.src = url;
    });
  };

  const getCroppedImage = async () => {
    if (!cropImage || !croppedAreaPixels) return;

    try {
      const canvas = await createImage(cropImage, croppedAreaPixels);
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.95);

      const newImage: ProductImage = {
        url: croppedBase64,
        alt: isEditMode
          ? editingProduct.name
          : newProduct.name || "Product Image",
        isPrimary: currentProductImages.length === 0,
      };

      setCurrentProductImages([...currentProductImages, newImage]);

      if (isEditMode) {
        setEditingProduct({
          ...editingProduct,
          images: [...editingProduct.images, newImage],
        });
      } else {
        setNewProduct({
          ...newProduct,
          images: [...newProduct.images, newImage],
        });
      }

      setShowCropModal(false);
      setCropImage(null);
      toast.success("Image added successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to process image");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (newProduct.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!newProduct.category) {
      toast.error("Category is required");
      return;
    }
    if (!newProduct.sku.trim()) {
      toast.error("SKU is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/products", {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock,
        sku: newProduct.sku,
        featured: newProduct.featured,
        images: newProduct.images,
        rating: newProduct.rating,
        reviews: newProduct.reviews,
      });

      console.log("Product added:", response.data);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        sku: "",
        featured: false,
        images: [],
        rating: 0,
        reviews: 0,
      });
      setCurrentProductImages([]);
      setShowAddModal(false);

      onProductsUpdate();
      toast.success("Product added successfully!");
    } catch (err: any) {
      console.error("Error adding product:", err);
      toast.error(
        "Failed to add product: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setCurrentProductImages(product.images);
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (editingProduct.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!editingProduct.category) {
      toast.error("Category is required");
      return;
    }
    if (!editingProduct.sku.trim()) {
      toast.error("SKU is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.put(`/products/${editingProduct._id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        stock: editingProduct.stock,
        sku: editingProduct.sku,
        featured: editingProduct.featured,
        images: editingProduct.images,
        rating: editingProduct.rating,
        reviews: editingProduct.reviews,
      });

      console.log("Product updated:", response.data);

      setShowEditModal(false);
      setEditingProduct(null);
      setCurrentProductImages([]);
      setIsEditMode(false);

      onProductsUpdate();
      toast.success("Product updated successfully!");
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast.error(
        "Failed to update product: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProductClick = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(`/products/${productToDelete.id}`);
      onProductsUpdate();
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast.error(
        "Failed to delete product: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = currentProductImages.filter((_, i) => i !== index);
    setCurrentProductImages(updatedImages);

    if (isEditMode) {
      setEditingProduct({
        ...editingProduct,
        images: updatedImages,
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: updatedImages,
      });
    }
  };

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-gray-200 text-gray-900 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={() => {
              setNewProduct({
                name: "",
                description: "",
                price: 0,
                category: "",
                stock: 0,
                sku: "",
                featured: false,
                images: [],
                rating: 0,
                reviews: 0,
              });
              setCurrentProductImages([]);
              setIsEditMode(false);
              setShowAddModal(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/50"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-300 transition-all group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={
                    typeof product.images[0] === "string"
                      ? product.images[0]
                      : product.images[0].url
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-4xl">🛋️</span>
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Featured
                </div>
              )}

              {/* Stock Status */}
              <div className="absolute bottom-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.stock > 0
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} In Stock`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
              {/* Category Badge */}
              <div className="inline-block mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>

              {/* SKU */}
              <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>

              {/* Description */}
              <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                {product.description || "No description available"}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-amber-500">
                  ⭐ {product.rating?.toFixed(1) || "N/A"}
                </span>
                {product.reviews > 0 && (
                  <span className="text-xs text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                <p className="text-2xl font-bold text-amber-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEditProduct(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </motion.button>
                <motion.button
                  onClick={() =>
                    handleDeleteProductClick(product._id, product.name)
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your filters or add a new product
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-3xl shadow-2xl my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? "Edit Product" : "Add New Product"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEditMode
                      ? "Update product details and images"
                      : "Create a new product for your store"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
                {/* Section: Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    Basic Information
                  </h4>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={isEditMode ? editingProduct.name : newProduct.name}
                      onChange={(e) => {
                        if (isEditMode) {
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            name: e.target.value,
                          });
                        }
                      }}
                      placeholder="e.g., Premium Leather Sofa"
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={
                        isEditMode
                          ? editingProduct.description
                          : newProduct.description
                      }
                      onChange={(e) => {
                        if (isEditMode) {
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          });
                        }
                      }}
                      placeholder="Describe your product, materials, dimensions, features..."
                      rows={3}
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none transition-all"
                    />
                  </div>
                </div>

                {/* Section: Pricing & Inventory */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Pricing & Inventory
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Price <span className="text-red-500">*</span> ($)
                      </label>
                      <input
                        type="number"
                        value={
                          isEditMode ? editingProduct.price : newProduct.price
                        }
                        onChange={(e) => {
                          if (isEditMode) {
                            setEditingProduct({
                              ...editingProduct,
                              price: parseFloat(e.target.value),
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              price: parseFloat(e.target.value),
                            });
                          }
                        }}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Stock <span className="text-red-500">*</span> (units)
                      </label>
                      <input
                        type="number"
                        value={
                          isEditMode ? editingProduct.stock : newProduct.stock
                        }
                        onChange={(e) => {
                          if (isEditMode) {
                            setEditingProduct({
                              ...editingProduct,
                              stock: parseInt(e.target.value),
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              stock: parseInt(e.target.value),
                            });
                          }
                        }}
                        min="0"
                        placeholder="0"
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Organization */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Organization
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={
                          isEditMode
                            ? editingProduct.category
                            : newProduct.category
                        }
                        onChange={(e) => {
                          if (isEditMode) {
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value,
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              category: e.target.value,
                            });
                          }
                        }}
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={isEditMode ? editingProduct.sku : newProduct.sku}
                        onChange={(e) => {
                          if (isEditMode) {
                            setEditingProduct({
                              ...editingProduct,
                              sku: e.target.value.toUpperCase(),
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              sku: e.target.value.toUpperCase(),
                            });
                          }
                        }}
                        placeholder="e.g., SOFA-001"
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Additional Settings */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Additional Settings
                  </h4>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={
                        isEditMode
                          ? editingProduct.featured
                          : newProduct.featured
                      }
                      onChange={(e) => {
                        if (isEditMode) {
                          setEditingProduct({
                            ...editingProduct,
                            featured: e.target.checked,
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            featured: e.target.checked,
                          });
                        }
                      }}
                      className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Mark as Featured
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Featured products appear on the homepage
                      </p>
                    </div>
                  </label>
                </div>

                {/* Section: Product Images */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Product Images
                  </h4>
                  <p className="text-xs text-gray-600">
                    Click an image to set it as display picture (DP)
                  </p>

                  {currentProductImages.length > 0 && (
                    <div className="space-y-3">
                      {/* Zoom Controls */}
                      <div className="flex items-center justify-center gap-3 bg-white rounded-lg p-3">
                        <motion.button
                          onClick={() =>
                            setImageGridZoom(Math.max(0.5, imageGridZoom - 0.2))
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </motion.button>
                        <span className="text-sm font-semibold text-gray-600 w-16 text-center">
                          {Math.round(imageGridZoom * 100)}%
                        </span>
                        <motion.button
                          onClick={() =>
                            setImageGridZoom(Math.min(2, imageGridZoom + 0.2))
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => setImageGridZoom(1)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                          title="Reset Zoom"
                        >
                          Reset
                        </motion.button>
                      </div>

                      {/* Image Grid */}
                      <div
                        className="grid gap-3"
                        style={{
                          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(
                            100,
                            140 * imageGridZoom
                          )}px, 1fr))`,
                        }}
                      >
                        {currentProductImages.map((image, idx) => (
                          <div key={idx} className="relative group">
                            <motion.button
                              onClick={() => {
                                const updatedImages = currentProductImages.map(
                                  (img, i) => ({
                                    ...img,
                                    isPrimary: i === idx,
                                  })
                                );
                                setCurrentProductImages(updatedImages);
                                if (isEditMode) {
                                  setEditingProduct({
                                    ...editingProduct,
                                    images: updatedImages,
                                  });
                                } else {
                                  setNewProduct({
                                    ...newProduct,
                                    images: updatedImages,
                                  });
                                }
                              }}
                              whileHover={{ scale: 1.05 }}
                              className={`w-full rounded overflow-hidden border-2 transition-all cursor-pointer aspect-square ${
                                image.isPrimary
                                  ? "border-pink-500 ring-2 ring-pink-400 shadow-lg shadow-pink-500/20"
                                  : "border-gray-300 hover:border-pink-400 hover:shadow-md shadow-gray-200/30"
                              }`}
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </motion.button>

                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            {image.isPrimary && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2.5 py-1.5 rounded font-bold flex items-center gap-1 shadow-lg"
                              >
                                📷 DP
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors group bg-white">
                    <div className="flex flex-col items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-pink-500 transition-colors mb-2" />
                      <span className="text-gray-700 text-sm font-medium group-hover:text-pink-600">
                        {currentProductImages.length > 0
                          ? "Add More Images"
                          : "Upload Images"}
                      </span>
                      <span className="text-gray-500 text-xs mt-1">
                        PNG, JPG up to 5MB each
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors disabled:opacity-50 font-medium border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? handleUpdateProduct : handleAddProduct}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Crop Modal */}
      <AnimatePresence>
        {showCropModal && cropImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700/50 rounded-xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Crop Image</h3>

              <div
                className="relative w-full bg-gray-800 rounded-lg overflow-hidden mb-4"
                style={{ height: "400px" }}
              >
                {cropImage && (
                  <Cropper
                    image={cropImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Zoom
                  </label>
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-4 h-4 text-gray-400" />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCropModal(false);
                      setCropImage(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={getCroppedImage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Crop & Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && productToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trash2 className="w-8 h-8 text-red-600" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Delete Product?
                </h3>
                <p className="text-gray-700 mb-2">
                  You're about to delete{" "}
                  <span className="font-semibold text-amber-600">
                    "{productToDelete.name}"
                  </span>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowDeleteModal(false);
                      setProductToDelete(null);
                    }}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
