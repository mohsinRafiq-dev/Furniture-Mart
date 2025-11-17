import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiClient } from "../services/api/client";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();

  const [email, setEmail] = useState("admin@furniture-mart.com");
  const [password, setPassword] = useState("Admin@123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        setError("Email is required");
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setIsLoading(false);
        return;
      }

      // Call backend API for authentication
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      if ((response.data as any).success) {
        const { accessToken, refreshToken, admin } = (response.data as any)
          .data;

        // Store tokens in localStorage
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Create user object
        const adminUser = {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role as "admin" | "editor" | "viewer",
          avatar: `https://ui-avatars.com/api/?name=${admin.name}&background=f59e0b&color=fff`,
        };

        // Update auth store
        setUser(adminUser);
        setToken(accessToken);

        // Show success message
        setSuccess("✓ Login successful! Redirecting to dashboard...");

        // Redirect after short delay
        setTimeout(() => {
          const from = location.state?.from?.pathname || "/admin/dashboard";
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (err: any) {
      console.error("[Login Error] Full error object:", err);

      let errorMessage = "Network error. Please check your connection.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === "Network Error") {
        errorMessage =
          "Network error. Backend server may not be running (http://localhost:5000)";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage =
          "Cannot connect to server. Is backend running on port 5000?";
      } else if (err.code === "ENOTFOUND") {
        errorMessage = "Cannot reach localhost:5000. Check your network.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-2xl">🛋️</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Ashraf Furnitures</h1>
          <p className="text-gray-400 mt-2">Admin Portal Login</p>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleLogin}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@furniture-mart.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900/50 text-amber-500 cursor-pointer disabled:opacity-50"
            />
            <span className="text-sm text-gray-300">
              Remember me for 24 hours
            </span>
          </label>

          {/* Admin Credentials Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-400 mb-2">
              📝 Admin Credentials:
            </p>
            <div className="space-y-1">
              <p className="text-xs text-gray-300">
                <span className="text-blue-300 font-medium">Email:</span>{" "}
                <code className="bg-gray-900/50 px-2 py-1 rounded text-blue-200">
                  admin@furniture-mart.com
                </code>
              </p>
              <p className="text-xs text-gray-300">
                <span className="text-blue-300 font-medium">Password:</span>{" "}
                <code className="bg-gray-900/50 px-2 py-1 rounded text-blue-200">
                  Admin@123456
                </code>
              </p>
              <p className="text-xs text-blue-300 mt-2">
                💡 Or try: editor@furniture-mart.com (Editor@123456)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Signing in...
              </span>
            ) : (
              "Sign In to Admin Portal"
            )}
          </motion.button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            This is a secured admin portal. Unauthorized access is prohibited.
          </p>
        </motion.form>
      </motion.div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Login;
