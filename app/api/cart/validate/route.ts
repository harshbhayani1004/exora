import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/products-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const freeShippingThreshold = parseFloat(
      process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "2500"
    );
    const standardShippingFee = parseFloat(
      process.env.NEXT_PUBLIC_DEFAULT_SHIPPING_FEE || "120"
    );

    const verifiedItems: any[] = [];
    let subtotal = 0;
    let hasStockIssue = false;

    for (const item of items) {
      const productId = item.productId || item.product?.id;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      let currentProduct: any = null;

      try {
        currentProduct = await prisma.product.findUnique({
          where: { id: productId },
        });
      } catch {
        // DB fallback
        currentProduct = PRODUCTS.find((p) => p.id === productId);
      }

      if (!currentProduct) {
        currentProduct = PRODUCTS.find((p) => p.id === productId);
      }

      if (!currentProduct) {
        continue;
      }

      const unitPrice = currentProduct.salePrice || currentProduct.price;
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      const isOutOfStock =
        currentProduct.stockStatus === "outofstock" ||
        (currentProduct.stockQuantity !== undefined && currentProduct.stockQuantity <= 0);

      if (isOutOfStock) {
        hasStockIssue = true;
      }

      verifiedItems.push({
        productId: currentProduct.id,
        name: currentProduct.name,
        slug: currentProduct.slug,
        unitPrice,
        quantity,
        subtotal: itemSubtotal,
        isOutOfStock,
        availableQuantity: currentProduct.stockQuantity ?? 10,
      });
    }

    const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
    const shippingFee = isFreeShipping ? 0 : standardShippingFee;
    const total = subtotal + shippingFee;

    return NextResponse.json({
      success: true,
      items: verifiedItems,
      subtotal,
      shippingFee,
      total,
      isFreeShipping,
      freeShippingThreshold,
      amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal),
      hasStockIssue,
    });
  } catch (error: any) {
    console.error("Cart validate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate cart" },
      { status: 500 }
    );
  }
}
