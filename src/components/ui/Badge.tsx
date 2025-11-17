import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-amber-100 text-amber-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs font-medium rounded",
    md: "px-3 py-1 text-sm font-medium rounded",
    lg: "px-4 py-2 text-base font-medium rounded-lg",
  };

  return (
    <span
      className={`inline-block ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
