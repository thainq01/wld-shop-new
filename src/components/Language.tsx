import down from "../assets/svg/down.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "../store/languageStore";

const languages = [
  { title: "English", symbol: "en" },
  { title: "Thailand", symbol: "th" },
  { title: "Malaysia", symbol: "ms" },
  { title: "Philippines", symbol: "ph" },
  { title: "Indonesia", symbol: "id" },
] as const;

export function Language() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, setLanguage } = useLanguageStore();

  const language = languages.find((item) => item.symbol === currentLanguage);

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
        <p className="text-gray-900 dark:text-gray-100 font-medium text-sm uppercase pl-1">{language?.symbol ?? "EN"}</p>
        <img src={down} alt="down" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute right-0 top-10 z-[100]"
          >
            <ul className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              {languages.map((item, index) => {
                return (
                  <li
                    data-action={`language-${item.symbol}`}
                    onClick={() => {
                      setIsOpen(false);
                      setLanguage(item.symbol as any);
                    }}
                    key={index}
                    className={`cursor-pointer flex items-center justify-between px-4 py-2.5 ${
                      languages.length - 1 !== index ? "border-b border-gray-200 dark:border-gray-700" : ""
                    }`}
                  >
                                         <p
                       className={`text-base text-gray-900 dark:text-gray-100 ${
                         currentLanguage === item.symbol ? "opacity-100" : "opacity-50"
                       }`}
                     >
                       {item.title}
                     </p>
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
