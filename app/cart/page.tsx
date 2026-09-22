"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { getImageUrl } from "@/lib/storage";

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCartStore();
  const shipping = total >= 100 || total === 0 ? 0 : 12.99;
  const orderTotal = total + shipping;

  return (
    <div className="min-h-screen bg-cream">
      <section className="paper-noise border-b border-dark/10 py-12 md:py-20">
        <div className="site-container">
          <Link
            href="/collection"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark/50 hover:text-coral"
          >
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
          <div className="flex items-end justify-between gap-6">
            <h1 className="display-title text-6xl md:text-8xl">Your bag.</h1>
            {itemCount > 0 && <p className="pb-2 text-sm text-dark/45">{itemCount} handmade {itemCount === 1 ? "piece" : "pieces"}</p>}
          </div>
        </div>
      </section>

      <section className="site-container py-12 md:py-20">
        {items.length === 0 ? (
          <div className="soft-card mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center md:py-28">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="display-title mt-8 text-5xl">Room to bloom.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-dark/55">
              Your bag is empty, but the studio is full of colour. Find a piece that feels like you.
            </p>
            <Link href="/collection" className="btn-primary mt-8">Explore the collection</Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:gap-14">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow text-dark/45">Your selection</p>
                <button onClick={clearCart} className="text-xs font-semibold text-dark/45 hover:text-coral">Clear bag</button>
              </div>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.article
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="mb-3 grid grid-cols-[100px_1fr] gap-4 rounded-[1.5rem] border border-dark/10 bg-white/45 p-3 md:grid-cols-[150px_1fr] md:gap-6 md:p-4"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-sage">
                      {item.product.images[0] && (
                        <Image
                          src={getImageUrl(item.product.images[0].src)}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-dark/35">{item.product.categories[0]?.name}</p>
                          <h2 className="mt-1 font-serif text-xl leading-tight md:text-2xl">{item.product.name}</h2>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dark/10 text-dark/40 hover:border-coral hover:text-coral"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div className="flex h-10 items-center rounded-full border border-dark/12 bg-white px-1">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream" aria-label="Decrease quantity">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream" aria-label="Increase quantity">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-xl">${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <aside>
              <div className="sticky top-28 rounded-[2rem] bg-dark p-7 text-white md:p-9">
                <p className="eyebrow text-butter">Order summary</p>
                <div className="mt-8 space-y-4 text-sm">
                  <div className="flex justify-between text-white/60"><span>Subtotal</span><span className="text-white">${total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-white/60"><span>Shipping</span><span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                  {shipping > 0 && <p className="rounded-xl bg-white/7 p-3 text-xs leading-5 text-white/50">You are ${(100 - total).toFixed(2)} away from free shipping.</p>}
                  <div className="flex justify-between border-t border-white/15 pt-5 font-serif text-2xl"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-coral text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-dark"
                >
                  Continue to checkout
                </Link>
                <p className="mt-4 text-center text-[10px] uppercase tracking-wider text-white/35">Secure checkout · Carefully packed</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
