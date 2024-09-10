import { clerkMiddleware, auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Simple in-memory cache
const userCache = new Map();

export default clerkMiddleware(async (_, req) => {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static assets and API routes
  if (pathname.match(/\.(svg|png|jpg|webp|ico)$/) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname === "/not-found") return NextResponse.next();

  const { userId } = auth();

  // Redirect to sign-in if not authenticated
  if (!userId && !pathname.startsWith("/sign-up") && !pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Only fetch user data if necessary
  if (userId && !userCache.has(userId)) {
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      userCache.set(userId, clerkUser);

      // Optionally, clear cache after some time
      setTimeout(() => userCache.delete(userId), 60000); // Clear after 1 minute
    } catch (error) {
      console.error("Error fetching user data:", error);
      return NextResponse.next();
    }
  }

  const clerkUser = userCache.get(userId);

  if (clerkUser) {
    if (clerkUser.publicMetadata.rejected || clerkUser.publicMetadata.banned) {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
    if (pathname !== "/register" && !clerkUser.publicMetadata.registered) {
      return NextResponse.redirect(new URL("/register", req.url));
    }
    if (pathname !== "/approval" && clerkUser.publicMetadata.registered && !clerkUser.publicMetadata.accepted) {
      return NextResponse.redirect(new URL("/approval", req.url));
    }
    if (pathname === "/companies" && !clerkUser.publicMetadata.owner) {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*[.].*|_next).*)"],
};
