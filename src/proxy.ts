import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { NextResponse, type NextRequest } from "next/server";

const isDevelopment = process.env.NODE_ENV !== "production";
const contentProjectsRootDir = join(process.cwd(), "src", "content", "projects");
let publishedProjectSlugs: Set<string> | null | undefined;

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function createContentSecurityPolicy(nonce: string, upgradeInsecureRequests: boolean): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://va.vercel-scripts.com",
    "https://challenges.cloudflare.com",
  ].join(" ");

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src https://challenges.cloudflare.com",
    "media-src 'self'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc}`,
    [
      "connect-src 'self'",
      "https://analytics.google.com",
      "https://www.google-analytics.com",
      "https://region1.google-analytics.com",
      "https://vitals.vercel-insights.com",
      "https://va.vercel-scripts.com",
      "https://challenges.cloudflare.com",
    ].join(" "),
  ];

  if (upgradeInsecureRequests) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

function isPrivateContentAsset(pathname: string): boolean {
  return /^\/(?:projects|experiences)\/[^/]+\/(?:project\.json|experience\.json|body\.md)$/.test(
    pathname
  );
}

function isNonPublishedProjectAsset(request: NextRequest): boolean {
  const sourcePath =
    request.nextUrl.pathname === "/_next/image"
      ? request.nextUrl.searchParams.get("url")
      : request.nextUrl.pathname;

  if (!sourcePath) {
    return false;
  }

  let pathname: string;
  try {
    const sourceUrl = new URL(sourcePath, request.nextUrl.origin);
    if (sourceUrl.origin !== request.nextUrl.origin) {
      return false;
    }
    pathname = sourceUrl.pathname;
  } catch {
    return false;
  }

  const match = pathname.match(/^\/projects\/([^/]+)\/.+$/);
  if (!match) {
    return false;
  }

  const slugs = getPublishedProjectSlugs();
  // Fail closed if the publication manifest cannot be read. Serving an
  // unknown project asset would risk exposing a draft image.
  return slugs === null || !slugs.has(match[1]);
}

function getPublishedProjectSlugs(): Set<string> | null {
  if (publishedProjectSlugs !== undefined) {
    return publishedProjectSlugs;
  }

  try {
    const slugs = new Set<string>();
    for (const entry of readdirSync(contentProjectsRootDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith("_") || entry.name.startsWith(".")) {
        continue;
      }

      const configPath = join(contentProjectsRootDir, entry.name, "project.json");
      if (!existsSync(configPath)) {
        continue;
      }

      const project = JSON.parse(readFileSync(configPath, "utf8")) as {
        slug?: unknown;
        status?: unknown;
      } | null;

      if (project && project.slug === entry.name && project.status === "published") {
        slugs.add(entry.name);
      }
    }

    publishedProjectSlugs = slugs;
    return slugs;
  } catch {
    // If the manifest cannot be read, let Next handle the route rather than
    // risking an outage for published project pages.
    publishedProjectSlugs = null;
    return null;
  }
}

function isUnknownProjectRoute(pathname: string): boolean {
  const match = pathname.match(/^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  if (!match) {
    return false;
  }

  const slugs = getPublishedProjectSlugs();
  return slugs !== null && !slugs.has(match[1]);
}

export function proxy(request: NextRequest) {
  if (isPrivateContentAsset(request.nextUrl.pathname) || isNonPublishedProjectAsset(request)) {
    return new NextResponse(null, {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  }

  if (isUnknownProjectRoute(request.nextUrl.pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  }

  if (isDevelopment) {
    return NextResponse.next();
  }

  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    createContentSecurityPolicy(nonce, request.nextUrl.protocol === "https:")
  );
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|favicon.ico|favicon.svg|icon-192.png|icon-512.png|apple-touch-icon.png).*)",
    },
  ],
};
