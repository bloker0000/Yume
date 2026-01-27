import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mollieClient } from "@/lib/mollie";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get("id") as string;

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
    }

    if (!mollieClient) {
      console.warn("Mollie client not configured - skipping webhook processing");
      return NextResponse.json({ success: false, message: "Payment processing not configured" }, { status: 503 });
    }

    const payment = await mollieClient.payments.get(paymentId);
    const metadata = payment.metadata as { orderId?: string; orderNumber?: string } | null;
    const orderId = metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID not found in payment metadata" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let newPaymentStatus = order.paymentStatus;
    let newOrderStatus = order.status;
    let statusNote = "";

    if (payment.status === "paid") {
      newPaymentStatus = "PAID";
      newOrderStatus = "CONFIRMED";
      statusNote = "Payment received, order confirmed";

      const estimatedTime = order.estimatedTime
        ? `${order.estimatedTime} minutes`
        : "30-45 minutes";

      const emailItems = order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price) * item.quantity,
      }));

      const address =
        order.orderType === "DELIVERY"
          ? `${order.deliveryStreet}${order.deliveryApartment ? `, ${order.deliveryApartment}` : ""}, ${order.deliveryPostalCode} ${order.deliveryCity}`
          : undefined;

      await sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: `${order.customerFirstName} ${order.customerLastName}`,
        customerEmail: order.customerEmail,
        items: emailItems,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee),
        discount: Number(order.discount),
        total: Number(order.total),
        orderType: order.orderType as "DELIVERY" | "PICKUP",
        estimatedTime,
        address,
      });
    } else if (payment.status === "failed" || payment.status === "canceled" || payment.status === "expired") {
      newPaymentStatus = "FAILED";
      newOrderStatus = "CANCELLED";
      statusNote = `Payment ${payment.status}`;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        statusHistory: {
          create: {
            status: newOrderStatus,
            note: statusNote,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}


