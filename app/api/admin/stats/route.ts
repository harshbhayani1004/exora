import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/backend/auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);

    const [totalOrders, orders, totalProducts, inquiriesCount, subscribersCount] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.findMany({ select: { total: true, status: true, paymentStatus: true } }),
        prisma.product.count(),
        prisma.contactInquiry.count({ where: { status: "UNREAD" } }),
        prisma.newsletterSubscriber.count(),
      ]);

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "PAID" || o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const processingOrders = orders.filter((o) => o.status === "PROCESSING").length;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        processingOrders,
        totalProducts,
        unreadInquiries: inquiriesCount,
        subscribersCount,
      },
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch stats" },
      { status }
    );
  }
}
