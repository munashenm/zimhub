import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      buyer: { select: { name: true, email: true, phone: true } },
      commissionRecord: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const isBuyer = order.buyerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  const isSeller = order.items.some((i) => i.sellerId === session.user.id);

  if (!isBuyer && !isAdmin && !isSeller) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isSeller = order.items.some((i) => i.sellerId === session.user.id);

  if (!isAdmin && !isSeller) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { status } = statusSchema.parse(body);

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === "DELIVERED" && { deliveredAt: new Date() }),
        ...(status === "PAID" && { paidAt: new Date(), paymentStatus: "COMPLETED" }),
      },
    });

    if (status === "DELIVERED") {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
        const seller = await prisma.sellerProfile.findFirst({
          where: { userId: item.sellerId },
        });
        if (seller) {
          await prisma.sellerProfile.update({
            where: { id: seller.id },
            data: { totalSales: { increment: 1 } },
          });
        }
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
