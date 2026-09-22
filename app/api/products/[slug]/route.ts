import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/products-data";
import { requireAdmin } from "@/lib/backend/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    try {
      const p = await prisma.product.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          categories: { include: { category: true } },
        },
      });

      if (p) {
        return NextResponse.json({
          success: true,
          product: {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            short_description: p.shortDescription || undefined,
            price: p.price,
            regular_price: p.regularPrice,
            sale_price: p.salePrice || undefined,
            on_sale: p.onSale,
            stock_status: p.stockStatus as "instock" | "outofstock" | "onbackorder",
            stock_quantity: p.stockQuantity,
            featured: p.featured,
            images: p.images.map((img) => ({
              id: img.id,
              src: img.src,
              alt: img.alt || p.name,
              name: img.name || img.src,
            })),
            categories: p.categories.map((c) => ({
              id: c.category.id,
              name: c.category.name,
              slug: c.category.slug,
              description: c.category.description || undefined,
              count: 0,
            })),
            created_at: p.createdAt.toISOString(),
            updated_at: p.updatedAt.toISOString(),
          },
        });
      }
    } catch (dbError) {
      console.warn("DB query for slug failed, falling back to static data:", dbError);
    }

    // Static fallback
    const staticProduct = PRODUCTS.find((p) => p.slug === slug);
    if (!staticProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: staticProduct,
    });
  } catch (error: any) {
    console.error("Product slug API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin(request);
    const { slug } = await params;
    const body = await request.json();

    const updated = await prisma.product.update({
      where: { slug },
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.short_description,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        regularPrice: body.regular_price !== undefined ? parseFloat(body.regular_price) : undefined,
        salePrice: body.sale_price !== undefined ? parseFloat(body.sale_price) : undefined,
        onSale: body.on_sale !== undefined ? Boolean(body.on_sale) : undefined,
        stockStatus: body.stock_status,
        stockQuantity: body.stock_quantity !== undefined ? parseInt(body.stock_quantity, 10) : undefined,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin(request);
    const { slug } = await params;

    await prisma.product.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Delete product error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status }
    );
  }
}
