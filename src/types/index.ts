export type Theme = 'dark' | 'light';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: 'Available' | 'Sold Out';
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}