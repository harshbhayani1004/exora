import { getImageUrl } from "./storage";
import { PRODUCTS } from "./products-data";
import type { Product } from "@/types";

/**
 * Fetch all products (static data with R2 images)
 */
export async function getProducts(): Promise<Product[]> {
  // Transform product images to use R2 URLs
  return PRODUCTS.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      src: getImageUrl(img.src),
    })),
  }));
}

/**
 * Fetch a single product by slug (static data with R2 images)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) return null;

  return {
    ...product,
    images: product.images.map((img) => ({
      ...img,
      src: getImageUrl(img.src),
    })),
  };
}

/**
 * Fetch featured products (static data with R2 images)
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const featured = PRODUCTS.filter((product) => product.featured).slice(0, 6);

  return featured.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      src: getImageUrl(img.src),
    })),
  }));
}

/**
 * Create a new order (localStorage based - no database)
 */
export async function createOrder(orderData: {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  total: number;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}) {
  // Create order object with ID
  const order = {
    id: Date.now(),
    ...orderData,
    status: "pending",
    payment_status: "pending",
    created_at: new Date().toISOString(),
  };

  // Save to localStorage (in production, send to API)
  if (typeof window !== "undefined") {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  return order;
}
