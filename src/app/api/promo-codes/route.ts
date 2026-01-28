import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }

    if (!promoCode.active) {
      return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
    }

    const now = new Date();
    if (promoCode.validFrom && now < promoCode.validFrom) {
      return NextResponse.json({ error: "This promo code is not yet valid" }, { status: 400 });
    }

    if (promoCode.validUntil && now > promoCode.validUntil) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
    }

    if (promoCode.minOrder && subtotal < Number(promoCode.minOrder)) {
      return NextResponse.json(
        {
          error: `Minimum order amount of EUR ${Number(promoCode.minOrder).toFixed(2)} required`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (promoCode.discountType === "PERCENT") {
      discount = (subtotal * Number(promoCode.discountValue)) / 100;
      if (promoCode.maxDiscount) {
        discount = Math.min(discount, Number(promoCode.maxDiscount));
      }
    } else if (promoCode.discountType === "FIXED") {
      discount = Number(promoCode.discountValue);
    } else if (promoCode.discountType === "FREE_DELIVERY") {
      discount = 0;
    }

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType,
      discountValue: Number(promoCode.discountValue),
      discount,
      freeDelivery: promoCode.discountType === "FREE_DELIVERY",
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
  }
}

