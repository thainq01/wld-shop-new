import React from "react";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { BottomNavigation } from "../BottomNavigation";

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
  const { items, removeFromCart, updateQuantity, getCartTotal } =
    useCartStore();

  // Empty state when no items in cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Content centered in screen */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-sm">
            {/* Shopping bag icon */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>

            {/* No items text */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No items yet
            </h2>

            {/* Description text */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              Your items will be displayed here
            </p>

            {/* Explore store button */}
            <button
              onClick={() => navigate("/explore")}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="px-4 pt-6 pb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Your Bag ({items.length} item{items.length !== 1 ? "s" : ""})
          </h2>
        </div>

        {/* Cart items */}
        <div className="flex-1">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center gap-4 p-4"
            >
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
                  Size: {item.size}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.productId, item.size);
                      } else {
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1
                        );
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.quantity + 1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total and checkout - Fixed at bottom */}
        <div className="sticky bottom-20 bg-white dark:bg-gray-900 p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Total:
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {getCartTotal().toFixed(2)} WLD
            </span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
