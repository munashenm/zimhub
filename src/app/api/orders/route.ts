import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  generateOrderNumber,
  COMMISSION_RATE,
} from "@/lib/utils";
import { processPayment, type PaymentProvider } from "@/lib/payments";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingPhone: z.string().min(10),
  notes: z.string().optional(),
  paymentMethod: z.enum(["PAYNOW", "ECOCASH", "BANK_TRANSFER", "CASH_ON_DELIVERY"]),
  productId: z.string().optional(),
  quantity: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    let cartItems;
    if (data.productId) {
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
        include: { seller: { include: { sellerProfile: true } } },
      });
      if (!product || product.status !== "APPROVED") {
        return NextResponse.json({ error: "Product not available" }, { status: 400 });
      }
      cartItems = [{ product, quantity: data.quantity || 1 }];
    } else {
      const items = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            include: { seller: { include: { sellerProfile: true } } },
          },
        },
      });
      if (items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }
      cartItems = items.map((i) => ({ product: i.product, quantity: i.quantity }));
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const commission = subtotal * COMMISSION_RATE;
    const total = subtotal;

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId: session.user.id,
        subtotal,
        commission,
        total,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingPhone: data.shippingPhone,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        status: data.paymentMethod === "CASH_ON_DELIVERY" ? "PROCESSING" : "PENDING_PAYMENT",
        paymentStatus: data.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PROCESSING",
        items: {
          create: cartItems.map((item) => ({
            productId: item.product.id,
            sellerId: item.product.sellerId,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cartItems) {
      const sellerProfile = item.product.seller.sellerProfile;
      if (sellerProfile) {
        const saleAmount = item.product.price * item.quantity;
        const commissionAmount = saleAmount * COMMISSION_RATE;
        await prisma.commission.create({
          data: {
            orderId: order.id,
            sellerProfileId: sellerProfile.id,
            saleAmount,
            commissionRate: COMMISSION_RATE,
            commissionAmount,
            sellerPayout: saleAmount - commissionAmount,
          },
        });
      }
    }

    const paymentResult = await processPayment(
      data.paymentMethod as PaymentProvider,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: total,
        currency: "USD",
        customerEmail: session.user.email!,
        customerPhone: data.shippingPhone,
        description: `ZimHub Order ${orderNumber}`,
      }
    );

    if (paymentResult.reference) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentReference: paymentResult.reference },
      });
    }

    if (!data.productId) {
      await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    }

    return NextResponse.json({
      order,
      payment: paymentResult,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      items: { include: { product: { select: { slug: true, images: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
