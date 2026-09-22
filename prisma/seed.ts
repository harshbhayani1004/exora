import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS } from "../src/lib/products-data";
import { CATEGORIES } from "../src/lib/category-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting EXORA database seeding...");

  // 1. Seed Studio Admin Account
  const adminPasswordHash = await bcrypt.hash("ExoraStudio2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@exora.in" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@exora.in",
      passwordHash: adminPasswordHash,
      name: "Exora Studio Admin",
      phone: "+91 78618 86462",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin account created: ${admin.email}`);

  // 2. Seed Demo Customer Account
  const customerPasswordHash = await bcrypt.hash("ExoraCustomer2026!", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: customerPasswordHash,
      name: "Ananya Sharma",
      phone: "+91 98765 43210",
      role: "CUSTOMER",
      addresses: JSON.stringify([
        {
          id: "addr-1",
          street: "Flat 402, Lotus Residency, Vesu",
          city: "Surat",
          state: "Gujarat",
          postalCode: "395007",
          country: "India",
          isDefault: true,
        },
      ]),
    },
  });
  console.log(`✅ Demo customer account created: ${customer.email}`);

  // 3. Seed Categories
  const categoryMap = new Map<string, number>();
  for (const cat of Object.values(CATEGORIES)) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description || null,
        image: cat.image || null,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        image: cat.image || null,
      },
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // 4. Seed Products and their Images
  let productCount = 0;
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        shortDescription: p.short_description || null,
        price: p.price,
        regularPrice: p.regular_price,
        salePrice: p.sale_price || null,
        onSale: p.on_sale,
        stockStatus: p.stock_status,
        featured: p.featured,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.short_description || null,
        price: p.price,
        regularPrice: p.regular_price,
        salePrice: p.sale_price || null,
        onSale: p.on_sale,
        stockStatus: p.stock_status,
        stockQuantity: p.stock_status === "outofstock" ? 0 : 25,
        featured: p.featured,
      },
    });

    // Handle images
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    if (p.images && p.images.length > 0) {
      await prisma.productImage.createMany({
        data: p.images.map((img, idx) => ({
          productId: product.id,
          src: img.src,
          alt: img.alt || product.name,
          name: img.name || img.src,
          sortOrder: idx,
        })),
      });
    }

    // Handle categories
    await prisma.productCategory.deleteMany({ where: { productId: product.id } });
    for (const cat of p.categories) {
      const categoryId = categoryMap.get(cat.slug);
      if (categoryId) {
        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: categoryId,
          },
        });
      }
    }
    productCount++;
  }
  console.log(`✅ Seeded ${productCount} products with images and category links.`);

  console.log("✨ EXORA database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
