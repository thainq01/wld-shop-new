import React from "react";
import { ShoppingBag, Minus, Plus, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { BottomNavigation } from "../BottomNavigation";
import { LoginButton } from "../LoginButton";
import { useTranslation } from "react-i18next";

// Simple placeholder component for product images in cart
const ProductImagePlaceholder: React.FC<{
  productName: string;
  productImage?: string;
}> = ({ productName, productImage }) => {
  if (productImage) {
    return (
      <img
        src={productImage}
        alt={productName}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Show placeholder if image fails to load
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  // Default placeholder for missing images
  return (
    <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400 text-xs text-center px-2">
        No Image
      </span>
    </div>
  );
};

export const BagScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalAmount,
    isLoading,
    error,
    hasWallet,
  } = useCart();

  // Show cart layout even when empty to prevent flickering
  const showCartLayout = hasWallet && (items?.length > 0 || isLoading);

  if (!hasWallet) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Content centered in screen */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-sm">
            {/* Clock icon (matching empty state style) */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
              <Clock className="w-16 h-16 text-white" />
            </div>

            {/* Login required text */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("loginRequired")}
            </h2>

            {/* Description text */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              {t("signInWithWorldId")}
            </p>

            {/* Login button */}
            <LoginButton />
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // Loading state - only show full screen loader if no items exist
  if (isLoading && (!items || items.length === 0)) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("loadingCart")}
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Error loading cart
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Empty state when no items in cart - only show if not loading and we have a wallet
  if (!isLoading && hasWallet && items?.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Content centered in screen */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-md">
            {/* Shopping bag icon */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>

            {/* No items text */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("noItemsYet")}
            </h2>

            {/* Description text */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              {t("itemsDisplayedHere")}
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/explore")}
                className="w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {t("explore")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // Cart layout (with or without items to prevent flickering)
  if (showCartLayout) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <div className="flex-1 pb-20">
          {/* Header */}
          <div className="px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t("yourBag")} ({items?.length || 0}{" "}
                {(items?.length || 0) === 1 ? t("item") : t("items")})
              </h2>
            </div>
          </div>

          {/* Cart items or empty state within cart layout */}
          <div className="flex-1">
            {items && items.length > 0 ? (
              // Cart items
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  {/* Product Image - 40% ratio */}
                  <div
                    className="bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 aspect-square overflow-hidden"
                    style={{ flexBasis: "40%" }}
                  >
                    <ProductImagePlaceholder
                      productName={item.productName}
                      productImage={item.productImage}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {item.productPrice} WLD
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {t("size")}: {item.size}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={async () => {
                          try {
                            if (item.quantity === 1) {
                              await removeFromCart(item.id);
                            } else {
                              await updateQuantity(item.id, item.quantity - 1);
                            }
                          } catch (error) {
                            console.error(
                              "Error in cart operation (decrease):",
                              error
                            );
                          }
                        }}
                        disabled={isLoading}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                          isLoading
                            ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>

                      <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </span>

                      <button
                        onClick={async () => {
                          try {
                            await updateQuantity(item.id, item.quantity + 1);
                          } catch (error) {
                            console.error(
                              "Error in cart operation (increase):",
                              error
                            );
                          }
                        }}
                        disabled={isLoading}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                          isLoading
                            ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty state within cart layout
              <div className="flex items-center justify-center px-4 py-12">
                <div className="text-center max-w-md">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t("noItemsYet")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t("itemsDisplayedHere")}
                  </p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    {t("explore")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Total and checkout - Fixed at bottom */}
          <div className="sticky bottom-20 bg-white dark:bg-gray-900 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("total")}:
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {(totalAmount || 0).toFixed(2)} WLD
              </span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              disabled={!items || items.length === 0}
              className={`w-full py-4 rounded-full font-semibold text-lg transition-colors ${
                items && items.length > 0
                  ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {t("checkout")}
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }
};
