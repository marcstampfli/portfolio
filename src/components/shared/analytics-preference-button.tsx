"use client";

import { resetAnalyticsConsent } from "@/components/shared/analytics-consent";

export function AnalyticsPreferenceButton() {
  return (
    <button
      type="button"
      onClick={resetAnalyticsConsent}
      className="transition-theme rounded-sm border border-borderStrong bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Change analytics preference
    </button>
  );
}
