"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  ShoppingBag,
  ShieldCheck,
  X,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/customers");
      if (res.ok) {
        const d = await res.json();
        if (d.success) setCustomers(d.customers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      );
    });
  }, [customers, search]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full">
            Accounts & Engagement
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1 text-dark tracking-tight">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-dark/60 mt-0.5">
            Registered accounts, ordering frequency, and lifetime transaction value.
          </p>
        </div>

        <button
          onClick={loadCustomers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold hover:bg-cream transition shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
          <span>Sync Accounts</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-dark/5 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="h-4 w-4 text-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
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

        <span className="text-xs text-dark/50 font-medium">
          Showing <span className="font-bold text-dark">{filtered.length}</span> members
        </span>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-dark/40">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-coral mb-2" />
            <p className="font-serif text-sm">Querying customer accounts from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-dark/40">
            <Users className="h-12 w-12 mx-auto text-dark/20 mb-3" />
            <p className="font-serif text-lg font-bold text-dark">No customers found</p>
            <p className="text-xs mt-1">Try modifying your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dark/10 text-[10px] font-bold uppercase tracking-wider text-dark/40">
                  <th className="pb-3 pl-2">Customer Profile</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Orders Placed</th>
                  <th className="pb-3">Lifetime Value</th>
                  <th className="pb-3 text-right pr-2">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/40 transition">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-dark text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                          {c.name?.[0]?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-dark leading-tight">{c.name}</p>
                          <p className="text-xs text-dark/50 mt-0.5">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-dark/70 font-mono text-xs">
                      {c.phone || <span className="text-dark/30 italic">No phone</span>}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                          c.role === "ADMIN"
                            ? "bg-dark text-white flex items-center gap-1 w-fit"
                            : "bg-cream text-dark/70"
                        }`}
                      >
                        {c.role === "ADMIN" && <ShieldCheck className="h-3 w-3 text-coral" />}
                        {c.role}
                      </span>
                    </td>

                    <td className="py-4">
                      <span className="font-bold text-dark font-mono text-xs">
                        {c.ordersCount || 0} orders
                      </span>
                    </td>

                    <td className="py-4">
                      <span className="font-serif font-bold text-sm text-dark">
                        ₹{(c.totalSpent || 0).toFixed(2)}
                      </span>
                    </td>

                    <td className="py-4 text-right pr-2 text-dark/40 font-mono text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
