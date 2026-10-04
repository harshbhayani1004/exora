"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flower2,
  ArrowLeft,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    regular_price: "",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: 50,
    featured: false,
    image_url: "",
    category_ids: [] as number[],
  });

  useEffect(() => {
    adminFetch("/api/categories")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.categories)) {
          setCategories(d.categories);
          if (d.categories.length > 0) {
            setForm((prev) => ({ ...prev, category_ids: [d.categories[0].id] }));
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({ ...prev, name, slug: prev.slug === "" || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? slug : prev.slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.slug || !form.price) {
      setError("Name, slug, and current price are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        short_description: form.short_description?.trim() || null,
        price: parseFloat(form.price),
        regular_price: parseFloat(form.regular_price || form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        on_sale: form.on_sale,
        stock_status: form.stock_status,
        stock_quantity: parseInt(form.stock_quantity.toString(), 10) || 0,
        featured: form.featured,
        category_ids: form.category_ids,
      };

      if (form.image_url) {
        payload.images = [
          {
            src: form.image_url.trim(),
            alt: form.name,
            name: form.name,
          },
        ];
      }

      const res = await adminFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create arrangement");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to save arrangement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="h-9 w-9 rounded-xl border border-dark/15 bg-white flex items-center justify-center text-dark/70 hover:bg-cream transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark">
              New Floral Arrangement
            </h1>
            <p className="text-xs text-dark/50">Add a handcrafted bouquet or piece to your live store.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Details Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
            1. Title & Descriptions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Arrangement Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Celestial White Lily Bouquet"
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="celestial-white-lily-bouquet"
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Short Tagline / Summary
            </label>
            <input
              type="text"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="Hand-knitted with organic cotton yarn and natural stems"
              className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Detailed Story & Floral Composition
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe materials, size, craft technique, and maintenance..."
              className="w-full rounded-xl border border-dark/20 bg-cream/20 p-4 outline-none focus:border-coral focus:bg-white transition text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
            2. Pricing & Inventory Controls
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1299"
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Regular / MRP (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.regular_price}
                onChange={(e) => setForm({ ...form, regular_price: e.target.value })}
                placeholder="1599"
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Discounted Sale Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                placeholder="Optional promo price"
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Stock Availability
              </label>
              <select
                value={form.stock_status}
                onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                className="w-full h-11 rounded-xl border border-dark/20 bg-white px-4 outline-none cursor-pointer text-xs font-semibold"
              >
                <option value="instock">In Stock (Available)</option>
                <option value="outofstock">Out of Stock (Hidden from Cart)</option>
                <option value="onbackorder">On Backorder (Made to order)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Stock Quantity Count
              </label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) =>
                  setForm({ ...form, stock_quantity: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
              />
            </div>
          </div>
        </div>

        {/* Media & Taxonomy Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
            3. Photography & Collections
          </h2>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Arrangement Photo URL (Cloudflare R2 or Web image)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev/... or /images/..."
                className="flex-1 h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-mono"
              />
              {form.image_url && (
                <div className="h-11 w-11 rounded-xl border border-dark/20 overflow-hidden bg-cream shrink-0">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300";
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] text-dark/40 mt-1">
              Tip: Paste the direct Cloudflare R2 bucket image link, or an image link from public assets.
            </p>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-2">
              Assign to Collections
            </label>
            {loadingCategories ? (
              <p className="text-dark/40 italic">Loading collections...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const isChecked = form.category_ids.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => {
                        const next = isChecked
                          ? form.category_ids.filter((id) => id !== c.id)
                          : [...form.category_ids, c.id];
                        setForm({ ...form, category_ids: next });
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                        isChecked
                          ? "bg-dark text-white border-dark shadow-xs"
                          : "bg-cream/40 text-dark/70 border-dark/15 hover:border-dark"
                      }`}
                    >
                      {isChecked && "✓ "}
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Badges Toggles */}
          <div className="flex flex-wrap items-center gap-8 pt-3 border-t border-dark/10">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded accent-coral"
              />
              <span className="font-bold text-dark">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.on_sale}
                onChange={(e) => setForm({ ...form, on_sale: e.target.checked })}
                className="h-4 w-4 rounded accent-coral"
              />
              <span className="font-bold text-dark">Highlight as On Sale</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-dark/20 font-bold hover:bg-cream transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-dark text-white font-bold uppercase tracking-widest hover:bg-coral transition shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-coral" /> Saving...
              </>
            ) : (
              "Publish Arrangement"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
