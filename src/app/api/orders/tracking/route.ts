import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { simulateOrderTracking, getEstimatedDeliveryTime } from "@/lib/trackingSimulation";
import { RESTAURANT_LOCATION } from "@/data/driversData";

function normalizePhoneNumber(phone: string): string {
  let normalized = phone.replace(/[\s\-\(\)\.]/g, "");
  
  if (normalized.startsWith("+31")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("31")) {
    normalized = "0" + normalized.slice(2);
  }
  
  if (normalized.startsWith("00")) {
    normalized = "0" + normalized.slice(2);
  }
  
  return normalized;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");
    const orderId = searchParams.get("orderId");

    if (!orderId && (!orderNumber || !phone)) {
      return NextResponse.json(
        { error: "Order number and phone number are required" },
        { status: 400 }
      );
    }

    let order;
    
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              menuItem: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } else {
      const normalizedInputPhone = normalizePhoneNumber(phone!);
      
      const orders = await prisma.order.findMany({
        where: {
          orderNumber: orderNumber!.toUpperCase(),
        },
        include: {
          items: {
            include: {
              menuItem: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      
      order = orders.find((o) => {
        const normalizedDbPhone = normalizePhoneNumber(o.customerPhone);
        return normalizedDbPhone === normalizedInputPhone;
      }) || null;
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order number and phone number." },
        { status: 404 }
      );
    }

    const deliveryLat = (order as any).deliveryLat || 52.3792;
    const deliveryLng = (order as any).deliveryLng || 4.8994;

    const tracking = simulateOrderTracking(
      order.createdAt,
      { lat: deliveryLat, lng: deliveryLng }
    );

    const estimatedDeliveryTime = getEstimatedDeliveryTime(order.createdAt);

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: tracking.status,
        orderType: order.orderType,
        customerFirstName: order.customerFirstName,
        customerLastName: order.customerLastName,
        customerPhone: order.customerPhone,
        deliveryStreet: order.deliveryStreet,
        deliveryCity: order.deliveryCity,
        deliveryPostalCode: order.deliveryPostalCode,
        deliveryInstructions: order.deliveryInstructions,
        subtotal: order.subtotal.toString(),
        deliveryFee: order.deliveryFee.toString(),
        discount: order.discount.toString(),
        tax: order.tax.toString(),
        total: order.total.toString(),
        createdAt: order.createdAt.toISOString(),
        items: (order as any).items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price.toString(),
          menuItem: item.menuItem,
        })),
      },
      tracking: {
        status: tracking.status,
        statusMessage: tracking.statusMessage,
        estimatedMinutes: tracking.estimatedMinutes,
        estimatedDeliveryTime: estimatedDeliveryTime.toISOString(),
        progress: tracking.progress,
        timeline: tracking.timeline.map((event) => ({
          ...event,
          time: event.time.toISOString(),
        })),
        driver: tracking.driver,
        driverLocation: tracking.driverLocation,
        restaurantLocation: RESTAURANT_LOCATION,
        deliveryLocation: {
          lat: deliveryLat,
          lng: deliveryLng,
          address: `${order.deliveryStreet}, ${order.deliveryCity}`,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching order tracking:", error);
    return NextResponse.json(
      { error: "Failed to fetch order tracking" },
      { status: 500 }
    );
  }
}