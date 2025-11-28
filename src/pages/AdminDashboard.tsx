import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";
import ProductsManagement from "../components/ProductsManagement";
import { getAnalyticsSummary } from "../services/analytics";
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
  ImagePlus,
  BarChart3,
  Eye,
  TrendingUp,
  Users,
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

  // Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Furniture Mart",
    storeEmail: "contact@furnituremartstore.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Furniture Street, Design City, DC 12345",
    currency: "USD",
    taxRate: 8.5,
    shippingCost: 9.99,
    lowStockThreshold: 10,
  });

  const [adminProfile, setAdminProfile] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 8432,
    visitorsThisMonth: 2156,
    visitorsThisWeek: 487,
    totalPageViews: 24891,
    pageViewsThisMonth: 6234,
    averageTimeOnSite: "3m 24s",
    bounceRate: "32%",
    topProducts: [
      { id: 1, name: "Premium Leather Sofa", views: 2341, purchases: 156 },
      { id: 2, name: "Modern Coffee Table", views: 1987, purchases: 134 },
      { id: 3, name: "Executive Office Chair", views: 1654, purchases: 98 },
      { id: 4, name: "Dining Table Set", views: 1432, purchases: 87 },
      { id: 5, name: "Wall Art Collection", views: 1289, purchases: 76 },
    ],
    conversionRate: "6.8%",
    trafficSources: [
      { source: "Direct", percentage: 35, color: "from-blue-500 to-blue-600" },
      {
        source: "Search",
        percentage: 28,
        color: "from-green-500 to-green-600",
      },
      {
        source: "Social",
        percentage: 22,
        color: "from-purple-500 to-purple-600",
      },
      {
        source: "Referral",
        percentage: 15,
        color: "from-orange-500 to-orange-600",
      },
    ],
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAnalyticsData();

    // Handle window resize to show/hide sidebar based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch analytics data from backend
  const fetchAnalyticsData = async () => {
    try {
      const data = await getAnalyticsSummary(30);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      // Keep the mock data if fetch fails
    }
  };

  // Lock scroll when sidebar opens on mobile
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get("/products?limit=100"),
        apiClient.get("/categories"),
      ]);

      // The axios response structure is: { data: { success, message, data: { products/categories, pagination } } }
      // So productsRes.data is the API response body
      const apiProductsData = (productsRes as any).data?.data?.products || [];
      const apiCategoriesData =
        (categoriesRes as any).data?.data?.categories || [];

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
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
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
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#000000",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          success: {
            style: {
              background: "#ecfdf5",
              border: "1px solid #d1fae5",
              color: "#065f46",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#ecfdf5",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#7f1d1d",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fef2f2",
            },
          },
        }}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-900" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-900" />
                )}
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Manage your store
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative hidden sm:inline-flex">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              </button>

              {/* User Menu */}
              <motion.div
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
              </motion.div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
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
              className="w-64 bg-white border-r border-gray-200 overflow-y-auto fixed md:static left-0 top-16 bottom-0 md:top-auto md:bottom-auto z-30 md:z-auto shadow-lg md:shadow-none"
            >
              <div className="p-6 pt-24 md:pt-6">
                {/* Navigation Tabs */}
                <nav className="space-y-2 mb-8">
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
                            if (
                              typeof window !== "undefined" &&
                              window.innerWidth < 768
                            ) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </motion.button>
                      );
                    })}
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
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
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-8">
                  Welcome back, {user?.name}!
                </h2>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {dashboardStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl border border-white/20 text-white shadow-lg hover:shadow-xl transition-shadow`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium opacity-90">
                              {stat.label}
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">
                              {loading && stat.label !== "Your Role"
                                ? "..."
                                : stat.value}
                            </p>
                          </div>
                          <Icon className="w-8 h-8 opacity-60" />
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
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Package className="w-5 h-5 text-amber-600" />
                          Recent Products
                        </h3>
                        <span className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                          {products.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {products.slice(0, 4).map((product, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-all border border-gray-100 flex items-center gap-3"
                          >
                            {/* Product Image */}
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={
                                    product.images[0]?.url || product.images[0]
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-amber-600" />
                                </div>
                              )}
                            </div>
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-semibold text-sm truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-amber-600 font-bold text-sm">
                                  ${product.price}
                                </p>
                                {product.stock && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      product.stock > 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {product.stock > 0
                                      ? `In Stock (${product.stock})`
                                      : "Out of Stock"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {products.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm font-medium">
                              No products yet
                            </p>
                          </div>
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
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <LayoutGrid className="w-5 h-5 text-amber-600" />
                          Recent Categories
                        </h3>
                        <span className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                          {categories.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {categories.slice(0, 4).map((category, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-all border border-gray-100 flex items-center gap-3"
                          >
                            {/* Category Image */}
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                              {category.image ? (
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                                </div>
                              )}
                            </div>
                            {/* Category Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-semibold text-sm truncate">
                                {category.name}
                              </p>
                              <p className="text-gray-600 text-xs truncate mt-1">
                                {category.description || "No description"}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                        {categories.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <LayoutGrid className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm font-medium">
                              No categories yet
                            </p>
                          </div>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-600 rounded-lg sm:rounded-xl transition-all shadow-sm border border-blue-200 flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.button>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-600 rounded-lg sm:rounded-xl transition-all shadow-sm border border-purple-200 flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.button>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Categories
                  </h2>
                  <div className="flex-1" />
                  <motion.button
                    onClick={() => setShowAddCategoryModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map((category, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all group"
                    >
                      {/* Category Image */}
                      <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <LayoutGrid className="w-16 h-16 text-blue-400/50" />
                          </div>
                        )}
                      </div>

                      {/* Category Details */}
                      <div className="p-4">
                        {/* Category Name */}
                        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                          {category.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                          {category.description || "No description available"}
                        </p>

                        {/* Color Indicator */}
                        {category.color && (
                          <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg shadow-sm bg-gradient-to-r from-blue-400 to-blue-600`}
                              />
                              <span className="text-xs text-gray-500">
                                Theme Color
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategory(category._id, category.name)
                            }
                            disabled={deletingCategoryId === category._id}
                            className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors disabled:opacity-50 font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            {deletingCategoryId === category._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                    <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No categories found
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && isAdmin() && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pb-8"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <motion.button
                      onClick={() => setActiveTab("dashboard")}
                      whileHover={{ scale: 1.05, x: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-600 rounded-lg sm:rounded-xl transition-all shadow-sm border border-blue-200 flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                    </motion.button>
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                        Analytics & Reports
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Total Visitors */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
                        Total Visitors
                      </span>
                      <Users className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                      {analyticsData.totalVisitors.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1 sm:mt-2">
                      +{analyticsData.visitorsThisMonth.toLocaleString()} this
                      month
                    </p>
                  </motion.div>

                  {/* Total Page Views */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-purple-600 uppercase tracking-wider">
                        Page Views
                      </span>
                      <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                      {analyticsData.totalPageViews.toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-600 mt-1 sm:mt-2">
                      +{analyticsData.pageViewsThisMonth.toLocaleString()} this
                      month
                    </p>
                  </motion.div>

                  {/* Conversion Rate */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-green-600 uppercase tracking-wider">
                        Conversion Rate
                      </span>
                      <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-green-900">
                      {analyticsData.conversionRate}
                    </p>
                    <p className="text-xs text-green-600 mt-1 sm:mt-2">
                      Avg bounce: {analyticsData.bounceRate}
                    </p>
                  </motion.div>

                  {/* Avg Time on Site */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-orange-600 uppercase tracking-wider">
                        Avg Time on Site
                      </span>
                      <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-900">
                      {analyticsData.averageTimeOnSite}
                    </p>
                    <p className="text-xs text-orange-600 mt-1 sm:mt-2">
                      Per visitor session
                    </p>
                  </motion.div>
                </div>

                {/* Traffic Sources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                    Traffic Sources
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {analyticsData.trafficSources.map((source, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="flex items-center gap-2 sm:gap-4"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-gray-600 w-16 sm:w-20">
                          {source.source}
                        </span>
                        <div className="flex-1 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${source.percentage}%` }}
                            transition={{
                              delay: 0.7 + idx * 0.1,
                              duration: 0.6,
                            }}
                            className={`h-full bg-gradient-to-r ${source.color}`}
                          ></motion.div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 w-10 sm:w-12 text-right">
                          {source.percentage}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Top Products by Views */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    Top Products by Views
                  </h3>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left text-xs sm:text-sm font-semibold text-gray-600 py-3 px-2 sm:px-4">
                            Product Name
                          </th>
                          <th className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-3 px-2 sm:px-4">
                            Views
                          </th>
                          <th className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-3 px-2 sm:px-4">
                            Purchases
                          </th>
                          <th className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-3 px-2 sm:px-4">
                            Conversion
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.topProducts.map((product, idx) => {
                          const conversion = (
                            (product.purchases / product.views) *
                            100
                          ).toFixed(1);
                          return (
                            <motion.tr
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + idx * 0.1 }}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="text-xs sm:text-sm text-gray-900 font-medium py-4 px-2 sm:px-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br ${
                                      idx === 0
                                        ? "from-amber-400 to-orange-500"
                                        : idx === 1
                                        ? "from-gray-300 to-gray-400"
                                        : idx === 2
                                        ? "from-amber-600 to-orange-700"
                                        : "from-gray-400 to-gray-500"
                                    } flex items-center justify-center text-white font-bold text-xs sm:text-sm`}
                                  >
                                    {idx === 0
                                      ? "🥇"
                                      : idx === 1
                                      ? "🥈"
                                      : idx === 2
                                      ? "🥉"
                                      : idx + 1}
                                  </motion.div>
                                  <span className="truncate">
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="text-xs sm:text-sm text-center text-gray-900 font-bold py-4 px-2 sm:px-4">
                                {product.views.toLocaleString()}
                              </td>
                              <td className="text-xs sm:text-sm text-center text-gray-900 font-bold py-4 px-2 sm:px-4">
                                {product.purchases.toLocaleString()}
                              </td>
                              <td className="text-xs sm:text-sm text-center py-4 px-2 sm:px-4">
                                <span className="inline-block px-2 sm:px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-semibold text-xs">
                                  {conversion}%
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-3">
                    {analyticsData.topProducts.map((product, idx) => {
                      const conversion = (
                        (product.purchases / product.views) *
                        100
                      ).toFixed(1);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`w-6 h-6 rounded-lg bg-gradient-to-br ${
                                  idx === 0
                                    ? "from-amber-400 to-orange-500"
                                    : idx === 1
                                    ? "from-gray-300 to-gray-400"
                                    : idx === 2
                                    ? "from-amber-600 to-orange-700"
                                    : "from-gray-400 to-gray-500"
                                } flex items-center justify-center text-white font-bold text-xs`}
                              >
                                {idx === 0
                                  ? "🥇"
                                  : idx === 1
                                  ? "🥈"
                                  : idx === 2
                                  ? "🥉"
                                  : idx + 1}
                              </motion.div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">
                                  {product.name}
                                </p>
                              </div>
                            </div>
                            <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-semibold text-xs whitespace-nowrap">
                              {conversion}%
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white rounded p-2">
                              <p className="text-gray-600 font-medium">Views</p>
                              <p className="text-gray-900 font-bold">
                                {product.views.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white rounded p-2">
                              <p className="text-gray-600 font-medium">
                                Purchases
                              </p>
                              <p className="text-gray-900 font-bold">
                                {product.purchases.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && user?.role === "admin" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pb-8"
              >
                {/* Header with Back Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-600 rounded-lg sm:rounded-xl transition-all shadow-sm border border-amber-200 flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.button>
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                      Settings & Configuration
                    </h2>
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {settingsSaved && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-4 flex items-center gap-3 shadow-sm"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-700">
                          ✓ Settings saved successfully!
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                          All changes have been applied
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ===== STORE INFORMATION ===== */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gradient-to-r from-amber-200 to-orange-200">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center shadow-sm"
                      >
                        <span className="text-2xl">🏪</span>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Store Information
                        </h3>
                        <p className="text-xs text-gray-500">
                          Core business details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Store Name
                        </label>
                        <input
                          type="text"
                          value={storeSettings.storeName}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              storeName: e.target.value,
                            })
                          }
                          placeholder="Your store name"
                          className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={storeSettings.storeEmail}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              storeEmail: e.target.value,
                            })
                          }
                          placeholder="contact@store.com"
                          className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={storeSettings.storePhone}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              storePhone: e.target.value,
                            })
                          }
                          placeholder="+1 (555) 123-4567"
                          className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Store Address
                        </label>
                        <textarea
                          value={storeSettings.storeAddress}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              storeAddress: e.target.value,
                            })
                          }
                          placeholder="Enter your complete store address"
                          rows={3}
                          className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* ===== BUSINESS SETTINGS ===== */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gradient-to-r from-green-200 to-emerald-200">
                      <motion.div
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-sm"
                      >
                        <span className="text-2xl">💼</span>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Business Settings
                        </h3>
                        <p className="text-xs text-gray-500">
                          Commerce & operations
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Currency
                        </label>
                        <select
                          value={storeSettings.currency}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              currency: e.target.value,
                            })
                          }
                          className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium"
                        >
                          <option value="USD">🇺🇸 USD ($)</option>
                          <option value="EUR">🇪🇺 EUR (€)</option>
                          <option value="GBP">🇬🇧 GBP (£)</option>
                          <option value="AUD">🇦🇺 AUD ($)</option>
                          <option value="CAD">🇨🇦 CAD ($)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Tax Rate (%)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={storeSettings.taxRate}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                taxRate: parseFloat(e.target.value),
                              })
                            }
                            min="0"
                            max="100"
                            step="0.1"
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          />
                          <span className="text-2xl font-bold text-green-600">
                            %
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Shipping Cost ({storeSettings.currency})
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-600">
                            {storeSettings.currency === "USD" && "$"}
                            {storeSettings.currency === "EUR" && "€"}
                            {storeSettings.currency === "GBP" && "£"}
                            {storeSettings.currency === "AUD" && "$"}
                            {storeSettings.currency === "CAD" && "$"}
                          </span>
                          <input
                            type="number"
                            value={storeSettings.shippingCost}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                shippingCost: parseFloat(e.target.value),
                              })
                            }
                            min="0"
                            step="0.01"
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Low Stock Threshold
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={storeSettings.lowStockThreshold}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                lowStockThreshold: parseInt(e.target.value),
                              })
                            }
                            min="0"
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          />
                          <span className="text-sm font-medium text-gray-600">
                            units
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* ===== ADMIN SECURITY ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gradient-to-r from-blue-200 to-cyan-200">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-sm"
                    >
                      <span className="text-2xl">🔐</span>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Account Security
                      </h3>
                      <p className="text-xs text-gray-500">
                        Protect your admin account
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                        Current User
                      </p>
                      <p className="text-lg font-bold text-blue-900 break-all">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">
                          {user?.role}
                        </span>
                      </div>
                    </motion.div>

                    {/* Password Change Form */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                          <span>🔒</span> Current Password
                        </label>
                        <input
                          type="password"
                          value={adminProfile.currentPassword}
                          onChange={(e) =>
                            setAdminProfile({
                              ...adminProfile,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Verify your identity"
                          className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                            <span>🔑</span> New Password
                          </label>
                          <input
                            type="password"
                            value={adminProfile.newPassword}
                            onChange={(e) =>
                              setAdminProfile({
                                ...adminProfile,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Create a strong password"
                            className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
                          />
                        </div>

                        <div>
                          <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                            <span>✓</span> Confirm Password
                          </label>
                          <input
                            type="password"
                            value={adminProfile.confirmPassword}
                            onChange={(e) =>
                              setAdminProfile({
                                ...adminProfile,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm your new password"
                            className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 justify-end pt-4"
                >
                  <motion.button
                    onClick={() => setActiveTab("dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setSettingsSaved(true);
                      setTimeout(() => setSettingsSaved(false), 3000);
                      toast.success("Settings saved successfully!");
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 25px -5px rgba(217, 119, 6, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    💾 Save Settings
                  </motion.button>
                </motion.div>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Add New Category
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a new product category for your store
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    Basic Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="e.g., Living Room, Bedroom"
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      placeholder="Add a brief description of this category..."
                      rows={3}
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Category Image Section */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Category Image
                  </h4>

                  {categoryImagePreview && (
                    <div className="relative">
                      <img
                        src={categoryImagePreview}
                        alt="Category preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => {
                          setCategoryImagePreview(null);
                          setNewCategory({ ...newCategory, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors group">
                    <div className="flex flex-col items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-pink-500 transition-colors mb-2" />
                      <span className="text-gray-700 text-sm font-medium group-hover:text-pink-600">
                        {categoryImagePreview ? "Change Image" : "Upload Image"}
                      </span>
                      <span className="text-gray-500 text-xs mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  disabled={addingCategory}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors disabled:opacity-50 font-medium border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={addingCategory}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  {addingCategory ? "Adding..." : "Add Category"}
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
              className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Crop Image
              </h3>

              <div
                className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-4"
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Zoom
                  </label>
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCropModal(false);
                      setCropImage(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors font-medium border border-gray-300"
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

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditCategoryModal && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Edit Category
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Update category details and image
                  </p>
                </div>
                <button
                  onClick={() => setShowEditCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    Basic Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category Name <span className="text-red-500">*</span>
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
                      placeholder="e.g., Living Room, Bedroom"
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={editingCategory.editDescription}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          editDescription: e.target.value,
                        })
                      }
                      placeholder="Add a brief description of this category..."
                      rows={3}
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Category Image Section */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Category Image
                  </h4>

                  {editCategoryImagePreview && (
                    <div className="relative">
                      <img
                        src={editCategoryImagePreview}
                        alt="Category preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => {
                          setEditCategoryImagePreview(null);
                          setEditingCategory({
                            ...editingCategory,
                            editImage: "",
                          });
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors group">
                    <div className="flex flex-col items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-pink-500 transition-colors mb-2" />
                      <span className="text-gray-700 text-sm font-medium group-hover:text-pink-600">
                        {editCategoryImagePreview
                          ? "Change Image"
                          : "Upload Image"}
                      </span>
                      <span className="text-gray-500 text-xs mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditCategoryImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => setShowEditCategoryModal(false)}
                  disabled={updatingCategory}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors disabled:opacity-50 font-medium border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  disabled={updatingCategory}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  {updatingCategory ? "Updating..." : "Update Category"}
                </button>
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
              className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Crop Image
              </h3>

              <div
                className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-4"
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Zoom
                  </label>
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={editZoom}
                      onChange={(e) => setEditZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditShowCropModal(false);
                      setEditCropImage(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors font-medium border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={getEditCroppedImage}
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
        {showDeleteConfirmModal && categoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-red-200 rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trash2 className="w-8 h-8 text-red-600" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Delete Category?
                </h3>
                <p className="text-gray-700 mb-2">
                  You're about to delete{" "}
                  <span className="font-semibold text-amber-600">
                    "{categoryToDelete.name}"
                  </span>
                </p>
                <p className="text-gray-600 text-sm mb-6">
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirmModal(false)}
                    disabled={deletingCategoryId === categoryToDelete.id}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors disabled:opacity-50 font-medium border border-gray-300"
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
