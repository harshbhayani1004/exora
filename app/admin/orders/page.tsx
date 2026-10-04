"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  RefreshCw,
  Eye,
  X,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/orders${statusFilter !== "ALL" ? `?status=${statusFilter}` : ""}`;
      const res = await adminFetch(url);
      if (res.ok) {
        const d = await res.json();
        if (d.success) setOrders(d.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  return (
    <div className="space-y-6 animate-fade-in">
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
            Fulfillment & Checkout
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1 text-dark tracking-tight">
            Orders Hub ({orders.length})
          </h1>
          <p className="text-xs text-dark/60 mt-0.5">
            Monitor incoming purchases, inspect delivery addresses, and advance shipping states.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold hover:bg-cream transition shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
          <span>Sync Orders</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-dark/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="h-4 w-4 text-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, customer name, or email..."
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

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-cream/60 p-1 rounded-xl overflow-x-auto">
            {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                  statusFilter === st
                    ? "bg-dark text-white shadow-xs"
                    : "text-dark/60 hover:text-dark"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-dark/50 font-medium">
          Showing <span className="font-bold text-dark">{filteredOrders.length}</span> orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-dark/40">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-coral mb-2" />
            <p className="font-serif text-sm">Fetching store orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-dark/40">
            <Package className="h-12 w-12 mx-auto text-dark/20 mb-3" />
            <p className="font-serif text-lg font-bold text-dark">No orders found</p>
            <p className="text-xs mt-1">Orders placed on the storefront will appear here live.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dark/10 text-[10px] font-bold uppercase tracking-wider text-dark/40">
                  <th className="pb-3 pl-2">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items Purchased</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/40 transition">
                    <td className="py-4 pl-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-serif font-bold text-sm text-dark hover:text-coral transition block leading-tight"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="text-[10px] text-dark/40 font-mono">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4">
                      <p className="font-semibold text-dark text-xs">{order.customerName}</p>
                      <p className="text-[10px] text-dark/50 font-mono">{order.customerEmail}</p>
                    </td>

                    <td className="py-4 text-xs text-dark/70 max-w-xs truncate">
                      {order.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(", ") || "1x Floral order"}
                    </td>

                    <td className="py-4">
                      <span className="font-serif font-bold text-sm text-dark">
                        ₹{order.total?.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-4">
                      <span className="rounded-md bg-cream px-2 py-0.5 text-[10px] font-bold uppercase">
                        {order.paymentGateway}
                      </span>
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-coral/10 text-coral"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="rounded-lg border border-dark/15 bg-white px-2 py-1 text-xs outline-none cursor-pointer hover:border-dark transition"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="h-7 w-7 rounded-lg border border-dark/10 flex items-center justify-center text-dark/60 hover:bg-cream hover:text-dark transition"
                          title="Inspect full order"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
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
