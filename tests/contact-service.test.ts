import { describe, expect, it } from "vitest";
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
});
