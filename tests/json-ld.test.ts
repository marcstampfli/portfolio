import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/json-ld";

describe("JSON-LD serialization", () => {
  it("escapes characters that could terminate an inline script", () => {
    const serialized = serializeJsonLd({
      name: "</script><script>alert('xss')</script> & more",
    });

    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(serialized).toContain("\\u0026");
  });
});
