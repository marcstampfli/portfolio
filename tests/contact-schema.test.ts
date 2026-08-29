import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/types";

describe("contact form schema", () => {
  it("trims valid input before it reaches the mailer", () => {
    const result = contactFormSchema.safeParse({
      name: "  Marc  ",
      email: "  person@example.com ",
      message: "  A sufficiently long project brief.  ",
      website: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Marc");
      expect(result.data.email).toBe("person@example.com");
      expect(result.data.message).toBe("A sufficiently long project brief.");
    }
  });

  it("rejects short messages and malformed email addresses", () => {
    const result = contactFormSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "Short",
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a honeypot value for silent bot handling", () => {
    const result = contactFormSchema.safeParse({
      name: "Valid Name",
      email: "person@example.com",
      message: "A sufficiently long project brief.",
      website: "https://bot.example",
    });

    expect(result.success).toBe(true);
  });
});
