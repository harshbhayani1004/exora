"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  DollarSign,
  CheckCircle,
  Flower2,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { getCurrentUser, loginUser, logout, type User } from "@/lib/auth";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Login form state for admin
  const [adminEmail, setAdminEmail] = useState("admin@exora.in");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Data State
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/orders${statusFilter !== "ALL" ? `?status=${statusFilter}` : ""}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) setOrders(ordersData.orders);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    }
  };

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
      if (u && u.role === "ADMIN") {
        fetchAdminData();
      }
    });
  }, [statusFilter]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const res = await loginUser(adminEmail, adminPassword);
    setIsLoggingIn(false);

    if (!res.success || !res.user) {
      setLoginError(res.error || "Login failed");
      return;
    }

    if (res.user.role !== "ADMIN") {
      setLoginError("This account does not have Studio Admin privileges.");
      return;
    }

    setUser(res.user);
    fetchAdminData();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-serif text-xl text-dark/60">Loading Studio Admin...</p>
      </div>
    );
  }

  // Not logged in as admin
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="soft-card w-full max-w-md p-8 md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white mx-auto mb-4">
            ✦
          </div>
          <p className="eyebrow text-coral text-center">Studio Portal</p>
          <h1 className="font-serif text-3xl text-center mt-1">Admin Sign In</h1>
          <p className="text-xs text-dark/50 text-center mt-2">
            Default seed admin: <code className="bg-dark/10 px-1 py-0.5 rounded">admin@exora.in</code>
          </p>

          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="rounded-xl bg-red-100 p-3 text-xs text-red-800">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-dark/50 mb-1">Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-dark/50 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="ExoraStudio2026!"
                className="w-full h-12 rounded-xl border border-dark/15 bg-white px-4 text-sm outline-none focus:border-coral"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              {isLoggingIn ? "Signing In..." : "Sign In to Studio"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-dark/50 hover:text-coral">
              ← Return to storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3efe6] py-10">
      <div className="site-container">
        {/* Admin Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white text-xs">
                ✦
              </span>
              <h1 className="font-serif text-3xl font-bold">EXORA Studio Admin</h1>
            </div>
            <p className="text-xs text-dark/50 mt-1">
              Logged in as <span className="font-bold text-dark">{user.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="flex items-center gap-1.5 rounded-full border border-dark/15 bg-white px-4 py-2 text-xs font-bold uppercase hover:bg-cream"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button
              onClick={() => logout().then(() => window.location.reload())}
              className="flex items-center gap-1.5 rounded-full border border-dark/15 bg-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-dark/5">
              <div className="flex items-center justify-between text-dark/40 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
                <DollarSign className="h-5 w-5 text-coral" />
              </div>
              <p className="font-serif text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-dark/40 mt-1">Completed & delivered</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-dark/5">
              <div className="flex items-center justify-between text-dark/40 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
                <Package className="h-5 w-5 text-butter" />
              </div>
              <p className="font-serif text-3xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-dark/40 mt-1">{stats.pendingOrders} awaiting fulfillment</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-dark/5">
              <div className="flex items-center justify-between text-dark/40 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Arrangements</span>
                <Flower2 className="h-5 w-5 text-sage" />
              </div>
              <p className="font-serif text-3xl font-bold">{stats.totalProducts}</p>
              <p className="text-xs text-dark/40 mt-1">Catalog items</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-dark/5">
              <div className="flex items-center justify-between text-dark/40 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Subscribers</span>
                <CheckCircle className="h-5 w-5 text-tan" />
              </div>
              <p className="font-serif text-3xl font-bold">{stats.subscribersCount}</p>
              <p className="text-xs text-dark/40 mt-1">{stats.unreadInquiries} unread inquiries</p>
            </div>
          </div>
        )}

        {/* Orders Table Container */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-dark/5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark/10 pb-5 mb-6">
            <h2 className="font-serif text-2xl font-bold">Studio Orders ({orders.length})</h2>

            <div className="flex items-center gap-2">
              <span className="text-xs text-dark/50 uppercase font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-dark/15 bg-cream px-3 py-1.5 text-xs font-semibold outline-none"
              >
                <option value="ALL">All Orders</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="py-12 text-center text-dark/40 font-serif text-lg">No orders matching this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-dark/10 text-[10px] font-bold uppercase tracking-wider text-dark/40">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Gateway</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/40">
                      <td className="py-4 font-serif font-bold">{order.orderNumber}</td>
                      <td className="py-4">
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="text-xs text-dark/50">{order.customerEmail}</p>
                      </td>
                      <td className="py-4 text-xs text-dark/70 max-w-xs truncate">
                        {order.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(", ") || "None"}
                      </td>
                      <td className="py-4 font-serif font-bold">${order.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold uppercase">
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
                      <td className="py-4 text-right">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="rounded-lg border border-dark/15 bg-white px-2 py-1 text-xs outline-none"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
