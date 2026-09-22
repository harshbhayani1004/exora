"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { getCurrentUser, type User } from "@/lib/auth";

export default function CustomerOrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) {
        fetch("/api/orders")
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.orders) {
              setOrders(data.orders);
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12 md:py-20">
      <div className="site-container max-w-4xl">
        <Link
          href="/collection"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark/50 hover:text-coral"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Garden
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow text-coral mb-2">Customer Studio Portal</p>
            <h1 className="display-title text-5xl md:text-6xl">Your Orders.</h1>
          </div>
          {user && (
            <p className="text-sm text-dark/60 pb-2">
              Signed in as <span className="font-semibold text-dark">{user.email}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="soft-card p-12 text-center text-dark/50 font-serif text-xl">
            Loading your orders...
          </div>
        ) : !user ? (
          <div className="soft-card p-12 text-center">
            <Package className="h-12 w-12 text-coral mx-auto mb-4" />
            <h2 className="font-serif text-3xl">Sign in to view orders</h2>
            <p className="mt-3 text-sm text-dark/60 max-w-md mx-auto">
              Please log in to your EXORA account to track and view your order history.
            </p>
            <Link href="/" className="btn-primary mt-6 inline-block">
              Return Home
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="soft-card p-12 text-center">
            <Package className="h-12 w-12 text-dark/30 mx-auto mb-4" />
            <h2 className="font-serif text-3xl">No orders yet</h2>
            <p className="mt-3 text-sm text-dark/60 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Discover our handmade flower collections!
            </p>
            <Link href="/collection" className="btn-primary mt-6 inline-block">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="soft-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-transform hover:-translate-y-0.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl font-bold">{order.orderNumber}</span>
                    <span className="rounded-full bg-butter px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                    <span className="rounded-full bg-sage px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {order.paymentGateway}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark/50">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{order.items?.length || 0} arrangement(s)</span>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <p className="text-sm text-dark/70 line-clamp-1">
                      {order.items.map((i: any) => `${i.quantity}x ${i.productName}`).join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-dark/10">
                  <p className="font-serif text-2xl font-bold">${order.total.toFixed(2)}</p>
                  <Link
                    href={`/order-confirmation/${order.orderNumber}`}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-coral hover:underline"
                  >
                    View Receipt <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
