import { clerkMiddleware } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  if (pathname.endsWith(".svg") || pathname.endsWith(".png") || pathname.endsWith(".jpg") || pathname.endsWith(".webp") || pathname.endsWith(".ico")) {
  } else if (pathname.startsWith("/api")) {
  } else {
    if (pathname === "/not-found") return;

    // Παίρνω όλο το object του clerk user
    const { userId, sessionClaims } = auth();

    // Αν ο user δεν έχει κάνει login τον στέλνει να κάνει
    if (!userId && !pathname.startsWith("/sign-up") && !pathname.startsWith("/sign-in")) return NextResponse.redirect(new URL("/sign-in", req.url));

    if (userId) {
      if (sessionClaims.metadata.rejected || sessionClaims.metadata.banned) return NextResponse.redirect(new URL("/not-found", req.url));
      if (pathname !== "/register" && !sessionClaims.metadata.registered) return NextResponse.redirect(new URL("/register", req.url));
      if (pathname !== "/approval" && sessionClaims.metadata.registered && !sessionClaims.metadata.accepted) return NextResponse.redirect(new URL("/approval", req.url));
      if (pathname === "/companies" && !sessionClaims.metadata.owner) return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*[.].*|.next).*)"],
};

/*
      // Αν ο user πάει να μπεί σε κάποιο admin path χωρίς να είναι admin τον πηγαίνει στο not found
      if (pathname.startsWith("/admin") && !clerkUser.publicMetadata.admin && !clerkUser.publicMetadata.owner && !clerkUser.publicMetadata.leader && !clerkUser.publicMetadata.investor) return NextResponse.redirect(new URL("/not-found", req.url));
  
    
    */

/*

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
*/
