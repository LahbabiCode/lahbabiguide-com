// Stripe integration with graceful fallback when STRIPE_SECRET_KEY is missing.
// Used by the products lead API to optionally generate a real checkout session.

export interface CheckoutResult {
  ok: boolean;
  mode: "stripe" | "manual";
  checkoutUrl?: string;
  message?: string;
}

export async function createProductCheckoutSession(args: {
  product: string;
  email: string;
  name?: string | null;
  price: string;
}): Promise<CheckoutResult> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return {
      ok: true,
      mode: "manual",
      message: "Stripe is not configured. Use the email checkout flow instead.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${process.env.NEXT_PUBLIC_SITE_URL || "https://lahbabiguide.com"}/products/thanks?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${process.env.NEXT_PUBLIC_SITE_URL || "https://lahbabiguide.com"}/products/${args.product}`);
    params.append("customer_email", args.email);
    params.append("metadata[product]", args.product);
    if (args.name) params.append("metadata[name]", args.name);
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "USD");
    params.append("line_items[0][price_data][unit_amount]", "900");
    params.append("line_items[0][price_data][product_data][name]", "Startup Cloud Credits Cheat Sheet 2026");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, mode: "stripe", message: data?.error?.message || "Stripe error" };
    }
    return { ok: true, mode: "stripe", checkoutUrl: data.url };
  } catch (err) {
    return { ok: false, mode: "stripe", message: "Stripe request failed" };
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
