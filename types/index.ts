export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  imageUrls: string[];
  stock: number;
  category: string;
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  reviewCount?: number;
  discount?: number; // Percentage discount (e.g., 20 for 20% off)
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  rating: number; // 1-5 stars
  text: string;
  author?: string;
  createdAt: Date;
}

export interface ReviewInput {
  productId: string;
  rating: number;
  text: string;
  author?: string;
  createdAt?: string; // ISO date string for custom date
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: Date;
  customerEmail?: string;
}
