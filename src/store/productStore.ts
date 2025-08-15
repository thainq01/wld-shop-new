import { create } from "zustand";

// Function to fetch multiple random dog images
const fetchRandomDogImages = async (count: number): Promise<string[]> => {
  try {
    const imagePromises = Array(count)
      .fill(null)
      .map(() =>
        fetch("https://dog.ceo/api/breeds/image/random")
          .then((response) => response.json())
          .then((data) => data.message)
      );
    const images = await Promise.all(imagePromises);
    return images.filter(Boolean); // Remove any failed requests
  } catch (error) {
    console.error("Failed to fetch random dog images:", error);
    return [];
  }
};

// Function to generate and cache product images
const generateProductImages = async (
  productId: string,
  imageCount: number = 3
): Promise<string[]> => {
  const cacheKey = `product-images-${productId}`;
  const cachedImages = localStorage.getItem(cacheKey);

  if (cachedImages) {
    try {
      return JSON.parse(cachedImages);
    } catch {
      // If parsing fails, generate new images
    }
  }

  const images = await fetchRandomDogImages(imageCount);
  if (images.length > 0) {
    localStorage.setItem(cacheKey, JSON.stringify(images));
  }
  return images;
};

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  images: string[];
  availability: string;
  category: string;
  description: string;
  madeBy: string;
  inStock: string;
  material: string;
  sizeAndFit: string;
  otherDetails: string;
  sizes: string[];
}

// Mock product details data - replace with real API calls
const mockProductDetails: Record<string, ProductDetail> = {
  "core-1": {
    id: "core-1",
    name: "Unique Human Oversized Hoodie",
    price: 60.0,
    images: ["hoodie-front", "hoodie-back", "hoodie-detail"],
    availability: "Available",
    category: "Core Collection",
    description:
      "The extra-soft hoodie features Unique Human embroidery and a classic World logo on the right sleeve.",
    madeBy: "World",
    inStock: "∞",
    material: "80% cotton, 20% recycled polyester fleece",
    sizeAndFit: "Relaxed oversized fit with dropped shoulders",
    otherDetails:
      "This hoodie is made especially for you after you place an order, which is why it takes a bit longer to deliver it to you.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "core-2": {
    id: "core-2",
    name: "Unique Human T-Shirt",
    price: 30.0,
    images: ["tshirt-front", "tshirt-back", "tshirt-detail"],
    availability: "Available",
    category: "Core Collection",
    description:
      "Premium cotton t-shirt with minimalist Unique Human branding.",
    madeBy: "World",
    inStock: "∞",
    material: "100% organic cotton",
    sizeAndFit: "Regular fit with classic neckline",
    otherDetails:
      "Made with sustainable materials and ethical manufacturing practices.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "core-3": {
    id: "core-3",
    name: "Unique Human Hat",
    price: 25.0,
    images: ["hat-front", "hat-side", "hat-detail"],
    availability: "Available",
    category: "Core Collection",
    description: "Classic cap with embroidered Unique Human logo.",
    madeBy: "World",
    inStock: "∞",
    material: "100% cotton twill",
    sizeAndFit: "Adjustable strap, one size fits most",
    otherDetails: "Durable construction with reinforced stitching.",
    sizes: ["One Size"],
  },
  "core-4": {
    id: "core-4",
    name: "Unique Human Crewneck",
    price: 50.0,
    images: ["crewneck-front", "crewneck-back", "crewneck-detail"],
    availability: "Available",
    category: "Core Collection",
    description: "Comfortable crewneck sweatshirt with subtle branding.",
    madeBy: "World",
    inStock: "∞",
    material: "70% cotton, 30% recycled polyester",
    sizeAndFit: "Regular fit with ribbed cuffs and hem",
    otherDetails: "Pre-shrunk fabric with color-safe washing.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "core-5": {
    id: "core-5",
    name: "Not A Bot Hat",
    price: 29.99,
    images: ["bot-hat-front", "bot-hat-side", "bot-hat-detail"],
    availability: "Available",
    category: "Core Collection",
    description:
      "Statement hat with 'Not A Bot' embroidery and unique design elements.",
    madeBy: "World",
    inStock: "∞",
    material: "100% cotton canvas",
    sizeAndFit: "Adjustable snapback, one size fits most",
    otherDetails: "Limited edition design with premium embroidery.",
    sizes: ["One Size"],
  },
  // Limited Drop Products
  "limited-1": {
    id: "limited-1",
    name: "Limited Edition Hoodie",
    price: 85.0,
    images: ["hoodie-front", "hoodie-back", "hoodie-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Exclusive limited edition hoodie with premium materials.",
    madeBy: "World",
    inStock: "50",
    material: "85% organic cotton, 15% recycled polyester",
    sizeAndFit: "Oversized fit with dropped shoulders and extended length",
    otherDetails: "Limited run of 500 pieces with authenticity certificate.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "limited-2": {
    id: "limited-2",
    name: "Exclusive Crewneck",
    price: 65.0,
    images: ["crewneck-front", "crewneck-back", "crewneck-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Premium crewneck sweatshirt with exclusive design.",
    madeBy: "World",
    inStock: "75",
    material: "80% cotton, 20% recycled polyester fleece",
    sizeAndFit: "Regular fit with ribbed cuffs and hem",
    otherDetails: "Exclusive colorway only available in this collection.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "limited-3": {
    id: "limited-3",
    name: "Rare Design Tee",
    price: 40.0,
    images: ["tshirt-front", "tshirt-back", "tshirt-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Rare artist collaboration t-shirt with unique print.",
    madeBy: "World",
    inStock: "120",
    material: "100% organic cotton",
    sizeAndFit: "Classic fit with crew neckline",
    otherDetails: "Collaboration with emerging artist. Limited print run.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "limited-4": {
    id: "limited-4",
    name: "Collector's Cap",
    price: 45.0,
    images: ["hat-front", "hat-side", "hat-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Premium collector's cap with exclusive embroidered design.",
    madeBy: "World",
    inStock: "200",
    material: "100% wool felt with leather strap",
    sizeAndFit: "Adjustable leather strap, one size fits most",
    otherDetails: "Collectible design with serialized numbering.",
    sizes: ["One Size"],
  },
  "limited-5": {
    id: "limited-5",
    name: "Premium Bot Hat",
    price: 55.0,
    images: ["bot-hat-front", "bot-hat-side", "bot-hat-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Premium version of the iconic 'Not A Bot' hat.",
    madeBy: "World",
    inStock: "100",
    material: "Premium cotton canvas with embroidered details",
    sizeAndFit: "Adjustable snapback, one size fits most",
    otherDetails: "Premium materials. Limited to 300 pieces worldwide.",
    sizes: ["One Size"],
  },
  "limited-6": {
    id: "limited-6",
    name: "Signature Hoodie",
    price: 90.0,
    images: ["hoodie-front", "hoodie-back", "hoodie-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Signature premium hoodie with luxury materials.",
    madeBy: "World",
    inStock: "25",
    material: "90% organic cotton, 10% cashmere blend",
    sizeAndFit: "Luxury oversized fit with premium finishing",
    otherDetails: "Hand-finished details. Very limited quantity.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "limited-7": {
    id: "limited-7",
    name: "Artist Collaboration Tee",
    price: 50.0,
    images: ["tshirt-front", "tshirt-back", "tshirt-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Special artist collaboration with unique artwork.",
    madeBy: "World",
    inStock: "150",
    material: "100% organic cotton with specialty ink",
    sizeAndFit: "Modern fit with slightly tapered silhouette",
    otherDetails: "Collaboration with street artist. Includes signature tag.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  "limited-8": {
    id: "limited-8",
    name: "Limited Crewneck V2",
    price: 70.0,
    images: ["crewneck-front", "crewneck-back", "crewneck-detail"],
    availability: "Available",
    category: "Limited Drop",
    description: "Second iteration of the popular limited crewneck.",
    madeBy: "World",
    inStock: "80",
    material: "Heavyweight cotton fleece with vintage wash",
    sizeAndFit: "Relaxed fit with vintage-inspired proportions",
    otherDetails: "Updated design. Pre-washed for vintage feel.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
};

interface ProductState {
  products: Record<string, ProductDetail>;
  currentProduct: ProductDetail | null;
  isLoading: boolean;
  error: string | null;

  // Collection-specific states
  coreCollectionProducts: ProductDetail[];
  limitedDropProducts: ProductDetail[];
  sliderProducts: ProductDetail[];
  isLoadingCoreCollection: boolean;
  isLoadingLimitedDrop: boolean;
  isLoadingSlider: boolean;

  // Actions
  fetchProductDetail: (productId: string) => Promise<void>;
  fetchCoreCollectionProducts: () => Promise<void>;
  fetchLimitedDropProducts: () => Promise<void>;
  fetchSliderProducts: () => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: mockProductDetails,
  currentProduct: null,
  isLoading: false,
  error: null,

  // Collection-specific initial states
  coreCollectionProducts: [],
  limitedDropProducts: [],
  sliderProducts: [],
  isLoadingCoreCollection: false,
  isLoadingLimitedDrop: false,
  isLoadingSlider: false,

  fetchProductDetail: async (productId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const product = mockProductDetails[productId];
      if (!product) {
        throw new Error("Product not found");
      }

      // Generate random dog images for this product
      const randomImages = await generateProductImages(productId, 4); // Generate 4 images for variety

      // Update product with random dog images if generated successfully
      const productWithImages =
        randomImages.length > 0
          ? { ...product, images: randomImages }
          : product;

      set({ currentProduct: productWithImages, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
        isLoading: false,
        currentProduct: null,
      });
    }
  },

  fetchCoreCollectionProducts: async () => {
    set({ isLoadingCoreCollection: true });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const coreProducts = Object.values(mockProductDetails).filter(
        (product) => product.category === "Core Collection"
      );

      // Generate random images for each core collection product
      const productsWithImages = await Promise.all(
        coreProducts.map(async (product) => {
          const randomImages = await generateProductImages(product.id, 1); // Just 1 image for collection view
          return randomImages.length > 0
            ? { ...product, images: randomImages }
            : product;
        })
      );

      set({
        coreCollectionProducts: productsWithImages,
        isLoadingCoreCollection: false,
      });
    } catch {
      set({ isLoadingCoreCollection: false });
    }
  },

  fetchLimitedDropProducts: async () => {
    set({ isLoadingLimitedDrop: true });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const limitedProducts = Object.values(mockProductDetails).filter(
        (product) => product.category === "Limited Drop"
      );

      // Generate random images for each limited drop product
      const productsWithImages = await Promise.all(
        limitedProducts.map(async (product) => {
          const randomImages = await generateProductImages(product.id, 1); // Just 1 image for collection view
          return randomImages.length > 0
            ? { ...product, images: randomImages }
            : product;
        })
      );

      set({
        limitedDropProducts: productsWithImages,
        isLoadingLimitedDrop: false,
      });
    } catch {
      set({ isLoadingLimitedDrop: false });
    }
  },

  fetchSliderProducts: async () => {
    set({ isLoadingSlider: true });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // For slider, we can use a mix of products or all products
      const sliderProducts = Object.values(mockProductDetails).slice(0, 6);

      set({ sliderProducts, isLoadingSlider: false });
    } catch {
      set({ isLoadingSlider: false });
    }
  },

  clearError: () => set({ error: null }),
}));
