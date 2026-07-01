import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseConfigured, tryDbInsert } from "@/lib/db/insertHelper";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "tool-listing",
  "credit-listing",
  "featured",
  "newsletter-mention",
  "other",
]);
const ALLOWED_BUDGETS = new Set(["under-100", "100-500", "500-2000", "2000+"]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const company = typeof body?.company === "string" ? body.company.trim() : "";
    const contactName = typeof body?.contactName === "string" ? body.contactName.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const website = typeof body?.website === "string" ? body.website.trim() : null;
    const type = typeof body?.type === "string" ? body.type : "other";
    const budget = typeof body?.budget === "string" ? body.budget : "100-500";
    const notes = typeof body?.notes === "string" ? body.notes.trim() : null;

    if (!company || !contactName || !email) {
      return NextResponse.json(
        { ok: false, error: "Company, contact name, and email are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request type." },
        { status: 400 }
      );
    }
    if (!ALLOWED_BUDGETS.has(budget)) {
      return NextResponse.json(
        { ok: false, error: "Invalid budget." },
        { status: 400 }
      );
    }

    if (isDatabaseConfigured()) {
      const result = await tryDbInsert(() =>
        prisma.sponsorRequest.create({
          data: {
            company,
            contactName,
            email,
            website: website || null,
            type,
            budget,
            notes: notes || null,
            status: "new",
          },
        })
      );
      return NextResponse.json({
        ok: true,
        message: "Request received. We will reply within 7 business days.",
        mode: result.mode,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Request received. We will reply within 7 business days.",
      mode: "fallback",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
