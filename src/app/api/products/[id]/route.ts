import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      seller: { include: { sellerProfile: true } },
      reviews: { include: { buyer: { select: { name: true } } } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
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
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();
  const isAdmin = session.user.role === "ADMIN";
  const isOwner = product.sellerId === session.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isAdmin && body.status) {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        status: body.status,
        rejectionReason: body.rejectionReason || null,
        approvedAt: body.status === "APPROVED" ? new Date() : null,
      },
    });
    return NextResponse.json(updated);
  }

  if (isOwner) {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        stock: body.stock,
        condition: body.condition,
        images: body.images,
        status: "PENDING_APPROVAL",
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Product deleted" });
}
