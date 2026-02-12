import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. all image/asset paths
     */
    "/((?!api/|_next/|_static/|favicon.ico|manifest.json|sw.js|swe-worker|images/|icons/|.*\\..*$).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const pathname = url.pathname;

  // 1. Skip if it's a global static file or internal path (safety check in addition to matcher)
  if (
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js"
  ) {
    return NextResponse.next();
  }

  const rootDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "";

  const host = hostname || "";

  let currentHost = "";
  if (host.includes("localhost")) {
    currentHost = host.replace(`.localhost:3000`, "").replace(`localhost:3000`, "");
  } else if (host.includes(rootDomain)) {
    currentHost = host.replace(`.${rootDomain}`, "").replace(rootDomain, "");
  } else if (process.env.VERCEL === "1" && host.includes(".vercel.app")) {
    currentHost = host.replace(`.vercel.app`, "");
  }

  currentHost = currentHost.split(":")[0];

  if (!currentHost || currentHost === "www" || host === rootDomain || host === "localhost:3000") {
    return NextResponse.next();
  }

  // Reserved Subdomains - Infrastructure & Core Services
  const reservedSubdomains = [
    "www",
    "kafka",
    "mongo",
    "rtmp",
    "conduit",
    "conduit-api",
    "openstream",
    "openstream-api",
    "kibana",
    "grafana",
    "dozzle",
    "elastic",
    "stats",
    "storage",
    "minio",
  ];

  if (reservedSubdomains.includes(currentHost)) {
    return NextResponse.next();
  }

  // Global Routes
  const globalRoutes = ["/dashboard", "/studio", "/login", "/signup", "/forgot-password", "/me", "/search", "/u"];

  if (globalRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  url.pathname = `/${currentHost}${pathname}`;

  return NextResponse.rewrite(url);
}
