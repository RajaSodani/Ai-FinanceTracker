import arcjet, { detectBot, shield } from "@arcjet/next";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname === "/"
    ) {
      return NextResponse.next();
    }

    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Request blocked" },
        { status: 403 }
      );
    }
    return NextResponse.next();
  },
  {
    publicRoutes: [
      "/",
      "/sign-in(.*)",
      "/sign-up(.*)",
    ],
  }
);

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
