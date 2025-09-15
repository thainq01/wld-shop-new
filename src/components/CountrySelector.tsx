import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Lock } from "lucide-react";
import { countries, type CountryCode } from "../store/countryStore";

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  disabled?: boolean;
  reason?: string;
  className?: string;
  variant?: "default" | "compact";
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  disabled = false,
  reason,
  className = "",
  variant = "default",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCountryOption = countries.find(c => c.code === selectedCountry);

  const handleCountrySelect = (country: CountryCode) => {
    onCountryChange(country);
    setIsModalOpen(false);
  };

  const buttonContent = (
    <div className="flex items-center gap-2">
      {disabled && <Lock className="w-4 h-4" />}
      {selectedCountryOption && (
        <>
          <span className="text-lg">{selectedCountryOption.flag}</span>
          <span>{selectedCountryOption.name}</span>
        </>
      )}
      {!disabled && <ChevronDown className="w-4 h-4 ml-auto" />}
    </div>
  );

  if (variant === "compact") {
    return (
      <>
        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Select Country
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Country List */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className="space-y-3"
                >
                  {countries.map((country) => (
                    <motion.button
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
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
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { duration: 0.1 },
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedCountry === country.code
                          ? "border-black dark:border-white bg-gray-50 dark:bg-gray-700"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {country.name}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Default variant (full width)
  return (
    <>
      {/* Country Selector Button */}
      <motion.button
        onClick={() => !disabled && setIsModalOpen(true)}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        className={`w-full px-4 py-4 border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 ${
          disabled
            ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-black dark:focus:ring-white"
        } ${className}`}
        disabled={disabled}
      >
        {buttonContent}
      </motion.button>

      {disabled && reason && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {reason}
        </p>
      )}

      {/* Modal - same as compact variant */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Select Country
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Country List */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="space-y-3"
              >
                {countries.map((country) => (
                  <motion.button
                    key={country.code}
                    onClick={() => handleCountrySelect(country.code)}
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
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1 },
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedCountry === country.code
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-700"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {country.name}
                      </span>
                    </div>
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
