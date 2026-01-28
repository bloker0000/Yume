import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { 
  sendOrderStatusUpdateEmail, 
  sendOrderOnItsWayEmail, 
  sendFeedbackRequestEmail,
  sendOrderReadyForPickupEmail
} from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yume-ebon.vercel.app/";

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
        internalNotes: {
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
        internalNotes: {
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

    if (status === "OUT_FOR_DELIVERY" && order.orderType === "DELIVERY") {
      await sendOrderOnItsWayEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerFirstName,
        customerEmail: order.customerEmail,
        estimatedMinutes: order.estimatedTime || 15,
        trackingUrl: `${siteUrl}/track/${order.orderNumber}`,
      });
    }

    if (status === "READY" && order.orderType === "PICKUP") {
      await sendOrderReadyForPickupEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerFirstName,
        customerEmail: order.customerEmail,
        pickupAddress: "Yume Ramen, Westerstraat 52, 1015 MN Amsterdam",
      });
    }

    if (status === "DELIVERED" || status === "PICKED_UP") {
      setTimeout(async () => {
        try {
          await sendFeedbackRequestEmail({
            orderNumber: order.orderNumber,
            customerName: order.customerFirstName,
            customerEmail: order.customerEmail,
            orderId: order.id,
          });
        } catch (err) {
          console.error("Failed to send feedback request email:", err);
        }
      }, 30 * 60 * 1000);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (permanent) {
      await prisma.order.delete({
        where: { id },
      });
    } else {
      await prisma.order.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: "CANCELLED",
          statusHistory: {
            create: {
              status: "CANCELLED",
              note: "Order cancelled and archived",
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

