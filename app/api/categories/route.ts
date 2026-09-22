import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, MAIN_GROUPS } from "@/lib/category-data";
import { requireAdmin } from "@/lib/backend/auth";

export async function GET() {
  try {
    try {
      const dbCategories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { displayOrder: "asc" },
      });

      if (dbCategories.length > 0) {
        const formatted = dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || undefined,
          image: c.image || undefined,
          count: c._count.products,
        }));

        return NextResponse.json({
          success: true,
          categories: formatted,
          mainGroups: MAIN_GROUPS,
        });
      }
    } catch (dbError) {
      console.warn("DB query for categories failed, falling back to static data:", dbError);
    }

    // Static fallback
    return NextResponse.json({
      success: true,
      categories: Object.values(CATEGORIES),
      mainGroups: MAIN_GROUPS,
    });
  } catch (error: any) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { name, slug, description, image, displayOrder } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("Create category error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status }
    );
  }
}
