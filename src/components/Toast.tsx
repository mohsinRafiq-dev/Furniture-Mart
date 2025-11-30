import { create } from "zustand";
import { motion } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message: string, type: ToastType, duration: number = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Toast Colors and Icons
const toastConfig = {
  success: {
    bg: "bg-green-500",
    icon: "✓",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
  },
  error: {
    bg: "bg-red-500",
    icon: "✕",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
  },
  info: {
    bg: "bg-blue-500",
    icon: "ℹ",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50",
  },
  warning: {
    bg: "bg-amber-500",
    icon: "⚠",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
  },
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        return (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${config.bgLight} ${config.textColor} p-4 rounded-lg shadow-lg flex items-center gap-3 pointer-events-auto`}
          >
            <div
              className={`${config.bg} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm`}
            >
              {config.icon}
            </div>
            <p className="flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};
