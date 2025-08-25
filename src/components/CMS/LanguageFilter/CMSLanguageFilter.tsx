import React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguageStore, languages, type Language } from "../../../store/languageStore";

interface CMSLanguageFilterProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  showAllOption?: boolean;
}

export const CMSLanguageFilter: React.FC<CMSLanguageFilterProps> = ({
  selectedLanguage,
  onLanguageChange,
  showAllOption = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getLanguageLabel = (code: string) => {
    if (code === "all") return "All Languages";
    const language = languages.find(lang => lang.code === code);
    return language ? `${language.flag} ${language.name}` : code;
  };

  const options = [
    ...(showAllOption ? [{ code: "all", name: "All Languages", nativeName: "All Languages", flag: "🌐" }] : []),
    ...languages
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getLanguageLabel(selectedLanguage)}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.code}
                  onClick={() => {
                    onLanguageChange(option.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedLanguage === option.code
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{option.flag}</span>
                    <span>{option.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
