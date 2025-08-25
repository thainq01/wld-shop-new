import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { BottomNavigation } from "../BottomNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWLDBalance } from "../../hooks/useWLDBalance";
import { useCheckout } from "../../hooks/useCheckout";
import { useAuthWorld } from "../../store/authStore";
import { generateOrderId } from "../../utils/orderIdGenerator";
import type { CreateCheckoutRequest } from "../../types";

interface ShippingAddress {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  phone: string;
  country: string;
  saveForNextTime: boolean;
}

// Country selector component
const CountrySelector = ({
  countries,
  selectedCountry,
  onCountryChange,
}: {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCountrySelect = (country: string) => {
    onCountryChange(country);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Country Selector Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
      >
        <span>{selectedCountry || "Select Country"}</span>
        <motion.div
          animate={{ rotate: isModalOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Country Selection Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 100,
                scale: 0.95,
                borderRadius: "24px 24px 0 0",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                borderRadius: "24px 24px 0 0",
              }}
              exit={{
                opacity: 0,
                y: 100,
                scale: 0.95,
                borderRadius: "24px 24px 0 0",
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                Select Country
              </h3>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="space-y-3"
              >
                {countries.map((country) => (
                  <motion.button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {country}
                    </span>
                    <AnimatePresence>
                      {selectedCountry === country && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white dark:text-black" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const CheckoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const {
    balance: wldBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWLDBalance();
  const { address } = useAuthWorld();
  const {
    createCheckout,
    isLoading: isCheckoutLoading,
    error: checkoutError,
  } = useCheckout();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>("");

  // Available countries for shipping
  const availableCountries = [
    "Thailand",
    "Malaysia",
    "Philippines",
    "Indonesia",
  ];

  // Generate order ID when component mounts
  useEffect(() => {
    const orderId = generateOrderId();
    setGeneratedOrderId(orderId);
  }, []);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
    country: "Thailand",
    saveForNextTime: false,
  });

  const subtotal = totalAmount || 0;
  const shipping = 16.99; // Worldwide flat rate
  const total = subtotal + shipping;

  // Balance validation logic
  const hasInsufficientBalance = wldBalance !== null && wldBalance < total;
  const shortfallAmount = hasInsufficientBalance ? total - wldBalance : 0;
  const canProceedWithPayment = wldBalance !== null && wldBalance >= total;

  const handleInputChange = (
    field: keyof ShippingAddress,
    value: string | boolean
  ) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayNow = async () => {
    // Prevent payment if balance is insufficient
    if (hasInsufficientBalance) {
      alert(
        `Insufficient WLD balance. You need ${shortfallAmount.toFixed(
          2
        )} more WLD to complete this purchase.`
      );
      return;
    }

    // Validate wallet address
    if (!address) {
      alert("Please connect your wallet to proceed with checkout.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Prepare checkout data according to API specification
      const checkoutData: CreateCheckoutRequest = {
        orderId: generatedOrderId, // Include the generated order ID
        walletAddress: address,
        email: shippingAddress.email,
        country: shippingAddress.country,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address: shippingAddress.address,
        apartment: shippingAddress.apartment || undefined,
        city: shippingAddress.city,
        postcode: shippingAddress.postalCode,
        phone: shippingAddress.phone,
        products: items.map((item) => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
        })),
      };

      console.log("Creating checkout with data:", checkoutData);

      // Create checkout via API
      const orderResponse = await createCheckout(checkoutData);

      if (!orderResponse) {
        throw new Error(checkoutError || "Failed to create checkout");
      }

      console.log("Checkout created successfully:", orderResponse);

      // TODO: Integrate with World ID and WLD payment processing
      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and redirect to success page
      clearCart();
      navigate("/order-success", {
        state: {
          orderData: orderResponse,
        },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Checkout failed. Please try again.";
      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isFormValid = () => {
    const formFieldsValid =
      shippingAddress.email &&
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.phone;

    return formFieldsValid && canProceedWithPayment;
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-lg mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Checkout
          </h2>
          {generatedOrderId && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Order ID:
                </span>
                <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                  {generatedOrderId}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {checkoutError && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">
              {checkoutError}
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className="pt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Contact
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={shippingAddress.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
          />
        </div>
        {/* Delivery Section */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Delivery
          </h2>

          {/* Country */}
          <div className="mb-4">
            <CountrySelector
              countries={availableCountries}
              selectedCountry={shippingAddress.country}
              onCountryChange={(country) =>
                handleInputChange("country", country)
              }
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="First name"
              value={shippingAddress.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              placeholder="Last name"
              value={shippingAddress.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
          />

          {/* Apartment */}
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={shippingAddress.apartment}
            onChange={(e) => handleInputChange("apartment", e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
          />

          {/* City and Postal Code */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              placeholder="Postal code (optional)"
              value={shippingAddress.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Phone */}
          <div className="relative mb-4">
            <input
              type="tel"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-12"
            />
            <HelpCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Shipping Method */}
        <div className="py-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Shipping method
          </h2>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-900 dark:text-gray-100">
              Worldwide Flat Rate
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {shipping.toFixed(2)} WLD
            </span>
          </div>
        </div>

        {/* Balance Information */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            WLD Balance
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {isBalanceLoading ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Current Balance
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  Loading...
                </span>
              </div>
            ) : balanceError ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Current Balance
                </span>
                <span className="text-red-600 dark:text-red-400">
                  Error loading balance
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current Balance
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {wldBalance?.toFixed(2) || "0.00"} WLD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Order Total
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {total.toFixed(2)} WLD
                  </span>
                </div>
                {hasInsufficientBalance && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between text-red-700 dark:text-red-400">
                      <span className="font-medium">
                        Need {shortfallAmount.toFixed(2)} more WLD
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Order summary
          </h2>

                     {items?.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center gap-4 mb-4"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">IMG</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {(item.productPrice * item.quantity).toFixed(2)} WLD
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="space-y-2 my-7">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-900 dark:text-gray-100">
                {subtotal} WLD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="text-gray-900 dark:text-gray-100">
                {shipping} WLD
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t border-gray-200 dark:border-gray-700 pt-5">
              <span className="text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-gray-900 dark:text-gray-100">
                {total.toFixed(2)} WLD
              </span>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handlePayNow}
          disabled={!isFormValid() || isProcessingPayment || isCheckoutLoading}
          className={`w-full py-4 rounded-full font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6 ${
            hasInsufficientBalance
              ? "bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800"
              : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          {isProcessingPayment || isCheckoutLoading
            ? "Processing WLD Payment..."
            : hasInsufficientBalance
            ? "Insufficient Balance"
            : "Pay now"}
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
