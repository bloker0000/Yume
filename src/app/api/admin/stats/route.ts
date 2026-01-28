import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayOrders,
      weekOrders,
      monthOrders,
      pendingCount,
      preparingCount,
      deliveryCount,
      recentOrders,
      todayRevenue,
      weekRevenue,
      monthRevenue,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: startOfToday },
          deletedAt: null,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfWeek },
          deletedAt: null,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfMonth },
          deletedAt: null,
        },
      }),
      prisma.order.count({
        where: {
          status: "PENDING",
          deletedAt: null,
        },
      }),
      prisma.order.count({
        where: {
          status: "PREPARING",
          deletedAt: null,
        },
      }),
      prisma.order.count({
        where: {
          status: "OUT_FOR_DELIVERY",
          deletedAt: null,
        },
      }),
      prisma.order.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          customerFirstName: true,
          customerLastName: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfToday },
          paymentStatus: "PAID",
          deletedAt: null,
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfWeek },
          paymentStatus: "PAID",
          deletedAt: null,
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: "PAID",
          deletedAt: null,
        },
        _sum: { total: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    const statusData = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
      where: { deletedAt: null },
    });
    statusData.forEach((s) => {
      statusCounts[s.status] = s._count.status;
    });

    return NextResponse.json({
      orders: {
        today: todayOrders,
        week: weekOrders,
        month: monthOrders,
      },
      revenue: {
        today: todayRevenue._sum.total || 0,
        week: weekRevenue._sum.total || 0,
        month: monthRevenue._sum.total || 0,
      },
      active: {
        pending: pendingCount,
        preparing: preparingCount,
        delivery: deliveryCount,
      },
      statusCounts,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}