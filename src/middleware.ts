import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");
    
    if (!sessionToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    if (pathname.startsWith("/admin")) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        });
        
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        
        const sessionData = await response.json();
        
        if (sessionData?.session?.user?.role !== "admin" && sessionData?.user?.role !== "admin") {
          const url = new URL("/dashboard", request.url);
          url.searchParams.set("error", "unauthorized");
          return NextResponse.redirect(url);
        }
      } catch (err) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
