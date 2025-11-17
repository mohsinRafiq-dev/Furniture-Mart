import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import ProductsManagement from "./ProductsManagement";
import CategoriesManagement from "./CategoriesManagement";
import {
  LogOut,
  Package,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Bell,
  Search,
  Grid3x3,
  Zap,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Dashboard Stats
  const stats = [
    {
      id: 1,
      label: "Total Products",
      value: "342",
      icon: Package,
      color: "from-orange-500 to-orange-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      id: 2,
      label: "Total Categories",
      value: "8",
      icon: Grid3x3,
      color: "from-blue-500 to-blue-600",
      trend: "+2",
      trendUp: true,
    },
    {
      id: 3,
      label: "Recent Orders",
      value: "1,234",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      id: 4,
      label: "Active Users",
      value: "8,456",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      trend: "+5%",
      trendUp: true,
    },
  ];

  // Recent Products
  const recentProducts = [
    {
      id: 1,
      name: "Modern Leather Sofa",
      category: "Sofas",
      price: "$1,299",
      stock: 12,
      status: "In Stock",
      image: "🛋️",
    },
    {
      id: 2,
      name: "Wooden Dining Chair",
      category: "Chairs",
      price: "$249",
      stock: 45,
      status: "In Stock",
      image: "🪑",
    },
    {
      id: 3,
      name: "Platform Bed Frame",
      category: "Beds",
      price: "$699",
      stock: 8,
      status: "Low Stock",
      image: "🛏️",
    },
    {
      id: 4,
      name: "Study Desk Oak",
      category: "Desks",
      price: "$399",
      stock: 0,
      status: "Out of Stock",
      image: "📚",
    },
    {
      id: 5,
      name: "Outdoor Garden Set",
      category: "Outdoor",
      price: "$1,899",
      stock: 5,
      status: "Low Stock",
      image: "🌳",
    },
  ];

  // Recent Categories
  const categories = [
    {
      id: 1,
      name: "Sofas",
      products: 45,
      icon: "🛋️",
      color: "from-rose-500 to-pink-500",
    },
    {
      id: 2,
      name: "Beds",
      products: 38,
      icon: "🛏️",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Chairs",
      products: 62,
      icon: "🪑",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 4,
      name: "Desks",
      products: 28,
      icon: "📚",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 5,
      name: "Tables",
      products: 35,
      icon: "🍽️",
      color: "from-purple-500 to-violet-500",
    },
    {
      id: 6,
      name: "Outdoor",
      products: 22,
      icon: "🌳",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: 7,
      name: "Lighting",
      products: 51,
      icon: "💡",
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: 8,
      name: "Storage",
      products: 31,
      icon: "🗄️",
      color: "from-slate-500 to-gray-600",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Grid3x3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-64 bg-gray-900/95 backdrop-blur-xl border-r border-amber-500/20 z-40 overflow-y-auto md:translate-x-0"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">🛋️</span>
            </div>
            <h2 className="text-white font-bold text-lg">Ashraf</h2>
          </div>
          <p className="text-gray-400 text-xs">Admin Management System</p>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-amber-500"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
              <h1 className="text-white font-bold text-xl hidden md:block">
                {sidebarItems.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-32"
                />
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              {/* User Profile */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <span className="text-sm text-gray-300 hidden md:block">
                  {user?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        y: -5,
                        shadow: "0 20px 25px rgba(0,0,0,0.3)",
                      }}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 hover:border-amber-500/50 transition-all"
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-400 text-sm font-medium">
                            {stat.label}
                          </span>
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-4xl font-bold text-white">
                            {stat.value}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              stat.trendUp ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {stat.trendUp ? "↑" : "↓"} {stat.trend} from last
                            month
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-900/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-500" />
                      Recent Products
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                    >
                      View All →
                    </motion.button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700/50 bg-gray-800/30">
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.map((product, index) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 + index * 0.05 }}
                            className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {product.image}
                                </span>
                                <span className="text-white font-medium">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 text-white font-semibold">
                              {product.price}
                            </td>
                            <td className="px-6 py-4">
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
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  product.status === "In Stock"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                    : product.status === "Low Stock"
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                                    : "bg-red-500/10 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Categories Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-900/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Grid3x3 className="w-5 h-5 text-blue-500" />
                      Categories
                    </h3>
                  </div>

                  {/* Categories List */}
                  <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + index * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="group p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all cursor-pointer border border-transparent hover:border-gray-600/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {category.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {category.products} products
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-8 h-1 rounded-full bg-gradient-to-r ${category.color}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && <ProductsManagement />}

          {/* Categories Tab */}
          {activeTab === "categories" && <CategoriesManagement />}

          {/* Other Tabs Placeholder */}
          {activeTab !== "dashboard" &&
            activeTab !== "products" &&
            activeTab !== "categories" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-12 text-center"
              >
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {sidebarItems.find((item) => item.id === activeTab)?.label}
                </h3>
                <p className="text-gray-400">
                  This section is coming soon. Stay tuned for more features!
                </p>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
