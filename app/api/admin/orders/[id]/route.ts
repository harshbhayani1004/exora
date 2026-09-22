import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/backend/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const { status, paymentStatus, notes } = body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: any) {
    console.error("Admin update order error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status }
    );
  }
}
