import React from "react";
import { hasValidDiscount } from "../utils/priceUtils";

interface PriceDisplayProps {
  /** Regular price from API (basePrice, effectivePrice, countryPrice, or price) */
  price: number;
  /** Discount price from API (discountPrice field) */
  discountPrice?: number;
  /** Additional CSS classes for customization */
  className?: string;
  /** Size variant for different use cases */
  size?: "small" | "medium" | "large";
  /** Whether to show currency unit */
  showCurrency?: boolean;
  /** Whether to render the small savings percentage badge */
  showSavingsBadge?: boolean;
}

/**
 * PriceDisplay Component
 *
 * Displays product pricing with discount logic:
 * - If discountPrice is 0 or undefined: show regular price only
 * - If discountPrice > 0: show crossed-out regular price and highlighted discount price
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discountPrice,
  className = "",
  size = "medium",
  showCurrency = true,
  showSavingsBadge = true,
}) => {
  const hasDiscount = hasValidDiscount(price, discountPrice);

  // Size-based styling
  const sizeStyles = {
    small: {
      regular: "text-sm",
      discount: "text-sm font-bold text-red-600 dark:text-red-400",
      originalStrikethrough:
        "text-xs text-gray-500 dark:text-gray-400 line-through",
    },
    medium: {
      regular: "text-base",
      discount: "text-base font-bold text-red-600 dark:text-red-400",
      originalStrikethrough:
        "text-sm text-gray-500 dark:text-gray-400 line-through",
    },
    large: {
      regular: "text-xl",
      discount: "text-xl font-bold text-red-600 dark:text-red-400",
      originalStrikethrough:
        "text-base text-gray-500 dark:text-gray-400 line-through",
    },
  };

  const styles = sizeStyles[size];
  const currency = showCurrency ? " WLD" : "";

  if (!hasDiscount) {
    // Show regular price only
    return (
      <span className={`${styles.regular} ${className}`}>
        {price.toFixed(2)}
        {currency}
      </span>
    );
  }

  // Calculate savings
  const savings = price - discountPrice!;
  const savingsPercentage = Math.round((savings / price) * 100);

  // Show discount price with crossed-out original price and optional savings info
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={styles.originalStrikethrough}>
        {price.toFixed(2)}
        {currency}
      </span>
      <span className={styles.discount}>
        {discountPrice!.toFixed(2)}
        {currency}
      </span>
      {showSavingsBadge && (
        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded font-medium">
          -{savingsPercentage}%
        </span>
      )}
    </div>
  );
};
