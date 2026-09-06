import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
    businessName: z.string().optional(),
    businessDescription: z.string().optional(),
    location: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "SELLER" && !data.businessName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Business name is required for seller accounts",
        path: ["businessName"],
      });
    }
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);
    const email = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email,
        passwordHash,
        phone: data.phone?.trim() || null,
        role: data.role,
        ...(data.role === "SELLER" && {
          sellerProfile: {
            create: {
              businessName: data.businessName!.trim(),
              businessDescription: data.businessDescription?.trim() || null,
              location: data.location?.trim() || null,
              verificationStatus: "PENDING",
            },
          },
        }),
      },
      include: { sellerProfile: true },
    });

    return NextResponse.json(
      {
        message:
          data.role === "SELLER"
            ? "Seller account created. An admin must verify you before you can list products."
            : "Account created successfully",
        userId: user.id,
        role: user.role,
        verificationStatus: user.sellerProfile?.verificationStatus ?? null,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
