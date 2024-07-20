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
    const { userId } = auth();
    let clerkUser;
    if (userId) {
      clerkUser = await clerkClient.users.getUser(userId);
    }

    // Αν ο user δεν έχει κάνει login τον στέλνει να κάνει
    if (!userId && !pathname.startsWith("/sign-up") && !pathname.startsWith("/sign-in")) return NextResponse.redirect(new URL("/sign-in", req.url));

    if (clerkUser) {
      if (clerkUser.publicMetadata.rejected || clerkUser.publicMetadata.banned) return NextResponse.redirect(new URL("/not-found", req.url));
      if (pathname !== "/register" && !clerkUser.publicMetadata.registered) return NextResponse.redirect(new URL("/register", req.url));
      if (pathname !== "/approval" && clerkUser.publicMetadata.registered && !clerkUser.publicMetadata.accepted) return NextResponse.redirect(new URL("/approval", req.url));
      if (pathname === "/companies" && !clerkUser.publicMetadata.owner) return NextResponse.redirect(new URL("/not-found", req.url));
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
