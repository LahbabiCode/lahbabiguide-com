import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseConfigured, tryDbInsert } from "@/lib/db/insertHelper";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : null;
    const source = typeof body?.source === "string" ? body.source : "site";

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (isDatabaseConfigured()) {
      const result = await tryDbInsert(() =>
        prisma.newsletterSubscriber.upsert({
          where: { email },
          update: { name, source, active: true },
          create: { email, name, source, active: true },
        })
      );
      return NextResponse.json({
        ok: true,
        message: "Thanks! You are subscribed.",
        mode: result.mode,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks! You are subscribed.",
      mode: "fallback",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
