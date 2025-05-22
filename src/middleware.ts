import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

type Locale = (typeof routing.locales)[number];

// Middleware function to handle locale redirection
function localeMiddleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip locale redirect for api routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already starts with a locale
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Get locale from accept-language header or default to 'en'
  const acceptLanguage = req.headers.get("accept-language");
  let locale: Locale = routing.defaultLocale;

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")[0]
      .split("-")[0]
      .toLowerCase();

    if (routing.locales.includes(preferredLocale as Locale)) {
      locale = preferredLocale as Locale;
    }
  }

  // Redirect to the locale path
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}${search}`, req.url)
  );
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Handle locale redirection first
    const localeResponse = localeMiddleware(req);
    if (localeResponse.status !== 200) return localeResponse;

    // Handle dashboard routes
    if (pathname.startsWith("/dashboard")) {
      const token = req.nextauth.token;
      
      // Check if user is authenticated
      if (!token) {
        const callbackUrl = encodeURIComponent(req.url);
        return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url));
      }

      // Check for admin role if needed
      if (pathname.startsWith("/dashboard/admin") && token.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Only require authentication for dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - api routes
    // - static files with extensions
    // - _next
    // - public folder assets
    "/((?!api|_next|.*\\.[^/]*$).*)",
    "/dashboard/:path*",
  ],
};
