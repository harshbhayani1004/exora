"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/storage";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  onAuthRequired?: () => void;
}

function ProductCard({
  product,
  onAuthRequired,
}: ProductCardProps) {
  const mainImage = product.images[0];
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, onAuthRequired);
  };

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-gray-100">
          {mainImage && (
            <Image
              src={getImageUrl(mainImage.src)}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
              loading="lazy"
              quality={80}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {product.on_sale && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Sale
            </div>
          )}

          {/* Add to Cart Button on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 transition-transform duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 will-change-transform">
            <button
              onClick={handleAddToCart}
              className="w-full bg-dark text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.on_sale && product.sale_price ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                ${product.sale_price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.regular_price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        {product.stock_status === "outofstock" && (
          <p className="text-sm text-red-600 font-medium">Out of Stock</p>
        )}
      </div>
    </div>
  );
}

export default memo(ProductCard);
