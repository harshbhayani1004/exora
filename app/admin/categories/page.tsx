"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    displayOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Delete State
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/categories");
      if (res.ok) {
        const d = await res.json();
        if (d.success) setCategories(d.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      image: "",
      displayOrder: categories.length + 1,
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "",
      displayOrder: cat.displayOrder ?? 0,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.slug) {
      setError("Name and slug are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
        description: form.description?.trim() || null,
        image: form.image?.trim() || null,
        displayOrder: parseInt(form.displayOrder.toString(), 10) || 0,
      };

      let res;
      if (editingCategory) {
        res = await adminFetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save category");
      }

      showToast(editingCategory ? "Collection updated!" : "Collection created!");
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Collection deleted from taxonomy.");
        setDeletingCategory(null);
        loadCategories();
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-dark px-5 py-3 text-xs font-semibold text-white shadow-2xl border border-white/20 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-coral shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full">
            Taxonomy & Navigation
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1 text-dark tracking-tight">
            Arrangement Collections ({categories.length})
          </h1>
          <p className="text-xs text-dark/60 mt-0.5">
            Organize flowers by occasion, materials, technique (Crochet, Pipe Cleaner, Wedding, etc.).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-3.5 py-2 text-xs font-semibold hover:bg-cream transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-coral transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4 text-coral" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center text-dark/40">
          <RefreshCw className="h-8 w-8 mx-auto animate-spin text-coral mb-2" />
          <p className="font-serif text-sm">Loading collections from database...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center text-dark/40 rounded-3xl bg-white border border-dark/5">
          <FolderTree className="h-12 w-12 mx-auto text-dark/20 mb-3" />
          <p className="font-serif text-lg font-bold text-dark">No collections created yet</p>
          <p className="text-xs mt-1">Create your first floral category to group arrangements.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id || c.slug}
              className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/10 text-coral font-bold font-serif text-xl shadow-2xs">
                    {c.name?.[0] || "✦"}
                  </div>
                  <span className="rounded-full bg-cream px-3 py-1 text-[10px] font-bold text-dark/70 font-mono">
                    {c.count ?? 0} items
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-dark">{c.name}</h3>
                <p className="text-xs text-dark/40 font-mono mt-0.5">slug: /{c.slug}</p>
                <p className="text-xs text-dark/60 mt-2.5 line-clamp-2 leading-relaxed">
                  {c.description || "Handcrafted studio floral collection."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-dark/10 flex items-center justify-between">
                <Link
                  href={`/collection?category=${c.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-coral hover:underline flex items-center gap-1"
                >
                  Storefront <ExternalLink className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="h-8 w-8 rounded-lg border border-dark/10 flex items-center justify-center text-dark/60 hover:bg-cream hover:text-dark transition"
                    title="Edit category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingCategory(c)}
                    className="h-8 w-8 rounded-lg border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-50 transition"
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs animate-fade-in">
          <div className="rounded-3xl bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl border border-dark/10 text-xs">
            <div className="flex items-center justify-between border-b border-dark/10 pb-4 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-dark">
                  {editingCategory ? "Edit Collection" : "New Collection"}
                </h3>
                <p className="text-xs text-dark/50">Manage store floral taxonomy grouping.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="h-8 w-8 rounded-full bg-cream flex items-center justify-center text-dark/60 hover:bg-dark hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-800 mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name,
                      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    }));
                  }}
                  placeholder="e.g. Wedding & Bridal"
                  className="w-full h-10 rounded-xl border border-dark/20 bg-cream/20 px-3 outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="wedding-bridal"
                  className="w-full h-10 rounded-xl border border-dark/20 bg-cream/20 px-3 outline-none focus:border-coral font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Summary for collection header and SEO..."
                  className="w-full rounded-xl border border-dark/20 bg-cream/20 p-3 outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... or /images/..."
                  className="w-full h-10 rounded-xl border border-dark/20 bg-cream/20 px-3 outline-none focus:border-coral font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-dark/20 font-bold hover:bg-cream transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-dark text-white font-bold uppercase tracking-wider hover:bg-coral transition shadow-md flex items-center gap-1.5"
                >
                  {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingCategory ? "Save Changes" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs animate-fade-in">
          <div className="rounded-3xl bg-white w-full max-w-sm p-6 shadow-2xl border border-dark/10 text-center text-xs">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-dark">Delete Collection?</h3>
            <p className="text-dark/60 mt-1 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-dark">"{deletingCategory.name}"</span>?
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-dark/20 font-bold hover:bg-cream transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-md flex items-center gap-1.5"
              >
                {isDeleting && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Delete Collection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
