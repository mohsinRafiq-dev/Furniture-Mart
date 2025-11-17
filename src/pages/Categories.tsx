import React from "react";

export default function Categories() {
  const categories = [
    "Living Room",
    "Bedroom",
    "Dining",
    "Office",
    "Outdoor",
    "Accessories",
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-gray-100 h-48 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
            >
              <span className="text-xl font-semibold text-gray-700">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
