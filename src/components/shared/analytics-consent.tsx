"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";

const CONSENT_KEY = "analytics-consent";
const CONSENT_EVENT = "analytics-consent-change";
type ConsentState = "unknown" | "prompt" | "granted" | "denied";

interface AnalyticsConsentProps {
  children: ReactNode;
  enabled: boolean;
}

function readConsent(): ConsentState {
  if (typeof window === "undefined") {
    return "unknown";
  }

  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "prompt";
  } catch {
    return "prompt";
  }
}

function subscribeToConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function resetAnalyticsConsent(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Consent remains opt-in when storage is unavailable.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
  // A reload removes scripts that may already have been injected during an
  // earlier granted session, including third-party analytics globals.
  window.location.reload();
}

export function AnalyticsConsent({ children, enabled }: AnalyticsConsentProps) {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => "unknown");

  const chooseConsent = (value: "granted" | "denied") => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Keep analytics disabled if consent persistence is blocked.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (!enabled) {
    return null;
  }

  return (
    <>
      {consent === "granted" ? children : null}
      {consent === "prompt" ? (
        <aside
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-consent-heading"
          aria-describedby="analytics-consent-description"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-xl rounded-lg border border-border/80 bg-background/95 p-5 shadow-panel backdrop-blur-md sm:inset-x-auto sm:right-6 sm:p-6"
        >
          <h2 id="analytics-consent-heading" className="font-display text-base font-semibold">
            Help improve this site?
          </h2>
          <p
            id="analytics-consent-description"
            className="mt-2 text-sm leading-6 text-muted-foreground"
          >
            Optional analytics help me understand which pages are useful. No analytics scripts load
            unless you allow them.{" "}
            <Link href="/privacy" className="link">
              Privacy details
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseConsent("granted")}
              className="transition-theme rounded-sm border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Allow analytics
            </button>
            <button
              type="button"
              onClick={() => chooseConsent("denied")}
              className="transition-theme rounded-sm border border-borderStrong bg-background/50 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Decline
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
