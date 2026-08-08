import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seed catalog priced in USD to match current Harare/Zimbabwe marketplace
 * ranges (classifieds.co.zw, Techzim shop, local retail, Aug 2026).
 * Images are stored under /public/images/products.
 */
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
    title: "Samsung Galaxy A16 128GB — Dual SIM",
    slug: "samsung-galaxy-a16-128gb",
    description:
      "Popular mid-range Android phone in Harare. 128GB storage, dual SIM, long battery life. Brand new, sealed box with charger. Free delivery in Harare CBD & Avondale.",
    price: 185,
    condition: "New",
    categorySlug: "phones",
    images: ["/images/products/phone-samsung.jpg"],
    stock: 8,
  },
  {
    title: "iPhone 13 128GB — Unlocked",
    slug: "iphone-13-128gb-unlocked",
    description:
      "Used iPhone 13 in excellent condition. Battery health 89%, Face ID working, no cracks. Unlocked for Econet/NetOne/Telecel. Includes original box and cable. Collection in Borrowdale or courier nationwide.",
    price: 420,
    condition: "Used - Like New",
    categorySlug: "phones",
    images: ["/images/products/phone-iphone.jpg"],
    stock: 3,
  },
  {
    title: "HP 15 Laptop — i5, 8GB RAM, 256GB SSD",
    slug: "hp-laptop-15-i5",
    description:
      "Reliable HP 15 for work and university. Intel Core i5, 8GB RAM, 256GB SSD, Windows 11. Lightly used, charger included. Common Harare student/office spec at current market rates.",
    price: 475,
    condition: "Used - Like New",
    categorySlug: "computers",
    images: ["/images/products/laptop-hp.jpg"],
    stock: 4,
  },
  {
    title: "Apple MacBook Air M1 8/256 — Space Grey",
    slug: "macbook-air-m1-256",
    description:
      "MacBook Air M1 8GB/256GB in great condition. Ideal for design, coding, and remote work. Charger included. Priced to current Harare second-hand Mac market.",
    price: 680,
    condition: "Used - Good",
    categorySlug: "computers",
    images: ["/images/products/laptop-mac.jpg"],
    stock: 2,
  },
  {
    title: "JBL Flip 6 Bluetooth Speaker",
    slug: "jbl-flip-6-speaker",
    description:
      "Portable waterproof Bluetooth speaker. Powerful bass, ~12 hours playtime, IP67. Brand new sealed — popular party/outdoor speaker in Zimbabwe.",
    price: 125,
    condition: "New",
    categorySlug: "electronics",
    images: ["/images/products/speaker-jbl.jpg"],
    stock: 6,
  },
  {
    title: "Sony WH-CH720N Noise Cancelling Headphones",
    slug: "sony-wh-ch720n-headphones",
    description:
      "Wireless noise-cancelling headphones with long battery life. Comfortable for commuting in Harare traffic or long study sessions. New in box.",
    price: 110,
    condition: "New",
    categorySlug: "electronics",
    images: ["/images/products/headphones.jpg"],
    stock: 5,
  },
  {
    title: "Wireless Earbuds — ENC Mic",
    slug: "wireless-earbuds-enc",
    description:
      "True wireless earbuds with ENC mic for clear WhatsApp/Zoom calls. Touch controls, charging case. Affordable everyday audio for Zimbabwe buyers.",
    price: 28,
    condition: "New",
    categorySlug: "electronics",
    images: ["/images/products/earbuds.jpg"],
    stock: 20,
  },
  {
    title: "Men's Ankara Print Shirt — Large",
    slug: "mens-ankara-shirt-large",
    description:
      "Handmade Ankara print shirt, size Large. Vibrant African patterns, 100% cotton, machine washable. Made for Zimbabwe weather — stylish for church, weddings, and weekends.",
    price: 22,
    condition: "New",
    categorySlug: "fashion",
    images: ["/images/products/shirt-ankara.jpg"],
    stock: 12,
  },
  {
    title: "Nike Running Sneakers — Size 42",
    slug: "nike-running-sneakers-42",
    description:
      "Mid-range running sneakers, EU 42 / UK 8. Comfortable cushioning for gym or daily wear. New pair — typical Harare sports-shop pricing.",
    price: 55,
    condition: "New",
    categorySlug: "fashion",
    images: ["/images/products/sneakers.jpg"],
    stock: 7,
  },
  {
    title: "Defy 210L Chest Freezer",
    slug: "defy-210l-chest-freezer",
    description:
      "Defy 210 litre chest freezer — lockable lid, solid for load-shedding meal prep and bulk grocery storage. Used 2 years, works perfectly. Delivery available in Harare for a fee.",
    price: 340,
    condition: "Used - Good",
    categorySlug: "home-appliances",
    images: ["/images/products/freezer-chest.jpg"],
    stock: 1,
  },
  {
    title: "Toyota Corolla Brake Pads — Front Set",
    slug: "toyota-corolla-brake-pads",
    description:
      "Quality front brake pads for Toyota Corolla 2008–2013 (very common in Zimbabwe). Brand new in box. Fitment advice available via WhatsApp.",
    price: 38,
    condition: "New",
    categorySlug: "car-parts",
    images: ["/images/products/brake-pads.jpg"],
    stock: 15,
  },
  {
    title: "12V Car Battery — 60Ah",
    slug: "car-battery-60ah",
    description:
      "Maintenance-free 12V 60Ah car battery suitable for many Japanese and Korean vehicles common in Zimbabwe. New, with warranty card.",
    price: 95,
    condition: "New",
    categorySlug: "car-parts",
    images: ["/images/products/car-battery.jpg"],
    stock: 9,
  },
  {
    title: "Hybrid Maize Seed — 10kg Bag",
    slug: "hybrid-maize-seed-10kg",
    description:
      "High-yield hybrid maize seed, 10kg bag. Suitable for Zimbabwe climate zones. Expected yield 8–10 t/ha with good agronomy. In demand ahead of the rainy season.",
    price: 52,
    condition: "New",
    categorySlug: "farming-supplies",
    images: ["/images/products/maize-seed.jpg"],
    stock: 25,
  },
  {
    title: "100W Solar Panel — Mono",
    slug: "solar-panel-100w-mono",
    description:
      "100W monocrystalline solar panel for small home backup or shop lighting. Popular load-shedding solution. New, with junction box. Pair with inverter/battery separately.",
    price: 75,
    condition: "New",
    categorySlug: "farming-supplies",
    images: ["/images/products/solar-panel.jpg"],
    stock: 14,
  },
  {
    title: "Mealie Meal — 10kg Premium Roller Meal",
    slug: "mealie-meal-10kg",
    description:
      "Premium roller meal, 10kg bag. Fine grind for sadza. Locally milled — priced to current Harare supermarket / tuckshop USD rates.",
    price: 9.5,
    condition: "New",
    categorySlug: "groceries",
    images: ["/images/products/mealie-meal.jpg"],
    stock: 40,
  },
  {
    title: "Cooking Oil — 2L Bottle",
    slug: "cooking-oil-2l",
    description:
      "Vegetable cooking oil, 2 litre bottle. Everyday kitchen staple. Bulk pricing available for tuckshops and boarding houses.",
    price: 4.8,
    condition: "New",
    categorySlug: "groceries",
    images: ["/images/products/cooking-oil.jpg"],
    stock: 50,
  },
  {
    title: "3-Seater Lounge Suite — Grey Fabric",
    slug: "3-seater-lounge-suite-grey",
    description:
      "Modern 3-seater lounge suite in grey fabric. Solid wood frame, high-density foam. Delivery available in Harare (Bulawayo by arrangement). Priced to current local furniture market.",
    price: 620,
    condition: "New",
    categorySlug: "furniture",
    images: ["/images/products/lounge-suite.jpg"],
    stock: 2,
  },
  {
    title: "Unisex Body Mist Gift Set",
    slug: "body-mist-gift-set",
    description:
      "Light fragrance gift set — popular for birthdays and Mother's Day. New sealed packaging. Affordable gifting option.",
    price: 18,
    condition: "New",
    categorySlug: "fashion",
    images: ["/images/products/perfume.jpg"],
    stock: 16,
  },
];

async function main() {
  console.log("🌱 Seeding ZimHub database with real Zimbabwe market catalog...");

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
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

  // Retire old placeholder listing slug if present
  await prisma.product.deleteMany({
    where: { slug: "samsung-galaxy-a54-128gb" },
  });

  for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
    const p = SAMPLE_PRODUCTS[i];
    const seller = sellers[i % sellers.length];
    const categoryId = catMap[p.categorySlug];

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        condition: p.condition,
        images: p.images,
        stock: p.stock,
        status: "APPROVED",
        approvedAt: new Date(),
        categoryId,
        sellerId: seller.id,
      },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        condition: p.condition,
        images: p.images,
        stock: p.stock,
        status: "APPROVED",
        approvedAt: new Date(),
        sellerId: seller.id,
        categoryId,
      },
    });
  }
  console.log(`✅ ${SAMPLE_PRODUCTS.length} products seeded with real images & ZW market prices`);

  console.log("\n📋 Demo accounts (password: password123):");
  console.log("   Admin:  admin@zimhub.co.zw");
  console.log("   Seller: seller@zimhub.co.zw");
  console.log("   Seller: seller2@zimhub.co.zw");
  console.log("   Buyer:  buyer@zimhub.co.zw");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
