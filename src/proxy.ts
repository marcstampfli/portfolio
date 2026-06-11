import { NextResponse, type NextRequest } from "next/server";

const isDevelopment = process.env.NODE_ENV !== "production";

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function createContentSecurityPolicy(nonce: string): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    isDevelopment ? "'unsafe-eval'" : "",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://va.vercel-scripts.com",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc}`,
    [
      "connect-src 'self'",
      "https://www.google-analytics.com",
      "https://region1.google-analytics.com",
      "https://vitals.vercel-insights.com",
      "https://va.vercel-scripts.com",
    ].join(" "),
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", createContentSecurityPolicy(nonce));
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon-192.png|icon-512.png|apple-touch-icon.png).*)",
    },
  ],
};
