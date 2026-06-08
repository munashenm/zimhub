import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Phones", slug: "phones", icon: "📱" },
  { name: "Computers", slug: "computers", icon: "💻" },
  { name: "Electronics", slug: "electronics", icon: "🔌" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Home Appliances", slug: "home-appliances", icon: "🏠" },
  { name: "Car Parts", slug: "car-parts", icon: "🚗" },
  { name: "Farming Supplies", slug: "farming-supplies", icon: "🌾" },
  { name: "Groceries", slug: "groceries", icon: "🛒" },
  { name: "Furniture", slug: "furniture", icon: "🪑" },
];

const SAMPLE_PRODUCTS = [
  {
    title: "Samsung Galaxy A54 5G — 128GB",
    slug: "samsung-galaxy-a54-128gb",
    description: "Brand new Samsung Galaxy A54 5G with 128GB storage, 6.4\" Super AMOLED display, 50MP camera. Unlocked, dual SIM. Full box with charger.",
    price: 299.99,
    condition: "New",
    categorySlug: "phones",
    images: ["https://placehold.co/600x600/16a34a/ffffff?text=Samsung+A54"],
  },
  {
    title: "HP Laptop 15 — Intel i5, 8GB RAM, 256GB SSD",
    slug: "hp-laptop-15-i5",
    description: "HP 15-inch laptop with Intel Core i5, 8GB RAM, 256GB SSD. Perfect for work and study. Windows 11 installed. Lightly used, excellent condition.",
    price: 450.00,
    condition: "Used - Like New",
    categorySlug: "computers",
    images: ["https://placehold.co/600x600/15803d/ffffff?text=HP+Laptop"],
  },
  {
    title: "JBL Flip 6 Bluetooth Speaker",
    slug: "jbl-flip-6-speaker",
    description: "Portable waterproof Bluetooth speaker with powerful sound. 12 hours battery life. IP67 rated. Brand new, sealed box.",
    price: 89.99,
    condition: "New",
    categorySlug: "electronics",
    images: ["https://placehold.co/600x600/16a34a/ffffff?text=JBL+Speaker"],
  },
  {
    title: "Men's Ankara Print Shirt — Large",
    slug: "mens-ankara-shirt-large",
    description: "Handmade Ankara print shirt, size Large. Vibrant Zimbabwe-inspired patterns. 100% cotton, machine washable.",
    price: 25.00,
    condition: "New",
    categorySlug: "fashion",
    images: ["https://placehold.co/600x600/15803d/ffffff?text=Ankara+Shirt"],
  },
  {
    title: "Defy 210L Chest Freezer",
    slug: "defy-210l-chest-freezer",
    description: "Defy 210 litre chest freezer. A-rated energy efficiency. Lockable lid. Perfect for bulk grocery storage. 2 years old, works perfectly.",
    price: 320.00,
    condition: "Used - Good",
    categorySlug: "home-appliances",
    images: ["https://placehold.co/600x600/16a34a/ffffff?text=Chest+Freezer"],
  },
  {
    title: "Toyota Corolla Brake Pads — Front Set",
    slug: "toyota-corolla-brake-pads",
    description: "Genuine quality front brake pads for Toyota Corolla 2008-2013 models. Easy installation. Brand new in box.",
    price: 35.00,
    condition: "New",
    categorySlug: "car-parts",
    images: ["https://placehold.co/600x600/15803d/ffffff?text=Brake+Pads"],
  },
  {
    title: "Hybrid Maize Seed — 10kg Bag",
    slug: "hybrid-maize-seed-10kg",
    description: "High-yield hybrid maize seed, 10kg bag. Suitable for Zimbabwe's climate zones. Expected yield: 8-10 tonnes per hectare.",
    price: 45.00,
    condition: "New",
    categorySlug: "farming-supplies",
    images: ["https://placehold.co/600x600/15803d/ffffff?text=Maize+Seed"],
  },
  {
    title: "Mealie Meal — 10kg Premium",
    slug: "mealie-meal-10kg",
    description: "Premium roller meal, 10kg bag. Fine consistency, perfect for sadza. Locally milled in Zimbabwe.",
    price: 8.50,
    condition: "New",
    categorySlug: "groceries",
    images: ["https://placehold.co/600x600/16a34a/ffffff?text=Mealie+Meal"],
  },
  {
    title: "3-Seater Lounge Suite — Grey Fabric",
    slug: "3-seater-lounge-suite-grey",
    description: "Modern 3-seater lounge suite in grey fabric. Solid wood frame, high-density foam cushions. Delivery available in Harare.",
    price: 550.00,
    condition: "New",
    categorySlug: "furniture",
    images: ["https://placehold.co/600x600/15803d/ffffff?text=Lounge+Suite"],
  },
];

async function main() {
  console.log("🌱 Seeding ZimHub database...");

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@zimhub.co.zw" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@zimhub.co.zw",
      passwordHash,
      phone: "+263771000001",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin:", admin.email);

  const seller1 = await prisma.user.upsert({
    where: { email: "seller@zimhub.co.zw" },
    update: {},
    create: {
      name: "Tendai Moyo",
      email: "seller@zimhub.co.zw",
      passwordHash,
      phone: "+263771000002",
      role: "SELLER",
      sellerProfile: {
        create: {
          businessName: "TechHub Zimbabwe",
          businessDescription: "Quality phones, laptops, and electronics in Harare",
          location: "Harare, Avondale",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          rating: 4.5,
          reviewCount: 12,
          totalSales: 45,
        },
      },
    },
    include: { sellerProfile: true },
  });
  console.log("✅ Seller 1:", seller1.email);

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@zimhub.co.zw" },
    update: {},
    create: {
      name: "Grace Ndlovu",
      email: "seller2@zimhub.co.zw",
      passwordHash,
      phone: "+263771000003",
      role: "SELLER",
      sellerProfile: {
        create: {
          businessName: "Home & Farm Supplies",
          businessDescription: "Groceries, farming supplies, and home appliances",
          location: "Bulawayo",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          rating: 4.8,
          reviewCount: 8,
          totalSales: 23,
        },
      },
    },
    include: { sellerProfile: true },
  });
  console.log("✅ Seller 2:", seller2.email);

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@zimhub.co.zw" },
    update: {},
    create: {
      name: "Farai Chikwanha",
      email: "buyer@zimhub.co.zw",
      passwordHash,
      phone: "+263771000004",
      role: "BUYER",
    },
  });
  console.log("✅ Buyer:", buyer.email);

  const categories = await prisma.category.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const sellers = [seller1, seller2];

  for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
    const p = SAMPLE_PRODUCTS[i];
    const seller = sellers[i % sellers.length];
    const categoryId = catMap[p.categorySlug];

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        condition: p.condition,
        images: p.images,
        stock: Math.floor(Math.random() * 10) + 1,
        status: "APPROVED",
        approvedAt: new Date(),
        sellerId: seller.id,
        categoryId,
      },
    });
  }
  console.log("✅ Sample products seeded");

  console.log("\n📋 Demo accounts (password: password123):");
  console.log("   Admin:  admin@zimhub.co.zw");
  console.log("   Seller: seller@zimhub.co.zw");
  console.log("   Seller: seller2@zimhub.co.zw");
  console.log("   Buyer:  buyer@zimhub.co.zw");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
