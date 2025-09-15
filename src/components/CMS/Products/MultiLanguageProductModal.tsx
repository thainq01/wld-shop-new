import React, { useState, useEffect, useCallback } from "react";
import { X, Package, Save, Plus, Trash2, Upload } from "lucide-react";
import { 
  MultiLanguageProduct, 
  CreateMultiLanguageProductRequest, 
  UpdateMultiLanguageProductRequest,
  ProductImage,
  ProductVariant,
  MultiLanguageCollection
} from "../../../types";
import { cmsLanguages } from "../../../store/languageStore";
import { collectionsApi } from "../../../utils/api";

interface MultiLanguageProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: MultiLanguageProduct | null;
  onSubmit: (data: CreateMultiLanguageProductRequest | UpdateMultiLanguageProductRequest) => Promise<void>;
}

export function MultiLanguageProductModal({
  isOpen,
  onClose,
  product,
  onSubmit,
}: MultiLanguageProductModalProps) {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    price: 0,
    collectionId: 0,
    category: "",
    madeBy: "",
    inStock: "In Stock",
    featured: false,
    active: true,
    translations: {} as Record<string, { name: string; description: string; material: string; otherDetails: string }>,
    countryPrices: {} as Record<string, number>,
  });
  
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [collections, setCollections] = useState<MultiLanguageCollection[]>([]);
  const [activeTab, setActiveTab] = useState<string>("en");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(["en"]);
  // Language to country code mapping
  const languageToCountryMap: Record<string, { countryCode: string; countryName: string; flag: string }> = {
    en: { countryCode: "EN", countryName: "Global/English", flag: "🌍" },
    th: { countryCode: "TH", countryName: "Thailand", flag: "🇹🇭" },
    ms: { countryCode: "MS", countryName: "Malaysia", flag: "🇲🇾" },
    tl: { countryCode: "PH", countryName: "Philippines", flag: "🇵🇭" },
    id: { countryCode: "ID", countryName: "Indonesia", flag: "🇮🇩" },
  };

  const loadCollections = useCallback(async () => {
    try {
      const response = await collectionsApi.getAllMultiLanguage();
      const collections = Array.isArray(response) ? response : response.data;
      setCollections(collections);
      if (collections.length > 0 && !product) {
        setFormData(prev => ({ ...prev, collectionId: collections[0].id }));
      }
    } catch (error) {
      console.error("Failed to load collections:", error);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen, loadCollections]);

  useEffect(() => {
    if (product) {
      setFormData({
        price: product.basePrice,
        collectionId: product.collection?.id || 0,
        category: product.category,
        madeBy: product.madeBy,
        inStock: product.inStock,
        featured: product.featured,
        active: product.active,
        translations: Object.fromEntries(
          Object.entries(product.translations).map(([lang, translation]) => [
            lang,
            { 
              name: translation.name, 
              description: translation.description,
              material: translation.material,
              otherDetails: translation.otherDetails
            }
          ])
        ),
        countryPrices: product.countryPrices || {},
      });
      setProductVariants(product.sizes || []);
      setProductImages(product.images || []);
      setAvailableLanguages(product.availableLanguages);
      setActiveTab(product.defaultLanguage || "en");
    } else {
      // Reset for new product
      setFormData({
        price: 0,
        collectionId: collections.length > 0 ? collections[0].id : 0,
        category: "",
        madeBy: "",
        inStock: "In Stock",
        featured: false,
        active: true,
        translations: {
          en: { name: "", description: "", material: "", otherDetails: "" }
        },
        countryPrices: {},
      });
      setProductVariants([]);
      setProductImages([]);
      setAvailableLanguages(["en"]);
      setActiveTab("en");
    }
    setErrors({});
  }, [product, isOpen, collections]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field === "price" || field === "collectionId" || field === "category" || field === "madeBy" || field === "inStock" || field === "featured" || field === "active") {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (field === "countryPrice") {
      // Handle country-specific pricing
      const countryCode = languageToCountryMap[activeTab]?.countryCode || activeTab;
      const numericValue = value as number;

      setFormData(prev => {
        const newCountryPrices = { ...prev.countryPrices };

        // Only remove the country price if the value is invalid (NaN)
        // Allow 0 as a valid price (user might want to set price to 0)
        if (isNaN(numericValue)) {
          delete newCountryPrices[countryCode];
        } else {
          newCountryPrices[countryCode] = numericValue;
        }

        return {
          ...prev,
          countryPrices: newCountryPrices
        };
      });
    } else {
      // Handle translation fields
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [activeTab]: {
            ...prev.translations[activeTab],
            [field]: value
          }
        }
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addLanguageTab = (languageCode: string) => {
    if (!availableLanguages.includes(languageCode)) {
      setAvailableLanguages(prev => [...prev, languageCode]);
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [languageCode]: { name: "", description: "", material: "", otherDetails: "" }
        }
      }));
      setActiveTab(languageCode);
    }
  };

  const removeLanguageTab = (languageCode: string) => {
    if (languageCode === "en") return; // Can't remove English

    setAvailableLanguages(prev => prev.filter(lang => lang !== languageCode));
    setFormData(prev => {
      const newTranslations = { ...prev.translations };
      delete newTranslations[languageCode];
      return { ...prev, translations: newTranslations };
    });

    if (activeTab === languageCode) {
      setActiveTab("en");
    }
  };

  // Helper function to get country price for current language tab
  const getCurrentCountryPrice = () => {
    const countryCode = languageToCountryMap[activeTab]?.countryCode || activeTab;
    const countryPrice = formData.countryPrices[countryCode];
    // Return empty string if no country-specific price is set, so user can see it's using base price
    return countryPrice !== undefined ? countryPrice : "";
  };

  // Helper function to get country info for current language tab
  const getCurrentCountryInfo = () => {
    return languageToCountryMap[activeTab] || {
      countryCode: activeTab,
      countryName: activeTab.toUpperCase(),
      flag: "🌍"
    };
  };

  const addVariant = () => {
    setProductVariants([
      ...productVariants,
      {
        size: "",
        price: formData.price,
        stockQuantity: 0,
        available: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setProductVariants(productVariants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number | boolean | null) => {
    setProductVariants(prev =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addImage = () => {
    setProductImages([
      ...productImages,
      {
        url: "",
        altText: "",
        isPrimary: productImages.length === 0,
        orderIndex: productImages.length,
      },
    ]);
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof ProductImage, value: string | boolean | number) => {
    setProductImages(prev =>
      prev.map((image, i) =>
        i === index ? { ...image, [field]: value } : image
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.madeBy.trim()) {
      newErrors.madeBy = "Made by is required";
    }

    // Validate English translation (required)
    if (!formData.translations.en?.name?.trim()) {
      newErrors["en-name"] = "English name is required";
    }

    if (!formData.translations.en?.description?.trim()) {
      newErrors["en-description"] = "English description is required";
    }

    if (!formData.translations.en?.material?.trim()) {
      newErrors["en-material"] = "English material is required";
    }

    // Validate country prices for each language
    availableLanguages.forEach((langCode) => {
      const countryCode = languageToCountryMap[langCode]?.countryCode || langCode;
      const countryPrice = formData.countryPrices[countryCode];
      if (countryPrice !== undefined && countryPrice < 0) {
        newErrors[`${langCode}-countryPrice`] = "Price cannot be negative";
      }
    });

    // Validate variants
    if (productVariants.length === 0) {
      newErrors.variants = "At least one product variant is required";
    } else {
      productVariants.forEach((variant, index) => {
        if (!variant.size.trim()) {
          newErrors[`variant-${index}-size`] = "Size is required";
        }
        if (variant.stockQuantity < 0) {
          newErrors[`variant-${index}-stock`] = "Stock quantity cannot be negative";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        productVariants,
        productImages,
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      setErrors({ general: "Failed to save product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getLanguageDisplay = (langCode: string) => {
    const language = cmsLanguages.find((lang) => lang.code === langCode);
    return language ? `${language.flag} ${language.name}` : langCode.toUpperCase();
  };

  const getAvailableLanguagesToAdd = () => {
    return cmsLanguages.filter(lang => !availableLanguages.includes(lang.code));
  };

  const getCollectionName = (collection: MultiLanguageCollection) => {
    return collection?.translations.en?.name ||
           collection?.translations[collection?.defaultLanguage]?.name ||
           Object.values(collection?.translations || {})[0]?.name ||
           "Untitled";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit Product" : "Create Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors.price 
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Collection
                      </label>
                      <select
                        value={formData.collectionId}
                        onChange={(e) => handleInputChange("collectionId", parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={0}>No Collection</option>
                        {collections.map((collection) => (
                          <option key={collection.id} value={collection.id}>
                            {getCollectionName(collection)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors.category 
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder="e.g., Apparel, Accessories"
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Made By *
                      </label>
                      <input
                        type="text"
                        value={formData.madeBy}
                        onChange={(e) => handleInputChange("madeBy", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors.madeBy 
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder="e.g., World Shop"
                      />
                      {errors.madeBy && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.madeBy}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock Status
                      </label>
                      <select
                        value={formData.inStock}
                        onChange={(e) => handleInputChange("inStock", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Pre-order">Pre-order</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange("featured", e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Product
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="active"
                          checked={formData.active}
                          onChange={(e) => handleInputChange("active", e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Active Product
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Translations */}
              <div className="space-y-6">
                <div>
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
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors[`${activeTab}-name`] 
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder={`Product name in ${getLanguageDisplay(activeTab)}`}
                      />
                      {errors[`${activeTab}-name`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${activeTab}-name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description {activeTab === "en" && "*"}
                      </label>
                      <textarea
                        value={formData.translations[activeTab]?.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors[`${activeTab}-description`] 
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder={`Product description in ${getLanguageDisplay(activeTab)}`}
                      />
                      {errors[`${activeTab}-description`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${activeTab}-description`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Material {activeTab === "en" && "*"}
                      </label>
                      <input
                        type="text"
                        value={formData.translations[activeTab]?.material || ""}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors[`${activeTab}-material`] 
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder={`Material in ${getLanguageDisplay(activeTab)}`}
                      />
                      {errors[`${activeTab}-material`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${activeTab}-material`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Other Details
                      </label>
                      <textarea
                        value={formData.translations[activeTab]?.otherDetails || ""}
                        onChange={(e) => handleInputChange("otherDetails", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder={`Additional details in ${getLanguageDisplay(activeTab)}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price for {getCurrentCountryInfo().flag} {getCurrentCountryInfo().countryName}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={getCurrentCountryPrice()}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Handle empty string or invalid input
                            if (inputValue === "" || inputValue === null || inputValue === undefined) {
                              handleInputChange("countryPrice", 0);
                            } else {
                              const numericValue = parseFloat(inputValue);
                              // Only use 0 as fallback if the input is actually invalid (NaN)
                              handleInputChange("countryPrice", isNaN(numericValue) ? 0 : numericValue);
                            }
                          }}
                          className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                            errors[`${activeTab}-countryPrice`]
                              ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                          }`}
                          placeholder="0.00"
                        />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">WLD</span>
                      </div>
                      {errors[`${activeTab}-countryPrice`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`${activeTab}-countryPrice`]}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave empty to use base price ({formData.price} WLD) for this region
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Product Variants *
                </h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>

              {errors.variants && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">{errors.variants}</p>
              )}

              <div className="space-y-3">
                {productVariants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        placeholder="Size (e.g., S, M, L, XL)"
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors[`variant-${index}-size`]
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-500 focus:ring-blue-500"
                        }`}
                      />
                      {errors[`variant-${index}-size`] && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[`variant-${index}-size`]}</p>
                      )}
                    </div>
                    
                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        value={variant.stockQuantity}
                        onChange={(e) => updateVariant(index, "stockQuantity", parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          errors[`variant-${index}-stock`]
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-500 focus:ring-blue-500"
                        }`}
                      />
                      {errors[`variant-${index}-stock`] && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[`variant-${index}-stock`]}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.available}
                        onChange={(e) => updateVariant(index, "available", e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Available</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Images */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Product Images
                </h3>
                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Add Image
                </button>
              </div>

              <div className="space-y-3">
                {productImages.map((image, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => updateImage(index, "url", e.target.value)}
                        placeholder="Image URL"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={image.altText}
                        onChange={(e) => updateImage(index, "altText", e.target.value)}
                        placeholder="Alt text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        value={image.orderIndex || 0}
                        onChange={(e) => updateImage(index, "orderIndex", parseInt(e.target.value) || 0)}
                        placeholder="Order"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={image.isPrimary}
                        onChange={(e) => updateImage(index, "isPrimary", e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Primary</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
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
              {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
