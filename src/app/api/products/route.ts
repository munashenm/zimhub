import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  categoryId: z.string(),
  condition: z.string().default("New"),
  stock: z.number().int().positive().default(1),
  images: z.array(z.string()).min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sellerId = searchParams.get("sellerId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const isOwnSeller =
    session?.user?.role === "SELLER" && sellerId === session.user.id;

  const where: Record<string, unknown> = {};

  if (status && (isAdmin || isOwnSeller)) {
    where.status = status;
  } else if (!isAdmin) {
    where.status = "APPROVED";
  }

  if (category) where.category = { slug: category };
  if (sellerId) where.sellerId = sellerId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: {
          select: {
            name: true,
            sellerProfile: { select: { verificationStatus: true, rating: true } },
          },
        },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["SELLER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    let slug = slugify(data.title);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        sellerId: session.user.id,
        status: "PENDING_APPROVAL",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
