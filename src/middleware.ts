import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

type Locale = (typeof routing.locales)[number];

// Extend NextRequest to include nextauth
interface RequestWithAuth extends NextRequest {
  nextauth: {
    token: {
      role?: string;
    } | null;
  };
}

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

// Middleware function to handle authentication for dashboard routes
function authMiddleware(req: RequestWithAuth) {
  const { pathname } = req.nextUrl;

  // Only apply auth check for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

// Combined middleware for both auth and locale
const combinedMiddleware = async (req: RequestWithAuth) => {
  // First handle locale redirection
  const localeResponse = localeMiddleware(req);
  if (localeResponse.status !== 200) return localeResponse;

  // Then handle auth for dashboard routes only
  return authMiddleware(req);
};

export default withAuth(combinedMiddleware, {
  callbacks: {
    authorized: ({ req, token }) => {
      // Only require authentication for dashboard routes
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        return !!token;
      }
      return true;
    },
  },
});

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
