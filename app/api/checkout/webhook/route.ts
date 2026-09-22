import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, orderNumber, paymentId, paymentGateway } = body;

    // Support both Razorpay and Stripe webhook structures or generic webhook
    if (event === "payment.captured" || event === "checkout.session.completed" || event === "payment_success") {
      if (orderNumber) {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "PAID",
            status: "PROCESSING",
            paymentId: paymentId || null,
            paymentGateway: paymentGateway || "ONLINE",
          },
        });
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
