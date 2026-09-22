import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/backend/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      items: items.map((item) => item.product),
    });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch wishlist" },
      { status }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId is required" },
        { status: 400 }
      );
    }

    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(productId, 10),
        },
      },
      update: {},
      create: {
        userId: user.id,
        productId: parseInt(productId, 10),
      },
    });

    return NextResponse.json({ success: true, message: "Added to wishlist" });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update wishlist" },
      { status }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId is required" },
        { status: 400 }
      );
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
        productId: parseInt(productId, 10),
      },
    });

    return NextResponse.json({ success: true, message: "Removed from wishlist" });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove from wishlist" },
      { status }
    );
  }
}
