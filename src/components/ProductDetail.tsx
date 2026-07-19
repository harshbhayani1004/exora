"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Gift, Heart, Minus, Plus, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/storage";

interface ProductDetailProps {
  product: Product;
  onAuthRequired?: () => void;
}

export default function ProductDetail({ product, onAuthRequired }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const image = product.images[0];

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let count = 0; count < quantity; count += 1) {
      addItem(product, onAuthRequired);
    }
    window.setTimeout(() => setIsAdding(false), 650);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="site-container py-8 md:py-14">
        <Link
          href="/collection"
          className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-dark/55 hover:text-coral"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all blooms
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage">
              {image ? (
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt || product.name}
                  fill
                  priority
                  quality={90}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-serif text-3xl text-dark/30">
                  Fresh from the studio soon
                </div>
              )}
              {product.featured && (
                <span className="absolute left-5 top-5 rounded-full bg-butter px-4 py-2 text-[10px] font-bold uppercase tracking-wider">
                  Studio favourite
                </span>
              )}
            </div>
            <div className="absolute -bottom-5 right-5 rounded-2xl bg-coral px-5 py-4 text-white shadow-xl md:right-8">
              <p className="text-[10px] font-bold uppercase tracking-wider">Made by hand</p>
              <p className="mt-1 font-serif text-xl">One of a kind</p>
            </div>
          </div>

          <div className="flex flex-col justify-center py-4 lg:py-10">
            <p className="eyebrow mb-4 text-coral">
              {product.categories.map((category) => category.name).join(" · ")}
            </p>
            <h1 className="display-title text-5xl md:text-7xl">{product.name}</h1>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-serif text-3xl">${(product.sale_price || product.price).toFixed(2)}</span>
              {product.on_sale && (
                <span className="text-sm text-dark/35 line-through">${product.regular_price.toFixed(2)}</span>
              )}
            </div>
            <p className="mt-7 max-w-xl text-base leading-7 text-dark/62">{product.description}</p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-14 items-center rounded-full border border-dark/15 bg-white/40 px-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-7 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock_status === "outofstock"}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding ? <><Check className="h-4 w-4" /> Added</> : "Add to bag"}
              </button>
              <button
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dark/15 hover:bg-white"
                aria-label="Save to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 grid gap-3 border-t border-dark/10 pt-7 sm:grid-cols-2">
              <div className="flex gap-3 rounded-2xl bg-white/45 p-4">
                <Truck className="h-5 w-5 shrink-0 text-coral" />
                <div>
                  <p className="text-sm font-bold">Carefully delivered</p>
                  <p className="mt-1 text-xs leading-5 text-dark/50">Packed by hand and protected on its way.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl bg-white/45 p-4">
                <Gift className="h-5 w-5 shrink-0 text-coral" />
                <div>
                  <p className="text-sm font-bold">Ready for gifting</p>
                  <p className="mt-1 text-xs leading-5 text-dark/50">Add a personal note after checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
