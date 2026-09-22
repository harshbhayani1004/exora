import { getImageUrl } from "./storage";
import { PRODUCTS } from "./products-data";
import type { Product } from "@/types";

/**
 * Fetch all products (API with static fallback)
 */
export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
}): Promise<Product[]> {
  try {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (options?.category) params.set("category", options.category);
      if (options?.featured) params.set("featured", "true");
      if (options?.search) params.set("search", options.search);
      if (options?.sort) params.set("sort", options.sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          return data.products.map((product: Product) => ({
            ...product,
            images: product.images.map((img) => ({
              ...img,
              src: getImageUrl(img.src),
            })),
          }));
        }
      }
    }
  } catch (err) {
    console.warn("Client fetch getProducts failed, using fallback:", err);
  }

  // Fallback to static PRODUCTS
  let list = PRODUCTS;
  if (options?.category && options.category !== "all") {
    list = list.filter((p) => p.categories.some((c) => c.slug === options.category));
  }
  if (options?.featured) {
    list = list.filter((p) => p.featured);
  }
  return list.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      src: getImageUrl(img.src),
    })),
  }));
}

/**
 * Fetch a single product by slug (API with static fallback)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch(`/api/products/${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          const product = data.product;
          return {
            ...product,
            images: product.images.map((img: any) => ({
              ...img,
              src: getImageUrl(img.src),
            })),
          };
        }
      }
    }
  } catch (err) {
    console.warn("Client fetch getProductBySlug failed, using fallback:", err);
  }

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
 * Fetch featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true });
}

/**
 * Create a new order via Backend API
 */
export async function createOrder(orderData: {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: Record<string, unknown> | string;
  billing_address?: Record<string, unknown> | string;
  total: number;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  payment_gateway?: string;
  notes?: string;
}) {
  try {
    const res = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        return data.order;
      }
    }
  } catch (err) {
    console.warn("Order creation API call failed, saving to localStorage as backup:", err);
  }

  // Local fallback
  const order = {
    id: `local-${Date.now()}`,
    orderNumber: `EXO-LOC-${Date.now().toString(36).toUpperCase()}`,
    ...orderData,
    status: "PENDING",
    payment_status: "PENDING",
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  return order;
}
