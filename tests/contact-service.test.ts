import { describe, expect, it, vi } from "vitest";
import { processContactMessage } from "@/lib/contact-service";

describe("contact service boundary", () => {
  it("returns validation errors for non-object action payloads", async () => {
    await expect(processContactMessage(null)).resolves.toEqual({
      success: false,
      error: "Invalid form data",
    });
    await expect(
      processContactMessage({ email: { value: "person@example.com" } })
    ).resolves.toEqual({
      success: false,
      error: "Invalid form data",
    });
  });

  it("handles valid honeypot submissions without touching SMTP configuration", async () => {
    await expect(
      processContactMessage({
        name: "Valid Name",
        email: "person@example.com",
        message: "A sufficiently long project brief.",
        website: "https://bot.example",
      })
    ).resolves.toEqual({ success: true });
  });

  it("rejects submissions when Turnstile validation fails", async () => {
    const previousTurnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const previousGmailUser = process.env.GMAIL_USER;
    const previousGmailPassword = process.env.GMAIL_APP_PASSWORD;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    process.env.GMAIL_USER = "owner@example.com";
    process.env.GMAIL_APP_PASSWORD = "test-password";

    try {
      await expect(
        processContactMessage(
          {
            name: "Valid Name",
            email: "person@example.com",
            message: "A sufficiently long project brief.",
            website: "",
            turnstileToken: "invalid-token",
          },
          { get: () => "198.51.100.12" }
        )
      ).resolves.toEqual({
        success: false,
        error: "Please complete the verification and try again.",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        expect.objectContaining({ method: "POST" })
      );
    } finally {
      fetchMock.mockRestore();

      if (previousTurnstileSecret === undefined) {
        delete process.env.TURNSTILE_SECRET_KEY;
      } else {
        process.env.TURNSTILE_SECRET_KEY = previousTurnstileSecret;
      }

      if (previousGmailUser === undefined) {
        delete process.env.GMAIL_USER;
      } else {
        process.env.GMAIL_USER = previousGmailUser;
      }

      if (previousGmailPassword === undefined) {
        delete process.env.GMAIL_APP_PASSWORD;
      } else {
        process.env.GMAIL_APP_PASSWORD = previousGmailPassword;
      }
    }
  });
});
