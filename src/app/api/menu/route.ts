import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { slug, available: true },
      });

      if (!menuItem) {
        return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
      }

      return NextResponse.json(menuItem);
    }

    const where = {
      available: true,
      ...(category && { category }),
    };

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [{ bestseller: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
