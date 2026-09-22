"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { getImageUrl } from "@/lib/storage";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "Surat",
    state: "Gujarat",
    postalCode: "",
    notes: "",
    paymentGateway: "COD",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = total >= 100 || total === 0 ? 0 : 12.99;
  const orderTotal = total + shipping;

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || u.name,
          email: prev.email || u.email,
          phone: prev.phone || u.phone || "",
        }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }

    if (!formData.name || !formData.email || !formData.street || !formData.postalCode) {
      setError("Please fill in all required delivery fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.subtotal,
        })),
        payment_gateway: formData.paymentGateway,
        notes: formData.notes,
        total: orderTotal,
      };

      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      clearCart();
      const orderRef = data.order?.orderNumber || data.order?.id;
      router.push(`/order-confirmation/${orderRef}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during checkout.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4 text-center">
        <h1 className="display-title text-5xl">Your bag is empty</h1>
        <p className="mt-3 text-dark/60">Choose a bloom before checking out.</p>
        <Link href="/collection" className="btn-primary mt-6">
          Explore Garden
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 md:py-16">
      <div className="site-container">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark/50 hover:text-coral"
        >
          <ArrowLeft className="h-4 w-4" /> Back to bag
        </Link>

        <h1 className="display-title text-5xl md:text-7xl mb-8">Checkout.</h1>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="soft-card p-6 md:p-10 space-y-8">
            {error && (
              <div className="rounded-2xl bg-red-100 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <p className="eyebrow text-coral mb-3">01 · Contact & Shipping</p>
              <h2 className="font-serif text-2xl">Where should we deliver?</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Recipient's Name"
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">Street Address / Flat / Floor *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Apartment, Studio, Street number"
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-dark/50 mb-1">PIN / Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 395007"
                    className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dark/10 pt-6">
              <p className="eyebrow text-coral mb-3">02 · Special Note</p>
              <h2 className="font-serif text-2xl">Gift Message or Delivery Notes</h2>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Write a custom note to be handwritten by our studio, or specify delivery instructions..."
                className="mt-4 w-full rounded-xl border border-dark/15 bg-white p-4 text-sm outline-none focus:border-coral"
              />
            </div>

            <div className="border-t border-dark/10 pt-6">
              <p className="eyebrow text-coral mb-3">03 · Payment Method</p>
              <h2 className="font-serif text-2xl">Choose how to pay</h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                    formData.paymentGateway === "COD"
                      ? "border-coral bg-coral/5"
                      : "border-dark/15 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentGateway"
                    value="COD"
                    checked={formData.paymentGateway === "COD"}
                    onChange={handleChange}
                    className="accent-coral"
                  />
                  <div>
                    <p className="font-semibold text-sm">Cash on Delivery / Direct</p>
                    <p className="text-xs text-dark/50">Pay when your blooms arrive</p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                    formData.paymentGateway === "ONLINE"
                      ? "border-coral bg-coral/5"
                      : "border-dark/15 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentGateway"
                    value="ONLINE"
                    checked={formData.paymentGateway === "ONLINE"}
                    onChange={handleChange}
                    className="accent-coral"
                  />
                  <div>
                    <p className="font-semibold text-sm">Card / UPI / Netbanking</p>
                    <p className="text-xs text-dark/50">Instant online confirmation</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Placing your order..." : `Place Order · $${orderTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-dark p-7 text-white">
              <p className="eyebrow text-butter">Order Summary</p>

              <div className="mt-6 divide-y divide-white/10 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sage">
                      {item.product.images[0] && (
                        <Image
                          src={getImageUrl(item.product.images[0].src)}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="font-serif text-sm leading-snug line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-sm">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/15 pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Delivery</span>
                  <span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between border-t border-white/15 pt-4 font-serif text-2xl">
                  <span>Total</span>
                  <span className="text-butter">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="soft-card p-6 flex items-center gap-4 text-xs text-dark/70">
              <ShieldCheck className="h-8 w-8 text-coral shrink-0" />
              <div>
                <p className="font-bold text-dark">Studio Quality Guarantee</p>
                <p className="mt-0.5 text-dark/60">Every bouquet is carefully inspected, wired, and packed by hand.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
