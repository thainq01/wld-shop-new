import React, { useState, useEffect } from "react";
import { X, Tag, Save, Trash2 } from "lucide-react";
import {
  MultiLanguageCollection,
  CreateMultiLanguageCollectionRequest,
  UpdateMultiLanguageCollectionRequest,
} from "../../../types";
import { cmsLanguages } from "../../../store/languageStore";

interface MultiLanguageCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection?: MultiLanguageCollection | null;
  onSubmit: (
    data:
      | CreateMultiLanguageCollectionRequest
      | UpdateMultiLanguageCollectionRequest
  ) => Promise<void>;
}

export function MultiLanguageCollectionModal({
  isOpen,
  onClose,
  collection,
  onSubmit,
}: MultiLanguageCollectionModalProps) {
  const isEditing = !!collection;

  const [formData, setFormData] = useState({
    slug: "",
    isActive: true,
    translations: {} as Record<string, { name: string; description: string }>,
  });

  const [activeTab, setActiveTab] = useState<string>("en");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "en",
  ]);

  useEffect(() => {
    if (collection) {
      setFormData({
        slug: collection.slug,
        isActive: collection.isActive,
        translations: Object.fromEntries(
          Object.entries(collection.translations).map(([lang, translation]) => [
            lang,
            { name: translation.name, description: translation.description },
          ])
        ),
      });
      setAvailableLanguages(collection.availableLanguages);
      setActiveTab(collection.defaultLanguage || "en");
    } else {
      // Reset for new collection
      setFormData({
        slug: "",
        isActive: true,
        translations: {
          en: { name: "", description: "" },
        },
      });
      setAvailableLanguages(["en"]);
      setActiveTab("en");
    }
    setErrors({});
  }, [collection, isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "slug" || field === "isActive") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      // Handle translation fields
      setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [activeTab]: {
            ...prev.translations[activeTab],
            [field]: value,
          },
        },
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Auto-generate slug from English name
  const handleNameChange = (name: string) => {
    handleInputChange("name", name);

    // Auto-generate slug only for new collections and only from English name
    if (!isEditing && activeTab === "en" && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addLanguageTab = (languageCode: string) => {
    if (!availableLanguages.includes(languageCode)) {
      setAvailableLanguages((prev) => [...prev, languageCode]);
      setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [languageCode]: { name: "", description: "" },
        },
      }));
      setActiveTab(languageCode);
    }
  };

  const removeLanguageTab = (languageCode: string) => {
    if (languageCode === "en") return; // Can't remove English

    setAvailableLanguages((prev) =>
      prev.filter((lang) => lang !== languageCode)
    );
    setFormData((prev) => {
      const newTranslations = { ...prev.translations };
      delete newTranslations[languageCode];
      return { ...prev, translations: newTranslations };
    });

    if (activeTab === languageCode) {
      setActiveTab("en");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    // Validate English translation (required)
    if (!formData.translations.en?.name?.trim()) {
      newErrors["en-name"] = "English name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save collection:", error);
      setErrors({ general: "Failed to save collection. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getLanguageDisplay = (langCode: string) => {
    const language = cmsLanguages.find((lang) => lang.code === langCode);
    return language
      ? `${language.flag} ${language.name}`
      : langCode.toUpperCase();
  };

  const getAvailableLanguagesToAdd = () => {
    return cmsLanguages.filter(
      (lang) => !availableLanguages.includes(lang.code)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit Collection" : "Create Collection"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                    errors.slug
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="collection-slug"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.slug}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  URL-friendly version (lowercase, no spaces)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Active Collection
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Only active collections will be displayed on the website
              </p>
            </div>

            {/* Language Tabs */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Translations
                </h3>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addLanguageTab(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Add Language</option>
                    {getAvailableLanguagesToAdd().map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {availableLanguages.map((langCode) => (
                    <div key={langCode} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab(langCode)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === langCode
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                      >
                        {getLanguageDisplay(langCode)}
                        {langCode === "en" && (
                          <span className="ml-1 text-xs text-red-500">*</span>
                        )}
                      </button>
                      {langCode !== "en" && (
                        <button
                          type="button"
                          onClick={() => removeLanguageTab(langCode)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Translation Form */}
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name {activeTab === "en" && "*"}
                  </label>
                  <input
                    type="text"
                    value={formData.translations[activeTab]?.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                      errors[`${activeTab}-name`]
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    }`}
                    placeholder={`Collection name in ${getLanguageDisplay(
                      activeTab
                    )}`}
                  />
                  {errors[`${activeTab}-name`] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors[`${activeTab}-name`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.translations[activeTab]?.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder={`Collection description in ${getLanguageDisplay(
                      activeTab
                    )}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Collection"
                : "Create Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
