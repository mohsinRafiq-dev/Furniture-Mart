import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import {
  LogOut,
  Package,
  Users,
  TrendingUp,
  Settings,
  BarChart3,
} from "lucide-react";

const AdminPortal: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const stats = [
    {
      label: "Total Orders",
      value: "1,234",
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Users",
      value: "8,456",
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Revenue",
      value: "$45.2K",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Products",
      value: "342",
      icon: Package,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-lg border-b border-amber-500/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🛡️</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Portal</h1>
              <p className="text-gray-400 text-xs">
                Ashraf Furnitures Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{user?.name}</p>
              <p className="text-amber-500 text-xs font-medium uppercase">
                {user?.role}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ color: "#FCD34D" }}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-all flex items-center gap-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-500"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 hover:border-amber-500/30 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" />
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
                      <p className="text-3xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-green-400 text-xs mt-2 font-medium">
                        ↑ 12% from last month
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h2>
              <p className="text-gray-300">
                You have admin access to the Ashraf Furnitures management
                portal. Use the navigation tabs above to manage products, users,
                and system settings.
              </p>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 text-center"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Products Management
            </h3>
            <p className="text-gray-400">
              Product management interface coming soon...
            </p>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 text-center"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Users Management
            </h3>
            <p className="text-gray-400">
              User management interface coming soon...
            </p>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 text-center"
          >
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              System Settings
            </h3>
            <p className="text-gray-400">
              System settings interface coming soon...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
