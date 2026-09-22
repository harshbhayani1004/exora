import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/products-data";
import { requireAdmin } from "@/lib/backend/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    try {
      // Build Prisma where query
      const where: any = {};

      if (featured === "true") {
        where.featured = true;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category && category !== "all") {
        where.categories = {
          some: {
            category: {
              slug: category,
            },
          },
        };
      }

      // Build orderBy
      let orderBy: any = { createdAt: "desc" };
      if (sort === "price_asc") orderBy = { price: "asc" };
      if (sort === "price_desc") orderBy = { price: "desc" };
      if (sort === "name_asc") orderBy = { name: "asc" };

      const [dbProducts, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            categories: { include: { category: true } },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      if (dbProducts.length > 0) {
        const formatted = dbProducts.map((p) => ({
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
        }));

        return NextResponse.json({
          success: true,
          products: formatted,
          total,
          page,
          limit,
        });
      }
    } catch (dbError) {
      console.warn("Database query failed, falling back to static product catalog:", dbError);
    }

    // Graceful fallback to PRODUCTS static array
    let filtered = [...PRODUCTS];

    if (featured === "true") {
      filtered = filtered.filter((p) => p.featured);
    }

    if (category && category !== "all") {
      filtered = filtered.filter((p) =>
        p.categories.some((c) => c.slug === category)
      );
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      products: paginated,
      total,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const {
      name,
      slug,
      description,
      short_description,
      price,
      regular_price,
      sale_price,
      on_sale,
      stock_status,
      stock_quantity,
      featured,
      images,
      category_ids,
    } = body;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { success: false, error: "Name, slug, and price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        shortDescription: short_description || null,
        price: parseFloat(price),
        regularPrice: parseFloat(regular_price || price),
        salePrice: sale_price ? parseFloat(sale_price) : null,
        onSale: Boolean(on_sale),
        stockStatus: stock_status || "instock",
        stockQuantity: stock_quantity !== undefined ? parseInt(stock_quantity, 10) : 50,
        featured: Boolean(featured),
        images: images && images.length > 0 ? {
          create: images.map((img: any, idx: number) => ({
            src: img.src,
            alt: img.alt || name,
            name: img.name || img.src,
            sortOrder: idx,
          })),
        } : undefined,
        categories: category_ids && category_ids.length > 0 ? {
          create: category_ids.map((id: number) => ({
            categoryId: id,
          })),
        } : undefined,
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status }
    );
  }
}
