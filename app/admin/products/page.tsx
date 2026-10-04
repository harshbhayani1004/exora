"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Flower2,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  RefreshCw,
  X,
  CheckCircle,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  // Delete modal
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminFetch("/api/products?limit=150"),
        adminFetch("/api/categories"),
      ]);

      if (prodRes.ok) {
        const d = await prodRes.json();
        if (d.success) setProducts(d.products || []);
      }
      if (catRes.ok) {
        const d = await catRes.json();
        if (d.success) setCategories(d.categories || []);
      }
    } catch (err) {
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/products/${deletingProduct.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Arrangement "${deletingProduct.name}" removed from catalog.`);
        setDeletingProduct(null);
        loadData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "ALL" ||
        p.categories?.some((c: any) => c.slug === categoryFilter);
      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "instock" && p.stock_status === "instock") ||
        (stockFilter === "outofstock" && p.stock_status !== "instock");

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-dark px-5 py-3 text-xs font-semibold text-white shadow-2xl border border-white/20 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-coral shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full">
            Inventory & Catalog
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1 text-dark tracking-tight">
            Floral Arrangements ({products.length})
          </h1>
          <p className="text-xs text-dark/60 mt-0.5">
            Manage your store catalog, pricing, Cloudflare R2 photography, and categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-3.5 py-2 text-xs font-semibold hover:bg-cream transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
            <span>Sync</span>
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-coral transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4 text-coral" />
            <span>Add Arrangement</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-dark/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="h-4 w-4 text-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by flower name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-8 rounded-xl border border-dark/15 bg-cream/30 text-xs outline-none focus:border-coral focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-xl border border-dark/15 bg-white px-3 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">All Collections ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="h-10 rounded-xl border border-dark/15 bg-white px-3 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="instock">In Stock Only</option>
            <option value="outofstock">Out of Stock Only</option>
          </select>
        </div>

        <span className="text-xs text-dark/50 font-medium">
          Showing <span className="font-bold text-dark">{filteredProducts.length}</span> items
        </span>
      </div>

      {/* Catalog Table */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-dark/40">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-coral mb-2" />
            <p className="font-serif text-sm">Retrieving arrangement records...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-dark/40">
            <Flower2 className="h-12 w-12 mx-auto text-dark/20 mb-3" />
            <p className="font-serif text-lg font-bold text-dark">No arrangements match your filters</p>
            <p className="text-xs mt-1">Try clearing your search query or collection selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dark/10 text-[10px] font-bold uppercase tracking-wider text-dark/40">
                  <th className="pb-3 pl-2">Arrangement</th>
                  <th className="pb-3">Collections</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Inventory</th>
                  <th className="pb-3">Badges</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {filteredProducts.map((p) => {
                  const img = p.images?.[0]?.src || "/images/placeholder.jpg";
                  return (
                    <tr key={p.id} className="hover:bg-cream/40 transition">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.name}
                            className="h-12 w-12 rounded-xl object-cover bg-cream shrink-0 border border-dark/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300";
                            }}
                          />
                          <div>
                            <Link
                              href={`/admin/products/${p.slug}`}
                              className="font-serif font-bold text-sm text-dark hover:text-coral transition leading-tight block"
                            >
                              {p.name}
                            </Link>
                            <p className="text-[10px] text-dark/40 font-mono mt-0.5">
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {p.categories && p.categories.length > 0 ? (
                            p.categories.map((c: any) => (
                              <span
                                key={c.id || c.slug}
                                className="rounded-md bg-dark/5 px-2 py-0.5 text-[10px] font-medium"
                              >
                                {c.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-dark/30 italic">Uncategorized</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <p className="font-serif font-bold text-sm">₹{p.price?.toFixed(2)}</p>
                        {p.regular_price && p.regular_price > p.price && (
                          <p className="text-[10px] text-dark/40 line-through">
                            ₹{p.regular_price?.toFixed(2)}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            p.stock_status === "instock"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.stock_status} ({p.stock_quantity ?? 0})
                        </span>
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          {p.featured && (
                            <span className="rounded-md bg-amber-100 text-amber-900 px-1.5 py-0.5 text-[10px] font-bold">
                              ★ Featured
                            </span>
                          )}
                          {p.on_sale && (
                            <span className="rounded-md bg-coral/15 text-coral px-1.5 py-0.5 text-[10px] font-bold">
                              Sale
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/collection/${p.slug}`}
                            target="_blank"
                            className="h-8 w-8 rounded-lg border border-dark/10 flex items-center justify-center text-dark/60 hover:bg-cream hover:text-dark transition"
                            title="View on public storefront"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.slug}`}
                            className="h-8 w-8 rounded-lg border border-dark/10 flex items-center justify-center text-dark/60 hover:bg-cream hover:text-dark transition"
                            title="Edit arrangement details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="h-8 w-8 rounded-lg border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-50 transition"
                            title="Delete arrangement"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs animate-fade-in">
          <div className="rounded-3xl bg-white w-full max-w-sm p-6 shadow-2xl border border-dark/10 text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-dark">Confirm Deletion</h3>
            <p className="text-xs text-dark/60 mt-1 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-dark">"{deletingProduct.name}"</span>?
              This will remove the item and its images from the PostgreSQL database.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-dark/20 text-xs font-bold hover:bg-cream transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition shadow-md flex items-center gap-1.5"
              >
                {isDeleting && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
