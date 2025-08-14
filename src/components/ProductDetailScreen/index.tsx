import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Share,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail, useAddToCart } from "./data";
import { ExpandableSection } from "./types";
import { useCartStore } from "../../store/cartStore";

// Product image component - reused from other components
function ProductImage({
  type,
  className = "",
}: {
  type: string;
  className?: string;
}) {
  const baseClasses = `w-full h-full bg-black flex items-center justify-center ${className}`;

  switch (type) {
    case "hoodie-front":
    case "hoodie-back":
    case "hoodie-detail":
    case "hoodie":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-12 bg-black border-2 border-gray-600 rounded-t-full mx-auto"></div>
            <div className="w-24 h-20 bg-black border-2 border-gray-600 rounded-t-2xl -mt-1 mx-auto"></div>
            <div className="absolute top-4 -left-4 w-8 h-16 bg-black border-2 border-gray-600 rounded-l-xl"></div>
            <div className="absolute top-4 -right-4 w-8 h-16 bg-black border-2 border-gray-600 rounded-r-xl"></div>
            {type.includes("front") && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs text-white font-mono">
                unique human
              </div>
            )}
          </div>
        </div>
      );
    case "tshirt-front":
    case "tshirt-back":
    case "tshirt-detail":
    case "tshirt":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-24 bg-black border-2 border-gray-600 rounded-t-lg mx-auto"></div>
            <div className="absolute -top-2 -left-4 w-8 h-10 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="absolute -top-2 -right-4 w-8 h-10 bg-black border-2 border-gray-600 rounded-t-lg"></div>
          </div>
        </div>
      );
    case "hat-front":
    case "hat-side":
    case "hat-detail":
    case "hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-10 bg-black border-2 border-gray-600 rounded-full mx-auto"></div>
            <div className="w-24 h-3 bg-black border-2 border-gray-600 rounded-full mt-1 mx-auto"></div>
          </div>
        </div>
      );
    case "crewneck-front":
    case "crewneck-back":
    case "crewneck-detail":
    case "crewneck":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-16 bg-black border-2 border-gray-600 rounded-t-lg mx-auto"></div>
            <div className="w-22 h-20 bg-black border-2 border-gray-600 rounded-t-xl -mt-1 mx-auto"></div>
            <div className="absolute top-3 -left-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-l-lg"></div>
            <div className="absolute top-3 -right-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-r-lg"></div>
          </div>
        </div>
      );
    case "bot-hat-front":
    case "bot-hat-side":
    case "bot-hat-detail":
    case "bot-hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-10 bg-black border-2 border-gray-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xs text-blue-400 font-bold">NOT</span>
            </div>
            <div className="w-24 h-3 bg-black border-2 border-gray-600 rounded-full mt-1 mx-auto"></div>
          </div>
        </div>
      );
    default:
      return <div className={baseClasses}></div>;
  }
}

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900">
    {/* Header */}
    <div className="flex items-center justify-between p-4">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    </div>

    {/* Image */}
    <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse mx-4 mt-4 rounded-2xl"></div>

    {/* Content */}
    <div className="p-4 space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

// Error component
const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-white rounded-lg bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Expandable section component
const ExpandableSectionComponent = ({
  title,
  content,
  isExpanded,
  onToggle,
}: {
  title: string;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
    {isExpanded && (
      <div className="pb-4">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {content}
        </p>
      </div>
    )}
  </div>
);

// Size selector component
const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeChange,
}: {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800"
      >
        <span className="text-gray-900 dark:text-gray-100">
          {selectedSize || "Select Size"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                onSizeChange(size);
                setIsOpen(false);
              }}
              className={`w-full p-4 text-left bg-gray-50 dark:bg-gray-700 transition-colors ${
                selectedSize === size ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductDetailScreen: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { productDetail, isLoading, error, refetch } = useProductDetail(
    productId || ""
  );
  const { addToCart } = useAddToCart();
  const { getCartItemCount } = useCartStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Set<ExpandableSection>
  >(new Set(["about"]));
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const toggleSection = (section: ExpandableSection) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddToCart = async () => {
    if (!productDetail) return;

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart(productDetail, selectedSize);
      // Could add success feedback here
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !productDetail)
    return (
      <ErrorState error={error || "Product not found"} onRetry={refetch} />
    );

  const cartItemCount = getCartItemCount();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
            <Share className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={() => {
              // TODO: Navigate to cart screen when implemented
              console.log("Navigate to cart");
            }}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative mx-4 mt-4">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
          <ProductImage
            type={productDetail.images[currentImageIndex]}
            className="rounded-2xl"
          />
        </div>

        {/* Image indicators */}
        {productDetail.images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {productDetail.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-gray-900 dark:bg-gray-100"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {productDetail.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          USD {productDetail.price.toFixed(2)}
        </p>

        {/* Size Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Size
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selectedSize}
            </span>
          </div>
          <SizeSelector
            sizes={productDetail.sizes}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />
        </div>

        {/* Expandable Sections */}
        <div className="space-y-0">
          <ExpandableSectionComponent
            title="About"
            content={productDetail.description}
            isExpanded={expandedSections.has("about")}
            onToggle={() => toggleSection("about")}
          />

          {expandedSections.has("about") && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Made by
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {productDetail.madeBy}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-gray-400">📦</div>
                  <span className="text-gray-600 dark:text-gray-300">
                    In stock
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {productDetail.inStock}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-gray-400">👕</div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Collection
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {productDetail.category}
                </span>
              </div>
            </div>
          )}

          <ExpandableSectionComponent
            title="Material"
            content={productDetail.material}
            isExpanded={expandedSections.has("material")}
            onToggle={() => toggleSection("material")}
          />

          <ExpandableSectionComponent
            title="Size & Fit"
            content={productDetail.sizeAndFit}
            isExpanded={expandedSections.has("sizeAndFit")}
            onToggle={() => toggleSection("sizeAndFit")}
          />

          <ExpandableSectionComponent
            title="Other Details"
            content={productDetail.otherDetails}
            isExpanded={expandedSections.has("otherDetails")}
            onToggle={() => toggleSection("otherDetails")}
          />
        </div>

        {/* Add to Cart Button */}
        <div className="mt-8 mb-8">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedSize}
            className={`w-full py-4 rounded-full font-semibold text-lg transition-colors ${
              isAddingToCart || !selectedSize
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}
          >
            {isAddingToCart ? "Adding..." : "Add to bag"}
          </button>
        </div>
      </div>
    </div>
  );
};
