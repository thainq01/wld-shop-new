import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

interface CMSState {
  selectedLanguage: string; // "all" for all languages, or specific language code
  setSelectedLanguage: (language: string) => void;
  shouldFilterByLanguage: () => boolean;
  getLanguageFilter: () => string | undefined;
}

export const useCMSStore = create<CMSState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      selectedLanguage: "all", // Default to show all languages
      
      setSelectedLanguage: (language: string) => {
        set({ selectedLanguage: language });
      },
      
      shouldFilterByLanguage: () => {
        return get().selectedLanguage !== "all";
      },
      
      getLanguageFilter: () => {
        const { selectedLanguage } = get();
        return selectedLanguage === "all" ? undefined : selectedLanguage;
      },
    }),
      {
        name: "cms-language-storage",
      }
    )
  )
);
