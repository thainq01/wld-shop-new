import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Tag, Search, MoreVertical } from "lucide-react";
import { collectionsApi } from "../../../utils/api";
import {
  MultiLanguageCollection,
  CreateMultiLanguageCollectionRequest,
  UpdateMultiLanguageCollectionRequest,
} from "../../../types";
import { MultiLanguageCollectionModal } from "./MultiLanguageCollectionModal";

export function CollectionsManager() {
  const [collections, setCollections] = useState<MultiLanguageCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] =
    useState<MultiLanguageCollection | null>(null);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await collectionsApi.getAllMultiLanguage();

      // Check if response has data property, otherwise use response directly
      const collections = Array.isArray(response) ? response : response.data;
      setCollections(collections);
    } catch (error) {
      console.error("Failed to load collections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const handleCreate = async (data: CreateMultiLanguageCollectionRequest) => {
    try {
      await collectionsApi.createMultiLanguage(data);
      setModalOpen(false);
      // Refetch collections to get the latest data
      await loadCollections();
    } catch (error) {
      console.error("Failed to create collection:", error);
      throw error;
    }
  };

  const handleUpdate = async (
    id: number,
    data: UpdateMultiLanguageCollectionRequest
  ) => {
    try {
      await collectionsApi.updateMultiLanguage(id, data);
      setModalOpen(false);
      setEditingCollection(null);
      // Refetch collections to get the latest data
      await loadCollections();
    } catch (error) {
      console.error("Failed to update collection:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      await collectionsApi.delete(id);
      // Refetch collections to get the latest data
      await loadCollections();
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  // Helper function to get collection name (defaults to English)
  const getCollectionName = (collection: MultiLanguageCollection) => {
    return (
      collection?.translations.en?.name ||
      collection?.translations[collection?.defaultLanguage]?.name ||
      Object.values(collection?.translations || {})[0]?.name ||
      "Untitled"
    );
  };

  const filteredCollections = collections?.filter((collection) => {
    const name = getCollectionName(collection);
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection?.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  console.log("filteredCollections", filteredCollections);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Collections
          </h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Collections
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Manage your product collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingCollection(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Collection
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredCollections?.map((collection) => (
          <div
            key={collection?.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {getCollectionName(collection)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      /{collection?.slug}
                    </p>
                    {(() => {
                      const description =
                        collection?.translations.en?.description ||
                        collection?.translations[collection?.defaultLanguage]
                          ?.description ||
                        Object.values(collection?.translations || {})[0]
                          ?.description;
                      return (
                        description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {description}
                          </p>
                        )
                      );
                    })()}
                  </div>
                </div>

                {/* Dropdown menu */}
                <div className="relative group">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setEditingCollection(collection);
                          setModalOpen(true);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(collection?.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and metadata */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      collection?.isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {collection?.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                    {collection?.availableLanguages.length} language
                    {collection?.availableLanguages.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {collection?.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredCollections?.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No collections found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating a new collection"}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingCollection(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Collection
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <MultiLanguageCollectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCollection(null);
        }}
        collection={editingCollection}
        onSubmit={
          editingCollection
            ? (data) =>
                handleUpdate(
                  editingCollection?.id,
                  data as UpdateMultiLanguageCollectionRequest
                )
            : (data) =>
                handleCreate(data as CreateMultiLanguageCollectionRequest)
        }
      />
    </div>
  );
}
