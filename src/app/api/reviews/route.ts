import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = reviewSchema.parse(body);

    const existing = await prisma.review.findUnique({
      where: {
        productId_buyerId: {
          productId: data.productId,
          buyerId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "You already reviewed this product" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        buyerId: session.user.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { reviews: true, seller: { include: { sellerProfile: true } } },
    });

    if (product) {
      if (product.seller.sellerProfile) {
        const sellerReviews = await prisma.review.findMany({
          where: { product: { sellerId: product.sellerId } },
        });
        const sellerAvg =
          sellerReviews.reduce((s, r) => s + r.rating, 0) / sellerReviews.length;

        await prisma.sellerProfile.update({
          where: { id: product.seller.sellerProfile.id },
          data: { rating: sellerAvg, reviewCount: sellerReviews.length },
        });
      }
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { buyer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
