import React, { useState } from "react";
import { ChevronDown, Check, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  disabled?: boolean;
  reason?: string;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCity,
  onCityChange,
  disabled = false,
  reason,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCitySelect = (city: string) => {
    onCityChange(city);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* City Selector Button */}
      <motion.button
        onClick={() => !disabled && setIsModalOpen(true)}
        whileHover={disabled ? {} : { scale: 1 }}
        whileTap={disabled ? {} : { scale: 1 }}
        className={`w-full px-4 py-4 border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 ${
          disabled
            ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-black dark:focus:ring-white"
        }`}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {disabled && <Lock className="w-4 h-4" />}
          <span>{selectedCity || "Select City"}</span>
        </div>
        {!disabled && (
          <motion.div
            animate={{ rotate: isModalOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        )}
      </motion.button>
      
      {/* Disabled reason message */}
      {disabled && reason && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {reason}
        </p>
      )}

      {/* City Selection Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 100,
                scale: 1,
                borderRadius: "24px 24px 0 0",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                borderRadius: "24px 24px 0 0",
              }}
              exit={{
                opacity: 0,
                y: 100,
                scale: 1,
                borderRadius: "24px 24px 0 0",
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                Select City
              </h3>

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
                {cities.map((city) => (
                  <motion.button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 1 },
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
                      scale: 1,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 1 }}
                    className="w-full p-4 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {city}
                    </span>
                    <AnimatePresence>
                      {selectedCity === city && (
                        <motion.div
                          initial={{ opacity: 0, scale: 1, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 1, rotate: 90 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white dark:text-black" />
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
