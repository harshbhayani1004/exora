"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

export default function CartButton() {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-dark/15 transition-colors hover:border-dark hover:bg-white"
      aria-label={`Shopping bag with ${itemCount} items`}
    >
      <ShoppingBag className="h-4.5 w-4.5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
