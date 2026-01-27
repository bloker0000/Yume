import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

const statusMessages: Record<string, string> = {
  CONFIRMED: "Your order has been confirmed and will be prepared shortly.",
  PREPARING: "Our chefs are now preparing your delicious ramen!",
  READY: "Your order is ready for pickup!",
  OUT_FOR_DELIVERY: "Your order is on its way! Our delivery driver is heading to you.",
  DELIVERED: "Your order has been delivered. Enjoy your meal!",
  PICKED_UP: "Your order has been picked up. Enjoy your meal!",
  CANCELLED: "Your order has been cancelled. If you have any questions, please contact us.",
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status, note } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note: note || statusMessages[status] || `Status updated to ${status}`,
          },
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    await sendOrderStatusUpdateEmail({
      orderNumber: order.orderNumber,
      customerName: `${order.customerFirstName} ${order.customerLastName}`,
      customerEmail: order.customerEmail,
      status,
      message: statusMessages[status] || `Your order status has been updated to ${status}.`,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

