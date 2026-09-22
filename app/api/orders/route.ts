import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/backend/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please log in to view your orders" },
        { status: 401 }
      );
    }

    try {
      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { userId: user.id },
            { customerEmail: user.email.toLowerCase() },
          ],
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        orders,
      });
    } catch (dbError) {
      console.warn("DB orders fetch failed:", dbError);
      return NextResponse.json({
        success: true,
        orders: [],
      });
    }
  } catch (error: any) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
