import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          seller: {
            select: {
              name: true,
              sellerProfile: { select: { verificationStatus: true } },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(items);
}

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, quantity } = addSchema.parse(body);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== "APPROVED") {
      return NextResponse.json({ error: "Product not available" }, { status: 400 });
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
      update: { quantity: { increment: quantity } },
      create: { userId: session.user.id, productId, quantity },
      include: { product: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
  } else {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  }

  return NextResponse.json({ message: "Cart updated" });
}
