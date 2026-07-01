import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseConfigured, tryDbInsert } from "@/lib/db/insertHelper";
import { createProductCheckoutSession, isStripeConfigured } from "@/lib/monetization/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product, name, email, mode } = body || {};
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanName = typeof name === "string" ? name.trim() : null;
    const cleanProduct = typeof product === "string" ? product.trim() : "";
    const cleanMode = mode === "buy" ? "buy" : "email";

    if (!cleanProduct) {
      return NextResponse.json(
        { ok: false, error: "Product not specified." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (isDatabaseConfigured()) {
      const result = await tryDbInsert(() =>
        prisma.productLead.create({
          data: {
            product: cleanProduct,
            name: cleanName,
            email: cleanEmail,
            mode: cleanMode,
            status: "new",
          },
        })
      );

      if (cleanMode === "buy" && isStripeConfigured()) {
        const checkout = await createProductCheckoutSession({
          product: cleanProduct,
          email: cleanEmail,
          name: cleanName,
          price: "9.00",
        });
        if (checkout.ok && checkout.checkoutUrl) {
          return NextResponse.json({
            ok: true,
            message: "Redirecting to secure checkout.",
            mode: result.mode,
            checkoutUrl: checkout.checkoutUrl,
            product: cleanProduct,
          });
        }
      }

      return NextResponse.json({
        ok: true,
        message:
          cleanMode === "buy"
            ? "Thanks! We will email you payment instructions within 24 hours."
            : "Thanks! Check your email for the download link.",
        mode: result.mode,
        product: cleanProduct,
      });
    }

    if (cleanMode === "buy" && isStripeConfigured()) {
      const checkout = await createProductCheckoutSession({
        product: cleanProduct,
        email: cleanEmail,
        name: cleanName,
        price: "9.00",
      });
      if (checkout.ok && checkout.checkoutUrl) {
        return NextResponse.json({
          ok: true,
          message: "Redirecting to secure checkout.",
          mode: "fallback",
          checkoutUrl: checkout.checkoutUrl,
          product: cleanProduct,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message:
        cleanMode === "buy"
          ? "Thanks! We will email you payment instructions within 24 hours."
          : "Thanks! Check your email for the download link.",
      mode: "fallback",
      product: cleanProduct,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
