"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  Flower2,
  Users,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
  Clock,
  PlusCircle,
  Mail,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, inquiriesRes] = await Promise.all([
        adminFetch("/api/admin/stats"),
        adminFetch("/api/admin/orders?limit=6"),
        adminFetch("/api/products?limit=100"),
        adminFetch("/api/admin/inquiries"),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.success) setStats(d.stats);
      }
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        if (d.success) setRecentOrders(d.orders || []);
      }
      if (productsRes.ok) {
        const d = await productsRes.json();
        if (d.success) setProducts(d.products || []);
      }
      if (inquiriesRes.ok) {
        const d = await inquiriesRes.json();
        if (d.success) setInquiries(d.inquiries || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const lowStockProducts = products.filter((p) => p.stock_quantity < 10 || p.stock_status === "outofstock");
  const unreadInquiries = inquiries.filter((i) => i.status === "UNREAD");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full">
              Studio Portal Overview
            </span>
            <span className="text-xs text-dark/40 font-mono">
              {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-2 tracking-tight text-dark">
            Studio Performance & Hub
          </h1>
          <p className="text-xs sm:text-sm text-dark/60 mt-1 max-w-xl">
            Real-time telemetry on orders, flower inventory, customer engagement, and sales transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-dark/15 bg-cream/50 px-4 py-2 text-xs font-bold text-dark hover:bg-white transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
            <span>Sync Stats</span>
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-coral transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" /> Add Arrangement
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between text-dark/40 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold tracking-tight text-dark">
            ₹{stats?.totalRevenue?.toLocaleString("en-IN") || "0"}
          </p>
          <p className="text-xs text-dark/50 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Settled across all payment gateways
          </p>
        </div>

        {/* Orders */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between text-dark/40 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold tracking-tight text-dark">
            {stats?.totalOrders ?? recentOrders.length}
          </p>
          <p className="text-xs text-dark/50 mt-2">
            <span className="font-bold text-amber-600">{stats?.pendingOrders || 0}</span> orders awaiting fulfillment
          </p>
        </div>

        {/* Catalog */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between text-dark/40 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalog</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-coral">
              <Flower2 className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold tracking-tight text-dark">
            {stats?.totalProducts ?? products.length}
          </p>
          <p className="text-xs text-dark/50 mt-2">
            Handmade floral arrangements in PostgreSQL
          </p>
        </div>

        {/* Inquiries */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between text-dark/40 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Messages</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold tracking-tight text-dark">
            {inquiries.length}
          </p>
          <p className="text-xs text-dark/50 mt-2">
            <span className="font-bold text-coral">{unreadInquiries.length}</span> unread messages in inbox
          </p>
        </div>
      </div>

      {/* Main Grid: Orders & Side Widgets */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-dark/5">
          <div className="flex items-center justify-between border-b border-dark/10 pb-4 mb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-dark">Recent Customer Orders</h2>
              <p className="text-xs text-dark/50">Latest incoming purchases and checkout activity.</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-coral hover:underline flex items-center gap-1"
            >
              All Orders ({stats?.totalOrders || recentOrders.length}) <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-14 text-center text-dark/40">
              <Package className="h-12 w-12 mx-auto text-dark/20 mb-2" />
              <p className="font-serif text-lg">No orders recorded yet.</p>
              <p className="text-xs mt-1">Purchases created on the storefront will appear here live.</p>
            </div>
          ) : (
            <div className="divide-y divide-dark/5">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-cream/30 px-2 rounded-xl transition">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-serif font-bold text-sm text-dark hover:text-coral transition"
                      >
                        {order.orderNumber}
                      </Link>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
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
                    </div>
                    <p className="text-xs text-dark/60 mt-0.5 truncate">
                      {order.customerName} • {order.items?.length || 0} items ({order.paymentGateway})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-serif font-bold text-sm">₹{order.total?.toFixed(2)}</p>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[10px] font-semibold text-coral hover:underline flex items-center justify-end gap-0.5 mt-0.5"
                    >
                      Inspect <ArrowUpRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Stack: Inventory & Quick Links */}
        <div className="space-y-6">
          {/* Inventory Health */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5">
            <h3 className="font-serif text-lg font-bold mb-1 text-dark">Inventory Health</h3>
            <p className="text-xs text-dark/50 mb-4">Stock level monitors & alerts.</p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream/60">
                <span className="font-semibold text-dark/80">In Stock Catalog Items</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {products.filter((p) => p.stock_status === "instock").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream/60">
                <span className="font-semibold text-dark/80">Featured Arrangements</span>
                <span className="font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-md">
                  {products.filter((p) => p.featured).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream/60">
                <span className="font-semibold text-dark/80">Active Sale Promos</span>
                <span className="font-bold text-dark bg-dark/10 px-2 py-0.5 rounded-md">
                  {products.filter((p) => p.on_sale).length}
                </span>
              </div>
            </div>

            {lowStockProducts.length > 0 && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{lowStockProducts.length} items low or out of stock</p>
                  <Link href="/admin/products" className="text-amber-800 underline font-semibold mt-0.5 block">
                    Review inventory & restock →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Hub Navigation */}
          <div className="rounded-3xl bg-dark text-white p-6 shadow-md space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-coral">Quick Directory</p>
              <h4 className="font-serif text-lg font-bold mt-0.5">Management Hubs</h4>
            </div>

            <div className="space-y-2 text-xs">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                <span>Bloom Catalog Table</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-coral" />
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                <span>Collections & Groups</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-coral" />
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                <span>Customer Directory</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-coral" />
              </Link>
              <Link
                href="/admin/inquiries"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                <span>Messages & Inquiries</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-coral" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
