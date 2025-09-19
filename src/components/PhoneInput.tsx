import React, { useState, useEffect, useCallback } from "react";
import { Phone, AlertCircle } from "lucide-react";
import {
  validatePhoneNumber,
  formatPhoneNumber,
  getCountryCallingCode,
  getExamplePhoneNumber,
  isPossiblePhoneNumber,
} from "../utils/phoneValidation";
import type { CountryCode } from "../store/countryStore";

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  countryCode: CountryCode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  showValidation?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode,
  placeholder,
  className = "",
  disabled = false,
  required = false,
  showValidation = true,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error: string | null;
  }>({ isValid: true, error: null });
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Get country calling code and example number
  const callingCode = getCountryCallingCode(countryCode);
  const exampleNumber = getExamplePhoneNumber(countryCode);
  const defaultPlaceholder =
    placeholder || exampleNumber || "Enter phone number";

  // Validate phone number and update validation state
  const validatePhone = useCallback(
    (value: string, touched: boolean) => {
      if (value.trim() === "") {
        const isValid = !required;
        setValidationResult({ isValid, error: null });
        return isValid;
      }

      // Check if it's a possible number first (for real-time feedback)
      const isPossible = isPossiblePhoneNumber(value, countryCode);

      if (!isPossible && touched) {
        setValidationResult({
          isValid: false,
          error: "Invalid phone number format",
        });
        return false;
      }

      // Full validation
      const result = validatePhoneNumber(value, countryCode);
      setValidationResult({
        isValid: result.isValid,
        error: result.error,
      });

      return result.isValid;
    },
    [countryCode, required]
  );

  // Update validation when input or country changes
  useEffect(() => {
    const isValid = validatePhone(inputValue, isTouched);
    onChange(inputValue, isValid);
  }, [inputValue, countryCode, isTouched, validatePhone]);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTouched(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsTouched(true);
    setIsFocused(false);

    // Format the number on blur if it's valid
    if (inputValue.trim() && validationResult.isValid) {
      const formatted = formatPhoneNumber(inputValue, countryCode, "national");
      setInputValue(formatted);
    }
  };

  const hasError =
    isTouched &&
    showValidation &&
    !validationResult.isValid &&
    inputValue.trim() !== "";

  // Determine border and ring color based on state
  const getBorderAndRingColor = () => {
    if (hasError) {
      return "border-red-500 focus:ring-2 focus:ring-red-500";
    }
    if (isTouched && validationResult.isValid && inputValue.trim() !== "") {
      return "border-green-500 focus:ring-2 focus:ring-green-500";
    }
    if (isFocused) {
      return "border-blue-500 focus:ring-2 focus:ring-blue-500";
    }
    return "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500";
  };

  return (
    <div className="relative">
      {/* Input with country code prefix */}
      <div className="relative">
        {/* Country calling code display */}
        {callingCode && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-gray-600 dark:text-gray-400 pointer-events-none z-10">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">{callingCode}</span>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          </div>
        )}

        {/* Phone input */}
        <input
          type="tel"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={defaultPlaceholder}
          disabled={disabled}
          className={`w-full py-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-transparent transition-colors ${
            callingCode ? "pl-20 pr-12" : "pl-4 pr-12"
          } ${getBorderAndRingColor()} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
        />

        {/* Validation icon */}
        {showValidation && isTouched && inputValue.trim() !== "" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {validationResult.isValid ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && validationResult.error && (
        <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{validationResult.error}</span>
        </div>
      )}

      {/* Helper text */}
      {!hasError && exampleNumber && showValidation && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Example: {exampleNumber}
        </div>
      )}
    </div>
  );
};
