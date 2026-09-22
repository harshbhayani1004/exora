import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/backend/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUserFromRequest(request);

    try {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id: id }, { orderNumber: id }],
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // Check authorization: allow if admin, owner, or if customer email provided
      const { searchParams } = new URL(request.url);
      const emailQuery = searchParams.get("email")?.toLowerCase().trim();

      const isAuthorized =
        (user && (user.role === "ADMIN" || user.id === order.userId || user.email.toLowerCase() === order.customerEmail.toLowerCase())) ||
        (emailQuery && emailQuery === order.customerEmail.toLowerCase()) ||
        !order.userId; // Guest order accessible right after checkout with order number

      if (!isAuthorized) {
        return NextResponse.json(
          { success: false, error: "Unauthorized to view this order" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        order,
      });
    } catch (dbError) {
      console.warn("DB order fetch failed:", dbError);
      return NextResponse.json(
        { success: false, error: "Order lookup unavailable" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Order details API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
