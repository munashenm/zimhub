import { prisma } from "@/lib/prisma";

export async function getApprovedProducts(options?: {
  categorySlug?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sellerId?: string;
}) {
  const where = {
    status: "APPROVED" as const,
    ...(options?.categorySlug && {
      category: { slug: options.categorySlug },
    }),
    ...(options?.search && {
      OR: [
        { title: { contains: options.search, mode: "insensitive" as const } },
        {
          description: {
            contains: options.search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
    ...(options?.sellerId && { sellerId: options.sellerId }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: {
          select: {
            name: true,
            sellerProfile: {
              select: { verificationStatus: true, rating: true },
            },
          },
        },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 20,
      skip: options?.skip ?? 0,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
          sellerProfile: true,
        },
      },
      reviews: {
        include: {
          buyer: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      offers: {
        where: { status: "PENDING" },
        select: { id: true },
      },
    },
  });
}
