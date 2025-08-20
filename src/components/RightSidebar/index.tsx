import { useState } from "react";
import {
  X,
  User,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Globe,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { useThemeStore } from "../../store/themeStore";
import {
  useLanguageStore,
  languages,
  type Language,
} from "../../store/languageStore";
import { useAuthWorld } from "../../store/authStore";

// WLD token contract address on World Chain
const WLD_CONTRACT_ADDRESS = "0x2cfc85d8e48f8eab294be644d9e25c3030863003";

interface TokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  logo_url: string | null;
  native_token: boolean;
  type: string;
  balance: string;
  quote_rate: string;
  quote: string;
  amount: string;
  tokenStatus: number;
}

interface BalanceResponse {
  data: TokenBalance[];
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<number> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: BalanceResponse = await response.json();

  // Find WLD token in the response
  const wldToken = data.data.find(
    (token) =>
      token.contract_address.toLowerCase() ===
      WLD_CONTRACT_ADDRESS.toLowerCase()
  );

  if (wldToken) {
    // Convert balance from wei to WLD (18 decimals)
    const balanceInWei = BigInt(wldToken.balance);
    const decimals = BigInt(wldToken.contract_decimals);
    const balanceInWLD = Number(balanceInWei) / Math.pow(10, Number(decimals));

    return balanceInWLD;
  } else {
    // WLD token not found, balance is 0
    return 0;
  }
};

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const { theme, setTheme } = useThemeStore();
  const { currentLanguage, setLanguage, getLanguageOption } =
    useLanguageStore();
  const { username, profile_picture_url, address } = useAuthWorld();

  // Use SWR to fetch WLD balance
  const {
    data: wldBalance,
    isLoading: isBalanceLoading,
    error,
  } = useSWR(
    address ? `/api/cms/api/user-balance/chain/480/wallet/${address}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      errorRetryCount: 3,
    }
  );

  console.log("wldBalance", wldBalance);

  if (error) {
    console.log("error in fetch balance", error);
  }

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const currentLanguageOption = getLanguageOption(currentLanguage);

  const handleLanguageSelect = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsLanguageModalOpen(false);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    if (newTheme === "system") {
      // For system theme, detect the user's preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
    setIsThemeDropdownOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "light":
        return <Sun className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                  {profile_picture_url ? (
                    <img
                      src={profile_picture_url}
                      alt={username || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {username ||
                      (address
                        ? `${address.slice(0, 6)}...${address.slice(-4)}`
                        : "Guest")}
                  </h3>
                  {address && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isBalanceLoading
                        ? "Balance: Loading..."
                        : error
                        ? "Balance: Error"
                        : wldBalance !== undefined
                        ? `Balance: ${wldBalance.toFixed(2)} WLD`
                        : "Balance: --"}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4">
                {/* Header Icons Row */}
                <div className="flex items-center justify-between">
                  {/* Theme Icon */}
                  <div className="relative">
                    <motion.button
                      onClick={() =>
                        setIsThemeDropdownOpen(!isThemeDropdownOpen)
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {getThemeIcon()}
                      <motion.div
                        animate={{ rotate: isThemeDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </motion.button>

                    {/* Theme Dropdown */}
                    <AnimatePresence>
                      {isThemeDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                        >
                          <div className="py-2">
                            <button
                              onClick={() => handleThemeChange("light")}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                theme === "light"
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              <Sun className="w-4 h-4" />
                              <span className="font-medium">Light</span>
                            </button>
                            <button
                              onClick={() => handleThemeChange("dark")}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                theme === "dark"
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              <Moon className="w-4 h-4" />
                              <span className="font-medium">Dark</span>
                            </button>
                            <button
                              onClick={() => handleThemeChange("system")}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                theme !== "light" && theme !== "dark"
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              <Monitor className="w-4 h-4" />
                              <span className="font-medium">System</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Language Icon */}
                  <motion.button
                    onClick={() => setIsLanguageModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {currentLanguageOption?.code.toUpperCase() || "EN"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Language Selection Modal - Similar to Size Selector */}
          <AnimatePresence mode="wait">
            {isLanguageModalOpen && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setIsLanguageModalOpen(false)}
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
                      Select Language
                    </motion.h2>
                    <motion.button
                      onClick={() => setIsLanguageModalOpen(false)}
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

                  {/* Language Options */}
                  <motion.div
                    className="space-y-3"
                    initial="hidden"
                    animate="visible"
                  >
                    {languages.map((language, index) => (
                      <motion.button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.95 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              duration: 0.3,
                              delay: index * 0.05,
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
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-gray-900 dark:text-gray-100 font-medium">
                              {language.nativeName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {language.name}
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {currentLanguage === language.code && (
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
      )}
    </AnimatePresence>
  );
}
