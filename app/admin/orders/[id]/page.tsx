"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  CheckCircle,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/orders`);
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.orders)) {
          const found = d.orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);
          setOrder(found || null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await adminFetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrder({ ...order, status: newStatus });
        showToast(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-dark/40">
        <RefreshCw className="h-8 w-8 mx-auto animate-spin text-coral mb-2" />
        <p className="font-serif text-sm">Fetching order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-dark/50 space-y-4">
        <p className="font-serif text-xl">Order not found</p>
        <Link href="/admin/orders" className="text-xs font-bold text-coral underline">
          ← Return to Orders Hub
        </Link>
      </div>
    );
  }

  let address: any = {};
  try {
    address = typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress || {};
  } catch {
    address = { street: order.shippingAddress };
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-dark px-5 py-3 text-xs font-semibold text-white shadow-2xl border border-white/20 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-coral shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="h-9 w-9 rounded-xl border border-dark/15 bg-white flex items-center justify-center text-dark/70 hover:bg-cream transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark">
                {order.orderNumber}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
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
            <p className="text-xs text-dark/40 font-mono mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status updater */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-dark/60 uppercase">Update Status:</span>
          <select
            disabled={updating}
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-10 rounded-xl border border-dark/20 bg-white px-3 text-xs font-bold outline-none cursor-pointer hover:border-coral transition shadow-xs"
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Customer, Shipping, Financials */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Customer Card */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-dark/10 pb-3 text-dark font-serif font-bold text-base">
            <User className="h-4 w-4 text-coral" /> Customer Information
          </div>
          <div className="space-y-1.5 pt-1">
            <p className="font-semibold text-sm text-dark">{order.customerName}</p>
            <p className="text-dark/70">Email: {order.customerEmail}</p>
            {order.customerPhone && <p className="text-dark/70">Phone: {order.customerPhone}</p>}
            <p className="text-dark/40 font-mono text-[10px]">User ID: {order.userId || "Guest checkout"}</p>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-dark/10 pb-3 text-dark font-serif font-bold text-base">
            <MapPin className="h-4 w-4 text-coral" /> Delivery Destination
          </div>
          <div className="space-y-1 pt-1 leading-relaxed">
            <p className="font-semibold text-dark">{order.customerName}</p>
            <p>{address.street || address.address || "Address on file"}</p>
            <p>
              {[address.city, address.state, address.postalCode || address.zip].filter(Boolean).join(", ")}
            </p>
            <p>{address.country || "India"}</p>
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
        <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
          Items Ordered ({order.items?.length || 0})
        </h2>

        <div className="divide-y divide-dark/5">
          {order.items && order.items.length > 0 ? (
            order.items.map((item: any, idx: number) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-sm text-dark">{item.productName}</p>
                  <p className="text-dark/50 text-[11px]">
                    Qty: {item.quantity} × ₹{item.unitPrice?.toFixed(2)}
                  </p>
                </div>
                <p className="font-serif font-bold text-sm text-dark">
                  ₹{item.subtotal?.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="py-4 text-dark/40 italic text-xs">Line items details not recorded.</p>
          )}
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-dark/10 space-y-2 text-xs">
          <div className="flex justify-between text-dark/70">
            <span>Subtotal</span>
            <span>₹{(order.subtotal || order.total)?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-dark/70">
            <span>Shipping Fee</span>
            <span>{order.shippingFee ? `₹${order.shippingFee.toFixed(2)}` : "FREE"}</span>
          </div>
          <div className="flex justify-between text-base font-serif font-bold text-dark pt-2 border-t border-dark/10">
            <span>Total Settled</span>
            <span className="text-coral">₹{order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Telemetry */}
      <div className="rounded-3xl bg-cream/60 p-6 border border-dark/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-dark/60" />
          <div>
            <p className="font-bold text-dark">Payment Method: {order.paymentGateway}</p>
            <p className="text-dark/50">Payment Status: {order.paymentStatus || "PENDING"}</p>
          </div>
        </div>

        {order.paymentId && (
          <span className="font-mono text-[11px] bg-white px-3 py-1 rounded-lg border border-dark/10">
            Transaction ID: {order.paymentId}
          </span>
        )}
      </div>
    </div>
  );
}
