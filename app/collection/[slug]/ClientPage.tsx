"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";
import AuthModal from "@/components/AuthModal";
import type { Product } from "@/types";

export default function ClientPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then(setProduct);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <ProductDetail
        product={product}
        onAuthRequired={() => setShowAuthModal(true)}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
