import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email, name, items, subtotal } = await request.json();

    if (!sessionId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Session ID and items are required" },
        { status: 400 }
      );
    }

    const existingCart = await prisma.abandonedCart.findUnique({
      where: { sessionId },
    });

    if (existingCart) {
      const updatedCart = await prisma.abandonedCart.update({
        where: { sessionId },
        data: {
          customerEmail: email || existingCart.customerEmail,
          customerName: name || existingCart.customerName,
          items,
          subtotal,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, cart: updatedCart });
    }

    const cart = await prisma.abandonedCart.create({
      data: {
        sessionId,
        customerEmail: email || null,
        customerName: name || null,
        items,
        subtotal,
      },
    });

    return NextResponse.json({ success: true, cart }, { status: 201 });
  } catch (error) {
    console.error("Error saving abandoned cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    await prisma.abandonedCart.update({
      where: { sessionId },
      data: { recovered: true, recoveredAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking cart as recovered:", error);
    return NextResponse.json({ success: true });
  }
}