import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAbandonedCartEmail } from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yuumee.nl/";
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: {
        emailSent: false,
        recovered: false,
        unsubscribed: false,
        customerEmail: { not: null },
        createdAt: {
          lt: oneHourAgo,
          gt: twentyFourHoursAgo,
        },
      },
      take: 50,
    });

    let sent = 0;
    let failed = 0;

    for (const cart of abandonedCarts) {
      if (!cart.customerEmail) continue;

      try {
        const items = cart.items as Array<{ name: string; quantity: number; price: number }>;
        
        await sendAbandonedCartEmail({
          customerEmail: cart.customerEmail,
          customerName: cart.customerName || undefined,
          items,
          subtotal: Number(cart.subtotal),
          cartUrl: `${siteUrl}/menu?recover=${cart.sessionId}`,
        });

        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { emailSent: true, emailSentAt: new Date() },
        });

        sent++;
      } catch (error) {
        console.error(`Failed to send abandoned cart email for ${cart.id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: abandonedCarts.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Error processing abandoned carts:", error);
    return NextResponse.json(
      { error: "Failed to process abandoned carts" },
      { status: 500 }
    );
  }
}