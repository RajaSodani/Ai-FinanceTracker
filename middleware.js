import { clerkMiddleware, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;
    const { userId } = await auth();

    // Public routes
    if (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname === "/"
    ) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users from protected routes
    if (!userId && !pathname.startsWith("/sign-in")) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
