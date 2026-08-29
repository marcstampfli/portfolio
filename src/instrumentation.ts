import type { Instrumentation } from "next";

function isExpectedNotFound(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("NoFallbackError") ||
    error.message.includes("NEXT_HTTP_ERROR_FALLBACK;404")
  );
}

export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  if (isExpectedNotFound(error)) {
    return;
  }

  console.error("Unhandled request error", {
    method: request.method,
    path: request.path.split("?", 1)[0]?.slice(0, 512),
    routeType: context.routeType,
  });
};
