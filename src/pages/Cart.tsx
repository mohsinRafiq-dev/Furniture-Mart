import React from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems] = React.useState([]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
              Your cart is empty
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-lg gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0">
                  ${item.price}
                </div>
              </div>
            ))}
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-center mt-6 sm:mt-8 text-sm sm:text-base transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
