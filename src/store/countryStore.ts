import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useLanguageStore } from "./languageStore";
import type { Language } from "./languageStore";

export type CountryCode = "en" | "th" | "ms" | "ph" | "id" | "vn";

export interface CountryOption {
  code: CountryCode;
  name: string;
  flag: string;
}

export const countries: CountryOption[] = [
  { code: "th", name: "Thailand", flag: "🇹🇭" },
  { code: "ms", name: "Malaysia", flag: "🇲🇾" },
  { code: "ph", name: "Philippines", flag: "🇵🇭" },
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "vn", name: "Vietnam", flag: "🇻🇳" },
];

// Language to country mapping based on user requirements
const languageToCountryMap: Record<Language, CountryCode> = {
  en: "th", // English → Thailand
  th: "th", // Thailand
  ms: "ms", // Malaysia
  ph: "ph", // Philippines (note: language code is "ph" not "tl")
  id: "id", // Indonesia
  vi: "vn", // Vietnamese → Vietnam
};

// Country to language mapping for API calls
const countryToLanguageMap: Record<CountryCode, Language> = {
  th: "th", // Thailand → Thai
  ms: "ms", // Malaysia → Malay
  ph: "ph", // Philippines → Filipino
  id: "id", // Indonesia → Indonesian
  vn: "vi", // Vietnam → Vietnamese
  en: "en", // English (fallback)
};

interface CountryState {
  selectedCountry: CountryCode;
  isManuallySelected: boolean; // Track if user manually selected country
  setCountry: (country: CountryCode, isManual?: boolean) => void;
  getCountryOption: (code: CountryCode) => CountryOption | undefined;
  getCountryFromLanguage: (language: Language) => CountryCode;
  getLanguageFromCountry: (country: CountryCode) => Language;
  getCountryCodeFromName: (name: string) => CountryCode | undefined;
  updateCountryFromLanguage: (language: Language) => void;
}

export const useCountryStore = create<CountryState>()(
  persist(
    (set) => ({
      selectedCountry: "th", // Default to Thailand
      isManuallySelected: false,

      setCountry: (country: CountryCode, isManual = false) => {
        set({
          selectedCountry: country,
          isManuallySelected: isManual,
        });
      },

      getCountryOption: (code: CountryCode) => {
        return countries.find((country) => country.code === code);
      },

      getCountryFromLanguage: (language: Language) => {
        return languageToCountryMap[language] || "th";
      },

      getLanguageFromCountry: (country: CountryCode) => {
        return countryToLanguageMap[country] || "th";
      },

      getCountryCodeFromName: (name: string) => {
        const country = countries.find((c) => c.name === name);
        return country?.code;
      },

      updateCountryFromLanguage: (language: Language) => {
        // Always update country based on language and reset manual selection flag
        // This ensures language-to-country mapping always works as expected
        const newCountry = languageToCountryMap[language] || "th";
        set({
          selectedCountry: newCountry,
          isManuallySelected: false, // Reset manual selection when language changes
        });
      },
    }),
    {
      name: "country-storage",
    }
  )
);

// Subscribe to language changes and update country automatically
let previousLanguageForCountry = useLanguageStore.getState().currentLanguage;

useLanguageStore.subscribe(() => {
  const currentLanguage = useLanguageStore.getState().currentLanguage;

  // Only update if language actually changed
  if (currentLanguage !== previousLanguageForCountry) {
    console.log(
      `Language changed from ${previousLanguageForCountry} to ${currentLanguage}, updating country...`
    );
    previousLanguageForCountry = currentLanguage;

    // Update country based on new language
    useCountryStore.getState().updateCountryFromLanguage(currentLanguage);
  }
});

// Initialize country based on current language on store creation
const initialLanguage: Language = useLanguageStore.getState().currentLanguage;
const initialCountry = languageToCountryMap[initialLanguage] || "th";
useCountryStore.getState().setCountry(initialCountry, false);
