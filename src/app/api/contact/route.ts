import { NextResponse } from "next/server";
import { processContactMessage } from "@/lib/contact-service";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_REQUEST_BYTES = 32 * 1024;
const allowedContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];

function isAllowedContentType(contentType: string): boolean {
  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
  return Boolean(mediaType && allowedContentTypes.includes(mediaType));
}

function redirectWithStatus(status: "sent" | "error") {
  const location = new URL("/?contact=" + status + "#contact", siteConfig.url);
  const response = NextResponse.redirect(location, 303);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

async function readFormDataWithinLimit(request: Request): Promise<FormData> {
  if (!request.body) {
    return request.formData();
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new Error("contact request is too large");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body,
  }).formData();
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return redirectWithStatus("error");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!isAllowedContentType(contentType)) {
    return new NextResponse("Unsupported content type", {
      status: 415,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    const requestOrigin = new URL(request.url).origin;
    if (origin !== requestOrigin && origin !== siteConfig.url) {
      return redirectWithStatus("error");
    }
  }

  try {
    const formData = await readFormDataWithinLimit(request);
    const getString = (name: string) => {
      const value = formData.get(name);
      return typeof value === "string" ? value : "";
    };

    const result = await processContactMessage(
      {
        name: getString("name"),
        email: getString("email"),
        message: getString("message"),
        website: getString("website"),
        turnstileToken: getString("turnstileToken") || getString("cf-turnstile-response"),
      },
      request.headers
    );

    return redirectWithStatus(result.success ? "sent" : "error");
  } catch (error) {
    console.error(
      "Failed to parse contact request",
      error instanceof Error ? error.name : "unknown error"
    );
    return redirectWithStatus("error");
  }
}
