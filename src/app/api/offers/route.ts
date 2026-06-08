import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const offerSchema = z.object({
  productId: z.string(),
  amount: z.number().positive(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = offerSchema.parse(body);

    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product || product.status !== "APPROVED") {
      return NextResponse.json({ error: "Product not available" }, { status: 400 });
    }

    if (product.sellerId === session.user.id) {
      return NextResponse.json({ error: "Cannot offer on your own product" }, { status: 400 });
    }

    if (data.amount >= product.price) {
      return NextResponse.json(
        { error: "Offer must be less than the listed price. Use Buy Now instead." },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.create({
      data: {
        productId: data.productId,
        buyerId: session.user.id,
        amount: data.amount,
        message: data.message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit offer" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "sent") {
    const offers = await prisma.offer.findMany({
      where: { buyerId: session.user.id },
      include: { product: { select: { title: true, slug: true, price: true, images: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(offers);
  }

  if (session.user.role === "SELLER" || session.user.role === "ADMIN") {
    const offers = await prisma.offer.findMany({
      where: { product: { sellerId: session.user.id } },
      include: {
        product: { select: { title: true, slug: true, price: true } },
        buyer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(offers);
  }

  return NextResponse.json([]);
}
