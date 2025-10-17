import { useLanguageStore } from "../store/languageStore";

// Language to country code mapping for order IDs
const LANGUAGE_TO_COUNTRY_CODE: Record<string, string> = {
  en: "th", // English → Thailand (consistent with country store)
  th: "th", // Thailand
  ms: "my", // Malaysia (using 'my' for order IDs)
  ph: "ph", // Philippines
  id: "id", // Indonesia
};

/**
 * Generates a unique order ID based on the user's current language
 * Format: {countryCode}{uuid-short}
 * Example: "th-a1b2c3", "my-d4e5f6", "ph-x9y8z7"
 */
export function generateOrderId(): string {
  const currentLanguage = useLanguageStore.getState().currentLanguage;
  const countryCode = LANGUAGE_TO_COUNTRY_CODE[currentLanguage] || "th";

  // Generate a short UUID (first 8 characters) - includes both letters and numbers
  const uuid = crypto.randomUUID().replace(/-/g, "").substring(0, 8);

  return `${countryCode}${uuid}`;
}

/**
 * Generates a unique order ID for giftcard orders
 * Format: GC{random-8-chars}
 * Example: "GCa1b2c3d4", "GCx9y8z7w6"
 */
export function generateGiftcardOrderId(): string {
  // Generate a short UUID (first 8 characters) - includes both letters and numbers
  const uuid = crypto.randomUUID().replace(/-/g, "").substring(0, 8);

  return `GC${uuid}`;
}

/**
 * Generates a unique order ID using UUID for more uniqueness
 * Format: {countryCode}{uuid-short}
 * Example: "th-a1b2c3", "my-d4e5f6", "ph-x9y8z7"
 */
export function generateOrderIdWithUUID(): string {
  const currentLanguage = useLanguageStore.getState().currentLanguage;
  const countryCode = LANGUAGE_TO_COUNTRY_CODE[currentLanguage] || "th";

  // Generate a short UUID (first 8 characters) - includes both letters and numbers
  const uuid = crypto.randomUUID().replace(/-/g, "").substring(0, 8);

  return `${countryCode}${uuid}`;
}

/**
 * Generates a unique order ID with timestamp for better tracking
 * Format: {countryCode}{timestamp}{random}
 * Example: "th20241201123456789", "my20241201123456789"
 */
export function generateOrderIdWithTimestamp(): string {
  const currentLanguage = useLanguageStore.getState().currentLanguage;
  const countryCode = LANGUAGE_TO_COUNTRY_CODE[currentLanguage] || "th";

  // Get current timestamp (YYYYMMDDHHMMSS)
  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");

  // Add 3 random digits for uniqueness
  const random = Math.floor(100 + Math.random() * 900);

  return `${countryCode}${timestamp}${random}`;
}

/**
 * Generates a unique order ID with alphanumeric characters in a readable format
 * Format: {countryCode}-{4-letters}-{4-numbers}
 * Example: "th-ABCD-1234", "my-XYZW-5678", "ph-MNOP-9012"
 */
export function generateOrderIdAlphanumeric(): string {
  const currentLanguage = useLanguageStore.getState().currentLanguage;
  const countryCode = LANGUAGE_TO_COUNTRY_CODE[currentLanguage] || "th";

  // Generate 4 random uppercase letters
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  // Generate 4 random numbers
  const numbers = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return `${countryCode}-${letters}-${numbers}`;
}
