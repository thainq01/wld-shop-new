import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";

export type Language = "en" | "th" | "ms" | "ph" | "id" | "vi";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ph", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
];

// CMS languages (excludes English since there are no English products)
export const cmsLanguages: LanguageOption[] = [
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ph", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguageOption: (code: Language) => LanguageOption | undefined;
  getProductLanguage: () => Language;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: "en" as Language,
      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
        i18n.changeLanguage(language);
      },
      getLanguageOption: (code: Language) => {
        return languages.find((lang) => lang.code === code);
      },
      getProductLanguage: (): Language => {
        const { currentLanguage } = useLanguageStore.getState();
        return currentLanguage;
      },
    }),
    {
      name: "language-storage",
      onRehydrateStorage: () => (state) => {
        // Set i18n language on rehydration
        if (state?.currentLanguage) {
          i18n.changeLanguage(state.currentLanguage);
        }
      },
    }
  )
);
