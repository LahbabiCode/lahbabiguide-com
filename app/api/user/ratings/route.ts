import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ ratings: {} });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    const ratings = await prisma.rating.findMany({
      where: { userId, targetType: type },
    });

    const ratingsMap = ratings.reduce((acc: Record<string, number>, r: { targetId: string; score: number }) => {
      acc[r.targetId] = r.score;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({ ratings: ratingsMap });
  } catch (error) {
    console.error("Ratings GET error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Even if anonymous, we might want to store public aggregate ratings. 
    // For now, this limits ratings storage to users.
    if (!userId) {
      return NextResponse.json({ success: true, localOnly: true });
    }

    const { type, id, score } = await req.json();

    if (!type || !id || typeof score !== "number" || score < 1 || score > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const existingRating = await prisma.rating.findFirst({
      where: { userId, targetType: type, targetId: id },
    });

    if (existingRating) {
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { score },
      });
    } else {
      await prisma.rating.create({
        data: {
          userId,
          targetType: type,
          targetId: id,
          score,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ratings API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
