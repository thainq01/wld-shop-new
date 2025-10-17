import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  PhoneNumber,
} from "google-libphonenumber";
import type { CountryCode } from "../store/countryStore";

const phoneUtil = PhoneNumberUtil.getInstance();

// Map our country codes to ISO country codes for libphonenumber
const countryCodeMap: Record<CountryCode, string> = {
  th: "TH", // Thailand
  ms: "MY", // Malaysia
  ph: "PH", // Philippines
  id: "ID", // Indonesia
  vn: "VN", // Vietnam
  en: "TH", // English defaults to Thailand
};

export interface PhoneValidationResult {
  isValid: boolean;
  error: string | null;
  formattedNumber?: string;
}

/**
 * Validate a phone number for a specific country
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode
): PhoneValidationResult {
  if (!phoneNumber || phoneNumber.trim() === "") {
    return {
      isValid: false,
      error: "Phone number is required",
    };
  }

  try {
    const isoCountryCode = countryCodeMap[countryCode];
    const parsedNumber = phoneUtil.parse(phoneNumber, isoCountryCode);

    // Check if the number is valid for the country
    const isValid = phoneUtil.isValidNumberForRegion(
      parsedNumber,
      isoCountryCode
    );

    if (!isValid) {
      return {
        isValid: false,
        error: "Invalid phone number for selected country",
      };
    }

    // Format the number for display
    const formattedNumber = phoneUtil.format(
      parsedNumber,
      PhoneNumberFormat.NATIONAL
    );

    return {
      isValid: true,
      error: null,
      formattedNumber,
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid phone number format",
    };
  }
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode,
  format: "national" | "international" = "national"
): string {
  try {
    const isoCountryCode = countryCodeMap[countryCode];
    const parsedNumber = phoneUtil.parse(phoneNumber, isoCountryCode);

    if (phoneUtil.isValidNumber(parsedNumber)) {
      const phoneFormat =
        format === "international"
          ? PhoneNumberFormat.INTERNATIONAL
          : PhoneNumberFormat.NATIONAL;

      return phoneUtil.format(parsedNumber, phoneFormat);
    }

    return phoneNumber; // Return original if can't format
  } catch (error) {
    return phoneNumber; // Return original if can't format
  }
}

/**
 * Get country calling code for display
 */
export function getCountryCallingCode(countryCode: CountryCode): string {
  try {
    const isoCountryCode = countryCodeMap[countryCode];
    const callingCode = phoneUtil.getCountryCodeForRegion(isoCountryCode);
    return `+${callingCode}`;
  } catch (error) {
    return "+66"; // Default to Thailand
  }
}

/**
 * Get example phone number for a country
 */
export function getExamplePhoneNumber(countryCode: CountryCode): string {
  try {
    const isoCountryCode = countryCodeMap[countryCode];
    const exampleNumber = phoneUtil.getExampleNumber(isoCountryCode);

    if (exampleNumber) {
      return phoneUtil.format(exampleNumber, PhoneNumberFormat.NATIONAL);
    }

    // Fallback examples
    const examples: Record<CountryCode, string> = {
      th: "02 123 4567",
      ms: "03-1234 5678",
      ph: "(02) 1234 5678",
      id: "021 1234 5678",
      vn: "024 1234 5678",
      en: "02 123 4567",
    };

    return examples[countryCode];
  } catch (error) {
    return "02 123 4567"; // Default example
  }
}

/**
 * Check if a phone number is possible (basic format check)
 */
export function isPossiblePhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode
): boolean {
  try {
    const isoCountryCode = countryCodeMap[countryCode];
    const parsedNumber = phoneUtil.parse(phoneNumber, isoCountryCode);
    return phoneUtil.isPossibleNumber(parsedNumber);
  } catch (error) {
    return false;
  }
}

/**
 * Parse phone number and return PhoneNumber object
 */
export function parsePhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode
): PhoneNumber | null {
  try {
    const isoCountryCode = countryCodeMap[countryCode];
    return phoneUtil.parse(phoneNumber, isoCountryCode);
  } catch (error) {
    return null;
  }
}

/**
 * Get international format of phone number
 */
export function getInternationalFormat(
  phoneNumber: string,
  countryCode: CountryCode
): string {
  return formatPhoneNumber(phoneNumber, countryCode, "international");
}
