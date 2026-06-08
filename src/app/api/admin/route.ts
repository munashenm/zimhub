import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    pendingProducts,
    pendingSellers,
    totalOrders,
    totalUsers,
    recentOrders,
    totalCommissions,
  ] = await Promise.all([
    prisma.product.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.sellerProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        buyer: { select: { name: true } },
        items: { select: { title: true } },
      },
    }),
    prisma.commission.aggregate({ _sum: { commissionAmount: true } }),
  ]);

  return NextResponse.json({
    stats: {
      pendingProducts,
      pendingSellers,
      totalOrders,
      totalUsers,
      totalCommissions: totalCommissions._sum.commissionAmount || 0,
    },
    recentOrders,
  });
}

const verifySchema = z.object({
  sellerProfileId: z.string(),
  status: z.enum(["VERIFIED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = verifySchema.parse(body);

    const updated = await prisma.sellerProfile.update({
      where: { id: data.sellerProfileId },
      data: {
        verificationStatus: data.status,
        verifiedAt: data.status === "VERIFIED" ? new Date() : null,
        rejectionReason: data.rejectionReason || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
