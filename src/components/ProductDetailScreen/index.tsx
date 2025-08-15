import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  Share,
  UserRoundCheck,
  Package,
  Shirt,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ExpandableSection } from "./types";
import { useCartStore } from "../../store/cartStore";
import { useProductStore } from "../../store/productStore";

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
    <motion.button
      onClick={onToggle}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <motion.div
        className="flex-shrink-0 ml-4"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </motion.div>
    </motion.button>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.2 },
          }}
          className="overflow-hidden"
        >
          <div className="pb-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {content}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSizeSelect = (size: string) => {
    onSizeChange(size);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Size Selector Button - Inline Style */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 text-gray-900 dark:text-gray-100 focus:outline-none"
      >
        <span className="text-lg font-semibold">
          {selectedSize || "Select Size"}
        </span>
        <motion.div
          animate={{ rotate: isModalOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Size Selection Modal */}
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Select size
                </motion.h2>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    rotate: 90,
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Size Options */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
              >
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
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
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {size}
                    </span>
                    <AnimatePresence>
                      {selectedSize === size && (
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
                          <svg
                            className="w-4 h-4 text-white dark:text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
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

export const ProductDetailScreen: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const {
    currentProduct: productDetail,
    isLoading,
    error,
    fetchProductDetail,
  } = useProductStore();
  const { addToCart, getCartItemCount } = useCartStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Set<ExpandableSection>
  >(new Set(["about"]));
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product detail when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      fetchProductDetail(productId);
    }
  }, [productId, fetchProductDetail]);

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
      toast.error("Please select a size");
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart({
        productId: productDetail.id,
        productName: productDetail.name,
        productPrice: productDetail.price,
        productImage: productDetail.images[0],
        size: selectedSize,
      });
      toast.success(`${productDetail.name} added to bag!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !productDetail)
    return (
      <ErrorState
        error={error || "Product not found"}
        onRetry={() => productId && fetchProductDetail(productId)}
      />
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
            onClick={() => navigate("/bag")}
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
          {/* Check if image is a URL (from Dog CEO API) or placeholder */}
          {productDetail.images[currentImageIndex]?.startsWith("http") ? (
            <img
              src={productDetail.images[currentImageIndex]}
              alt={`${productDetail.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ProductImage
              type={productDetail.images[currentImageIndex]}
              className="rounded-2xl"
            />
          )}
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
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Size
            </span>
            <SizeSelector
              sizes={productDetail.sizes}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>
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
            <div className="pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserRoundCheck className="w-5 h-5 text-gray-400" />
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
                  <Package className="w-5 h-5 text-gray-400" />
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
                  <Shirt className="w-5 h-5 text-gray-400" />
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
