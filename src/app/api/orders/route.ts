import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mollieClient } from "@/lib/mollie";

function generateOrderNumber(): string {
  const prefix = "YUM";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

interface OrderItemInput {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  toppings?: string[];
  specialInstructions?: string;
}

interface CreateOrderInput {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "DELIVERY" | "PICKUP";
  deliveryStreet?: string;
  deliveryApartment?: string;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  deliveryInstructions?: string;
  deliveryTimeType: string;
  scheduledDate?: string;
  scheduledTime?: string;
  paymentMethod: string;
  items: OrderItemInput[];
  promoCode?: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderInput = await request.json();
    const {
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      orderType,
      deliveryStreet,
      deliveryApartment,
      deliveryCity,
      deliveryPostalCode,
      deliveryInstructions,
      deliveryTimeType,
      scheduledDate,
      scheduledTime,
      paymentMethod,
      items,
      promoCode,
      notes,
    } = body;

    if (!customerFirstName || !customerLastName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    let deliveryFee = 0;
    let estimatedTime = 20;

    if (orderType === "DELIVERY") {
      if (!deliveryPostalCode) {
        return NextResponse.json({ error: "Delivery postal code is required" }, { status: 400 });
      }

      const cleanPostalCode = deliveryPostalCode.replace(/\s/g, "").substring(0, 4);
      const zone = await prisma.deliveryZone.findFirst({
        where: { postalCode: cleanPostalCode, active: true },
      });

      if (!zone) {
        return NextResponse.json({ error: "We do not deliver to this area" }, { status: 400 });
      }

      if (zone.minOrder && subtotal < Number(zone.minOrder)) {
        return NextResponse.json(
          { error: `Minimum order amount for delivery is EUR ${Number(zone.minOrder).toFixed(2)}` },
          { status: 400 }
        );
      }

      deliveryFee = Number(zone.fee);
      estimatedTime = zone.estimatedTime;
    }

    let discount = 0;
    let appliedPromoCode = null;

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      if (promo && promo.active) {
        const now = new Date();
        const validFrom = !promo.validFrom || now >= promo.validFrom;
        const validUntil = !promo.validUntil || now <= promo.validUntil;
        const hasUses = !promo.usageLimit || promo.usageCount < promo.usageLimit;
        const meetsMinimum = !promo.minOrder || subtotal >= Number(promo.minOrder);

        if (validFrom && validUntil && hasUses && meetsMinimum) {
          if (promo.discountType === "PERCENT") {
            discount = (subtotal * Number(promo.discountValue)) / 100;
            if (promo.maxDiscount) {
              discount = Math.min(discount, Number(promo.maxDiscount));
            }
          } else if (promo.discountType === "FIXED") {
            discount = Number(promo.discountValue);
          } else if (promo.discountType === "FREE_DELIVERY") {
            deliveryFee = 0;
          }
          appliedPromoCode = promo.code;

          await prisma.promoCode.update({
            where: { id: promo.id },
            data: { usageCount: promo.usageCount + 1 },
          });
        }
      }
    }

    const tax = (subtotal + deliveryFee - discount) * 0.21;
    const total = subtotal + deliveryFee - discount + tax;
    const orderNumber = generateOrderNumber();

    const orderItemsData = items.map((item) => ({
      menuItemId: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      toppings: item.toppings || [],
      specialInstructions: item.specialInstructions,
    }));

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhone,
        orderType,
        deliveryStreet,
        deliveryApartment,
        deliveryCity,
        deliveryPostalCode,
        deliveryInstructions,
        deliveryTimeType,
        scheduledDate,
        scheduledTime,
        paymentMethod,
        subtotal,
        deliveryFee,
        discount,
        tax,
        total,
        promoCode: appliedPromoCode,
        estimatedTime,
        notes,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: "Order created, awaiting payment",
          },
        },
      },
      include: {
        items: true,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!mollieClient) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 503 }
      );
    }

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const payment = await mollieClient.payments.create({
      amount: {
        value: total.toFixed(2),
        currency: "EUR",
      },
      description: `Yume Ramen - Order ${orderNumber}`,
      redirectUrl: `${baseUrl}/order/confirmation?orderId=${order.id}`,
      webhookUrl: `${baseUrl}/api/payments/webhook`,
      metadata: {
        orderId: order.id,
        orderNumber,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: payment.id },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      checkoutUrl: payment.getCheckoutUrl(),
    });
  } catch (error) {
    console.error("Error creating order:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ 
      error: "Failed to create order",
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");

    if (!orderId && !orderNumber) {
      return NextResponse.json({ error: "Order ID or number required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber: orderNumber! },
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

