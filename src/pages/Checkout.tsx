import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  agreeTerms: boolean;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
      agreeTerms: false,
    },
  });

  const agreeTerms = watch("agreeTerms");
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 100 ? 0 : 9.99;
  const taxRate = 0.08;
  const tax = totalPrice * taxRate;
  const grandTotal = totalPrice + shippingCost + tax;

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">
              Add some items before checking out
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-amber-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center"
      >
        <div className="text-center max-w-md px-4 sm:px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-14 sm:w-16 h-14 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <Check className="w-7 sm:w-8 h-7 sm:h-8 text-green-600" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-6 sm:mb-8">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          <button
            onClick={() => {
              navigate("/");
              setOrderSuccess(false);
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Order submitted:", {
      ...data,
      items,
      total: grandTotal,
    });

    clearCart();
    setOrderSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">
                    1
                  </span>
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.firstName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                        {errors.firstName.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.lastName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                        {errors.lastName.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...register("phone", {
                        required: "Phone is required",
                        pattern: {
                          value: /^[\d\s()+-]+$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                        {errors.phone.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                    2
                  </span>
                  Shipping Address
                </h2>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 5,
                        message: "Address must be at least 5 characters",
                      },
                    })}
                    className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                      errors.address
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                      <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      {errors.address.message}
                    </div>
                  )}
                </div>

                <div className="mt-3 sm:mt-4">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    {...register("apartment")}
                    className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="New York"
                      {...register("city", {
                        required: "City is required",
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.city
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.city && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {errors.city.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      placeholder="NY"
                      {...register("state", {
                        required: "State is required",
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.state
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.state && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {errors.state.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      placeholder="10001"
                      {...register("zipCode", {
                        required: "ZIP code is required",
                        pattern: {
                          value: /^[\d-]+$/,
                          message: "Invalid ZIP code format",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.zipCode
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.zipCode && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {errors.zipCode.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                    3
                  </span>
                  Payment Information
                </h2>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("cardName", {
                      required: "Cardholder name is required",
                    })}
                    className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                      errors.cardName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.cardName && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                      <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      {errors.cardName.message}
                    </div>
                  )}
                </div>

                <div className="mt-3 sm:mt-4">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="4532 1111 1111 1111"
                    maxLength={19}
                    {...register("cardNumber", {
                      required: "Card number is required",
                      pattern: {
                        value: /^[\d\s]{13,}$/,
                        message: "Invalid card number",
                      },
                    })}
                    className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                      errors.cardNumber
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.cardNumber && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                      <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      {errors.cardNumber.message}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      {...register("cardExpiry", {
                        required: "Expiry date is required",
                        pattern: {
                          value: /^\d{2}\/\d{2}$/,
                          message: "Use MM/YY format",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.cardExpiry
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.cardExpiry && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {errors.cardExpiry.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      CVC *
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      {...register("cardCVC", {
                        required: "CVC is required",
                        pattern: {
                          value: /^\d{3,4}$/,
                          message: "Invalid CVC",
                        },
                      })}
                      className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs sm:text-sm ${
                        errors.cardCVC
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.cardCVC && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {errors.cardCVC.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("agreeTerms", {
                      required: "You must agree to the terms",
                    })}
                    className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-amber-600 hover:underline">
                      Terms and Conditions
                    </a>
                    ,{" "}
                    <a href="#" className="text-amber-600 hover:underline">
                      Privacy Policy
                    </a>
                    , and{" "}
                    <a href="#" className="text-amber-600 hover:underline">
                      Return Policy
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    {errors.agreeTerms.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !agreeTerms}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Place Order</>
                )}
              </motion.button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 sticky top-20"
            >
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-3 mb-4 sm:mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 sm:w-12 h-10 sm:h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex justify-between text-xs sm:text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm text-gray-700">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-amber-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                {totalPrice > 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 sm:p-3 mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm text-green-700 font-semibold">
                      ✓ Free Shipping Applied!
                    </p>
                    <p className="text-xs text-green-600">
                      Orders over $100 qualify for free shipping
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
