import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, offers, orders, commissions, profile] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: session.user.id },
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.offer.findMany({
      where: { product: { sellerId: session.user.id }, status: "PENDING" },
      include: {
        product: { select: { title: true, price: true } },
        buyer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: { sellerId: session.user.id },
      include: {
        order: { include: { buyer: { select: { name: true } } } },
        product: { select: { slug: true, images: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
    }),
    prisma.commission.findMany({
      where: { sellerProfile: { userId: session.user.id } },
      include: { order: { select: { orderNumber: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sellerProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ products, offers, orders, commissions, profile });
}

const offerActionSchema = z.object({
  offerId: z.string(),
  action: z.enum(["ACCEPTED", "REJECTED"]),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { offerId, action } = offerActionSchema.parse(body);

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { product: true },
    });

    if (!offer || offer.product.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: { status: action },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
