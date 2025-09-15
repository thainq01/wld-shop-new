import down from "../assets/svg/down.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguageStore, languages } from "../store/languageStore";

export function Language() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, setLanguage, getLanguageOption } =
    useLanguageStore();

  const language = getLanguageOption(currentLanguage);

  useEffect(() => {
    if (!containerRef.current || !isOpen) {
      return;
    }

    function clickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        data-action="select-language"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-[6px] cursor-pointer"
      >
        <span className="text-lg mr-1">{language?.flag ?? "🇺🇸"}</span>
        <p className="text-gray-900 dark:text-gray-100 font-medium text-sm uppercase">
          {language?.code ?? "EN"}
        </p>
        <img src={down} alt="down" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute right-0 top-12 z-[100]"
          >
            <ul className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              {languages.map((item, index) => {
                return (
                  <li
                    data-action={`language-${item.code}`}
                    onClick={() => {
                      setIsOpen(false);
                      setLanguage(item.code);
                    }}
                    key={index}
                    className={`cursor-pointer flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      languages.length - 1 !== index
                        ? ""
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.flag}</span>
                      <div>
                        <p
                          className={`text-base text-gray-900 dark:text-gray-100 ${
                            currentLanguage === item.code
                              ? "font-semibold"
                              : "font-normal"
                          }`}
                        >
                          {item.name}
                        </p>
                      </div>
                    </div>
                    {currentLanguage === item.code && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
