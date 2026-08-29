type DateInput = string | Date;

function parseDate(value: DateInput): Date | null {
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(value + "T00:00:00Z")
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getCalendarParts(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}

export function calculateDuration(startDate: DateInput, endDate: DateInput | null): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate ?? new Date());

  if (!start || !end || end.getTime() < start.getTime()) {
    return "Duration unavailable";
  }

  const startParts = getCalendarParts(start);
  const endParts = getCalendarParts(end);
  let diffMonths = (endParts.year - startParts.year) * 12 + (endParts.month - startParts.month);

  if (endParts.day < startParts.day) {
    diffMonths -= 1;
  }

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(years + " yr" + (years !== 1 ? "s" : ""));
  }

  if (months > 0) {
    parts.push(months + " mo" + (months !== 1 ? "s" : ""));
  }

  return parts.length > 0 ? parts.join(" ") : "Less than 1 mo";
}

export function formatDateRange(startDate: DateInput, endDate: DateInput | null): string {
  const start = parseDate(startDate);
  const end = endDate ? parseDate(endDate) : null;

  if (!start || (endDate && !end) || (end && end.getTime() < start.getTime())) {
    return "Date range unavailable";
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  return formatDate(start) + " - " + (end ? formatDate(end) : "Present");
}

export function generatePeriodString(startDate: DateInput, endDate: DateInput | null): string {
  return formatDateRange(startDate, endDate) + " · " + calculateDuration(startDate, endDate);
}
