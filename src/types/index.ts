export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  regular_price: number;
  sale_price?: number;
  on_sale: boolean;
  images: ProductImage[];
  categories: Category[];
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity?: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
