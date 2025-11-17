import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";
import ProductsManagement from "../components/ProductsManagement";
import {
  LogOut,
  Package,
  LayoutGrid,
  Settings,
  Menu,
  X,
  Shield,
  Home,
  Bell,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { apiClient } from "../services/api/client";

const AdminDashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" && window.innerWidth >= 768
  );
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "from-amber-500 to-orange-600",
    image: "",
  });
  const [categoryImagePreview, setCategoryImagePreview] = useState<
    string | null
  >(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editCategoryImagePreview, setEditCategoryImagePreview] = useState<
    string | null
  >(null);
  const [editCropImage, setEditCropImage] = useState<string | null>(null);
  const [editShowCropModal, setEditShowCropModal] = useState(false);
  const [editCrop, setEditCrop] = useState({ x: 0, y: 0 });
  const [editZoom, setEditZoom] = useState(1);
  const [editCroppedAreaPixels, setEditCroppedAreaPixels] = useState<any>(null);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();

    // Handle window resize to show sidebar on desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get("/products?limit=100"),
        apiClient.get("/categories"),
      ]);

      console.log("Products Full Response:", productsRes);
      console.log("Categories Full Response:", categoriesRes);

      // The axios response structure is: { data: { success, message, data: { products/categories, pagination } } }
      // So productsRes.data is the API response body
      const apiProductsData = (productsRes as any).data?.data?.products || [];
      const apiCategoriesData =
        (categoriesRes as any).data?.data?.categories || [];

      console.log("Extracted Products:", apiProductsData);
      console.log("Extracted Categories:", apiCategoriesData);

      setProducts(Array.isArray(apiProductsData) ? apiProductsData : []);
      setCategories(Array.isArray(apiCategoriesData) ? apiCategoriesData : []);
      setError("");
    } catch (err: any) {
      setError("Failed to load dashboard data");
      console.error("Error fetching dashboard data:", err);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCategoryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const getCroppedImage = async () => {
    if (!cropImage || !croppedAreaPixels) return;

    try {
      const canvas = await createImage(cropImage, croppedAreaPixels);
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.95);
      setNewCategory({ ...newCategory, image: croppedBase64 });
      setCategoryImagePreview(croppedBase64);
      setShowCropModal(false);
      setCropImage(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
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

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setAddingCategory(true);
    try {
      const response = await apiClient.post("/categories", {
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
        image: newCategory.image,
      });

      console.log("Category added response:", response.data);

      // POST returns: { success, message, data: { categoryObject } }
      // GET returns: { success, message, data: { categories: [...], pagination: {...} } }
      const addedCategory = (response as any).data?.data;

      if (addedCategory) {
        setCategories([...categories, addedCategory]);
        console.log("Categories updated:", [...categories, addedCategory]);
      }

      // Reset form
      setNewCategory({
        name: "",
        description: "",
        color: "from-amber-500 to-orange-600",
        image: "",
      });
      setCategoryImagePreview(null);
      setShowAddCategoryModal(false);

      // Show success toast
      toast.success("Category added successfully!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (err: any) {
      console.error("Error adding category:", err);
      toast.error(
        "Failed to add category: " +
          (err.response?.data?.message || err.message),
        {
          duration: 4000,
          position: "top-center",
        }
      );
    } finally {
      setAddingCategory(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory({
      ...category,
      editName: category.name,
      editDescription: category.description,
      editColor: category.color,
      editImage: category.image,
    });
    setEditCategoryImagePreview(category.image || null);
    setShowEditCategoryModal(true);
  };

  const handleEditCategoryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditCropImage(base64String);
        setEditShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onEditCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setEditCroppedAreaPixels(croppedAreaPixels);
  };

  const getEditCroppedImage = async () => {
    if (!editCropImage || !editCroppedAreaPixels) return;

    try {
      const canvas = await createImage(editCropImage, editCroppedAreaPixels);
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.95);
      setEditingCategory({
        ...editingCategory,
        editImage: croppedBase64,
      });
      setEditCategoryImagePreview(croppedBase64);
      setEditShowCropModal(false);
      setEditCropImage(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.editName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setUpdatingCategory(true);
    try {
      const response = await apiClient.put(
        `/categories/${editingCategory._id}`,
        {
          name: editingCategory.editName,
          description: editingCategory.editDescription,
          color: editingCategory.editColor,
          image: editingCategory.editImage,
        }
      );

      console.log("Category updated response:", response.data);

      const updatedCategory = (response as any).data?.data;

      if (updatedCategory) {
        setCategories(
          categories.map((cat) =>
            cat._id === editingCategory._id ? updatedCategory : cat
          )
        );
      }

      setShowEditCategoryModal(false);
      setEditingCategory(null);
      setEditCategoryImagePreview(null);

      toast.success("Category updated successfully!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (err: any) {
      console.error("Error updating category:", err);
      toast.error(
        "Failed to update category: " +
          (err.response?.data?.message || err.message),
        {
          duration: 4000,
          position: "top-center",
        }
      );
    } finally {
      setUpdatingCategory(false);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeletingCategoryId(categoryToDelete.id);
    try {
      await apiClient.delete(`/categories/${categoryToDelete.id}`);

      setCategories(
        categories.filter((cat) => cat._id !== categoryToDelete.id)
      );

      toast.success("Category deleted successfully!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast.error(
        "Failed to delete category: " +
          (err.response?.data?.message || err.message),
        {
          duration: 4000,
          position: "top-center",
        }
      );
    } finally {
      setDeletingCategoryId(null);
      setShowDeleteConfirmModal(false);
      setCategoryToDelete(null);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "from-red-500 to-red-600";
      case "editor":
        return "from-blue-500 to-blue-600";
      case "viewer":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRoleBadgeText = (role: string) => {
    switch (role) {
      case "admin":
        return "🔴 Administrator";
      case "editor":
        return "🔵 Editor";
      case "viewer":
        return "🟢 Viewer";
      default:
        return role;
    }
  };

  // Tab configuration with permissions
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home, show: true },
    {
      id: "products",
      label: "Products",
      icon: Package,
      show: isAdmin(),
    },
    {
      id: "categories",
      label: "Categories",
      icon: LayoutGrid,
      show: isAdmin(),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      show: user?.role === "admin",
    },
  ];

  const dashboardStats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Total Categories",
      value: categories.length,
      icon: LayoutGrid,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Your Role",
      value: getRoleBadgeText(user?.role || "Unknown"),
      icon: Shield,
      color: getRoleBadgeColor(user?.role || ""),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#ffffff",
            border: "1px solid rgba(107, 114, 128, 0.5)",
            borderRadius: "0.75rem",
            backdropFilter: "blur(10px)",
          },
          success: {
            style: {
              background: "#064e3b",
              border: "1px solid rgba(16, 185, 129, 0.5)",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#111827",
            },
          },
          error: {
            style: {
              background: "#7f1d1d",
              border: "1px solid rgba(239, 68, 68, 0.5)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#111827",
            },
          },
        }}
      />
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                🛋️ Furniture Mart Admin
              </h1>
              <p className="text-sm text-gray-400">Management Panel</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <motion.div
              className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-lg"
              whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </motion.div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.2 }}
              className="w-64 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 p-6 overflow-y-auto fixed md:static left-0 top-16 bottom-0 md:top-auto md:bottom-auto z-30 md:z-auto"
            >
              {/* User Profile Card */}
              <motion.div
                className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full border-2 border-amber-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg px-3 py-1 inline-block">
                  <p className="text-xs font-medium text-white">
                    {getRoleBadgeText(user?.role || "")}
                  </p>
                </div>
              </motion.div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs
                  .filter((tab) => tab.show)
                  .map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          // Only close sidebar on mobile, keep it open on desktop
                          if (
                            typeof window !== "undefined" &&
                            window.innerWidth < 768
                          ) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            : "text-gray-300 hover:bg-gray-700/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </motion.button>
                    );
                  })}
              </nav>

              {/* Permissions Info */}
              <motion.div
                className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="text-sm font-semibold text-blue-300 mb-2">
                  📋 Your Permissions
                </h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>
                    ✓ View Dashboard
                    {isAdmin() && (
                      <span className="text-amber-400"> (Full)</span>
                    )}
                  </li>
                  {isAdmin() && <li>✓ Manage Products</li>}
                  {isAdmin() && <li>✓ Manage Categories</li>}
                  {user?.role === "admin" && <li>✓ System Settings</li>}
                  {user?.role === "viewer" && (
                    <li>📖 View-only mode (Read permissions)</li>
                  )}
                </ul>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Welcome back, {user?.name}! 👋
                </h2>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {dashboardStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl border border-white/10 text-white`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium opacity-90">
                              {stat.label}
                            </p>
                            <p className="text-3xl font-bold mt-2">
                              {loading && stat.label !== "Your Role"
                                ? "..."
                                : stat.value}
                            </p>
                          </div>
                          <Icon className="w-8 h-8 opacity-75" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Items */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Products */}
                  {isAdmin() && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Recent Products
                      </h3>
                      <div className="space-y-3">
                        {products.slice(0, 3).map((product, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            <p className="text-white font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              ${product.price}
                            </p>
                          </div>
                        ))}
                        {products.length === 0 && (
                          <p className="text-gray-400 text-sm">
                            No products yet
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Recent Categories */}
                  {isAdmin() && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5" />
                        Recent Categories
                      </h3>
                      <div className="space-y-3">
                        {categories.slice(0, 3).map((category, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            <p className="text-white font-medium text-sm">
                              {category.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {category.description}
                            </p>
                          </div>
                        ))}
                        {categories.length === 0 && (
                          <p className="text-gray-400 text-sm">
                            No categories yet
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && isAdmin() && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-6">
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                  <h2 className="text-3xl font-bold text-white">
                    Products Management
                  </h2>
                </div>

                <ProductsManagement
                  products={products}
                  categories={categories}
                  onProductsUpdate={fetchDashboardData}
                />
              </motion.div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && isAdmin() && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                  <h2 className="text-3xl font-bold text-white">Categories</h2>
                  <div className="flex-1" />
                  <motion.button
                    onClick={() => setShowAddCategoryModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-amber-500/50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {category.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="flex-1 py-2 px-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCategory(category._id, category.name)
                          }
                          disabled={deletingCategoryId === category._id}
                          className="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingCategoryId === category._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-12 text-center">
                    <LayoutGrid className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No categories found</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && user?.role === "admin" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                  <h2 className="text-3xl font-bold text-white">Settings</h2>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                  <p className="text-gray-400">Settings panel coming soon...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700/50 rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Add New Category
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter category description"
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Image (Optional)
                  </label>
                  {categoryImagePreview && (
                    <div className="mb-3 relative">
                      <img
                        src={categoryImagePreview}
                        alt="Category preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-700"
                      />
                      <button
                        onClick={() => {
                          setCategoryImagePreview(null);
                          setNewCategory({ ...newCategory, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                    <span className="text-gray-300 text-sm">
                      {categoryImagePreview ? "Change Image" : "Upload Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddCategoryModal(false)}
                    disabled={addingCategory}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    disabled={addingCategory}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {addingCategory ? "Adding..." : "Add Category"}
                  </button>
                </div>
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
                    aspect={16 / 9}
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
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={getCroppedImage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors"
                  >
                    Crop & Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditCategoryModal && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowEditCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700/50 rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Edit Category
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.editName}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        editName: e.target.value,
                      })
                    }
                    placeholder="Enter category name"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={editingCategory.editDescription}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        editDescription: e.target.value,
                      })
                    }
                    placeholder="Enter category description"
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Image (Optional)
                  </label>
                  {editCategoryImagePreview && (
                    <div className="mb-3 relative">
                      <img
                        src={editCategoryImagePreview}
                        alt="Category preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-700"
                      />
                      <button
                        onClick={() => {
                          setEditCategoryImagePreview(null);
                          setEditingCategory({
                            ...editingCategory,
                            editImage: "",
                          });
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                    <span className="text-gray-300 text-sm">
                      {editCategoryImagePreview
                        ? "Change Image"
                        : "Upload Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditCategoryImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditCategoryModal(false)}
                    disabled={updatingCategory}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCategory}
                    disabled={updatingCategory}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updatingCategory ? "Updating..." : "Update Category"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Image Crop Modal */}
      <AnimatePresence>
        {editShowCropModal && editCropImage && (
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
                {editCropImage && (
                  <Cropper
                    image={editCropImage}
                    crop={editCrop}
                    zoom={editZoom}
                    aspect={16 / 9}
                    onCropChange={setEditCrop}
                    onCropComplete={onEditCropComplete}
                    onZoomChange={setEditZoom}
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
                      value={editZoom}
                      onChange={(e) => setEditZoom(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditShowCropModal(false);
                      setEditCropImage(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={getEditCroppedImage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors"
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
        {showDeleteConfirmModal && categoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trash2 className="w-8 h-8 text-red-400" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Delete Category?
                </h3>
                <p className="text-gray-400 mb-2">
                  You're about to delete{" "}
                  <span className="font-semibold text-amber-400">
                    "{categoryToDelete.name}"
                  </span>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirmModal(false)}
                    disabled={deletingCategoryId === categoryToDelete.id}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDeleteCategory}
                    disabled={deletingCategoryId === categoryToDelete.id}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                  >
                    {deletingCategoryId === categoryToDelete.id
                      ? "Deleting..."
                      : "Delete"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
