import { describe, expect, it } from "vitest";
import { calculateDuration, formatDateRange } from "@/lib/date-utils";

describe("date utilities", () => {
  it("formats date-only values without shifting the calendar month", () => {
    expect(formatDateRange("2021-08-01", null)).toBe("Aug 2021 - Present");
  });

  it("calculates complete calendar months instead of using an average month length", () => {
    expect(calculateDuration("2021-01-31", "2021-02-28")).toBe("Less than 1 mo");
    expect(calculateDuration("2021-01-01", "2022-01-01")).toBe("1 yr");
  });

  it("rejects invalid or reversed ranges", () => {
    expect(calculateDuration("not-a-date", null)).toBe("Duration unavailable");
    expect(formatDateRange("2022-01-01", "2021-01-01")).toBe("Date range unavailable");
  });
});
