"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch(console.error);
    }
  }, [id]);

  let shippingAddress: any = null;
  if (order?.shippingAddress) {
    try {
      shippingAddress = typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress;
    } catch {
      shippingAddress = { street: order.shippingAddress };
    }
  }

  return (
    <div className="min-h-screen bg-cream py-12 md:py-20">
      <div className="site-container max-w-3xl">
        <div className="soft-card p-8 md:p-14 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage text-dark">
            <CheckCircle2 className="h-10 w-10 text-coral" />
          </div>

          <p className="eyebrow text-coral mt-6">Order Received</p>
          <h1 className="display-title text-4xl md:text-6xl mt-2">
            Blooms on their way.
          </h1>
          <p className="mt-4 text-sm text-dark/60 max-w-md mx-auto leading-relaxed">
            Thank you for ordering from the EXORA studio. We have received your order and are carefully preparing your handmade flower arrangement.
          </p>

          <div className="mt-8 rounded-2xl bg-white/70 border border-dark/10 p-6 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark/10 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-dark/45">Order Reference</p>
                <p className="font-serif text-xl font-bold mt-0.5">{order?.orderNumber || id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-butter px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {order?.status || "CONFIRMED"}
                </span>
                <span className="rounded-full bg-sage px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {order?.paymentGateway || "COD"}
                </span>
              </div>
            </div>

            {shippingAddress && (
              <div className="border-b border-dark/10 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-dark/45">Shipping to</p>
                <p className="text-sm font-semibold mt-1">{order?.customerName}</p>
                <p className="text-xs text-dark/60 leading-5">
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </p>
                {order?.customerPhone && <p className="text-xs text-dark/60">Phone: {order.customerPhone}</p>}
              </div>
            )}

            {order?.items && order.items.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-dark/45 mb-2">Arrangements</p>
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id || item.productName} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="font-serif">${item.subtotal?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dark/10 mt-3 pt-3 flex justify-between font-serif text-lg">
                  <span>Total</span>
                  <span className="font-bold">${order?.total?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/collection" className="btn-primary w-full sm:w-auto">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/account/orders" className="btn-secondary w-full sm:w-auto">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
