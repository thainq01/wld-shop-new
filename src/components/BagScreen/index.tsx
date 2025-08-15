import React, { useState, useEffect } from "react";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { BottomNavigation } from "../BottomNavigation";

// Function to fetch random dog image
const fetchRandomDogImage = async (): Promise<string> => {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Failed to fetch random dog image:", error);
    return "";
  }
};

// Component for displaying random dog images for products
const ProductImage: React.FC<{ productId: string; productName: string }> = ({
  productId,
  productName,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we already have an image cached in localStorage
    const cachedImage = localStorage.getItem(`product-image-${productId}`);
    if (cachedImage) {
      setImageUrl(cachedImage);
      setIsLoading(false);
    } else {
      // Fetch new random image and cache it
      fetchRandomDogImage().then((url) => {
        if (url) {
          setImageUrl(url);
          localStorage.setItem(`product-image-${productId}`, url);
        }
        setIsLoading(false);
      });
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={productName}
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback for broken images
        e.currentTarget.style.display = "none";
      }}
    />
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
              Explore store
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
                <ProductImage
                  productId={item.productId}
                  productName={item.productName}
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ${item.productPrice.toFixed(2)}
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
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Checkout
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
