import { useState, useEffect, useCallback } from "react";
import { X, Package, Save, Plus, Trash2, Globe } from "lucide-react";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Collection,
  ProductImage,
  ProductVariant,
} from "../../../types";
import { collectionsApi } from "../../../utils/api";
import { cmsLanguages } from "../../../store/languageStore";
import { useCMSStore } from "../../../store/cmsStore";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSubmit: (
    data: CreateProductRequest | UpdateProductRequest
  ) => Promise<void>;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  onSubmit,
}: ProductModalProps) {
  const { selectedLanguage, getLanguageFilter } = useCMSStore();
  const isEditing = !!product;

  const [formData, setFormData] = useState(() => {
    // Initialize with current CMS language (or "th" if "all" is selected)
    const defaultLanguage =
      selectedLanguage === "all" ? "th" : selectedLanguage;
    return {
      name: "",
      description: "",
      price: 0,
      collectionId: 0,
      category: "",
      material: "",
      madeBy: "",
      inStock: "In Stock",
      featured: false,
      language: defaultLanguage,
      otherDetails: "",
    };
  });

  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadCollections = useCallback(async () => {
    try {
      // Load collections filtered by currently selected CMS language
      const languageFilter = getLanguageFilter();
      const data = await collectionsApi.getAll(
        languageFilter ? { lang: languageFilter } : undefined
      );
      setCollections(data);
      if (data.length > 0 && !product) {
        setFormData((prev) => ({ ...prev, collectionId: data[0].id }));
      }
    } catch (error) {
      console.error("Failed to load collections:", error);
    }
  }, [product, getLanguageFilter]);

  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen, loadCollections]);

  // Reload collections when language filter changes (only for new products)
  useEffect(() => {
    if (isOpen && !isEditing) {
      loadCollections();
    }
  }, [selectedLanguage, isOpen, loadCollections, isEditing]);

  // Update language when CMS language filter changes (only for new products)
  useEffect(() => {
    if (!isEditing && isOpen) {
      const defaultLanguage =
        selectedLanguage === "all" ? "th" : selectedLanguage;
      setFormData((prev) => ({
        ...prev,
        language: defaultLanguage,
      }));
    }
  }, [selectedLanguage, isEditing, isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        collectionId: product.collection?.id,
        category: product.category,
        material: product.material,
        madeBy: product.madeBy,
        inStock: product.inStock,
        featured: product.featured,
        language: product.language || "th",
        otherDetails: product.otherDetails || "",
      });
      setProductImages(product.images || []);
      setProductVariants(
        product.sizes?.map((size) => ({
          size: size.size,
          price: size.price || product.price,
          stockQuantity: size.stockQuantity,
          available: size.available,
        })) || []
      );
    } else {
      // For new products, auto-select the current CMS language (or "en" if "all" is selected)
      const defaultLanguage =
        selectedLanguage === "all" ? "th" : selectedLanguage;
      setFormData({
        name: "",
        description: "",
        price: 0,
        collectionId: 0,
        category: "",
        material: "",
        madeBy: "",
        inStock: "In Stock",
        featured: false,
        language: defaultLanguage,
        otherDetails: "",
      });
      setProductImages([]);
      setProductVariants([]);
    }
    setErrors({});
  }, [product, isOpen, selectedLanguage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.collectionId === 0) {
      newErrors.collectionId =
        collections.length === 0
          ? "No collections available in selected language. Please create a collection first or change language filter."
          : "Please select a collection";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.material.trim()) {
      newErrors.material = "Material is required";
    }

    if (!formData.madeBy.trim()) {
      newErrors.madeBy = "Made by is required";
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
        productImages,
        productVariants,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Failed to save product:", error);
      setErrors({ general: "Failed to save product. Please try again." });
    } finally {
      setLoading(false);
    }
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

  const updateImage = (
    index: number,
    field: keyof ProductImage,
    value: string | boolean | number
  ) => {
    const updated = [...productImages];
    updated[index] = { ...updated[index], [field]: value };

    // Ensure only one primary image
    if (field === "isPrimary" && value) {
      updated.forEach((img, i) => {
        if (i !== index) img.isPrimary = false;
      });
    }

    setProductImages(updated);
  };

  const removeImage = (index: number) => {
    const updated = productImages.filter((_, i) => i !== index);
    // If removed image was primary, make first image primary
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setProductImages(updated);
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

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number | boolean
  ) => {
    const updated = [...productVariants];
    updated[index] = { ...updated[index], [field]: value };
    setProductVariants(updated);
  };

  const removeVariant = (index: number) => {
    setProductVariants(productVariants.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? "Edit Product" : "Create Product"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.general}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Basic Information
                </h4>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.name
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.description
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Price and Collection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.price
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      }`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Collection *
                    </label>
                    <select
                      value={formData.collectionId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          collectionId: parseInt(e.target.value),
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.collectionId
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      }`}
                    >
                      <option value={0}>
                        {collections.length === 0
                          ? "No collections available in selected language"
                          : "Select a collection"}
                      </option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                    {errors.collectionId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.collectionId}
                      </p>
                    )}
                    {!isEditing && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Collections filtered by selected language (
                        {selectedLanguage === "all"
                          ? "all languages"
                          : cmsLanguages.find((l) => l.code === selectedLanguage)
                              ?.name || selectedLanguage}
                        )
                      </p>
                    )}
                  </div>
                </div>

                {/* Category and Material */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.category
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      }`}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Material *
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          material: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.material
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      }`}
                    />
                    {errors.material && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.material}
                      </p>
                    )}
                  </div>
                </div>

                {/* Made By and Stock Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Made By *
                    </label>
                    <input
                      type="text"
                      value={formData.madeBy}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          madeBy: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.madeBy
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      }`}
                    />
                    {errors.madeBy && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.madeBy}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Status
                    </label>
                    <select
                      value={formData.inStock}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          inStock: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <select
                      value={formData.language}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    >
                      {cmsLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Content language for this product
                  </p>
                </div>

                {/* Featured and Other Details */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <label
                      htmlFor="featured"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Featured Product
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Other Details
                  </label>
                  <textarea
                    value={formData.otherDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        otherDetails: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Additional product details..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  />
                </div>
              </div>

              {/* Right Column - Images and Variants */}
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Product Images
                    </h4>
                    <button
                      type="button"
                      onClick={addImage}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Image
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={image.url}
                            onChange={(e) =>
                              updateImage(index, "url", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Alt text"
                            value={image.altText}
                            onChange={(e) =>
                              updateImage(index, "altText", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={image.isPrimary}
                                onChange={(e) =>
                                  updateImage(
                                    index,
                                    "isPrimary",
                                    e.target.checked
                                  )
                                }
                                className="w-3 h-3 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Primary
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Variants/Sizes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Size Variants
                    </h4>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Size
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {productVariants.map((variant, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Size (e.g., S, M, L)"
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            step="0.01"
                            min="0"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            placeholder="Stock Quantity"
                            min="0"
                            value={variant.stockQuantity}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "stockQuantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={variant.available}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "available",
                                    e.target.checked
                                  )
                                }
                                className="w-3 h-3 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Available
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
