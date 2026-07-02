import { auth } from "@/lib/auth";

/**
 * Gate the entire admin area. Unauthenticated (or non-admin) visitors are
 * sent to the NextAuth sign-in page. lib/auth.ts is Prisma-free, so this
 * middleware is safe on the edge runtime.
 */
export default auth((req) => {
  const role = (req.auth?.user as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
