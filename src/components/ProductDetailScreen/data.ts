import { useCartStore } from "../../store/cartStore";
import { useEffect, useState } from "react";
import { ProductDetail } from "./types";

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

export const useProductDetail = (productId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const detail = mockProductDetails[productId];
        if (!detail) {
          throw new Error("Product not found");
        }

        setProductDetail(detail);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  return {
    productDetail,
    isLoading,
    error,
    refetch: () => {
      if (productId) {
        const detail = mockProductDetails[productId];
        setProductDetail(detail || null);
      }
    },
  };
};

export const useAddToCart = () => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (
    productDetail: ProductDetail,
    selectedSize: string
  ) => {
    if (!selectedSize) {
      throw new Error("Please select a size");
    }

    addToCart({
      productId: productDetail.id,
      productName: productDetail.name,
      productPrice: productDetail.price,
      productImage: productDetail.images[0],
      size: selectedSize,
    });
  };

  return { addToCart: handleAddToCart };
};
