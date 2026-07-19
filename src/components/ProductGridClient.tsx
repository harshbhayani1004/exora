"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/storage";

interface ProductGridClientProps {
  products: Product[];
  onAuthRequired?: () => void;
}

function ProductGridClient({ products, onAuthRequired }: ProductGridClientProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(
    (event: React.MouseEvent, product: Product) => {
      event.preventDefault();
      event.stopPropagation();
      addItem(product, onAuthRequired);
    },
    [addItem, onAuthRequired],
  );

  if (!products.length) {
    return (
      <div className="soft-card col-span-full py-20 text-center">
        <p className="font-serif text-3xl">This corner is still growing.</p>
        <p className="mt-2 text-sm text-dark/50">Try another collection while our makers work their magic.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
      {products.map((product, index) => {
        const image = product.images[0];
        return (
          <article key={product.id} className="group">
            <div className={`image-reveal relative aspect-[3/4] overflow-hidden bg-white ${
              index % 3 === 1 ? "rounded-[5rem_5rem_1.5rem_1.5rem]" : "rounded-[1.5rem]"
            }`}>
              <Link href={`/collection/${product.slug}`} className="absolute inset-0">
                {image ? (
                  <Image
                    src={getImageUrl(image.src)}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    quality={82}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 30vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-sage text-xs font-bold uppercase tracking-widest text-dark/40">
                    Image coming soon
                  </div>
                )}
              </Link>

              {product.featured && (
                <span className="absolute left-3 top-3 rounded-full bg-butter px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider">
                  Loved
                </span>
              )}

              <button
                onClick={(event) => handleAddToCart(event, product)}
                className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark shadow-lg transition-all hover:rotate-90 hover:bg-coral hover:text-white md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Link href={`/collection/${product.slug}`} className="mt-4 block">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-dark/40">
                    {product.categories[0]?.name || "Handmade bloom"}
                  </p>
                  <h3 className="font-serif text-lg leading-tight md:text-2xl">{product.name}</h3>
                </div>
                <ArrowUpRight className="mt-1 hidden h-4 w-4 shrink-0 text-coral transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:block" />
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                <span>${(product.sale_price || product.price).toFixed(2)}</span>
                {product.on_sale && (
                  <span className="text-xs text-dark/35 line-through">${product.regular_price.toFixed(2)}</span>
                )}
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export default memo(ProductGridClient);
