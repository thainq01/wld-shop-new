import { create } from 'zustand';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  isActive: boolean;
}

interface CollectionState {
  collections: Collection[];
  currentCollection: Collection | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCollections: () => Promise<void>;
  setCurrentCollection: (collectionId: string) => void;
  clearError: () => void;
}

// Mock API function - replace with real API call
const fetchCollectionsFromAPI = async (): Promise<Collection[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: "core-collection",
      name: "Core Collection",
      description: "Essential pieces for everyday wear",
      productCount: 5,
      isActive: true,
    },
    {
      id: "limited-drop",
      name: "Limited Drop",
      description: "Exclusive limited edition items", 
      productCount: 4,
      isActive: true,
    },
    {
      id: "seasonal",
      name: "Seasonal",
      description: "Seasonal collection items",
      productCount: 8,
      isActive: false,
    },
  ];
};

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  currentCollection: null,
  isLoading: false,
  error: null,
  
  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    try {
      const collections = await fetchCollectionsFromAPI();
      set({ collections, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch collections',
        isLoading: false 
      });
    }
  },
  
  setCurrentCollection: (collectionId: string) => {
    const { collections } = get();
    const collection = collections.find(c => c.id === collectionId);
    set({ currentCollection: collection || null });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));
