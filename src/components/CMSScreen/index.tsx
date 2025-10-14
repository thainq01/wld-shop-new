import { useState, useEffect } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collectionsApi, productsApi } from "../../utils/api";
import { useCollectionStore } from "../../store/collectionStore";
import { useAuthStore } from "../../store/authStore";
import type {
  Collection,
  Product,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CreateProductRequest,
  UpdateProductRequest,
  ProductVariant,
  ProductImage,
} from "../../types";

type ActiveTab = "collections" | "products";
type ActiveModal =
  | null
  | "create-collection"
  | "edit-collection"
  | "create-product"
  | "edit-product";

export function CMSScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("collections");
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Collection | Product | null>(
    null
  );

  // Get cache refresh function and auth
  const { refreshAllData } = useCollectionStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    loadCollections();
    loadProducts();
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      toast.success("Logged out successfully");
      navigate("/explore");
    }
  };

  const loadCollections = async () => {
    try {
      const data = await collectionsApi.getAll();
      setCollections(data);
    } catch (error) {
      toast.error("Failed to load collections");
      console.error(error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    }
  };

  // Helper function to refresh explore page cache after CMS changes
  const refreshExploreCache = async () => {
    try {
      await refreshAllData();
    } catch (error) {
      console.error("Failed to refresh explore page cache:", error);
    }
  };

  const handleCreateCollection = () => {
    setSelectedItem(null);
    setActiveModal("create-collection");
  };

  const handleEditCollection = (collection: Collection) => {
    setSelectedItem(collection);
    setActiveModal("edit-collection");
  };

  const handleCreateProduct = () => {
    setSelectedItem(null);
    setActiveModal("create-product");
  };

  const handleEditProduct = (product: Product) => {
    setSelectedItem(product);
    setActiveModal("edit-product");
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      setLoading(true);
      const response = await collectionsApi.delete(id);
      toast.success(response.message || "Collection deleted successfully");
      loadCollections();
      // Refresh explore page cache since collections changed
      await refreshExploreCache();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete collection";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true);
      const response = await productsApi.delete(id);
      toast.success(response.message || "Product deleted successfully");
      loadProducts();
      // Refresh explore page cache since products changed
      await refreshExploreCache();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content Management System
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 -mb-px">
            <button
              onClick={() => setActiveTab("collections")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "collections"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Products
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "collections" ? (
          <CollectionsTab
            collections={collections}
            onCreateCollection={handleCreateCollection}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
            loading={loading}
          />
        ) : (
          <ProductsTab
            products={products}
            collections={collections}
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        )}
      </div>

      {/* Modals */}
      {activeModal === "create-collection" && (
        <CollectionModal
          onClose={() => setActiveModal(null)}
          onSave={async (data) => {
            try {
              setLoading(true);
              await collectionsApi.create(data as CreateCollectionRequest);
              toast.success("Collection created successfully");
              loadCollections();
              // Refresh explore page cache since collections changed
              await refreshExploreCache();
              setActiveModal(null);
            } catch (error) {
              toast.error("Failed to create collection");
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {activeModal === "edit-collection" && selectedItem && (
        <CollectionModal
          collection={selectedItem as Collection}
          onClose={() => setActiveModal(null)}
          onSave={async (data) => {
            try {
              setLoading(true);
              await collectionsApi.update(
                (selectedItem as Collection).id,
                data as UpdateCollectionRequest
              );
              toast.success("Collection updated successfully");
              loadCollections();
              // Refresh explore page cache since collections changed
              await refreshExploreCache();
              setActiveModal(null);
            } catch (error) {
              toast.error("Failed to update collection");
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {activeModal === "create-product" && (
        <ProductModal
          collections={collections}
          onClose={() => setActiveModal(null)}
          onSave={async (data) => {
            try {
              setLoading(true);
              await productsApi.create(data as CreateProductRequest);
              toast.success("Product created successfully");
              loadProducts();
              // Refresh explore page cache since products changed
              await refreshExploreCache();
              setActiveModal(null);
            } catch (error) {
              toast.error("Failed to create product");
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {activeModal === "edit-product" && selectedItem && (
        <ProductModal
          product={selectedItem as Product}
          collections={collections}
          onClose={() => setActiveModal(null)}
          onSave={async (data) => {
            try {
              setLoading(true);
              await productsApi.update(
                (selectedItem as Product).id,
                data as UpdateProductRequest
              );
              toast.success("Product updated successfully");
              loadProducts();
              // Refresh explore page cache since products changed
              await refreshExploreCache();
              setActiveModal(null);
            } catch (error) {
              toast.error("Failed to update product");
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}

// Collections Tab Component
interface CollectionsTabProps {
  collections: Collection[];
  onCreateCollection: () => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (id: number) => void;
  loading: boolean;
}

function CollectionsTab({
  collections,
  onCreateCollection,
  onEditCollection,
  onDeleteCollection,
  loading,
}: CollectionsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Collections ({collections.length})
        </h2>
        <button
          onClick={onCreateCollection}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Create Collection
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {collections.map((collection) => (
                <tr
                  key={collection.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {collection.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {collection.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {collection.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        collection.isActive
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {collection.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditCollection(collection)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteCollection(collection.id)}
                      disabled={loading}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Products Tab Component
interface ProductsTabProps {
  products: Product[];
  collections: Collection[];
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  loading: boolean;
}

function ProductsTab({
  products,
  collections,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  loading,
}: ProductsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Products ({products.length})
        </h2>
        <button
          onClick={onCreateProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Create Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {(() => {
                        // Show primary image, fallback to first image
                        const primaryImage = product.images?.find(
                          (img) => img.isPrimary
                        );
                        const displayImage =
                          primaryImage || product.images?.[0];

                        return displayImage ? (
                          <img
                            className="h-10 w-10 rounded-md object-cover mr-3"
                            src={displayImage.url}
                            alt={displayImage.altText}
                          />
                        ) : null;
                      })()}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.collection?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.inStock === "Available"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {product.inStock}
                      </span>
                      {product.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      disabled={loading}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Collection Modal Component
interface CollectionModalProps {
  collection?: Collection;
  onClose: () => void;
  onSave: (
    data: CreateCollectionRequest | UpdateCollectionRequest
  ) => Promise<void>;
}

function CollectionModal({
  collection,
  onClose,
  onSave,
}: CollectionModalProps) {
  const [formData, setFormData] = useState({
    name: collection?.name || "",
    slug: collection?.slug || "",
    description: collection?.description || "",
    isActive: collection?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !collection ? generateSlug(name) : prev.slug,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {collection ? "Edit Collection" : "Create Collection"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {collection ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Product Modal Component
interface ProductModalProps {
  product?: Product;
  collections: Collection[];
  onClose: () => void;
  onSave: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
}

function ProductModal({
  product,
  collections,
  onClose,
  onSave,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    collectionId: product?.collection?.id || collections[0]?.id || 0,
    category: product?.category || "",
    material: product?.material || "",
    madeBy: product?.madeBy || "",
    inStock: product?.inStock || "Available",
    featured: product?.featured || false,
    otherDetails: product?.otherDetails || "",
  });

  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.sizes?.map((size) => ({
      size: size.size,
      price: product.price,
      stockQuantity: size.stockQuantity,
      available: size.available,
    })) || [{ size: "S", price: 0, stockQuantity: 0, available: true }]
  );

  const [images, setImages] = useState<ProductImage[]>(() => {
    if (product?.images && product.images.length > 0) {
      const mappedImages = product.images.map((img, index) => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        orderIndex: index,
      }));

      // Ensure at least one image is primary
      const hasPrimary = mappedImages.some((img) => img.isPrimary);
      if (!hasPrimary && mappedImages.length > 0) {
        mappedImages[0].isPrimary = true;
      }

      return mappedImages;
    }

    // Default for new products
    return [{ url: "", altText: "", isPrimary: true, orderIndex: 0 }];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validImages = images.filter((i) => i.url && i.altText);

    // Ensure at least one image is primary if there are valid images
    if (validImages.length > 0) {
      const hasPrimary = validImages.some((img) => img.isPrimary);
      if (!hasPrimary) {
        toast.error("Please select one image as primary");
        return;
      }
    }

    const data = {
      ...formData,
      productVariants: variants.filter((v) => v.size),
      productImages: validImages,
    };

    onSave(data);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        price: formData.price,
        stockQuantity: 0,
        available: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addImage = () => {
    setImages((prev) => {
      const newImage = {
        url: "",
        altText: "",
        isPrimary: prev.length === 0, // Make first image primary by default
        orderIndex: prev.length,
      };
      return [...prev, newImage];
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);

      // If we removed the primary image and there are still images left,
      // make the first remaining image primary
      if (prev[index]?.isPrimary && newImages.length > 0) {
        const hasOtherPrimary = newImages.some((img) => img.isPrimary);
        if (!hasOtherPrimary) {
          newImages[0].isPrimary = true;
        }
      }

      return newImages;
    });
  };

  const updateImage = (
    index: number,
    field: keyof ProductImage,
    value: any
  ) => {
    setImages((prev) => {
      const newImages = [...prev];

      if (field === "isPrimary" && value === true) {
        newImages.forEach((img, i) => {
          if (i !== index) {
            img.isPrimary = false;
          }
        });
      }

      newImages[index] = { ...newImages[index], [field]: value };
      return newImages;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {product ? "Edit Product" : "Create Product"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Basic Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Collection
                  </label>
                  <select
                    value={formData.collectionId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        collectionId: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Material
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Made By
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Featured Product
                </label>
              </div>
            </div>

            {/* Variants and Images */}
            <div className="space-y-6">
              {/* Product Variants */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Product Variants
                  </h4>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-md"
                    >
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Size"
                          value={variant.size}
                          onChange={(e) =>
                            updateVariant(index, "size", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={variant.stockQuantity}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stockQuantity",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="flex items-center text-sm">
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
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1"
                          />
                          Available
                        </label>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Product Images
                  </h4>
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    + Add Image
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Select one image as primary. Only one image can be primary at
                  a time. The primary image will be displayed in product
                  listings.
                </p>

                <div className="space-y-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-md"
                    >
                      <div className="space-y-2">
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={image.url}
                          onChange={(e) =>
                            updateImage(index, "url", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Alt Text"
                          value={image.altText}
                          onChange={(e) =>
                            updateImage(index, "altText", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="flex justify-between items-center">
                          <label className="flex items-center text-sm">
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
                              disabled={
                                !image.isPrimary &&
                                images.some(
                                  (img, i) => i !== index && img.isPrimary
                                )
                              }
                              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span
                              className={
                                image.isPrimary
                                  ? "text-blue-600 dark:text-blue-400 font-medium"
                                  : ""
                              }
                            >
                              Primary Image {image.isPrimary ? "✓" : ""}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
