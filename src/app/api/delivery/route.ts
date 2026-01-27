import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { active: true },
      orderBy: { postalCode: "asc" },
    });

    return NextResponse.json(zones);
  } catch (error) {
    console.error("Error fetching delivery zones:", error);
    return NextResponse.json({ error: "Failed to fetch delivery zones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { postalCode } = await request.json();

    if (!postalCode) {
      return NextResponse.json({ error: "Postal code is required" }, { status: 400 });
    }

    const cleanPostalCode = postalCode.replace(/\s/g, "").substring(0, 4);

    const zone = await prisma.deliveryZone.findFirst({
      where: {
        postalCode: cleanPostalCode,
        active: true,
      },
    });

    if (!zone) {
      return NextResponse.json(
        {
          available: false,
          error: "Sorry, we do not deliver to this area yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      available: true,
      postalCode: zone.postalCode,
      deliveryFee: Number(zone.fee),
      minOrderAmount: zone.minOrder ? Number(zone.minOrder) : null,
      estimatedMinutes: zone.estimatedTime,
    });
  } catch (error) {
    console.error("Error checking delivery zone:", error);
    return NextResponse.json({ error: "Failed to check delivery zone" }, { status: 500 });
  }
}

