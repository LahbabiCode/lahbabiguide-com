import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId, targetType: type },
    });

    return NextResponse.json({
      favorites: favorites.map((f: { targetId: string }) => f.targetId)
    });
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      // If not logged in, just acknowledge the request for the anonymous fallback to work quietly
      return NextResponse.json({ success: true, localOnly: true });
    }

    const { type, ids } = await req.json();

    if (!type || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Replace current favorites for this type with the new array
    await prisma.$transaction([
      prisma.favorite.deleteMany({
        where: { userId, targetType: type },
      }),
      prisma.favorite.createMany({
        data: ids.map((id) => ({
          userId,
          targetType: type,
          targetId: id,
        })),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorites API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
