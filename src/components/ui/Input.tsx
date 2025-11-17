import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, fullWidth = true, className = "", ...props },
    ref
  ) => {
    const inputClass = `w-full px-4 py-2 border rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
      error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
    } ${!fullWidth ? "w-auto" : ""} ${className}`;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClass} {...props} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
