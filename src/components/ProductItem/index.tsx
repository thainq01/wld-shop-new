import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductItemProps } from "./types";
import { PriceDisplay } from "../PriceDisplay";
import { getBasePrice } from "../../utils/priceUtils";
// Product type is imported via ProductItemProps

function ProductImage({ type }: { type: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const baseClasses = "w-full h-full bg-black flex items-center justify-center";

  if (type?.startsWith("http")) {
    return (
      <div className="relative w-full h-full">
        {/* Blur-up placeholder */}
        {!isLoaded && (
          <div
            className="absolute inset-0 bg-gray-300 dark:bg-gray-600"
            style={{
              filter: "blur(15px)",
              transform: "scale(1.1)",
              transition: "opacity 400ms ease-out",
            }}
          />
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              <svg
                className="w-6 h-6 mx-auto mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>No image</span>
            </div>
          </div>
        )}

        {/* Actual image */}
        <img
          src={type}
          alt="Product"
          className="w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={() => {
            setIsLoaded(false);
            setHasError(true);
          }}
        />
      </div>
    );
  }

  switch (type) {
    case "hoodie":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-10 bg-black border-2 border-gray-600 rounded-t-full"></div>
            <div className="w-20 h-16 bg-black border-2 border-gray-600 rounded-t-2xl -mt-1"></div>
            <div className="absolute top-3 -left-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-l-xl"></div>
            <div className="absolute top-3 -right-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-r-xl"></div>
          </div>
        </div>
      );
    case "tshirt":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-20 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="absolute -top-2 -left-4 w-6 h-8 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="absolute -top-2 -right-4 w-6 h-8 bg-black border-2 border-gray-600 rounded-t-lg"></div>
          </div>
        </div>
      );
    case "hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-8 bg-black border-2 border-gray-600 rounded-full"></div>
            <div className="w-20 h-2 bg-black border-2 border-gray-600 rounded-full mt-1"></div>
          </div>
        </div>
      );
    case "crewneck":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-12 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="w-18 h-16 bg-black border-2 border-gray-600 rounded-t-xl -mt-1"></div>
            <div className="absolute top-2 -left-2 w-5 h-10 bg-black border-2 border-gray-600 rounded-l-lg"></div>
            <div className="absolute top-2 -right-2 w-5 h-10 bg-black border-2 border-gray-600 rounded-r-lg"></div>
          </div>
        </div>
      );
    case "bot-hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-8 bg-black border-2 border-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-blue-400 font-bold">NOT</span>
            </div>
            <div className="w-20 h-2 bg-black border-2 border-gray-600 rounded-full mt-1"></div>
          </div>
        </div>
      );
    default:
      return <div className={baseClasses}></div>;
  }
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePress = () => {
    navigate(`/product/${product.id}`);
  };

  // Get the primary image, fallback to first image if no primary is set
  const getProductImage = () => {
    if (!product.images || product.images.length === 0) return "";

    // Find primary image
    const primaryImage = product.images.find((img) => img.isPrimary);
    if (primaryImage) return primaryImage.url;

    // Fallback to first image
    return product.images[0]?.url || "";
  };

  return (
    <button
      onClick={handlePress}
      className={`flex items-center gap-4 p-1 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors`}
    >
      {/* Product Image */}
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden flex-shrink-0 relative">
        <ProductImage type={getProductImage()} />
        {/* Featured badge overlay */}
        {product.featured && (
          <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            ★
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`${
              product.inStock == "Out of Stock"
                ? "text-red-500"
                : "text-blue-500"
            } text-sm font-medium`}
          >
            {product.inStock === "Out of Stock"
              ? t("outOfStock")
              : t("inStock")}
          </div>
          {product.featured && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full font-medium">
              {t("featured")}
            </span>
          )}
        </div>
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h4>
        <div className="text-gray-500 dark:text-gray-400">
          <PriceDisplay
            price={getBasePrice(product)}
            discountPrice={product.discountPrice}
            size="small"
          />
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
    </button>
  );
};
