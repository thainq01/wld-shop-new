import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCart } from "../../hooks/useCart";
import { BottomNavigation } from "../BottomNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWLDBalance } from "../../hooks/useWLDBalance";
import { useCheckout } from "../../hooks/useCheckout";
import { useAuthWorld } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { useCountryStore, countries } from "../../store/countryStore";
import { generateOrderId } from "../../utils/orderIdGenerator";
import { productsApi } from "../../utils/api";
import type { CreateCheckoutRequest, Product, ProductImage } from "../../types";
import { WLDPaymentButton } from "../checkout/WLDPaymentButton";
import { CitySelector } from "../checkout/CitySelector";
import { getCitiesForCountry } from "../../data/cities";
import { PhoneInput } from "../PhoneInput";

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
  disabled = false,
  reason,
}: {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  disabled?: boolean;
  reason?: string;
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
        onClick={() => !disabled && setIsModalOpen(true)}
        whileHover={disabled ? {} : { scale: 1 }}
        whileTap={disabled ? {} : { scale: 1 }}
        className={`w-full px-4 py-4 border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 ${
          disabled
            ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-black dark:focus:ring-white"
        }`}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {disabled && <Lock className="w-4 h-4" />}
          <span>{selectedCountry || "Select Country"}</span>
        </div>
        {!disabled && (
          <motion.div
            animate={{ rotate: isModalOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        )}
      </motion.button>

      {/* Disabled reason message */}
      {disabled && reason && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {reason}
        </p>
      )}

      {/* Country Selection Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && !disabled && (
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
                scale: 1,
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
                scale: 1,
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
                      hidden: { opacity: 0, y: 20, scale: 1 },
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
                      scale: 1,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 1 }}
                    className="w-full p-4 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {country}
                    </span>
                    <AnimatePresence>
                      {selectedCountry === country && (
                        <motion.div
                          initial={{ opacity: 0, scale: 1, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 1, rotate: 90 }}
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

// CheckoutScreen now uses the shared country store for consistency

export const CheckoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, totalAmount, clearCart, refreshCart } = useCart();
  const { balance: wldBalance } = useWLDBalance();
  const { address } = useAuthWorld();
  const { currentLanguage } = useLanguageStore();
  const {
    selectedCountry,
    getCountryOption,
    setCountry,
    getCountryCodeFromName,
    getCountryFromLanguage,
    isManuallySelected,
  } = useCountryStore();
  const { createCheckout } = useCheckout();

  const [generatedOrderId, setGeneratedOrderId] = useState<string>("");
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  // Country-specific pricing state
  const [countrySpecificTotal, setCountrySpecificTotal] = useState<
    number | null
  >(null);
  const [itemPricing, setItemPricing] = useState<
    Record<string, { effectivePrice: number; itemTotal: number }>
  >({});
  const [countrySpecificProducts, setCountrySpecificProducts] = useState<
    Record<string, Product>
  >({});
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);

  // Available countries for shipping - use names from country store
  const availableCountries = countries.map((country) => country.name);

  // Get selected country name from country store
  const selectedCountryOption = getCountryOption(selectedCountry);
  const selectedCountryName = selectedCountryOption?.name || "Thailand";

  // Country selection is now fully interactive in checkout
  const isCountryAutoSelected = false;
  const countryDisabledReason = undefined;

  // Get available cities for the selected country
  const availableCities = getCitiesForCountry(selectedCountry);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
    country: selectedCountryName,
    saveForNextTime: false,
  });

  // Phone validation state
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Generate order ID when component mounts or language changes
  useEffect(() => {
    const orderId = generateOrderId();
    setGeneratedOrderId(orderId);
  }, [currentLanguage]);

  // Update country when selected country changes
  useEffect(() => {
    const newCountryName = selectedCountryName;
    setShippingAddress((prev) => ({
      ...prev,
      country: newCountryName,
    }));
  }, [selectedCountryName]);

  // Function to fetch country-specific pricing for all cart items
  const fetchCountrySpecificPricing = useCallback(
    async (countryCode: string) => {
      if (!items || items.length === 0) {
        setCountrySpecificTotal(0);
        return;
      }

      setIsPricingLoading(true);
      setPricingError(null);

      try {
        // Fetch pricing for each cart item
        const pricingPromises = items.map(async (item) => {
          try {
            // For checkout pricing, use selected country for both lang and country
            const product = await productsApi.getById(item.productId, {
              lang: countryCode,
              country: countryCode,
            });

            // Use countryPrice if available, otherwise use basePrice
            const effectivePrice = product.countryPrice ?? product.basePrice;
            const itemTotal = effectivePrice * item.quantity;

            console.log(
              `Product ${item.productId}: countryPrice=${product.countryPrice}, basePrice=${product.basePrice}, effectivePrice=${effectivePrice}, quantity=${item.quantity}, total=${itemTotal}`
            );

            return {
              productId: item.productId,
              effectivePrice,
              itemTotal,
              productData: product,
            };
          } catch (error) {
            console.error(
              `Failed to fetch pricing for product ${item.productId}:`,
              error
            );
            // Fallback to current item price if API call fails
            return {
              productId: item.productId,
              effectivePrice: item.productPrice,
              itemTotal: item.lineTotal,
              productData: null, // No updated data available
            };
          }
        });

        const pricingResults = await Promise.all(pricingPromises);

        // Create pricing map and product data map for individual items
        const newItemPricing: Record<
          string,
          { effectivePrice: number; itemTotal: number }
        > = {};
        const newProductData: Record<string, Product> = {};
        let newTotal = 0;

        pricingResults.forEach((result) => {
          newItemPricing[result.productId] = {
            effectivePrice: result.effectivePrice,
            itemTotal: result.itemTotal,
          };
          if (result.productData) {
            newProductData[result.productId] = result.productData;
          }
          newTotal += result.itemTotal;
        });

        setItemPricing(newItemPricing);
        setCountrySpecificProducts(newProductData);
        setCountrySpecificTotal(newTotal);
        console.log(`Country-specific total for ${countryCode}: ${newTotal}`);
      } catch (error) {
        console.error("Failed to fetch country-specific pricing:", error);
        setPricingError("Failed to load country-specific pricing");
        // Fallback to cart total
        setCountrySpecificTotal(totalAmount || 0);
      } finally {
        setIsPricingLoading(false);
      }
    },
    [items, totalAmount]
  );

  // Fetch country-specific pricing when component mounts, items change, or country changes
  useEffect(() => {
    if (items && items.length > 0) {
      fetchCountrySpecificPricing(selectedCountry);
    }
  }, [items, selectedCountry, fetchCountrySpecificPricing]);

  // Handle automatic country selection and show toast notification
  useEffect(() => {
    const expectedCountry = getCountryFromLanguage(currentLanguage);

    // If the country doesn't match the expected country for the current language
    // and it wasn't manually selected, update it automatically
    if (selectedCountry !== expectedCountry && !isManuallySelected) {
      console.log(
        `Auto-selecting country ${expectedCountry} for language ${currentLanguage}`
      );

      // Update the country (this will trigger price updates via the existing useEffect)
      setCountry(expectedCountry, false);

      // Show toast notification to inform user about automatic country selection
      const countryOption = getCountryOption(expectedCountry);
      if (countryOption) {
        toast.success(
          `Delivery country automatically set to ${countryOption.name} based on your language preference.`
        );
      }
    }
  }, [
    currentLanguage,
    selectedCountry,
    isManuallySelected,
    getCountryFromLanguage,
    setCountry,
    getCountryOption,
  ]);

  // Helper function to build checkout products with country-specific data
  const buildCheckoutProducts = () => {
    return items.map((item) => {
      const countrySpecificProduct = countrySpecificProducts[item.productId];
      const pricing = itemPricing[item.productId];

      return {
        productId: parseInt(item.productId),
        size: item.size || "Default",
        quantity: item.quantity,
        // Include country-specific product information if available
        ...(countrySpecificProduct && {
          productName: countrySpecificProduct.name,
          productDescription: countrySpecificProduct.description,
          effectivePrice: pricing?.effectivePrice || item.productPrice,
          countryCode: selectedCountry,
          language: selectedCountry, // Use selected country as language for checkout
        }),
      };
    });
  };

  // Use country-specific total if available, otherwise fall back to cart total
  const subtotal =
    countrySpecificTotal !== null ? countrySpecificTotal : totalAmount || 0;
  const total = subtotal;

  // Balance validation logic
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

  // Special handler for country changes that also updates the country store and refreshes pricing
  const handleCountryChange = async (countryName: string) => {
    // Update shipping address and reset city when country changes
    handleInputChange("country", countryName);
    handleInputChange("city", ""); // Reset city when country changes

    // Find the country code from the country name using the helper function
    const countryCode = getCountryCodeFromName(countryName);
    if (countryCode) {
      // Update the shared country store (mark as manually selected)
      setCountry(countryCode, true);

      // Fetch country-specific pricing for the new country
      try {
        await fetchCountrySpecificPricing(countryCode);
        console.log("Country-specific pricing updated for:", countryCode);
      } catch (error) {
        console.error(
          "Failed to fetch country-specific pricing after country change:",
          error
        );
        // Could show a toast notification here if needed
      }

      // Also refresh cart with new country pricing
      try {
        await refreshCart();
        console.log("Cart refreshed with new country pricing:", countryCode);
      } catch (error) {
        console.error("Failed to refresh cart after country change:", error);
      }
    }
  };

  // Handler for city changes
  const handleCityChange = (cityName: string) => {
    handleInputChange("city", cityName);
  };

  // Handler for phone changes with validation
  const handlePhoneChange = (value: string, isValid: boolean) => {
    setShippingAddress((prev) => ({
      ...prev,
      phone: value,
    }));
    setIsPhoneValid(isValid);
  };

  const isFormValid = () => {
    const formFieldsValid =
      shippingAddress.email &&
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.phone &&
      isPhoneValid; // Add phone validation check

    return formFieldsValid && canProceedWithPayment;
  };

  if ((!items || items.length === 0) && !checkoutCompleted) {
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
        </div>

        {/* Contact Section */}
        <div className="pt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("contact")}
          </h2>
          <input
            type="email"
            placeholder={t("email")}
            value={shippingAddress.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          />
        </div>
        {/* Delivery Section */}
        <div className="py-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("delivery")}
          </h2>

          {/* Country */}
          <div className="mb-4">
            <CountrySelector
              countries={availableCountries}
              selectedCountry={shippingAddress.country}
              onCountryChange={handleCountryChange}
              disabled={isCountryAutoSelected}
              reason={countryDisabledReason}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t("firstName")}
              value={shippingAddress.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
            />
            <input
              type="text"
              placeholder={t("lastName")}
              value={shippingAddress.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
            />
          </div>

          {/* Address */}
          <input
            type="text"
            placeholder={t("address")}
            value={shippingAddress.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          />

          {/* Apartment */}
          <input
            type="text"
            placeholder={t("apartment")}
            value={shippingAddress.apartment}
            onChange={(e) => handleInputChange("apartment", e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          />

          {/* City and Postal Code */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <CitySelector
              cities={availableCities}
              selectedCity={shippingAddress.city}
              onCityChange={handleCityChange}
              disabled={availableCities.length === 0}
              reason={
                availableCities.length === 0
                  ? "No cities available for selected country"
                  : undefined
              }
            />
            <input
              type="text"
              placeholder={t("postalCode")}
              value={shippingAddress.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <PhoneInput
              value={shippingAddress.phone}
              onChange={handlePhoneChange}
              countryCode={selectedCountry}
              placeholder={t("phone")}
              required={true}
              showValidation={true}
            />
          </div>
        </div>

        {/* Shipping Method */}
        <div className="py-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("shippingMethod")}
          </h2>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-900 dark:text-gray-100">
              {t("worldwideFlatRate")}
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {t("freeship")}
            </span>
          </div>
        </div>

        {/* Balance Information */}
        {/* <div className="py-6 border-t border-gray-200 dark:border-gray-700">
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
        </div> */}

        {/* Order Summary */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("orderSummary")}
          </h2>

          {items?.map((item) => {
            const countryProduct = countrySpecificProducts[item.productId];
            const productImage =
              countryProduct?.images?.find((img: ProductImage) => img.isPrimary)
                ?.url ||
              countryProduct?.images?.[0]?.url ||
              item.productImage;

            return (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex items-center gap-4 mb-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={countryProduct?.name || item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                          const nextElement =
                            target.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                      style={{ display: productImage ? "none" : "flex" }}
                    >
                      <span className="text-gray-500 text-xs font-medium">
                        {(countryProduct?.name || item.productName)?.charAt(
                          0
                        ) || "P"}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {countrySpecificProducts[item.productId]?.name ||
                      item.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("size")}: {item.size}
                    {itemPricing[item.productId] && (
                      <span className="ml-2 text-xs">
                        ({itemPricing[item.productId].effectivePrice.toFixed(2)}{" "}
                        WLD each)
                      </span>
                    )}
                  </p>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {isPricingLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 dark:border-gray-400"></div>
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : (
                    `${(
                      itemPricing[item.productId]?.itemTotal ??
                      item.productPrice * item.quantity
                    ).toFixed(2)} WLD`
                  )}
                </span>
              </div>
            );
          })}

          {/* Totals */}
          <div className="space-y-2 my-7">
            {countrySpecificTotal !== null && (
              <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                {t("pricesUpdatedFor", {
                  country:
                    getCountryOption(selectedCountry)?.name || selectedCountry,
                })}
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {t("subtotal")}
              </span>
              <span className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {isPricingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 dark:border-gray-400"></div>
                    <span className="text-sm">{t("loading")}</span>
                  </>
                ) : (
                  `${subtotal.toFixed(2)} WLD`
                )}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-600 dark:text-gray-400">
                {t("shipping")}
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {t("freeship")}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t border-gray-200 dark:border-gray-700 pt-5">
              <span className="text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {isPricingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                    <span className="text-sm">Updating...</span>
                  </>
                ) : (
                  <>
                    {total.toFixed(2)} WLD
                    {pricingError && (
                      <span className="text-xs text-red-500 ml-1">*</span>
                    )}
                  </>
                )}
              </span>
            </div>
            {pricingError && (
              <div className="text-xs text-red-500 mt-1">
                *Using fallback pricing due to error
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          {/* WLD Payment Button */}
          <WLDPaymentButton
            amount={total}
            orderId={generatedOrderId}
            wldBalance={wldBalance}
            disabled={!isFormValid()}
            onPaymentSuccess={async (txHash) => {
              console.log("✅ WLD Payment successful:", txHash);

              try {
                // Create checkout after successful payment
                const checkoutData: CreateCheckoutRequest = {
                  orderId: generatedOrderId,
                  walletAddress: address!,
                  email: shippingAddress.email,
                  country: shippingAddress.country,
                  firstName: shippingAddress.firstName,
                  lastName: shippingAddress.lastName,
                  address: shippingAddress.address,
                  apartment: shippingAddress.apartment || undefined,
                  city: shippingAddress.city,
                  postcode: shippingAddress.postalCode,
                  phone: shippingAddress.phone,
                  language: currentLanguage,
                  totalAmount: total.toFixed(2),
                  status: "paid",
                  transactionHash: txHash,
                  products: buildCheckoutProducts(),
                };

                const orderResponse = await createCheckout(checkoutData);

                if (orderResponse) {
                  setCheckoutCompleted(true);

                  const successData = {
                    success: true,
                    data: orderResponse,
                    statusCode: 200,
                  };

                  navigate("/order-success", {
                    state: { orderData: successData },
                    replace: true,
                  });

                  setTimeout(() => clearCart(), 200);
                }
              } catch (error) {
                console.error(
                  "❌ Failed to create checkout after payment:",
                  error
                );
                toast.error(
                  "Payment successful but failed to create order. Please contact support."
                );
              }
            }}
            onPaymentError={(error) => {
              console.error("❌ WLD Payment failed:", error);
              toast.error(`Payment failed: ${error}`);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
