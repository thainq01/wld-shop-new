export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  images: string[];
  availability: "Available" | "Sold Out";
  category: string;
  description: string;
  madeBy: string;
  inStock: string | number;
  material: string;
  sizeAndFit: string;
  otherDetails: string;
  sizes: string[];
}

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

export type ExpandableSection =
  | "about"
  | "material"
  | "sizeAndFit"
  | "otherDetails";
